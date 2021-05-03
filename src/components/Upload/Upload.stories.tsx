import Upload, { UploadProps } from './Upload'
import { Story, Meta } from '@storybook/react'
import Icon from '../Icon/icon'

export default {
  title: 'Test/Upload',
  component: Upload,
  argTypes: {}
} as Meta

const Template: Story<UploadProps> = (args) => (
  <Upload drag={true} multiple={true} {...args}>
    <Icon icon="upload" size="5x" theme="secondary" />
    <br />
    <p>Drag file over to upload</p>
  </Upload>
)

export const Primary = Template.bind({})

Primary.args = {
  action:
    'https://www.mocky.io/v2/5cc8019d300000980a055e76' ||
    'https://run.mocky.io/v3/86486535-ffb9-496f-a136-a23c6f3327fb',
  name: 'fileName',
  accept: '.jpeg,.jpg,.png',
  withCredentials: false
}
