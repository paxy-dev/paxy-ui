import React from 'react';
import moment from 'moment';
import { Form, Input, Switch, DatePicker, Select } from 'antd';
import type { Field, ValueEnum } from '../data';
import { Upload } from '../Input';

const { TextArea } = Input;
const FormItem = Form.Item;

const { Option } = Select;

export const createFormItem = (field: Field) => {
  let InputUnit: any;
  let valuePropName = 'value';
  const formItmeProps: any = {};

  switch (field.type) {
    case 'number':
      InputUnit = (props: any) => <Input type="number" {...props} />;
      break;
    case 'boolean':
      InputUnit = (props: any) => <Switch defaultChecked={false} {...props} />;
      valuePropName = 'checked';
      break;
    case 'text':
      InputUnit = (props: any) => <TextArea {...props} />;
      break;
    case 'date':
      InputUnit = (props: any) => {
        const { value } = props;
        return <DatePicker {...props} value={value ? moment(value) : null} />;
      };
      break;
    case 'paragraph':
      InputUnit = (props: any) => (
        <p {...props}>
          Please confirm to delete <b>{props.value}</b>
        </p>
      );
      break;
    case 'select':
      InputUnit = (props: any) => {
        let options;
        if (field.valueEnum) {
          options = field.valueEnum.map((v: ValueEnum) => {
            return (
              <Option value={v.value} key={v.value}>
                {v.text}
              </Option>
            );
          });
        }
        return <Select {...props}>{options}</Select>;
      };
      break;
    case 'multiselect':
      InputUnit = (props: any) => {
        let options;
        if (field.valueEnum) {
          options = field.valueEnum.map((v: ValueEnum) => {
            return (
              <Option value={v.value} key={v.value}>
                {v.text}
              </Option>
            );
          });
        }
        return (
          <Select {...props} mode="multiple">
            {options}
          </Select>
        );
      };
      break;
    case 'upload':
      // valuePropName = 'fileList';
      formItmeProps.getValueFromEvent = (e: any) => {
        if (!e || !e.fileList) {
          return e;
        }
        const { fileList } = e;
        return fileList[0];
      };
      InputUnit = Upload;
      break;
    default:
      InputUnit = (props: any) => <Input {...props} />;
  }
  return (
    <FormItem
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 15 }}
      label={field.label ? field.label : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
      name={field.name}
      rules={[{ required: field.required }]}
      key={field.name}
      valuePropName={valuePropName}
      {...formItmeProps}
    >
      <InputUnit disabled={field.disabled} />
    </FormItem>
  );
};
