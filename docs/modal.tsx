import React, { useState } from 'react';
import { Button } from 'antd';
import { modalFormFactory } from '../components/Form/Form';

export default () => {
  const Form = modalFormFactory('Demo', [
    { name: 'name', required: true, type: 'string' },
    { name: 'description', required: true, type: 'text' },
    { name: 'upload', required: true, type: 'upload' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = (values: any) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(values));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Modal Form
      </Button>
      <Form onSubmit={handleOk} onCancel={handleCancel} modalVisible={isModalVisible} />
    </>
  );
};
