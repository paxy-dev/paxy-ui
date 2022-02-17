import React, { useState } from 'react';
import { Button, message } from 'antd';
import { modalFormFactory, drawerFormFactory } from '../components/Form/Form';

export default () => {
  const Form = drawerFormFactory(
    'Demo',
    [
      { name: 'name', required: true, type: 'string' },
      { name: 'description', required: true, type: 'text' },
    ],
    <Button type="primary">Open</Button>,
  );

  const [visible, handleVisible] = useState<boolean>(false);

  return (
    <>
      <Form
        onSubmit={(values) => {
          if (values.name === 'error') {
            throw 'error';
          } else {
            message.success('ok');
          }
        }}
        onDelete={(values) => {
          console.log(values);
        }}
        initialValues={{ name: 'name', description: 'description' }}
        visible={visible}
        onVisibleChange={handleVisible}
      />
    </>
  );
};
