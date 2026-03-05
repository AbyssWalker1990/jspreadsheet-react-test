export const sheetConfig: any = {
  data: [
    ['Material', 'Measuring Unit', 'Period', '', ''],
    ['', '', 'April', 'May', 'June'],
    ['Поле1 + Поле2', '', '', '', ''],
    ['Agro Input 1', 'g', '', '', ''],
    ['Agro Input 2', 'g', '', '', ''],
    ['Test from UI', '', '', '', ''],
    ['Agro Input 1', 'g', '', '', ''],
    ['Agro Input 2', 'g', '', '', ''],
  ],
  columns: [
    {
      type: 'text',
      width: 200,
      readOnly: true,
    },
    {
      type: 'text',
      width: 120,
      readOnly: true,
    },
    {
      type: 'text',
      width: 100,
    },
    {
      type: 'text',
      width: 100,
    },
    {
      type: 'text',
      width: 100,
    },
  ],
  mergeCells: {
    A1: [1, 2],
    B1: [1, 2],
    C1: [3, 1],
    A3: [5, 1],
    A6: [5, 1],
  },
  meta: {
    C4: {
      type: 'AgroTaskItem',
      agroInputId: '9ab741eb-9420-4233-bcd5-d0077f700e2b',
      agroTaskId: '741a5291-64bc-43b4-855c-2b48b3cbd21e',
    },
    D4: {
      type: 'AgroTaskItem',
      agroInputId: '9ab741eb-9420-4233-bcd5-d0077f700e2b',
      agroTaskId: '0df467cf-be5f-4d4f-a848-3e406d8a5be9',
    },
    E4: {
      type: 'AgroTaskItem',
      agroInputId: '9ab741eb-9420-4233-bcd5-d0077f700e2b',
      agroTaskId: '5b51e3ec-a25e-4d4c-b648-6fd2b0ed8b47',
    },
    C5: {
      type: 'AgroTaskItem',
      agroInputId: '81dacdcb-74e4-4982-b384-4542759ca8d9',
      agroTaskId: '741a5291-64bc-43b4-855c-2b48b3cbd21e',
    },
    D5: {
      type: 'AgroTaskItem',
      agroInputId: '81dacdcb-74e4-4982-b384-4542759ca8d9',
      agroTaskId: '0df467cf-be5f-4d4f-a848-3e406d8a5be9',
    },
    E5: {
      type: 'AgroTaskItem',
      agroInputId: '81dacdcb-74e4-4982-b384-4542759ca8d9',
      agroTaskId: '5b51e3ec-a25e-4d4c-b648-6fd2b0ed8b47',
    },
    C7: {
      type: 'AgroTaskItem',
      agroInputId: '9ab741eb-9420-4233-bcd5-d0077f700e2b',
      agroTaskId: '2a92c10c-31fd-4555-af15-930b63c3f393',
    },
    D7: {
      type: 'AgroTaskItem',
      agroInputId: '9ab741eb-9420-4233-bcd5-d0077f700e2b',
      agroTaskId: 'c2637530-036e-4456-96b5-b7b9898e864a',
    },
    E7: {
      type: 'AgroTaskItem',
      agroInputId: '9ab741eb-9420-4233-bcd5-d0077f700e2b',
      agroTaskId: 'be9e86ee-714a-4766-b508-81ca882db534',
    },
    C8: {
      type: 'AgroTaskItem',
      agroInputId: '81dacdcb-74e4-4982-b384-4542759ca8d9',
      agroTaskId: '2a92c10c-31fd-4555-af15-930b63c3f393',
    },
    D8: {
      type: 'AgroTaskItem',
      agroInputId: '81dacdcb-74e4-4982-b384-4542759ca8d9',
      agroTaskId: 'c2637530-036e-4456-96b5-b7b9898e864a',
    },
    E8: {
      type: 'AgroTaskItem',
      agroInputId: '81dacdcb-74e4-4982-b384-4542759ca8d9',
      agroTaskId: 'be9e86ee-714a-4766-b508-81ca882db534',
    },
  },
  cells: {
    A1: {
      readOnly: true,
    },
    B1: {
      readOnly: true,
    },
    C1: {
      readOnly: true,
    },
    D1: {
      readOnly: true,
    },
    E1: {
      readOnly: true,
    },
    A2: {
      readOnly: true,
    },
    B2: {
      readOnly: true,
    },
    C2: {
      readOnly: true,
    },
    D2: {
      readOnly: true,
    },
    E2: {
      readOnly: true,
    },
    A3: {
      readOnly: true,
    },
    B3: {
      readOnly: true,
    },
    C3: {
      readOnly: true,
    },
    D3: {
      readOnly: true,
    },
    E3: {
      readOnly: true,
    },
    A4: {
      readOnly: true,
    },
    B4: {
      readOnly: true,
    },
    C4: {
      readOnly: false,
    },
    D4: {
      readOnly: false,
    },
    E4: {
      readOnly: false,
    },
    A5: {
      readOnly: true,
    },
    B5: {
      readOnly: true,
    },
    C5: {
      readOnly: false,
    },
    D5: {
      readOnly: false,
    },
    E5: {
      readOnly: false,
    },
    A6: {
      readOnly: true,
    },
    B6: {
      readOnly: true,
    },
    C6: {
      readOnly: true,
    },
    D6: {
      readOnly: true,
    },
    E6: {
      readOnly: true,
    },
    A7: {
      readOnly: true,
    },
    B7: {
      readOnly: true,
    },
    C7: {
      readOnly: false,
    },
    D7: {
      readOnly: false,
    },
    E7: {
      readOnly: false,
    },
    A8: {
      readOnly: true,
    },
    B8: {
      readOnly: true,
    },
    C8: {
      readOnly: false,
    },
    D8: {
      readOnly: false,
    },
    E8: {
      readOnly: false,
    },
  },
  minDimensions: [5, 8],

  // fire when cells are changed
  onafterchanges: (
    instance: any,
    changes: Array<{ x: number; y: number; value: any; oldValue: any }>
  ) => {
    changes.forEach((chg) => {
      const col = instance.getColumnName(chg.x);
      const cell = `${col}${chg.y + 1}`;
      const meta = instance.getMeta(cell);
      console.log('cell changed', cell, 'new value', chg.value, 'meta', meta);
    });
  },
};
