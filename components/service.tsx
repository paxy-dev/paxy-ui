import { message } from 'antd';

export const createServiceHandler = (msg: string, service: (fieldsValues: any) => void) => {
  return async (values: any) => {
    const hide = message.loading(msg);
    try {
      await service(values);
      hide();
      message.success('success');
    } catch (error: any) {
      hide();
      message.error(error.message);
      throw error;
    }
  };
};
