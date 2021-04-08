import { createTable } from '../components/table';
import { Services } from './service';
import { ItemList } from '../src';

export const requestFields = [
  { name: 'name', required: true, type: 'string' },
  { name: 'description', required: true, type: 'text' },
  { name: 'boolean', required: true, type: 'boolean' },
  { name: 'number', required: true, type: 'number' },
  { name: 'date', required: true, type: 'date' },
  {
    name: 'select',
    required: true,
    type: 'select',
    valueEnum: [
      { text: 'Tifa', value: 'tifaaaaa' },
      { text: 'Mikasa Akaman', value: 'mikasa' },
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
  'Kitchen',
  undefined,
  requestFields,
  updateRequestFields,
  tableFields,
  services,
);

export default TableList;
