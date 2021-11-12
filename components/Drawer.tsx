import React from 'react';
import { Drawer } from 'antd';

export default (props: any) => {
  //   const [visible, setVisible] = useState(false);
  const { visible, setVisible, setSelectedRowKeys } = props;
  const onClose = () => {
    setVisible(false);
    setSelectedRowKeys([]);
  };
  return (
    <>
      <Drawer title="Basic Drawer" placement="right" onClose={onClose} visible={visible}>
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};
