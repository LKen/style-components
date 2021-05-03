import { ChangeEvent, FC, useRef, useState } from 'react'
import UploadList from './UploadList'
import Dragger from './Dragger'
import axios from 'axios'

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'
export interface UploadFile {
  uid: string
  size: number
  name: string
  status?: UploadFileStatus
  percent?: number
  raw?: File
  response?: any
  error?: any
}
export interface UploadProps {
  action: string
  defaultFileList?: UploadFile[]
  beforeUpload?: (file: File) => boolean | Promise<File>
  onProgress?: (percentage: number, file: File) => void
  onSuccess?: (data: any, file: File) => void
  onError?: (err: Error, file: File) => void
  onChange?: (file: File) => void
  onRemove?: (file: UploadFile) => void

  headers?: { [key: string]: any }
  name?: string
  data?: { [key: string]: any }

  drag?: boolean
  accept?: string
  multiple?: boolean
  withCredentials?: boolean
}

export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    defaultFileList,
    beforeUpload,
    onError,
    onProgress,
    onSuccess,
    onChange,
    onRemove,
    children,
    drag,
    accept,
    multiple,
    name,
    headers,
    data,
    withCredentials
  } = props
  const fileInput = useRef<HTMLInputElement>(null)
  const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList || [])

  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click()
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files) return

    uploadFiles(files)

    if (fileInput.current) {
      fileInput.current.value = ''
    }
  }

  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files)

    postFiles.forEach((file) => {
      if (!beforeUpload) {
        post(file)
      } else {
        const result = beforeUpload(file)

        if (result && result instanceof Promise) {
          result.then((processedFile) => {
            post(processedFile)
          })
        } else if (result !== false) {
          post(file)
        }
      }
    })
  }

  const updateFileList = (
    updateFile: UploadFile,
    updateObj: Partial<UploadFile>
  ) => {
    setFileList((prevFile) =>
      prevFile.map((file) =>
        file.uid === updateFile.uid ? { ...file, ...updateObj } : file
      )
    )
  }

  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter((item) => item.uid !== file.uid)
    })

    if (onRemove) onRemove(file)
  }

  const post = (file: File) => {
    let _file: UploadFile = {
      uid: Date.now() + 'upload-file',
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file
    }

    setFileList((prevList) => {
      return [_file, ...prevList]
    })

    const formData = new FormData()

    formData.append(name || 'file', file)
    if (data) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key])
      })
    }
    axios
      .post(action, formData, {
        timeout: 30 * 1000,
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials,
        onUploadProgress: (e) => {
          let percentage = Math.round((e.loaded * 100) / e.total) || 0
          if (percentage < 100) {
            updateFileList(_file, { percent: percentage, status: 'uploading' })

            if (onProgress) onProgress(percentage, file)
          }
        }
      })
      .then((res) => {
        updateFileList(_file, { status: 'success', response: res.data })

        if (onSuccess) onSuccess(res.data, file)

        if (onChange) onChange(file)
      })
      .catch((err) => {
        updateFileList(_file, { status: 'error', error: err })

        if (onError) {
          onError(err, file)
        }
        if (onChange) {
          onChange(file)
        }
      })
  }

  return (
    <div className="g-upload-component">
      <div
        className="g-upload-input"
        style={{ display: 'inline-block' }}
        onClick={handleClick}
      >
        {drag ? (
          <Dragger onFile={(files) => uploadFiles(files)}>{children}</Dragger>
        ) : (
          children
        )}
        <input
          className="g-file-input"
          style={{ display: 'none' }}
          ref={fileInput}
          onChange={handleFileChange}
          type="file"
          accept={accept}
          multiple={multiple}
        />
      </div>

      <UploadList fileList={fileList} onRemove={handleRemove} />
    </div>
  )
}

Upload.defaultProps = {
  name: 'file'
}

export default Upload
