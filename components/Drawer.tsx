import React from 'react';
import { Drawer } from 'antd';
import type { Field } from './data';
import { createColumn } from './column';

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
      const column = createColumn(field, data[field.name]);
      return (
        <div key={field.name}>
          <b>{column.title}</b>
          <p>{column.value}</p>
        </div>
      );
    });
  }

  return (
    <>
      <Drawer title="Details" placement="right" onClose={onClose} visible={visible} width={'50%'}>
        {contents}
      </Drawer>
    </>
  );
};
