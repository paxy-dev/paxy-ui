import { message } from 'antd';

export const createServiceHandler = (msg: string, service: (fieldsValues: any) => void) => {
  return async (values: any) => {
    const hide = message.loading(msg);
    try {
      await service(values);
      hide();
      message.success('success');
      return true;
    } catch (error: any) {
      hide();
      message.error(error);
      return false;
    }
  };
};
