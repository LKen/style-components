import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  ReactElement,
  useEffect,
  useRef,
  useState
} from 'react'
import Transition from '../Transition/transition'
import useDebounce from '../../hooks/useDebounce'
import Input, { InputProps } from '../Input/Input'
import Icon from '../Icon/icon'
import classNames from 'classnames'
import useClickOutside from '../../hooks/useClickOutside'

interface DataSourceObject {
  value: string
}

export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
  fetchSuggestions: (
    str: string
  ) => DataSourceType[] | Promise<DataSourceType[]>
  onSelect?: (item: DataSourceType) => void
  renderOption?: (item: DataSourceType) => ReactElement
}

export const AutoComplete: FC<AutoCompleteProps> = (props) => {
  const {
    fetchSuggestions,
    onSelect,
    value,
    renderOption,
    ...restProps
  } = props

  const [inputValue, setInputValue] = useState(value as string)
  const [suggestions, setSuggestions] = useState<DataSourceType[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const triggerSearch = useRef(false)
  const componentRef = useRef<HTMLDivElement>(null)
  const debounceValue = useDebounce(inputValue)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setInputValue(value)
    triggerSearch.current = true
  }
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.keyCode) {
      case 13: // center
        if (suggestions[highlightIndex]) {
          handleSelect(suggestions[highlightIndex])
        }
        break
      case 38: // up
        setHighlightIndex(highlightIndex - 1)
        break
      case 40: // down
        setHighlightIndex(highlightIndex + 1)
        break
      case 27: // esc
        setShowDropdown(false)
        break
    }
  }
  const handleSelect = (item: DataSourceType) => {
    setInputValue(item.value)
    setShowDropdown(false)
    if (onSelect) {
      onSelect(item)
    }
    triggerSearch.current = false
  }
  const renderTemplate = (item: DataSourceType) => {
    return renderOption ? renderOption(item) : item.value
  }
  const generateDropdown = () => (
    <Transition
      in={showDropdown || loading}
      animation="zoom-in-top"
      timeout={300}
      onExited={() => setSuggestions([])}
    >
      <ul className="g-suggestion-list">
        {loading && (
          <div className="suggestions-loading-icon">
            <Icon icon="spinner" spin></Icon>
          </div>
        )}
        {Array.isArray(suggestions) &&
          suggestions.map((item, index) => {
            const cnames = classNames('suggestion-item', {
              'is-active': index === highlightIndex
            })

            return (
              <li
                key={index}
                className={cnames}
                onClick={() => handleSelect(item)}
              >
                {renderTemplate(item)}
              </li>
            )
          })}
      </ul>
    </Transition>
  )

  useClickOutside(componentRef, () => {
    setShowDropdown(false)
    setSuggestions([])
  })

  useEffect(() => {
    if (debounceValue && triggerSearch.current) {
      setSuggestions([])

      const results = fetchSuggestions(debounceValue)

      if (results instanceof Promise) {
        setLoading(true)
        results.then((data) => {
          setLoading(false)
          setSuggestions(data)
          if (data.length > 0) {
            // open dropdown - menu
            setShowDropdown(true)
          }
        })
      } else {
        setSuggestions(results)
        // open dropdown menu
        if (results.length > 0) setShowDropdown(true)
      }
    } else {
      setShowDropdown(false)
    }
    setHighlightIndex(-1)
  }, [debounceValue, fetchSuggestions])

  return (
    <div ref={componentRef} className="g-auto-complete">
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...restProps}
      />
      {generateDropdown()}
    </div>
  )
}

export default AutoComplete
