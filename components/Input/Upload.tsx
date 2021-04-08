import React, { useEffect, useState } from 'react';
import { Upload, Button } from 'antd';
import type { UploadFile } from 'antd/lib/upload/interface';
import { UploadOutlined } from '@ant-design/icons';

interface UploadState {
  fileList: UploadFile[];
  uploading: boolean;
}

export default (props: any) => {
  const { value, ...others } = props;
  const [uploadState, setUploadState] = useState<UploadState>({
    fileList: [],
    uploading: false,
  });
  const disableUpload = () => {
    if (uploadState.fileList.length === 0) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    setUploadState(uploadState);
  }, [uploadState]);
  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const { fileList } = uploadState;
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);

      let { uploading } = uploadState;
      if (newFileList.every((uploadFile) => uploadFile.status !== 'uploading')) {
        uploading = false;
      }
      setUploadState({
        fileList: newFileList,
        uploading,
      });
    },
    beforeUpload: (file: UploadFile) => {
      setUploadState({
        ...uploadState,
        fileList: [file],
      });
      return false;
    },
  };
  return (
    <Upload {...others} {...uploadProps}>
      <Button icon={<UploadOutlined />} disabled={disableUpload()}>
        Click to Upload
      </Button>
    </Upload>
  );
};
