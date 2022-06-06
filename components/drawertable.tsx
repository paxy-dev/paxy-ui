import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import type { BasicLayoutProps } from '@ant-design/pro-layout';
import { history } from 'umi';
import { PageContainer, PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Field, Services, TableAction } from './data';
import { modalFormFactory, drawerFormFactory } from './Form';
import { createColumn, createLinkColumn } from './column';
import { createServiceHandler } from './service';

const record2InitialValues = (record: object, fields: Field[]) => {
  const initialValues = { ...record };
  fields.forEach((f) => {
    if (f.type === 'pointer') {
      initialValues[f.name] = initialValues[f.name]?.id;
    }
  });
  return initialValues;
};

export const createDrawerTable = ({
  name,
  parentField,
  requestFields,
  updateRequestFields,
  tableFields,
  services,
  links = [],
  extra = {},
  detialFields = undefined,
}: {
  name: string;
  parentField: string;
  requestFields: Field[];
  updateRequestFields: Field[];
  tableFields: Field[];
  services: Services;
  links: string[];
  extra: any;
  detialFields?: Field[];
}) => {
  const CreateForm = drawerFormFactory(
    `New ${name}`,
    requestFields,
    <Button key="addItem" type="primary">
      <PlusOutlined /> Add
    </Button>,
  );
  const UpdateForm = drawerFormFactory(`Update ${name}`, updateRequestFields);

  const createHandler = createServiceHandler(`Adding ${name}`, services.create);
  const updateHandler = createServiceHandler(`Updating ${name}`, services.update);
  const deleteHandler = createServiceHandler(`Deleting ${name}`, services.delete);

  const Table: React.FC<BasicLayoutProps> = (props: any) => {
    const queryParams = history.location.query || {};
    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

    const [createFormValues, setCreateFormValues] = useState({});
    const [updateFormValues, setUpdateFormValues] = useState({});

    let { actionRef, ...otherSettings } = extra;

    if (actionRef === undefined) {
      actionRef = useRef<ActionType>();
    }

    const linkColumns = links.map((linkname) => createLinkColumn(name, linkname));
    const columns = [...linkColumns, ...tableFields].map((field) => {
      const col = createColumn(field, undefined, queryParams);
      if (field.type === 'id') {
        return {
          ...col,
          onCell: (record: any) => {
            return {
              onClick: (_: any) => {
                setUpdateFormValues(record2InitialValues(record, updateRequestFields));
                handleUpdateModalVisible(true);
              },
            };
          },
        };
      }
      return col;
    });

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
      <PageHeaderWrapper>
        <ProTable
          {...otherSettings}
          actionRef={actionRef}
          headerTitle=""
          rowKey="id"
          search={{
            defaultCollapsed: false,
          }}
          toolBarRender={() => [
            <CreateForm
              onSubmit={async (value: any) => {
                await createHandler({ ...value, locationState: history.location.state });
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}
              // onCancel={() => {
              //   handleModalVisible(false);
              // }}
              initialValues={createFormValues}
            />,
            <UpdateForm
              onSubmit={async (value: any) => {
                await updateHandler(value);
                setUpdateFormValues({});
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}
              initialValues={updateFormValues}
              visible={updateModalVisible}
              onVisibleChange={handleUpdateModalVisible}
              onDelete={async (values: any) => {
                await deleteHandler(values);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }}
            />,
            // ...actionButtons,
          ]}
          params={queryParams}
          form={{ initialValues: queryParams }}
          request={(params, sorter) => {
            const filter = { ...queryParams };
            tableFields.forEach((field) => {
              if (params[field.name]) {
                filter[field.name] = params[field.name];
              }
            });

            setCreateFormValues(filter);
            const serviceQueryParams = {
              total: params.total,
              pageSize: params.pageSize,
              current: params.current,
            };

            return services.query({
              ...serviceQueryParams,
              sorter,
              filter,
              locationState: history.location.state,
            });
          }}
          columns={columns}
        />
      </PageHeaderWrapper>
    );
  };
  return Table;
};
