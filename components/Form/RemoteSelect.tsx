import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

interface RemoteSelectProps {
  request: (value: string | undefined) => Promise<any>;
}

class RemoteSelect extends React.Component<any> {
  timeout: any;

  state = {
    data: [],
    value: undefined,
  };

  constructor(props: any) {
    super(props);
    this.timeout = null;
  }

  fetch = ({
    value,
    service,
    callback,
  }: {
    value?: string;
    service: (value: string | undefined) => any;
    callback: (data: object) => void;
  }) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    // currentValue = value;

    const query = () => {
      service(value).then((data: any) => callback(data));
    };

    this.timeout = setTimeout(query, 300);
  };

  componentDidMount = async () => {
    if (this.props.request) {
      this.fetch({
        service: this.props.request,
        callback: (data) => {
          this.setState({ data });
        },
      });
    }
  };

  handleSearch = async (value: string) => {
    if (value) {
      this.fetch({
        value,
        service: this.props.request,
        callback: (data) => {
          this.setState({ data });
        },
      });
    } else {
      this.setState({ data: [] });
    }
  };

  handleChange = (value: string) => {
    this.setState({ value });
  };

  render() {
    const options = this.state.data.map((d: any) => (
      <Option key={d.value} value={d.value}>
        {d.label}
      </Option>
    ));
    const { request, ...others } = this.props;
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
        onSearch={this.handleSearch}
        //onChange={this.handleChange}
        // notFoundContent={null}
      >
        {options}
      </Select>
    );
  }
}

export default RemoteSelect;
