import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'

import Icon, { IconProps } from './icon'

export default {
  title: 'Test/Icon',
  component: Icon
} as Meta

const Template: Story<IconProps> = (args) => <Icon {...args} />

export const Primary = Template.bind({})

Primary.args = {}
