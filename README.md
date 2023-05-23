<h1 align="center">Inspectiv: Vue.js Client 🛡</h1>
<img src="https://my.cesppa.com/static/images/logo-horizontal.svg" width="200">
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
</p>

## Build


There are four possible ENV_TAGs to use with the build command:
- local
- dev
- staging
- prod
```sh
yarn cesppa:{ENV_TAG}
```


To build on Windows, set the NODE_ENV and run the node build command manually:
```sh
NODE_ENV=production
node build/build.js
```


## Run


Run the client using either dev or local environment using one of the following commands:
dev, local-dev

**development**
```sh
yarn dev
```


**local (if you are running docker locally)**
```sh
yarn local-dev
```

## Dependencies

- [@caohenghu/vue-colorpicker](https://ghub.io/@caohenghu/vue-colorpicker): Colorpicker of Vue Components
- [axios](https://ghub.io/axios): Promise based HTTP client for the browser and node.js
- [bootstrap](https://ghub.io/bootstrap): The most popular front-end framework for developing responsive, mobile first projects on the web.
- [bugsnag-js](https://ghub.io/bugsnag-js): Automatically detect JavaScript errors, collect detailed diagnostic information, and get notified about errors in real-time.
- [bugsnag-vue](https://ghub.io/bugsnag-vue): Vue.js integration for bugsnag-js
- [he](https://ghub.io/he): A robust HTML entities encoder/decoder with full Unicode support.
- [lodash.debounce](https://ghub.io/lodash.debounce): The lodash method `_.debounce` exported as a module.
- [simplemde-theme-base](https://ghub.io/simplemde-theme-base): The base theme for SimpleMDE, you can easily create your custom theme based on this.
- [style-loader](https://ghub.io/style-loader): style loader module for webpack
- [v-money](https://ghub.io/v-money): Vue currency input/directive mask
- [vee-validate](https://ghub.io/vee-validate): Template Based Validation Framework for Vue.js
- [vue](https://ghub.io/vue): Reactive, component-oriented view layer for modern web interfaces.
- [vue-affix](https://ghub.io/vue-affix): A Vue.js plugin that affixes an element in the window while you scroll, similar to Bootstrap Affix but much simpler
- [vue-analytics](https://ghub.io/vue-analytics): Google Analytics plugin for Vue
- [vue-cookies](https://ghub.io/vue-cookies): A simple Vue.js plugin for handling browser cookies
- [vue-js-modal](https://ghub.io/vue-js-modal): Modal Component for Vue.js
- [vue-markdown](https://ghub.io/vue-markdown): A Powerful and Highspeed Markdown Parser for Vue
- [vue-router](https://ghub.io/vue-router): Official router for Vue.js 2
- [vue-scrollto](https://ghub.io/vue-scrollto): Adds a directive that listens for click events and scrolls to elements.
- [vue-simplemde](https://ghub.io/vue-simplemde): SimpleMDE - Markdown Editor component for Vue.js
- [vue-the-mask](https://ghub.io/vue-the-mask): Tiny (2KB) and dependency free mask input for Vue.js
- [vuejs-datepicker](https://ghub.io/vuejs-datepicker): A simple Vue.js datepicker component. Supports disabling of dates, inline mode, translations
- [vuex](https://ghub.io/vuex): state management for Vue.js

## Dev Dependencies

- [autoprefixer](https://ghub.io/autoprefixer): Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use website
- [babel-core](https://ghub.io/babel-core): Babel compiler core.
- [babel-eslint](https://ghub.io/babel-eslint): Custom parser for ESLint
- [babel-helper-vue-jsx-merge-props](https://ghub.io/babel-helper-vue-jsx-merge-props): babel helper for vue jsx spread.
- [babel-loader](https://ghub.io/babel-loader): babel module loader for webpack
- [babel-plugin-add-module-exports](https://ghub.io/babel-plugin-add-module-exports): Fix babel/babel#2212
- [babel-plugin-syntax-jsx](https://ghub.io/babel-plugin-syntax-jsx): Allow parsing of jsx
- [babel-plugin-transform-runtime](https://ghub.io/babel-plugin-transform-runtime): Externalise references to helpers and builtins, automatically polyfilling your code without polluting globals
- [babel-plugin-transform-vue-jsx](https://ghub.io/babel-plugin-transform-vue-jsx): Babel plugin for Vue 2.0 JSX
- [babel-preset-env](https://ghub.io/babel-preset-env): A Babel preset for each environment.
- [babel-preset-stage-2](https://ghub.io/babel-preset-stage-2): Babel preset for stage 2 plugins
- [babel-register](https://ghub.io/babel-register): babel require hook
- [chalk](https://ghub.io/chalk): Terminal string styling done right
- [copy-webpack-plugin](https://ghub.io/copy-webpack-plugin): Copy files &amp;&amp; directories with webpack
- [css-loader](https://ghub.io/css-loader): css loader module for webpack
- [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-standard](https://ghub.io/eslint-config-standard): JavaScript Standard Style - ESLint Shareable Config
- [eslint-friendly-formatter](https://ghub.io/eslint-friendly-formatter):  simple formatter/reporter for eslint that&#39;s friendly with Sublime Text and iterm2 &#39;click to open file&#39; functionality
- [eslint-loader](https://ghub.io/eslint-loader): eslint loader (for webpack)
- [eslint-plugin-import](https://ghub.io/eslint-plugin-import): Import with sanity.
- [eslint-plugin-node](https://ghub.io/eslint-plugin-node): Additional ESLint&#39;s rules for Node.js
- [eslint-plugin-promise](https://ghub.io/eslint-plugin-promise): Enforce best practices for JavaScript promises
- [eslint-plugin-standard](https://ghub.io/eslint-plugin-standard): ESlint Plugin for the Standard Linter
- [eslint-plugin-vue](https://ghub.io/eslint-plugin-vue): Official ESLint plugin for Vue.js
- [file-loader](https://ghub.io/file-loader): A file loader module for webpack
- [friendly-errors-webpack-plugin](https://ghub.io/friendly-errors-webpack-plugin): Recognizes certain classes of webpack errors and cleans, aggregates and prioritizes them to provide a better Developer Experience
- [html-webpack-plugin](https://ghub.io/html-webpack-plugin): Simplifies creation of HTML files to serve your webpack bundles
- [mini-css-extract-plugin](https://ghub.io/mini-css-extract-plugin): extracts CSS into separate files
- [node-notifier](https://ghub.io/node-notifier): A Node.js module for sending notifications on native Mac, Windows (post and pre 8) and Linux (or Growl as fallback)
- [node-sass](https://ghub.io/node-sass): Wrapper around libsass
- [optimize-css-assets-webpack-plugin](https://ghub.io/optimize-css-assets-webpack-plugin): A Webpack plugin to optimize \ minimize CSS assets.
- [ora](https://ghub.io/ora): Elegant terminal spinner
- [portfinder](https://ghub.io/portfinder): A simple tool to find an open port on the current machine
- [postcss-import](https://ghub.io/postcss-import): PostCSS plugin to import CSS files
- [postcss-loader](https://ghub.io/postcss-loader): PostCSS loader for webpack
- [postcss-url](https://ghub.io/postcss-url): PostCSS plugin to rebase or inline on url().
- [rimraf](https://ghub.io/rimraf): A deep deletion module for node (like `rm -rf`)
- [sass-loader](https://ghub.io/sass-loader): Sass loader for webpack
- [semver](https://ghub.io/semver): The semantic version parser used by npm.
- [shelljs](https://ghub.io/shelljs): Portable Unix shell commands for Node.js
- [terser-webpack-plugin](https://ghub.io/terser-webpack-plugin): Terser plugin for webpack
- [url-loader](https://ghub.io/url-loader): A loader for webpack which transforms files into base64 URIs
- [vue-loader](https://ghub.io/vue-loader): Vue single-file component loader for Webpack
- [vue-recaptcha](https://ghub.io/vue-recaptcha): ReCAPTCHA vue component
- [vue-style-loader](https://ghub.io/vue-style-loader): Vue.js style loader module for webpack
- [vue-template-compiler](https://ghub.io/vue-template-compiler): template compiler for Vue 2.0
- [webpack](https://ghub.io/webpack): Packs CommonJs/AMD modules for the browser. Allows to split your codebase into multiple bundles, which can be loaded on demand. Support loaders to preprocess files, i.e. json, jsx, es7, css, less, ... and your custom stuff.
- [webpack-cli](https://ghub.io/webpack-cli): CLI for webpack &amp; friends
- [webpack-dev-server](https://ghub.io/webpack-dev-server): Serves a webpack app. Updates the browser on changes.
- [webpack-merge](https://ghub.io/webpack-merge): Variant of merge that&#39;s useful for webpack configuration

<br/><br/>
🛡️ [#SecureTheInternet](https://twitter.com/inspectiv)
***
# client-master
