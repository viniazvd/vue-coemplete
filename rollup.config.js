const vue = require('rollup-plugin-vue')
const typescript = require('rollup-plugin-typescript')

const config = {
  external: ['vue'],
  plugins: [
    typescript({
      tsconfig: false,
      experimentalDecorators: true,
      module: 'es2015'
    }),
    vue()
  ],

  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      file: 'dist/bundle.cjs.js'
    },
    {
      format: 'esm',
      file: 'dist/bundle.esm.js'
    }
  ]
}

export default config
