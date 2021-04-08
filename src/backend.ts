// eslint-disable-next-line import/no-extraneous-dependencies
import parse from 'url-parse';
import short from 'short-uuid';
import { Request, Response } from 'express';
import { ItemList } from './mock';

export class MockBackend {
  items: ItemList;

  name: string;

  constructor(items: ItemList, name: string) {
    this.items = items;
    this.name = name;
  }

  get = (req: Request, res: Response, u: string) => {
    let realUrl = u;
    if (
      !realUrl ||
      Object.prototype.toString.call(realUrl) !== '[object String]'
    ) {
      realUrl = req.url;
    }
    const { current = 1, pageSize = 10 } = req.query;

    const params = (parse(realUrl, true).query as unknown) as any;

    let dataSource = [...this.items.items].slice(
      ((current as number) - 1) * (pageSize as number),
      (current as number) * (pageSize as number),
    );

    if (params.sorter) {
      const sorter = JSON.parse(params.sorter as any);
      dataSource = dataSource.sort((prev, next) => {
        let sortNumber = 0;
        Object.keys(sorter).forEach(key => {
          if (sorter[key] === 'descend') {
            if (prev[key] > next[key]) {
              sortNumber += -1;
            } else {
              sortNumber += 1;
            }
            return;
          }
          if (prev[key] > next[key]) {
            sortNumber += 1;
          } else {
            sortNumber += -1;
          }
        });
        return sortNumber;
      });
    }
    if (params.filter) {
      const filter = JSON.parse(params.filter as any) as Record<
        string,
        string[]
      >;
      if (Object.keys(filter).length > 0) {
        dataSource = dataSource.filter(item => {
          return Object.keys(filter).some(key => {
            if (!filter[key]) {
              return true;
            }
            if (filter[key].includes(`${item[key]}`)) {
              return true;
            }
            return false;
          });
        });
      }
    }

    const result = {
      data: dataSource,
      total: this.items.items.length,
      success: true,
      pageSize,
      current: parseInt(`${params.current}`, 10) || 1,
    };

    return res.json(result);
  };

  post = (req: Request, res: Response, u: string, b: Request) => {
    let realUrl = u;
    if (
      !realUrl ||
      Object.prototype.toString.call(realUrl) !== '[object String]'
    ) {
      realUrl = req.url;
    }

    const body = (b && b.body) || req.body;
    const { method, ...others } = body;

    switch (method) {
      /* eslint no-case-declarations:0 */
      case 'delete':
        this.items.delete(body.id);
        return res.json({ id: body.id });
      case 'post':
        (() => {
          const id = short.generate().slice(0, 10);
          const newRule = { id, updatedAt: new Date(), createdAt: new Date() };
          Object.keys(others).forEach(key => {
            newRule[key] = others[key];
          });
          this.items.add(newRule);
          return res.json(newRule);
        })();
        break;
      case 'update':
        (() => {
          const newRule = { id: body.id, updatedAt: new Date() };
          Object.keys(others).forEach(key => {
            newRule[key] = others[key];
          });
          this.items.update(newRule);
          return res.json(newRule);
        })();
        break;
      default:
        break;
    }

    return {};
  };

  api = () => {
    const api = {};
    api[`GET /api/${this.name}`] = this.get;
    api[`POST /api/${this.name}`] = this.post;
    return api;
  };
}
