/**
 * 触发事件 hook, 除输入源外，点击其他文档将会取消
 */

import { RefObject, useEffect } from 'react'

const useClickOutside = (ref: RefObject<HTMLElement>, handler: Function) => {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return
      }

      handler(event)
    }

    document.addEventListener('click', listener)

    return () => {
      document.removeEventListener('click', listener)
    }
  }, [ref, handler])
}

export default useClickOutside
