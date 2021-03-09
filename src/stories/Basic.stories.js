import React from 'react'
import Basic from './Basic'

export default {
  title: 'Basic',
  component: Basic,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
}

export const Template = (args) => <Basic {...args} />
