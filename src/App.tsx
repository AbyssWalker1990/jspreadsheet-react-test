import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import { sheetConfig as localSheetConfig } from './sheet-config';

const ROADMAP_URL =
  'http://localhost:3000/api/v1/agro-programs/d81310f0-7ee9-45ff-b3fb-595c44330e09/roadmap';

const getLocalSheetConfig = async () => localSheetConfig.worksheets;

const getRemoteSheetConfig = async () => {
  const response = await fetch(ROADMAP_URL, {
    method: 'GET',
    headers: {
      'x-lang': 'uk',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch roadmap: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload?.worksheets)) {
    throw new Error('Expected remote payload format: { worksheets: Worksheet[] }');
  }

  return payload.worksheets;
};

const sheetConfigLoaders = {
  remote: getRemoteSheetConfig,
  local: getLocalSheetConfig,
} as const;

export default function App() {
  const spreadsheet = useRef<any>(null);
  const cellMappingsRef = useRef<Record<string, string[]>[]>([]);
  const writableHeadersRef = useRef<Set<string>[]>([]);
  const columnPatchRef = useRef<Record<string, any>>({});
  const [worksheets, setWorksheets] = useState<any[] | null>(null);
  const [activeSource, setActiveSource] = useState<'remote' | 'local' | 'loading'>('loading');

  const headerRowsRender = (td: HTMLElement, value: unknown, _x: number, y: number) => {
    if (y <= 3 && typeof value === 'string') {
      td.innerText = value;
    }
  };

  const stripCellMappings = useCallback((raw: any[]) => {
    cellMappingsRef.current = raw.map((ws: any) => ws.cellMapping ?? {});
    writableHeadersRef.current = raw.map(
      (ws: any) =>
        new Set(
          (ws.cellMapping?.writableHeaders ?? []).map((cell: string) => cell.trim().toUpperCase())
        )
    );

    return raw.map((ws: any) => {
      const columns = ws.columns ?? [];
      const config = { ...ws };
      delete config.cellMapping;

      return {
        ...config,
        columns: columns.map((column: any, index: number) => {
          return index >= 2 ? { ...column, render: headerRowsRender } : column;
        }),
      };
    });
  }, []);

  const colIndexToLetter = (idx: number) => {
    let s = '';
    while (idx >= 0) {
      s = String.fromCharCode(65 + (idx % 26)) + s;
      idx = Math.floor(idx / 26) - 1;
    }
    return s;
  };

  const handleAfterChanges = (
    instance: any,
    changes: Array<{ x: number; y: number; value: any; oldValue: any }>
  ) => {
    changes.forEach((chg) => {
      const colLetter = colIndexToLetter(chg.x);
      const cell = `${colLetter}${Number(chg.y) + 1}`;
      console.log('cell: ', cell);
      const meta = instance.getMeta(cell);
      console.log('cell changed', cell, 'new value', chg.value, 'meta', meta);
    });
  };

  const getSheetIndex = (instance: any) => {
    const parentSheets = instance?.parent?.worksheets;
    return Array.isArray(parentSheets) ? parentSheets.indexOf(instance) : -1;
  };

  const getCellName = (x: number | string, y: number | string) => {
    const column = colIndexToLetter(Number(x));
    return `${column}${Number(y) + 1}`.toUpperCase();
  };

  const handleEditionStart = (instance: any, _cell: HTMLElement, x: number, y: number) => {
    const sheetIndex = getSheetIndex(instance);
    if (sheetIndex < 0) return;

    const cellName = getCellName(x, y);
    if (!writableHeadersRef.current[sheetIndex]?.has(cellName)) {
      return;
    }

    const column = instance?.options?.columns?.[x];
    if (!column) {
      return;
    }

    const patchKey = `${sheetIndex}:${x}`;
    if (!columnPatchRef.current[patchKey]) {
      columnPatchRef.current[patchKey] = {
        type: column.type,
        mask: column.mask,
        format: column.format,
        decimal: column.decimal,
        locale: column.locale,
        options: column.options,
        disabledMaskOnEdition: column.disabledMaskOnEdition,
      };
    }

    // Apply a temporary text editor only for this edit session.
    column.type = 'text';
    column.disabledMaskOnEdition = true;
    delete column.mask;
    delete column.format;
    delete column.decimal;
    delete column.locale;
    delete column.options;
  };

  const handleEditionEnd = (instance: any, _cell: HTMLElement, x: number) => {
    const sheetIndex = getSheetIndex(instance);
    if (sheetIndex < 0) return;

    const patchKey = `${sheetIndex}:${x}`;
    const original = columnPatchRef.current[patchKey];
    const column = instance?.options?.columns?.[x];
    if (!original || !column) {
      return;
    }

    column.type = original.type;
    column.disabledMaskOnEdition = original.disabledMaskOnEdition;

    if (original.mask !== undefined) column.mask = original.mask;
    else delete column.mask;

    if (original.format !== undefined) column.format = original.format;
    else delete column.format;

    if (original.decimal !== undefined) column.decimal = original.decimal;
    else delete column.decimal;

    if (original.locale !== undefined) column.locale = original.locale;
    else delete column.locale;

    if (original.options !== undefined) column.options = original.options;
    else delete column.options;

    delete columnPatchRef.current[patchKey];
  };

  useEffect(() => {
    // Toggle source here:
    const sheetConfigSource: keyof typeof sheetConfigLoaders = 'remote';
    // const sheetConfigSource: keyof typeof sheetConfigLoaders = 'local';
    const loadSheetConfig = sheetConfigLoaders[sheetConfigSource];

    let isMounted = true;

    (async () => {
      try {
        const nextConfig = await loadSheetConfig();
        if (isMounted) {
          setWorksheets(stripCellMappings(nextConfig));
          setActiveSource(sheetConfigSource);
        }
      } catch (error) {
        console.error('Unable to load remote sheetConfig, using local fallback.', error);
        if (isMounted) {
          setWorksheets(stripCellMappings(localSheetConfig.worksheets));
          setActiveSource('local');
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [stripCellMappings]);

  useEffect(() => {
    if (!worksheets) {
      return;
    }

    if (spreadsheet.current) {
      // Apply cell-level readOnly based on cellMapping
      (spreadsheet.current as any[]).forEach((sheet, idx) => {
        const mapping = cellMappingsRef.current[idx];
        if (!mapping) return;
        Object.entries(mapping).forEach(([key, cells]) => {
          if (key !== 'taskItems' && key !== 'writableHeaders') {
            (cells as string[]).forEach((cell) => sheet.setReadOnly(cell, true));
          }
        });
      });

      const sheet: any = spreadsheet.current[0];
      console.log('initial meta C4', sheet.getMeta('C4'));

      sheet.setMeta('C4', 'updated', true);
      console.log('after setMeta C4', sheet.getMeta('C4'));

      sheet.setMeta('C4', 'category', 'Agro');
      console.log('final C4 meta', sheet.getMeta('C4'));
    }
  }, [worksheets]);

  if (!worksheets) {
    return <div>Loading sheet config...</div>;
  }

  return (
    <>
      <div style={{ marginBottom: 8 }}>Config source: {activeSource}</div>
      <Spreadsheet
        key={activeSource}
        ref={spreadsheet}
        onafterchanges={handleAfterChanges}
        oneditionstart={handleEditionStart}
        oneditionend={handleEditionEnd}
      >
        {worksheets.map((worksheet, index) => (
          <Worksheet key={`worksheet-${index}`} {...worksheet} />
        ))}
      </Spreadsheet>
    </>
  );
}
