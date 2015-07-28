var webpack = require('webpack');

module.exports = function (config) {
  // Browsers to run on BrowserStack
  var customLaunchers = {
    BS_Chrome: {
      base: 'BrowserStack',
      os: 'OS X',
      os_version: 'Yosemite',
      browser: 'chrome',
      browser_version: '39.0',
    },
    BS_Firefox: {
      base: 'BrowserStack',
      os: 'OS X',
      os_version: 'Yosemite',
      browser: 'firefox',
      browser_version: '32.0',
    },
    BS_Safari: {
      base: 'BrowserStack',
      os: 'OS X',
      os_version: 'Yosemite',
      browser: 'safari',
      browser_version: '8.0',
    },
//    BS_InternetExplorer_9: {
//      base: 'BrowserStack',
//      os: 'Windows',
//      os_version: '7',
//      browser: 'ie',
//      browser_version: '9.0',
//    },
    BS_InternetExplorer_10: {
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '8',
      browser: 'ie',
      browser_version: '10.0',
    },
    BS_InternetExplorer_11: {
      base: 'BrowserStack',
      os: 'Windows',
      os_version: '8.1',
      browser: 'ie',
      browser_version: '11.0',
    },
    BS_MobileSafari: {
      base: 'BrowserStack',
      os: 'iOS',
      os_version: '8.3',
      device: 'iPhone 6'
    },
  };

  config.set({
    customLaunchers: customLaunchers,

    browsers: [ 'Chrome' ],
    frameworks: [ 'mocha' ],
    reporters: [ 'mocha' ],

    files: [
      'tests.webpack.js'
    ],

    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel' }
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('test')
        })
      ]
    },

    webpackServer: {
      noInfo: true
    }
  });

  if (process.env.USE_CLOUD) {
    config.browsers = Object.keys(customLaunchers);
    config.reporters = [ 'dots' ];

    config.browserStack = {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
      startTunnel: true,
    };
  } else if (process.env.TRAVIS) {
    config.browsers = Object.keys(customLaunchers);
    config.reporters = [ 'dots' ];

    var buildLabel = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';

    config.browserStack = {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
      startTunnel: true,
      project: 'history',
      build: buildLabel,
      name: process.env.TRAVIS_JOB_NUMBER,
    };

    config.singleRun = true;
  }
};
