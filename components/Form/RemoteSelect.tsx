import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

let timeout: any;
let currentValue: string | undefined;

interface RemoteSelectProps {
  request: (value: string | undefined) => Promise<any>;
}

const fetch = ({
  value,
  service,
  callback,
}: {
  value?: string;
  service: (value: string | undefined) => any;
  callback: (data: object) => void;
}) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const query = () => {
    service(value).then((data: any) => callback(data));
  };

  timeout = setTimeout(query, 300);
};

class RemoteSelect extends React.Component<RemoteSelectProps> {
  state = {
    data: [],
    value: undefined,
  };

  componentDidMount = async () => {
    if (this.props.request) {
      fetch({
        service: this.props.request,
        callback: (data) => {
          console.log(data);
          this.setState({ data });
        },
      });
    }
  };

  handleSearch = async (value: string) => {
    if (value) {
      fetch({
        value,
        service: this.props.request,
        callback: (data) => {
          console.log(data);
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
    const options = this.state.data.map((d: any) => <Option key={d.value}>{d.label}</Option>);
    this.props;
    return (
      <Select
        showSearch
        value={this.state.value}
        // placeholder={this.props.placeholder}
        // style={this.props.style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
      >
        {options}
      </Select>
    );
  }
}

export default RemoteSelect;
