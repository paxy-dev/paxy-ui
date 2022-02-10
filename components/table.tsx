import React, { useState, useRef } from 'react';
import { Button, message, Divider, Switch, Tag } from 'antd';
import { Link } from 'umi';
import type { BasicLayoutProps } from '@ant-design/pro-layout';
import { PageContainer, PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  CopyOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import ProTable, { EditableProTable } from '@ant-design/pro-table';

import type { Field, Services, TableAction } from './data';
import { modalFormFactory } from './Form';
import { Upload } from './Input';
import Drawer from './Drawer';

const createLinkColumn = (rootName: string, links: string[]) => {
  let linkColumn: any = [];
  if (links.length > 0) {
    linkColumn = [
      {
        name: 'links',
        type: 'text',
        required: true,
        disabled: true,
        render: (_: any, record: { id: string }) => {
          return links.map((i) => {
            return (
              <Tag key={i}>
                <Link to={`/${i}s?${rootName.toLowerCase()}=${record.id}`}>{i}</Link>
              </Tag>
            );
          });
        },
      },
    ];
  }
  return linkColumn;
};

const createColumns = (fields: Field[]) => {
  return fields.map((field: Field) => {
    let { type, sorter, render } = field;
    let valueEnum;
    let renderFormItem;
    let fieldProps;
    let formItemProps;
    if (sorter === undefined) {
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

    switch (field.type) {
      case 'pointer':
        render = (_: any, record: { id: string }) => {
          return (
            <Tag key={field.name}>
              <Link to={`/${field.name}s?id=${record[field.name]}`}>{record[field.name]}</Link>
            </Tag>
          );
        };
        break;
      case 'boolean':
        renderFormItem = () => {
          return <Switch />;
        };
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
        renderFormItem = () => {
          return <Upload />;
        };
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
      render,
      renderFormItem,
      formItemProps,
      valueType: type,
      valueEnum,
      fieldProps,
      editable: !field.disabled,
      colSize: 8,
      width: field.width,
      sorter,
    };
  });
};

const createServiceHandler = (msg: string, service: (fieldsValues: any) => void) => {
  return async (values: any) => {
    const hide = message.loading(msg);
    try {
      await service(values);
      hide();
      message.success('success');
      return true;
    } catch (error) {
      hide();
      message.error(error.message);
      return false;
    }
  };
};

const ActionComponent: React.FC<TableAction> = (props) => {
  const ActionForm = modalFormFactory(`${props.name}`, props.fields);
  const serviceHandler = createServiceHandler(`${props.name}`, props.service);
  const [visible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  return (
    <>
      <Button key="addItem" type="primary" onClick={() => handleModalVisible(true)}>
        {props.name}
      </Button>
      <ActionForm
        onSubmit={async (value: any) => {
          const success = await serviceHandler(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
        }}
        modalVisible={visible}
      />
    </>
  );
};

export const createTable = (
  name: string,
  parentField: string,
  requestFields: Field[],
  updateRequestFields: Field[],
  tableFields: Field[],
  services: Services,
  links: string[] = [],
  extra: object = { scroll: { x: 1600 } },
  actions: TableAction[] = [],
  enableRowSelection: boolean = false,
) => {
  const CreateForm = modalFormFactory(`New ${name}`, requestFields);
  const UpdateForm = modalFormFactory(`Update ${name}`, updateRequestFields);
  const DeleteForm = modalFormFactory(`Delete ${name}`, [
    { name: 'id', required: true, type: 'paragraph', disabled: true, label: ' ' },
  ]);

  const createHandler = createServiceHandler(`Adding ${name}`, services.create);
  const updateHandler = createServiceHandler(`Updating ${name}`, services.update);
  const deleteHandler = createServiceHandler(`Deleting ${name}`, services.delete);

  const Table: React.FC<BasicLayoutProps> = ({ location }) => {
    const queryParams = location?.query || {};

    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
    const [updateFormValues, setUpdateFormValues] = useState({});
    const [deleteFormValues, setDeleteFormValues] = useState({});
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedData, setSelectedData] = useState({});
    const actionRef = useRef<ActionType>();

    const linkColumn = createLinkColumn(name, links);
    const columns = createColumns([
      ...linkColumn,
      ...tableFields,
      {
        name: 'option',
        label: ' ',
        type: ' ',
        required: true,
        render: (_: any, record: object) => (
          <>
            <a
              onClick={() => {
                handleUpdateModalVisible(true);
                setUpdateFormValues(record);
              }}
            >
              <FormOutlined />
            </a>
            <Divider type="vertical" />
            <a
              onClick={() => {
                handleDeleteModalVisible(true);
                setDeleteFormValues(record);
              }}
            >
              <DeleteOutlined />
            </a>
          </>
        ),
      },
    ]);

    const routes = [
      {
        path: queryParams[parentField]
          ? `/${parentField}s?id=${queryParams[parentField]}`
          : `${parentField}s`,
        breadcrumbName: parentField,
      },
      {
        path: name.toLowerCase(),
        breadcrumbName: name.toLowerCase(),
      },
    ];

    const actionButtons = actions.map((i: TableAction) => {
      return <ActionComponent {...i} />;
    });

    let rowSelection = undefined;
    if (enableRowSelection) {
      rowSelection = {
        selectedRowKeys,
        type: 'radio',
        onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          // setDrawerVisible(true);
          setSelectedRowKeys(selectedRowKeys);
        },
        getCheckboxProps: (record: any) => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        }),
        onSelect: (selected, selectedRows, changeRows) => {
          setDrawerVisible(true);
          setSelectedData(selected);
        },
      };
    }

    return (
      <PageHeaderWrapper breadcrumb={{ routes }}>
        <Drawer
          data={selectedData}
          visible={drawerVisible}
          tableFields={tableFields}
          setVisible={setDrawerVisible}
          setSelectedRowKeys={setSelectedRowKeys}
        ></Drawer>
        <ProTable
          {...extra}
          headerTitle=""
          actionRef={actionRef}
          rowSelection={rowSelection}
          rowKey="id"
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button key="addItem" type="primary" onClick={() => handleModalVisible(true)}>
              <PlusOutlined /> Add
            </Button>,
            ...actionButtons,
          ]}
          params={queryParams}
          request={(params: any, sorter) => {
            const filter = { ...queryParams };
            tableFields.forEach((field) => {
              if (params[field.name]) {
                filter[field.name] = params[field.name];
              }
            });
            const serviceQueryParams = {
              total: params.total,
              pageSize: params.pageSize,
              current: params.current,
            };
            return services.query({ ...serviceQueryParams, sorter, filter });
          }}
          columns={columns}
        />
        <CreateForm
          onSubmit={async (value: any) => {
            const success = await createHandler(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleModalVisible(false);
          }}
          modalVisible={createModalVisible}
          initialValues={{ [parentField]: queryParams[parentField] }}
        />
        <UpdateForm
          onSubmit={async (value) => {
            const success = await updateHandler(value);
            if (success) {
              handleUpdateModalVisible(false);
              setUpdateFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setUpdateFormValues({});
          }}
          modalVisible={updateModalVisible}
          initialValues={updateFormValues}
        />
        <DeleteForm
          onSubmit={async (value) => {
            const success = await deleteHandler(value);
            if (success) {
              handleDeleteModalVisible(false);
              setDeleteFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleDeleteModalVisible(false);
            setDeleteFormValues({});
          }}
          modalVisible={deleteModalVisible}
          initialValues={deleteFormValues}
        />
      </PageHeaderWrapper>
    );
  };
  return Table;
};

export const createEditTable = (
  name: string,
  parentField: string,
  links: string[],
  tableFields: Field[],
  services: Services,
  extra: object = { scroll: { x: 1600, y: 1000 } },
  actions: TableAction[] = [],
) => {
  const createHandler = createServiceHandler(`Adding ${name}`, services.create);
  const updateHandler = createServiceHandler(`Update ${name}`, services.update);
  const deleteHandler = createServiceHandler(`Delete ${name}`, services.delete);

  const actionButtons = actions.map((i: TableAction) => {
    return <ActionComponent {...i} />;
  });

  const Table: React.FC<BasicLayoutProps> = ({ location }) => {
    const queryParams = location?.query || {};

    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>();
    const actionRef = useRef<ActionType>();

    const linkColumn = createLinkColumn(name, links);
    const columns = createColumns([
      ...linkColumn,
      {
        name: 'option',
        label: ' ',
        type: 'option',
        required: true,
        render: (
          __: any,
          record: { id: string },
          _: any,
          action: { startEditable: (arg0: any) => void },
        ) => [
          <a
            key="editable"
            onClick={() => {
              // eslint-disable-next-line no-unused-expressions
              action.startEditable?.(record.id);
            }}
          >
            <EditOutlined />
          </a>,
          <EditableProTable.RecordCreator
            key="copy"
            position="bottom"
            record={{
              ...record,
              id: '-',
            }}
          >
            <a>
              <CopyOutlined />
            </a>
          </EditableProTable.RecordCreator>,
        ],
      },
      ...tableFields,
    ]);

    const routes = [
      {
        path: queryParams[parentField]
          ? `/${parentField}s?id=${queryParams[parentField]}`
          : `${parentField}s`,
        breadcrumbName: parentField,
      },
      {
        path: name.toLowerCase(),
        breadcrumbName: name.toLowerCase(),
      },
    ];

    return (
      <PageContainer breadcrumb={{ routes }}>
        <EditableProTable
          {...extra}
          rowKey="id"
          headerTitle=""
          options={{ reload: true, setting: false }}
          maxLength={500}
          pagination={{ defaultPageSize: 50 }}
          actionRef={actionRef}
          toolBarRender={() => [...actionButtons]}
          recordCreatorProps={{
            position: 'bottom',
            creatorButtonText: 'Add New',
            record: () => {
              const r = {
                id: '-',
                createdAt: '-',
                updatedAt: '-',
              };
              r[parentField] = queryParams[parentField];
              return r;
            },
          }}
          columns={columns}
          params={queryParams}
          request={async (params: any, sorter) => {
            const filter = { ...queryParams };
            tableFields.forEach((field) => {
              if (params[field.name]) {
                filter[field.name] = params[field.name];
              }
            });
            const serviceQueryParams = {
              total: params.total,
              pageSize: params.pageSize,
              current: params.current,
            };
            return services.query({ ...serviceQueryParams, sorter, filter });
          }}
          editable={{
            type: 'single',
            editableKeys,
            onSave: async (_, row: any, newLine?: any) => {
              let success = false;
              if (row.id === '-') {
                const { id, index, createdAt, updatedAt, ...others } = row;
                success = await createHandler(others);
              } else {
                const { createdAt, updatedAt, ...others } = row;
                success = await updateHandler(others);
              }
              return new Promise((resolve, reject) => {
                if (success) {
                  resolve(success);
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                } else {
                  reject();
                }
              });
            },
            onChange: setEditableRowKeys,
            onDelete: async (_, row: any) => {
              const success = await deleteHandler(row);
              if (success) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            },
          }}
        />
      </PageContainer>
    );
  };

  return Table;
};
