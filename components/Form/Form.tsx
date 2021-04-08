/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useEffect } from 'react';
import { Form, Modal } from 'antd';
import { Field } from '../data';
import { createFormItem } from './FormItem';

interface CreateFormProps {
  initialValues?: any;
  modalVisible: boolean;
  onSubmit: (fieldsValue: any) => void;
  onCancel: () => void;
}

export const formFactory = (name: string, fields: Field[]) => {
  const formItems = fields.map((field) => {
    return createFormItem(field);
  });
  return (props: { form: any; initialValues?: any }) => {
    const { form, initialValues } = props;
    useEffect(() => form.resetFields(), [form, initialValues]);
    return (
      <Form layout="vertical" name={`${name}_form_in_modal`} id="create-form" {...props}>
        {formItems.map((i) => i)}
      </Form>
    );
  };
};

export const modalFormFactory = (title: string, fields: Field[]) => {
  const BaseForm = formFactory(title.replace(/\s/g, '').toLowerCase(), fields);

  const ModalForm: React.FC<CreateFormProps> = (props) => {
    const { initialValues, modalVisible, onSubmit: handleAdd, onCancel } = props;
    const [form] = Form.useForm();

    const okHandle = async () => {
      const fieldsValue = await form.validateFields();
      handleAdd(fieldsValue);
      form.resetFields();
    };

    return (
      <Modal
        destroyOnClose
        title={title}
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => onCancel()}
      >
        <BaseForm initialValues={initialValues} form={form} />
      </Modal>
    );
  };

  return ModalForm;
};
