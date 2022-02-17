import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import type { BasicLayoutProps } from '@ant-design/pro-layout';
import { PageContainer, PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { Field, Services, TableAction } from './data';
import { modalFormFactory, drawerFormFactory } from './Form';
import Drawer from './Drawer';
import { createColumn, createLinkColumn } from './column';
import { createServiceHandler } from './service';

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
  extra: object;
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

  // const DeleteForm = modalFormFactory(`Delete ${name}`, [
  //   { name: 'id', required: true, type: 'paragraph', disabled: true, label: ' ' },
  // ]);

  const Table: React.FC<BasicLayoutProps> = ({ location }) => {
    const queryParams = location?.query || {};

    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

    const [updateFormValues, setUpdateFormValues] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const actionRef = useRef<ActionType>();

    const linkColumn = createLinkColumn(name, links);
    const columns = [...linkColumn, ...tableFields].map((field) => createColumn(field));

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

    let rowSelection = {};
    if (detialFields) {
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
          setUpdateFormValues(selected);
          handleUpdateModalVisible(true);
        },
      };
    }

    return (
      <PageHeaderWrapper breadcrumb={{ routes }}>
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
            <CreateForm
              onSubmit={async (value: any) => {
                await createHandler(value);
              }}
              // onCancel={() => {
              //   handleModalVisible(false);
              // }}
              initialValues={{ [parentField]: queryParams[parentField] }}
            />,
            <UpdateForm
              onSubmit={async (value: any) => {
                await updateHandler(value);
              }}
              initialValues={updateFormValues}
              visible={updateModalVisible}
              onVisibleChange={handleUpdateModalVisible}
              onDelete={deleteHandler}
            />,
            // ...actionButtons,
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
      </PageHeaderWrapper>
    );
  };
  return Table;
};
