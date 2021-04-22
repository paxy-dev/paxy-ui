import faker from 'faker';
import short from 'short-uuid';
import { Field } from './data.d';

export class ItemList {
  items: any[];

  constructor() {
    this.items = [];
  }

  delete = (id: string) => {
    this.items = this.items.filter((item) => item.id !== id);
  };

  add = (item: any) => {
    this.items.unshift(item);
  };

  update = (item: any) => {
    this.items = this.items.map((i) => {
      if (item.id === i.id) {
        return { ...i, ...item };
      }
      return i;
    });
  };

  init = (fields: Field[], pageSize: number) => {
    this.items = [];

    for (let i = 0; i < pageSize; i += 1) {
      const id = short.generate().slice(0, 10);
      const item = {};
      fields.forEach((field: Field) => {
        let value;
        switch (field.type) {
          case 'number':
            value = faker.datatype.number();
            break;
          case 'boolean':
            value = faker.datatype.boolean();
            break;
          case 'text':
            if (i === 0) {
              value = null;
            } else {
              value = faker.random.words();
            }
            break;
          case 'date':
            value = faker.date.past();
            break;
          case 'multiselect':
            if (field.valueEnum) {
              const loop_num = Math.floor(Math.random() * field.valueEnum.length);
              value = [];
              for (let j = 0; j < loop_num; j += 1) {
                value.push(field.valueEnum[j].value);
              }
            }
            break;
          case 'upload':
            value = { url: faker.image.image(), name: faker.random.word() };
            break;
          case 'json':
            value = faker.datatype.json();
            break;
          default:
            if (i === 0) {
              value = null;
            } else {
              value = faker.random.word();
            }
        }

        item[field.name] = value;
      });

      this.items.push({
        ...item,
        id,
        updatedAt: new Date(),
        createdAt: new Date(),
      });
    }
    this.items.reverse();
  };
}
