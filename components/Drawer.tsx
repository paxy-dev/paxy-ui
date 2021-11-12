import React from 'react';
import { Drawer } from 'antd';
import type { Field } from './data';

interface DrawerProps {
  data: {};
  visible: boolean;
  tableFields: Field[];
  setVisible: (visable: boolean) => void;
  setSelectedRowKeys: ([]) => void;
}

export default (props: DrawerProps) => {
  //   const [visible, setVisible] = useState(false);
  const { data, tableFields, visible, setVisible, setSelectedRowKeys } = props;
  const onClose = () => {
    setVisible(false);
    setSelectedRowKeys([]);
  };

  let contents;
  if (Object.keys(data).length === 0) {
    contents = <></>;
  } else {
    contents = tableFields.map((field) => {
      const { name, type } = field;
      let value = ' ';
      switch (type) {
        case 'string':
        case 'text':
        case 'select':
        case 'paragraph':
        case 'json':
          value = data[name];
          break;
        case 'boolean':
        case 'number':
          value = `${data[name]}`;
          break;
        case 'date':
          value = data[name].toLocaleDateString('en-US');
          break;
        case 'multiselect':
          value = JSON.stringify(data[name]);
          break;
        case 'upload':
          value = data[name].url;
          break;
        default:
          break;
      }
      return (
        <div key={field.name}>
          <b>{field.name}</b>
          <p>{value}</p>
        </div>
      );
    });
  }

  return (
    <>
      <Drawer title="Basic Drawer" placement="right" onClose={onClose} visible={visible}>
        {contents}
      </Drawer>
    </>
  );
};
