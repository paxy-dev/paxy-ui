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
    record: T,
    index: number,
    action: UseFetchDataAction<T>,
  ) => ReactNode | ReactNode[];
  width?: string | number;
  valueEnum?: ValueEnum[];
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
