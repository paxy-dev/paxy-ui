import React, { useState } from 'react';
import { Button } from 'antd';
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

  return (
    <>
      <Form
        submit={(values) => {
          if (values.name === 'error') {
            throw 'error';
          } else {
            console.log(values);
          }
        }}
        initialValues={{ name: 'name', description: 'description' }}
      />
    </>
  );
};
