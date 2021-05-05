import { useEffect, useState } from 'react'
import { debounce } from 'lodash'
/**
 * 添加 value 响应的节流器
 * @param value useState 获取的值
 * @param delay 延迟的时间
 * @returns
 */
function useDebounce(value: string, delay = 300) {
  const [debounceValue, setDebounceValue] = useState(value)

  useEffect(() => {
    // 方式一
    const handler = debounce(
      (v) => {
        setDebounceValue(v)
      },
      delay,
      { leading: false, trailing: true }
    )

    handler(value)

    return handler.cancel
  }, [value, delay])

  // 方式二
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebounceValue(value)
  //   }, delay)

  //   return () => window.clearTimeout(handler)
  // }, [value, delay])

  return debounceValue
}

export default useDebounce
