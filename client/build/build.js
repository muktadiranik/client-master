"use strict";
require("./check-versions")();

const ora = require("ora");
const rm = require("rimraf");
const path = require("path");
const chalk = require("chalk");
const webpack = require("webpack");
const config = require("../config");

if (!process || !process.env || !process.env.NODE_ENV) {
  throw new Error("NODE_ENV was not specified.");
}

let webpackConfigPath = "";
try {
  switch (process.env.NODE_ENV) {
    case "local":
      webpackConfigPath = "./webpack.cesppa.local.conf";
      break;
    case "development":
      webpackConfigPath = "./webpack.cesppa.dev.conf";
      break;
    case "staging":
      webpackConfigPath = "./webpack.staging.conf";
      break;
    case "production":
      webpackConfigPath = "./webpack.prod.conf";
      break;
    default:
      throw new Error(`${process.env.NODE_ENV} is not a valid environment.`);
  }
} catch (e) {
  chalk.red(e.message);
  throw e;
}

const webpackConfig = require(webpackConfigPath);

const spinner = ora(`building for ${process.env.NODE_ENV.toLowerCase()}...`);
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err;
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) {
      throw err;
    }
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + "\n\n"
    );

    if (stats.hasErrors()) {
      console.log(chalk.red("  Build failed with errors.\n"));
      process.exit(1);
    }

    console.log(chalk.cyan("  Build complete.\n"));
    console.log(
      chalk.yellow(
        "  Tip: built files are meant to be served over an HTTP server.\n" +
          "  Opening index.html over file:// won't work.\n"
      )
    );
  });
});
