import type { RequestData, UseFetchDataAction } from '@ant-design/pro-table/lib/typing';
import type { ReactNode } from 'react';

export interface ValueEnum {
  text: string;
  value: string;
}

export interface Field {
  name: string;
  label?: string;
  type: string;
  required: boolean;
  disabled?: boolean;
  render?: (
    text: ReactNode,
    record: any,
    index: number,
    action: UseFetchDataAction<T>,
  ) => ReactNode | ReactNode[];
  width?: string | number;
  valueEnum?: ValueEnum[];
  sorter?: (a: Field, b: Field) => boolean | number;
  note?: string;
  hideInTable?: boolean;
  formItemProps?: any;
  inputUnitProps?: any;
  targetclass?: string;
  link?: boolean;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface Services {
  create: (fieldsValues: unknown) => void;
  update: (fieldsValues: unknown) => void;
  query: (fieldsValues: unknown) => Partial<RequestData<Record<string, any>>>;
  delete: (fieldsValues: unknown) => void;
}

export interface TableAction {
  name: string;
  fields: Field[];
  service: (fieldsValues: unknown) => void;
}
