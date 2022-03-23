import React, { useState, useEffect } from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface RemoteSelectProps {
  request: (value: string | undefined) => Promise<any>;
}

export default (props: any) => {
  // timeout: any;

  // state = {
  //   data: [],
  //   value: undefined,
  // };

  // constructor(props: any) {
  //   super(props);
  //   this.timeout = null;
  // }
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
  const [dataList, setDataList] = useState<object[]>();

  // componentDidMount = async () => {
  //   if (this.props.request) {
  //     this.fetch({
  //       service: this.props.request,
  //       callback: (data) => {
  //         this.setState({ data });
  //       },
  //     });
  //   }
  // };

  const handleSearch = async (value: string) => {
    if (value) {
      fetch({
        value,
        service: props.request,
        callback: (data: object[]) => {
          setDataList(data);
        },
      });
    } else {
      setDataList([]);
    }
  };

  const { request, ...others } = props;

  useEffect(() => {
    let cancel = false;
    const fetchDataList = async () => {
      const data = await request();
      if (cancel) return;
      setDataList(data);
    };

    fetchDataList();

    return () => {
      cancel = true;
    };
  }, []);

  const options = dataList?.map((d: any) => (
    <Option key={d.value} value={d.value}>
      {d.label}
    </Option>
  ));

  return (
    <Select
      {...others}
      showSearch
      //value={this.state.value}
      // // placeholder={this.props.placeholder}
      // // style={this.props.style}
      // defaultActiveFirstOption={false}
      // showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      //onChange={this.handleChange}
      // notFoundContent={null}
    >
      {options}
    </Select>
  );
};
