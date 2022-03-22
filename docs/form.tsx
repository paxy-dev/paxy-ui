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
    {
      name: 'pointer',
      required: false,
      type: 'pointer',
      inputUnitProps: {
        request: async (params: string) => {
          console.log(params);
          return [
            { label: '全部', value: 'all' },
            { label: '未解决', value: 'open' },
            { label: '已解决', value: 'closed' },
            { label: '解决中', value: 'processing' },
          ];
        },
      },
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
