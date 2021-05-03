import React from 'react'
import { Story, Meta } from '@storybook/react'
import Button, { ButtonProps } from './Button'

export default {
  title: 'Test/Button',
  component: Button,
  argTypes: {}
} as Meta

const Template: Story<ButtonProps> = (args) => (
  <Button {...args}>Primary1</Button>
)

export const Primary = Template.bind({})

Primary.args = {}
