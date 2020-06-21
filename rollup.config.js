import svelte from 'rollup-plugin-svelte'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    // iife : (即時関数、Immediately-invoked function expression)
    // コード全体が即時関数に囲まれ、グローバル汚染をしなくなる。
    format: 'iife',
    // foramt が iife だと name は必須になる。
    // この名前のグローバル変数に entry ファイルの export default が代入される。
    name: 'app',
    file: 'public/build/bundle.js',
  },
  plugins: [
    // 最終的に出力する内容にたいして replace をかける
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        production ? 'production' : 'development',
      ),
    }),

    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write('public/build/bundle.css')
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !production && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}

function serve() {
  let started = false

  return {
    writeBundle() {
      if (!started) {
        started = true

        require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
        })
      }
    },
  }
}
