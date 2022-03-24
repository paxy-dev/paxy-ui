import { ConfigProvider } from 'antd';
import enUS from 'antd/lib/locale/en_US';
import { createDrawerTable } from '../components/drawertable';
import { Services } from './service';
import { ItemList } from '../src';
import { Image } from 'antd';

export const requestFields = [
  {
    name: 'parent',
    required: true,
    type: 'pointer',
    inputUnitProps: {
      request: async (params: string) => {
        const dl = [
          { label: 'father', value: 'fafa' },
          { label: 'mother', value: 'mama' },
          { label: 'sister', value: 'sis' },
          { label: 'brother', value: 'bro' },
        ];

        return new Promise((resolve, reject) => {
          if (params) {
            if (params === 'abc') {
              resolve([
                { label: 'ABC', value: 'abc' },
                { label: 'ABCD', value: 'abcd' },
              ]);
            }
            resolve(dl.filter((i) => i.label.includes(params)));
          } else {
            resolve(dl);
          }
        });
      },
    },
  },
  {
    name: 'parent2',
    required: false,
    type: 'pointer',
    inputUnitProps: {
      request: async (params: string) => {
        const dl = [
          { label: 'father', value: 'fafa' },
          { label: 'mother', value: 'mama' },
          { label: 'sister', value: 'sis' },
          { label: 'brother', value: 'bro' },
        ];

        return new Promise((resolve, reject) => {
          if (params) {
            resolve(dl.filter((i) => i.label.includes(params)));
          } else {
            resolve(dl);
          }
        });
      },
    },
  },
  { name: 'name', required: true, type: 'string' },
  {
    name: 'description',
    required: true,
    type: 'text',
    note: 'write something to describe',
    hideInTable: true,
  },
  { name: 'boolean', required: true, type: 'boolean', hideInTable: true },
  { name: 'number', required: true, type: 'number', hideInTable: true },
  { name: 'date', required: true, type: 'date', hideInTable: true },
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
    hideInTable: true,
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
    hideInTable: true,
  },
  { name: 'paragraph', required: false, type: 'paragraph', hideInTable: true },
  {
    name: 'json',
    required: false,
    type: 'json',
    note: '[{"type":"normal","sn":"918539188"}]',
    hideInTable: true,
  },
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

const TableList = createDrawerTable({
  name: 'Table',
  parentField: 'RootTable',
  requestFields,
  updateRequestFields,
  tableFields,
  services,
  links: ['subTable1', 'subTable2'],
  detialFields: [
    { name: 'name', required: true, type: 'string' },
    { name: 'description', required: true, type: 'text', note: 'write something to describe' },
  ],
});

export default () => {
  return (
    <>
      <ConfigProvider locale={enUS}>
        <TableList />
      </ConfigProvider>
    </>
  );
};
