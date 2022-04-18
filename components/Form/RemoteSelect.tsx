import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface RemoteSelectProps {
  request: (value: string | undefined) => Promise<any>;
}

export default (props: any) => {
  let timeout: any;

  const fetch = ({
    value,
    service,
    callback,
  }: {
    value?: string;
    service: (value: string | undefined) => any;
    callback: (data: object[]) => void;
  }) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    // currentValue = value;

    const query = () => {
      service(value).then((data: any) => callback(data));
    };

    timeout = setTimeout(query, 300);
  };
  const { request, ...others } = props;
  const [dataList, setDataList] = useState<object[]>();

  const handleSearch = async (value: string) => {
    fetch({
      value,
      service: props.request,
      callback: (data: object[]) => {
        setDataList(data);
      },
    });
  };

  const handleClear = () => {
    fetch({
      value: undefined,
      service: props.request,
      callback: (data: object[]) => {
        setDataList(data);
      },
    });
  };

  useEffect(() => {
    let cancel = false;
    const fetchDataList = async () => {
      const data = await request(props.value);
      if (cancel) return;
      setDataList(data);
    };

    if (request) {
      fetchDataList();
    }

    return () => {
      cancel = true;
    };
  }, []);

  const options = dataList?.map((d: any) => {
    return (
      <Option key={d.value} value={d.value}>
        {d.label}
      </Option>
    );
  });

  return (
    <Select
      {...others}
      showSearch
      allowClear
      // // placeholder={this.props.placeholder}
      // // style={this.props.style}
      // defaultActiveFirstOption={false}
      // showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onClear={handleClear}
      // notFoundContent={null}
    >
      {options}
    </Select>
  );
};
