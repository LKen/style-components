import { IconProp } from '@fortawesome/fontawesome-svg-core'
import classNames from 'classnames'
import { ChangeEvent, FC, InputHTMLAttributes, ReactElement } from 'react'
import Icon from '../Icon/icon'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLElement>, 'size'> {
  /**是否禁用 Input */
  disabled?: boolean
  /**设置 input 大小，支持 lg 或者是 sm */
  size?: 'lg' | 'sm'
  /**添加图标，在右侧悬浮添加一个图标，用于提示 */
  icon?: IconProp
  /**添加前缀 用于配置一些固定组合 */
  prepend?: string | ReactElement
  /**添加后缀 用于配置一些固定组合 */
  append?: string | ReactElement
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export const Input: FC<InputProps> = (props) => {
  const { disabled, size, icon, prepend, append, style, ...restProp } = props

  const cnames = classNames('g-input-wrapper', {
    [`input-size-${size}`]: size,
    'is-disabled': disabled,
    'input-group': prepend || append,
    'input-group-append': !!append,
    'input-group-prepend': !!prepend
  })

  const fixControlledValue = (value: any) => {
    if (typeof value === 'undefined' || value === null) {
      return ''
    }
    return value
  }

  if ('value' in props) {
    delete restProp.defaultValue

    restProp.value = fixControlledValue(props.value)
  }

  return (
    <div className={cnames}>
      {prepend && <div className="g-input-group-prepend">{prepend}</div>}
      {icon && (
        <div className="icon-wrapper">
          <Icon icon={icon} title={`title-${icon}`} />
        </div>
      )}
      <input className="g-input-inner" disabled={disabled} {...restProp} />
      {append && <div className="g-input-group-append">{append}</div>}
    </div>
  )
}

export default Input
