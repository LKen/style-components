import '@testing-library/jest-dom/extend-expect'
import {
  createEvent,
  fireEvent,
  render,
  RenderResult,
  waitFor
} from '@testing-library/react'
import { MouseEvent } from 'react'
import { Upload, UploadProps } from './Upload'
// import { act } from 'react-dom/test-utils'
import axios from 'axios'

jest.mock('axios')
jest.mock(
  '../Icon/icon',
  () => ({
    icon,
    onClick
  }: {
    icon: any
    onClick: (e: MouseEvent<HTMLElement>) => void
  }) => <span onClick={onClick}>{icon}</span>
)
const mockedAxios = axios as jest.Mocked<typeof axios>
const testProps: UploadProps = {
  action: 'fakeurl.com',
  onSuccess: jest.fn(),
  onChange: jest.fn(),
  onRemove: jest.fn(),
  drag: true
}

let wrapper: RenderResult, fileInput: HTMLInputElement, uploadArea: HTMLElement
const testFile = new File(['zxc'], 'test.png', { type: 'image/png' })

describe('test upload component', () => {
  beforeEach(() => {
    wrapper = render(<Upload {...testProps}>Click to upload</Upload>)
    fileInput = wrapper.container.querySelector(
      '.g-file-input'
    ) as HTMLInputElement
    uploadArea = wrapper.queryByText('Click to upload') as HTMLElement
  })

  it('upload process should works fine', async () => {
    const { queryByText } = wrapper

    // error
    // mockedAxios.post.mockResolvedValue(() => {
    //   return Promise.resolve({ data: 'cool' })
    // })
    mockedAxios.post.mockResolvedValue({ data: 'cool' })
    expect(uploadArea).toBeInTheDocument()
    expect(fileInput).not.toBeVisible()

    fireEvent.change(fileInput, { target: { files: [testFile] } })
    expect(queryByText('spinner')).toBeInTheDocument()
    /**
     * ! 好奇怪，如果下面没有 await 语句的话，就会报这个错误
     * ! ‘When testing, code that causes React state updates should be wrapped into act(...)’
     */
    await waitFor(() => {
      expect(queryByText('test.png')).toBeInTheDocument()
    })
    expect(queryByText('check-circle')).toBeInTheDocument()
    expect(testProps.onSuccess).toHaveBeenCalledWith('cool', testFile)
    expect(testProps.onChange).toHaveBeenCalledWith(testFile)

    // remove the upload file
    expect(queryByText('times')).toBeInTheDocument()

    fireEvent.click(queryByText('times') as HTMLElement)
    expect(queryByText('test.png')).not.toBeInTheDocument()
    expect(testProps.onRemove).toHaveBeenCalledWith(
      expect.objectContaining({
        raw: testFile,
        status: 'success',
        name: 'test.png'
      })
    )
  })

  it('drag and drop files should works fine', async () => {
    mockedAxios.post.mockResolvedValue({ data: 'cool' })

    fireEvent.dragOver(uploadArea)
    expect(uploadArea).toHaveClass('is-dragover')
    fireEvent.dragLeave(uploadArea)
    expect(uploadArea).not.toHaveClass('is-dragover')

    const mockDropEvent = createEvent.drop(uploadArea)

    Object.defineProperty(mockDropEvent, 'dataTransfer', {
      value: {
        files: [testFile]
      }
    })
    fireEvent(uploadArea, mockDropEvent)
    await waitFor(() => {
      expect(wrapper.queryByText('test.png')).toBeInTheDocument()
    })
    expect(testProps.onSuccess).toHaveBeenCalledWith('cool', testFile)
  })
})
