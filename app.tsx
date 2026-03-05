import React, { useRef } from 'react';
import { Spreadsheet, Worksheet } from '@jspreadsheet-ce/react';
import 'jsuites/dist/jsuites.css';
import 'jspreadsheet-ce/style.css';

export default function App() {
  const spreadsheet = useRef();

  return (
    <>
      <Spreadsheet ref={spreadsheet}>
        <Worksheet minDimensions={[6, 6]} />
      </Spreadsheet>
    </>
  );
}
