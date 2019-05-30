/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const path = require('path');
const webpack = require('webpack');
const {bundler, styles} = require('@ckeditor/ckeditor5-dev-utils');
const CKEditorWebpackPlugin = require('@ckeditor/ckeditor5-dev-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

let defaultCfg = {
  watch: true,
  name: 'inline',
  devtool: 'source-map',
  performance: {hints: false},

  output: {
    libraryTarget: 'umd',
    /*libraryExport: 'default'*/
  },

  optimization: {
    minimizer: [
      new TerserWebpackPlugin(
        {
          sourceMap: true,
        }
      )
    ]
  },

  plugins: [
    new CKEditorWebpackPlugin(
      {
        // UI language. Language codes follow the https://en.wikipedia.org/wiki/ISO_639-1 format.
        // When changing the built-in language, remember to also change it in the editor's configuration (src/shared.js).
        language: 'en',
        additionalLanguages: 'all'
      }
    ),
    new webpack.BannerPlugin(
      {
        banner: bundler.getLicenseBanner(),
        raw: true
      }
    )
  ],

  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ['raw-loader']
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              singleton: true
            }
          },
          {
            loader: 'postcss-loader',
            options: styles.getPostCssConfig(
              {
                themeImporter: {
                  themePath: require.resolve('@ckeditor/ckeditor5-theme-lark')
                },
                minify: true
              }
            )
          },
        ]
      }
    ]
  }
};

let classicCfg = Object.assign(
  {}, defaultCfg,
  {
    name: 'classic',
    entry: path.resolve(__dirname, 'example', 'classic.js'),
    output: {
      filename: 'ckeditor.min.js',
      path: path.resolve(__dirname, 'example', 'build', 'classic')
    }
  }
);

let inlineCfg = Object.assign(
  {}, defaultCfg,
  {
    name: 'inline',
    entry: path.resolve(__dirname, 'example', 'inline.js'),
    output: {
      filename: 'ckeditor.min.js',
      path: path.resolve(__dirname, 'example', 'build', 'inline')
    }
  }
);

module.exports = [/*classicCfg,*/ inlineCfg];
