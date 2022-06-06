import moment from 'moment';
import Upload from './Upload';
import { Input, Switch, DatePicker, Select, InputNumber } from 'antd';
import RemoteSelect from '../Form/RemoteSelect';
import type { Field, ValueEnum } from '../data';

const { TextArea } = Input;
const { Option } = Select;

const createInputUnit = (field: Field) => {
  let InputUnit;
  switch (field.type) {
    case 'number':
      InputUnit = (props: any) => <Input type="number" {...props} />;
      break;
    case 'float':
      InputUnit = (props: any) => <InputNumber style={{ width: '100%' }} step="0.1" {...props} />;
      break;
    case 'boolean':
      InputUnit = (props: any) => <Switch defaultChecked={false} {...props} />;
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
      InputUnit = Upload;
      break;
    case 'json':
      InputUnit = (props: any) => <TextArea {...props} />;
      break;
    case 'pointer':
      InputUnit = (props: any) => {
        return <RemoteSelect {...props} request={field.inputUnitProps?.request} />;
      };
      break;
    default:
      InputUnit = (props: any) => <Input {...props} />;
  }

  return InputUnit;
};

export { Upload, createInputUnit };
