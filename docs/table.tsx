import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import { createTable } from '../components/table';
import { Services } from './service';
import { ItemList } from '../src';
import { Image } from 'antd';

export const requestFields = [
  { name: 'name', required: true, type: 'string' },
  { name: 'description', required: true, type: 'text', note: 'write something to describe' },
  { name: 'boolean', required: true, type: 'boolean' },
  { name: 'number', required: true, type: 'number' },
  { name: 'date', required: true, type: 'date' },
  {
    name: 'select',
    required: true,
    type: 'select',
    valueEnum: [
      { text: 'Tifa', value: 'tifaaaaa' },
      { text: 'Aerith', value: 'aerith' },
      { text: 'Garnet', value: 'garnet' },
      { text: 'Yuna', value: 'yuna' },
    ],
  },
  {
    name: 'multiselect',
    required: true,
    type: 'multiselect',
    valueEnum: [
      { text: 'PS4', value: 'ps4' },
      { text: 'Switch', value: 'switch' },
      { text: 'Oculus Quest 2', value: 'oculusquest2' },
    ],
  },
  { name: 'paragraph', required: true, type: 'paragraph' },
  { name: 'json', required: false, type: 'json', note: '[{"type":"normal","sn":"918539188"}]' },
  {
    name: 'photo',
    required: false,
    type: 'upload',
    render: (_: any, row: any) => {
      if (row.photo) {
        return <Image src={row.photo.url} />;
      }
      return <></>;
    },
  },
];

export const updateRequestFields = [
  { name: 'id', required: true, type: 'string', disabled: true },
  ...requestFields,
];

export const tableFields = [
  ...updateRequestFields,
  { name: 'createdAt', required: true, type: 'date', disabled: true },
  { name: 'updatedAt', required: true, type: 'date', disabled: true },
];

const itemList = new ItemList();
itemList.init(tableFields, 3);

const services = new Services('Kitchen', tableFields, {}, itemList);

const TableList = createTable(
  'Table',
  'RootTable',
  requestFields,
  updateRequestFields,
  tableFields,
  services,
  ['subTable1', 'subTable2'],
  undefined,
  [
    {
      name: 'test',
      fields: [
        { name: 'name', required: true, type: 'string' },
        { name: 'description', required: true, type: 'text', note: 'write something to describe' },
      ],
      service: (values: any) => console.log(values),
    },
  ],
  true,
);

export default () => {
  return (
    <>
      <ConfigProvider locale={enUS}>
        <TableList />
      </ConfigProvider>
    </>
  );
};
