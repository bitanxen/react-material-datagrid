import { create } from '@storybook/theming/create'
import { addons } from '@storybook/addons'

const theme = create({
  brandUrl: 'https://github.com/bitanxen/react-material-datagrid'
})

addons.setConfig({
  theme
})
