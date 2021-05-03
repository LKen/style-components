import React, { useState } from 'react'
import { Story, Meta } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import Input, { InputProps } from './Input'

export default {
  title: 'Test/Input',
  component: Input,
  argTypes: {}
} as Meta

const Template: Story<InputProps> = (args) => <Input {...args} />

export const Primary = Template.bind({})

Primary.args = {
  defaultValue: '123231',
  icon: 'angle-down'
}

const Template2: Story<InputProps> = (args) => {
  const [value, setValue] = useState(args.value)

  const onChange = (e: any) => {
    setValue(e.target.value)
  }

  return (
    <Input {...args} value={value} defaultValue={value} onChange={onChange} />
  )
}

export const Controll = Template2.bind({})

Controll.args = {
  icon: 'angle-down',
  value: '123123'
}
