
import '../src/style/index.scss'
import React from 'react'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  info: {
    inline: true, header: false
  }
}

export const decorators = [
  (Story) => (
    <div style={{ margin: '3em' }}>
      <Story />
    </div>
  ),
];
