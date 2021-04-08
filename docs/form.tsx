import React from 'react';
import { Form } from 'antd';
import { formFactory } from '../components/Form/Form';

React.useLayoutEffect = React.useEffect;

export default () => {
  const BaseForm = formFactory('Demo', [
    { name: 'name', required: true, type: 'string' },
    { name: 'description', required: true, type: 'text' },
    { name: 'boolean', required: true, type: 'boolean' },
    { name: 'number', required: true, type: 'number' },
    { name: 'date', required: true, type: 'date' },
    {
      name: 'select',
      required: true,
      type: 'select',
      valueEnum: [
        { text: 'Tifa', value: 'tifaaaaa' },
        { text: 'Mikasa Akaman', value: 'mikasa' },
      ],
    },
    {
      name: 'multiselect',
      required: true,
      type: 'multiselect',
      valueEnum: [
        { text: 'PS4', value: 'ps4' },
        { text: 'Switch', value: 'switch' },
        { text: 'Oculus Quest 2', value: 'oculusquest2' },
      ],
    },
    { name: 'paragraph', required: true, type: 'paragraph' },
    { name: 'upload', required: true, type: 'upload' },
  ]);

  const [form] = Form.useForm();

  return (
    <>
      <BaseForm form={form} />
    </>
  );
};
