import React from 'react';
import { Link } from 'umi';
import { Switch, Tag, Typography } from 'antd';
import type { Field } from './data';
import { Upload, createInputUnit } from './Input';

const { Text } = Typography;

const convertDisplayValue = (value: any, type: string) => {
  let v = ' ';
  switch (type) {
    case 'string':
    case 'text':
    case 'select':
    case 'paragraph':
    case 'json':
      v = value;
      break;
    case 'boolean':
    case 'number':
      v = `${value}`;
      break;
    case 'date':
      v = value.toLocaleDateString('en-US');
      break;
    case 'multiselect':
      v = JSON.stringify(value);
      break;
    case 'upload':
      v = value.url;
      break;
    default:
      break;
  }
  return v;
};

export const createColumn = (field: Field, value?: any, formInitValues?: any) => {
  let { type, sorter } = field;
  let render;
  let valueEnum;
  let fieldProps;
  let formItemProps;

  const InputUnit = createInputUnit(field);

  const renderFormItem = (
    a: any,
    { type, defaultRender, formItemProps, fieldProps, ...rest }: any,
    form: any,
  ) => {
    const disabled = formInitValues[field.name] ? true : false;
    return <InputUnit disabled={disabled} />;
  };
  if (sorter === undefined) {
    switch (field.type) {
      case 'pointer':
        sorter = (a: Field, b: Field) => {
          if (a[field.name]?.name && b[field.name]?.name) {
            return a[field.name]?.name.localeCompare(b[field.name]?.name);
          }
          if (a[field.name]?.name) {
            return true;
          }
          return false;
        };
        break;
      default:
        sorter = (a: Field, b: Field) => {
          if (a[field.name] && b[field.name]) {
            return a[field.name].localeCompare(b[field.name]);
          }
          if (a[field.name]) {
            return true;
          }
          return false;
        };
    }
  }

  switch (field.type) {
    case 'pointer':
      render = (_: any, record: { id: string }) => {
        return (
          <Text style={{ width: field.width }} ellipsis={{ tooltip: record[field.name]?.name }}>
            {field.link ? (
              // <Link to={`/${field.name}s?id=${record[field.name]?.id}`}>
              <Link
                to={{
                  pathname: `/${field.name}s`,
                  search: record[field.name]?.id ? `?id=${record[field.name]?.id}` : undefined,
                  state: field.linkstate ? { ...field.linkstate, srcId: record.id } : undefined,
                }}
              >
                {field.linkstate ? field.name : record[field.name]?.name}
              </Link>
            ) : (
              record[field.name]?.name
            )}
          </Text>
        );
      };
      break;
    case 'id':
      render = (_: any, row: any) => {
        return <a>{row[field.name]}</a>;
      };
      break;
    case 'boolean':
      formItemProps = {
        valuePropName: 'checked',
      };
      render = (_: any, row: any) => {
        return <>{row[field.name] !== undefined ? row[field.name].toString() : undefined}</>;
      };
      sorter = (a: Field, b: Field) => a[field.name] - b[field.name];
      break;
    case 'number':
      sorter = (a: Field, b: Field) => a[field.name] - b[field.name];
      type = 'digit';
      break;
    case 'json':
      type = 'textarea';
      break;
    case 'text':
      type = 'textarea';
      break;
    case 'select':
      if (field.valueEnum) {
        valueEnum = Object.fromEntries(
          field.valueEnum.map((v) => {
            return [v.text, { text: v.text, value: v.value }];
          }),
        );
      }
      break;
    case 'multiselect':
      type = 'select';
      sorter = (a: Field, b: Field) => a[field.name] - b[field.name];
      if (field.valueEnum) {
        valueEnum = Object.fromEntries(
          field.valueEnum.map((v) => {
            return [v.text, { text: v.text, value: v.value }];
          }),
        );
        fieldProps = {
          mode: 'multiple',
          showSearch: false,
          allowClear: true,
        };
      }

      break;
    case 'upload':
      // renderFormItem = () => {
      //   return <Upload />;
      // };
      render = render || (() => <></>);
      sorter = undefined;
      formItemProps = {
        getValueFromEvent: (e: any) => {
          if (!e || !e.fileList) {
            return e;
          }
          const { fileList } = e;
          return fileList[0];
        },
      };
      break;
    case 'date':
      if (sorter === undefined) {
        sorter = (a: Field, b: Field) => a[field.name] > b[field.name];
      }
      break;
    default:
      break;
  }

  if (field.required) {
    formItemProps = { ...formItemProps, rules: [{ required: true, message: 'empty' }] };
  }

  return {
    title: field.label ? field.label : field.name.charAt(0).toUpperCase() + field.name.slice(1),
    dataIndex: field.name,
    hideInForm: true,
    hideInTable: field.hideInTable !== undefined ? field.hideInTable : false,
    render: field.render ? field.render : render,
    renderFormItem,
    formItemProps,
    valueType: type,
    valueEnum,
    fieldProps,
    editable: !field.disabled,
    // colSize: 2,
    width: field.width,
    sorter,
    value: value ? convertDisplayValue(value, field.type) : value,
    ellipsis: field.ellipsis,
  };
};

export const createLinkColumn = (rootName: string, linkname: string) => {
  return {
    name: linkname,
    type: 'text',
    required: true,
    disabled: true,
    render: (_: any, record: { id: string }) => {
      return <Link to={`/${linkname}?${rootName.toLowerCase()}=${record.id}`}>{linkname}</Link>;
    },
  };
};
