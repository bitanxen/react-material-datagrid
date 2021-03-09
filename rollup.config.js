import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import externalPeer from 'rollup-plugin-peer-deps-external'
import { uglify } from 'rollup-plugin-uglify'
import postcss from 'rollup-plugin-postcss'

const inputFile = 'src/index.js'
const outputFile = 'dist/index'
const production = !process.env.ROLLUP_WATCH

const globals = {
  react: 'React',
  '@material-ui/core': 'MaterialUICore',
  '@material-ui/icon': 'MaterialUIIcon',
  lodash: '_',
  uuid: 'uuid',
  'react-resizable': 'ReactResizable',
  'react-beautiful-dnd': 'ReactBeautifulDnd',
  clsx: 'clsx'
}

const external = Object.keys(globals)

const extensions = ['.js', '.jsx']

const babelOptions = {
  extensions,
  babelrc: false,
  exclude: 'node_modules/**',
  presets: ['@babel/env', '@babel/react']
}

const output = (format, fileName) => {
  return {
    globals,
    name: 'React Material UI DataGrid',
    format,
    file: fileName
  }
}

const commonPlugins = [
  resolve({ preferBuiltins: true, browser: true, ...external }),
  commonjs({
    include: 'node_modules/**'
  }),
  babel(babelOptions),
  externalPeer(),
  postcss({
    extract: 'style.css',
    minimize: production
  })
]

const rollup = [
  {
    input: inputFile,
    output: output('cjs', `${outputFile}.js`),
    plugins: [...commonPlugins, production && uglify()],
    external
  },
  {
    input: inputFile,
    output: output('es', `${outputFile}.modern.js`),
    plugins: [...commonPlugins, production && terser()],
    external
  },
  {
    input: inputFile,
    output: output('umd', `${outputFile}.umd.js`),
    plugins: [...commonPlugins, production && terser()],
    external
  }
]

export default rollup
