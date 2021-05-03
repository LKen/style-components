import AutoComplete, { AutoCompleteProps } from './AutoComplete'
import { config } from 'react-transition-group'
import {
  fireEvent,
  render,
  RenderResult,
  waitFor
} from '@testing-library/react'
// import axios from 'axios'

// jest.mock('axios')
jest.mock('../Icon/icon', () => {
  return () => {
    return <i className="fa"></i>
  }
})

config.disabled = true

const testArray = [
  { value: 'ab', number: 11 },
  { value: 'abc', number: 1 },
  { value: 'b', number: 4 },
  { value: 'c', number: 15 }
]
const testProps: AutoCompleteProps = {
  fetchSuggestions: (query) =>
    testArray.filter((item) => item.value.includes(query)),
  onSelect: jest.fn(),
  placeholder: 'auto-complete'
}
let wrapper: RenderResult, inputNode: HTMLInputElement

describe('test AutoComplete component', () => {
  beforeEach(() => {
    wrapper = render(<AutoComplete {...testProps}></AutoComplete>)
    inputNode = wrapper.getByPlaceholderText(
      'auto-complete'
    ) as HTMLInputElement
  })

  it('test basic AutoComplete behavior', async () => {
    // input change
    fireEvent.change(inputNode, {
      target: {
        value: 'a'
        // files: [new File(['1233'], 'chucknorris.png', { type: 'image/png' })]
      }
    })
    await waitFor(() => {
      expect(wrapper.queryByText('ab')).toBeInTheDocument()
    })
    // should have two suggestion items
    expect(
      wrapper.container.querySelectorAll('.suggestion-item').length
    ).toEqual(2)
    //click the first item
    fireEvent.click(wrapper.getByText('ab'))
    expect(testProps.onSelect).toHaveBeenCalledWith({ value: 'ab', number: 11 })
    expect(wrapper.queryByText('ab')).not.toBeInTheDocument() // getByText 找不到会报错 应该用 query
    //fill the input
    expect(inputNode.value).toEqual('ab')
  })

  it('should provide keyboard support', async () => {
    // input change
    fireEvent.change(inputNode, { target: { value: 'a' } })

    await waitFor(() => {
      expect(wrapper.queryByText('ab')).toBeInTheDocument()
    })
    const firstNode = wrapper.getByText('ab')
    const secondNode = wrapper.getByText('abc')
    // arrow down
    fireEvent.keyDown(inputNode, { keyCode: 40 })
    expect(firstNode).toHaveClass('is-active')
    // arrow down
    fireEvent.keyDown(inputNode, { keyCode: 40 })
    expect(secondNode).toHaveClass('is-active')
    //arrow up
    fireEvent.keyDown(inputNode, { keyCode: 38 })
    expect(firstNode).toHaveClass('is-active')
    // press enter
    fireEvent.keyDown(inputNode, { keyCode: 13 })
    expect(testProps.onSelect).toHaveBeenCalledWith({ value: 'ab', number: 11 })
    expect(wrapper.queryByText('ab')).not.toBeInTheDocument()
    expect(secondNode).not.toBeInTheDocument()
  })

  it('click outside should hide the dropdown', async () => {
    // input change
    fireEvent.change(inputNode, { target: { value: 'a' } })
    await waitFor(() => {
      expect(wrapper.queryByText('ab')).toBeInTheDocument()
    })
    fireEvent.click(document)
    expect(wrapper.queryByText('ab')).not.toBeInTheDocument()
  })

  it('renderOption should generate the right template', async () => {
    // input a, find not b, and c
    fireEvent.change(inputNode, { target: { value: 'a' } })
    await waitFor(() => {
      expect(
        wrapper.container.querySelectorAll('.suggestion-item').length
      ).toEqual(2)
    })
    expect(wrapper.queryByText('b')).not.toBeInTheDocument()
    expect(wrapper.queryByText('c')).not.toBeInTheDocument()
    // input b, length = 3,
    fireEvent.change(inputNode, { target: { value: 'b' } })
    await waitFor(() => {
      expect(
        wrapper.container.querySelectorAll('.suggestion-item').length
      ).toEqual(3)
    })
  })

  it('async fetchSuggestions should works fine', async () => {
    const testProps2: AutoCompleteProps = {
      // jest.mock('axios') 返回的Promise 对象有点不正常 instanceof 居然失败了，暂时不知道怎么回事
      // axios 真实调用应该是没问题的
      fetchSuggestions: (query) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(testArray.filter((item) => item.value.includes(query)))
          }, 300)
        })
      },
      onSelect: jest.fn(),
      placeholder: 'auto-complete2'
    }

    const wrapper2 = render(<AutoComplete {...testProps2} />)
    const inputNode2 = wrapper2.getByPlaceholderText(
      'auto-complete2'
    ) as HTMLInputElement

    fireEvent.change(inputNode2, { target: { value: 'a' } })

    await waitFor(() => {
      expect(wrapper2.queryByText('ab')).toBeInTheDocument()
    })
  })
})
