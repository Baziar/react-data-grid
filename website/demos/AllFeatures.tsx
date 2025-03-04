import faker from 'faker';
import { useState } from 'react';
import { css } from '@linaria/core';
import DataGrid, { SelectColumn, TextEditor } from '../../src';
import type { Column, FillEvent, PasteEvent } from '../../src';
import DropDownEditor from './components/Editors/DropDownEditor';
import { ImageFormatter } from './components/Formatters';

const highlightClassname = css`
  .rdg-cell {
    background-color: #9370db;
    color: white;
  }

  &:hover .rdg-cell {
    background-color: #800080;
  }
`;

export interface Row {
  id: string;
  avatar: string;
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  street: string;
  zipCode: string;
  date: string;
  bs: string;
  catchPhrase: string;
  companyName: string;
  words: string;
  sentence: string;
}

function rowKeyGetter(row: Row) {
  return row.id;
}

faker.locale = 'en_GB';

const columns: readonly Column<Row>[] = [
  SelectColumn,
  {
    key: 'id',
    name: 'ID',
    width: 80,
    resizable: true,
    frozen: true
  },
  {
    key: 'avatar',
    name: 'Avatar',
    width: 40,
    resizable: true,
    headerRenderer: () => <ImageFormatter value={faker.image.cats()} />,
    formatter: ({ row }) => <ImageFormatter value={row.avatar} />
  },
  {
    key: 'title',
    name: 'Title',
    width: 200,
    resizable: true,
    formatter(props) {
      return <>{props.row.title}</>;
    },
    editor: DropDownEditor,
    editorOptions: {
      editOnClick: true
    }
  },
  {
    key: 'firstName',
    name: 'First Name',
    width: 200,
    resizable: true,
    frozen: true,
    editor: TextEditor
  },
  {
    key: 'lastName',
    name: 'Last Name',
    width: 200,
    resizable: true,
    frozen: true,
    editor: TextEditor
  },
  {
    key: 'email',
    name: 'Email',
    width: 200,
    resizable: true,
    editor: TextEditor
  },
  {
    key: 'street',
    name: 'Street',
    width: 200,
    resizable: true,
    editor: TextEditor
  },
  {
    key: 'zipCode',
    name: 'ZipCode',
    width: 200,
    resizable: true,
    editor: TextEditor
  },
  {
    key: 'date',
    name: 'Date',
    width: 200,
    resizable: true,
    editor: TextEditor
  },
  {
    key: 'bs',
    name: 'bs',
    width: 200,
    resizable: true,
    editor: TextEditor
  },
  {
    key: 'catchPhrase',
    name: 'Catch Phrase',
    width: 200,
    resizable: true,
    editor: TextEditor
  },
  {
    key: 'companyName',
    name: 'Company Name',
    width: 200,
    resizable: true,
    editor: TextEditor
  },
  {
    key: 'sentence',
    name: 'Sentence',
    width: 200,
    resizable: true,
    editor: TextEditor
  }
];

function createRows(): Row[] {
  const rows: Row[] = [];

  for (let i = 0; i < 2000; i++) {
    rows.push({
      id: `id_${i}`,
      avatar: faker.image.avatar(),
      email: faker.internet.email(),
      title: faker.name.prefix(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      street: faker.address.streetName(),
      zipCode: faker.address.zipCode(),
      date: faker.date.past().toLocaleDateString(),
      bs: faker.company.bs(),
      catchPhrase: faker.company.catchPhrase(),
      companyName: faker.company.companyName(),
      words: faker.lorem.words(),
      sentence: faker.lorem.sentence()
    });
  }

  return rows;
}

export default function AllFeatures() {
  const [rows, setRows] = useState(createRows);
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<string>>(() => new Set());

  function handleFill({ columnKey, sourceRow, targetRow }: FillEvent<Row>): Row {
    return { ...targetRow, [columnKey]: sourceRow[columnKey as keyof Row] };
  }

  function handlePaste({
    sourceColumnKey,
    sourceRow,
    targetColumnKey,
    targetRow
  }: PasteEvent<Row>): Row {
    const incompatibleColumns = ['email', 'zipCode', 'date'];
    if (
      sourceColumnKey === 'avatar' ||
      ['id', 'avatar'].includes(targetColumnKey) ||
      ((incompatibleColumns.includes(targetColumnKey) ||
        incompatibleColumns.includes(sourceColumnKey)) &&
        sourceColumnKey !== targetColumnKey)
    ) {
      return targetRow;
    }

    return { ...targetRow, [targetColumnKey]: sourceRow[sourceColumnKey as keyof Row] };
  }

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      rowKeyGetter={rowKeyGetter}
      onRowsChange={setRows}
      onFill={handleFill}
      onPaste={handlePaste}
      rowHeight={30}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      className="fill-grid"
      rowClass={(row) => (row.id.includes('7') ? highlightClassname : undefined)}
    />
  );
}
