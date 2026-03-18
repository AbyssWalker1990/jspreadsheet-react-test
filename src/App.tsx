import React, { useRef, useEffect, useState } from 'react';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import { sheetConfig as localSheetConfig } from './sheet-config';

const ROADMAP_URL =
  'http://localhost:3000/api/v1/agro-programs/33101df9-65cb-4d41-9155-2d7ed5260a03/roadmap';

const getLocalSheetConfig = async () => localSheetConfig.worksheets;

const getRemoteSheetConfig = async () => {
  const response = await fetch(ROADMAP_URL);
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
  const [worksheets, setWorksheets] = useState<any[] | null>(null);
  const [activeSource, setActiveSource] = useState<'remote' | 'local' | 'loading'>('loading');

  const stripCellMappings = (raw: any[]) => {
    cellMappingsRef.current = raw.map((ws: any) => ws.cellMapping ?? {});
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return raw.map(({ cellMapping: _, ...config }: any) => config);
  };

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
  }, []);

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
          if (key !== 'taskItems') {
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
      <Spreadsheet key={activeSource} ref={spreadsheet} onafterchanges={handleAfterChanges}>
        {worksheets.map((worksheet, index) => (
          <Worksheet key={`worksheet-${index}`} {...worksheet} />
        ))}
      </Spreadsheet>
    </>
  );
}
