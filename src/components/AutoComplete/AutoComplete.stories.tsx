import AutoComplete, { AutoCompleteProps, DataSourceType } from './AutoComplete'
import { Story, Meta } from '@storybook/react'
// import { action } from '@storybook/addon-actions'

export default {
  title: 'Test/AutoComplete',
  component: AutoComplete,
  argTypes: {
    // 一般只会触发带有 on xxxx 前缀得方法
    fetchSuggestions: {
      action: 'asdsd'
    }
  }
} as Meta

interface GithubUserProps {
  login: string
  url: string
  avatar_url: string
}

const Template: Story<AutoCompleteProps> = ({
  onChange,
  fetchSuggestions,
  ...args
}) => {
  const handleFetch = (query: string) => {
    if (!query) return []

    return fetch(`https://api.github.com/search/users?q=${query}`)
      .then((res) => res.json())
      .then(({ items }) => {
        return !items
          ? []
          : items
              .slice(0, 10)
              .map((item: any) => ({ value: item.login, ...item }))
      })
  }

  const renderOption = (item: DataSourceType) => {
    const _item = item as DataSourceType<GithubUserProps>
    return (
      <>
        <h2>Name: {_item.value}</h2>
        <p>url: {_item.url}</p>
      </>
    )
  }
  return (
    <AutoComplete
      renderOption={renderOption}
      fetchSuggestions={handleFetch}
      {...args}
    />
  )
}

export const Primary = Template.bind({})

Primary.args = {}
