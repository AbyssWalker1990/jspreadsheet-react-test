import React, { useRef, useEffect } from 'react';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import { sheetConfig } from './sheet-config-old';

export default function App() {
  const spreadsheet = useRef<any>(null);

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
    if (spreadsheet.current) {
      const sheet: any = spreadsheet.current[0];
      console.log('initial meta C4', sheet.getMeta('C4'));

      sheet.setMeta('C4', 'updated', true);
      console.log('after setMeta C4', sheet.getMeta('C4'));

      sheet.setMeta('C4', 'category', 'Agro');
      console.log('final C4 meta', sheet.getMeta('C4'));
    }
  }, []);

  return (
    <>
      <Spreadsheet ref={spreadsheet} onafterchanges={handleAfterChanges}>
        <Worksheet {...sheetConfig} />
      </Spreadsheet>
    </>
  );
}
