/* eslint-disable @typescript-eslint/consistent-type-imports */
import React, { useEffect, useRef } from 'react';
import { message, Form, Modal } from 'antd';
import ProForm, { DrawerForm } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
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

export const drawerFormFactory = (title: string, fields: Field[], trigger: JSX.Element) => {
  const formItems = fields.map((field) => {
    return createFormItem(field);
  });

  const _Form = (props: { submit: (values: any) => void; initialValues?: any }) => {
    const { initialValues, submit } = props;
    const formRef = useRef<ProFormInstance>();

    return (
      <DrawerForm
        title={title}
        trigger={trigger}
        initialValues={initialValues}
        formRef={formRef}
        submitter={{
          searchConfig: {
            resetText: 'Close',
            submitText: 'Confirm',
          },
        }}
        layout={'vertical'}
        drawerProps={{
          destroyOnClose: true,
        }}
        onFinish={async (values) => {
          // const fieldsValue = await form.validateFields();
          try {
            await submit(values);
            message.success('Success');
            return true;
          } catch (err: any) {
            message.error(err);
            return false;
          }
        }}
      >
        {formItems}
      </DrawerForm>
    );
  };
  return _Form;
};
