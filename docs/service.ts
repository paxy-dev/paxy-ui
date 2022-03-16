import { Field } from '../components/data';

export class Services {
  name: string;

  url: string;

  fields: Record<string, Field>;

  pointers: Record<string, string>;

  itemList: [];

  constructor(name: string, fields: Field[], pointers: Record<string, string>, itemList: any) {
    this.name = name;
    this.url = `/api/${this.name.toLowerCase()}s`;
    this.pointers = pointers;
    this.fields = {};
    fields.forEach((f) => {
      this.fields[f.name] = f;
    });
    this.itemList = itemList;
  }

  createServices = () => {
    return {
      create: this.create,
      update: this.update,
      query: this.query,
      delete: this.delete,
    };
  };

  query = async (params: any) => {
    return {
      data: this.itemList.items,
      total: this.itemList.items.length,
      current: params.current,
      pageSize: params.pageSize,
    };
  };

  delete = async ({ id }: { id: string }) => {
    console.log(id);
  };

  create = async (params: any) => {
    // eslint-disable-next-line no-alert
    // throw('ddd');
    alert(JSON.stringify(params));
  };

  update = async (params: any) => {
    console.log(params);
  };
}
