const rollup = require('rollup')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const json = require('rollup-plugin-json')

module.exports = ({ input, output, name }) => {
	const rollupOptions = {
		// the input parameter is your main Lambda module file
		input,
		plugins:[
			// if you `require('./some.json')` in RollupJS you
			// will need the JSON plugin
			json(),
			// you will almost certainly want to resolve files
			// using the NodeJS module resolution algorithm
			nodeResolve({
				// to be honest I can't remember why this is here...
				jsnext: true,
				// the AWS Lambda environment is NodeJS@6.10 so we
				// can use system modules like `fs`
				preferBuiltins: true,
				// if you want to resolve anything more than `.js`
				// files you will need to specify them here
				extensions: [ '.js', '.json' ]
			}),
			// unless you are not using system modules and only
			// using strict ECMA imports, you'll want to include
			// CommonJS resolution in your rollup, which means that
			// tree shaking doesn't make as small a bundle, but
			// that's not going to be an issue in a Lambda instance
			commonjs({
				ignore: [
					// the AWS Lambda runtime includes `aws-sdk` module
					// so we can ignore it from our built bundle and
					// use that instead
					'aws-sdk',
					// these are NodeJS core modules, which I would have
					// thought that we didn't need to ignore with the
					// `nodeResolve.preferBuiltins` option, but here we
					// are ignoring them still...
					'assert',
					'buffer',
					'child_process',
					'cluster',
					'console',
					'constants',
					'crypto',
					'dgram',
					'dns',
					'domain',
					'events',
					'fs',
					'http',
					'https',
					'module',
					'net',
					'os',
					'path',
					'process',
					'punycode',
					'querystring',
					'readline',
					'repl',
					'stream',
					'string_decoder',
					'timers',
					'tls',
					'tty',
					'url',
					'util',
					'vm',
					'zlib'
				]
			}),
			// in order to run in the NodeJS@6.10 environment, we
			// need to transpile down to an older JS version
			babel({
				// in this CLI tool we will ignore any babel config
				// file found in the folder, but you probably will
				// want to specify a babelrc file in your real build
				babelrc: false,
				presets: [
					[
						// npm install --save-dev babel-preset-env
						'env',
						{
							targets: {
								node: '6.10'
							},
							// the babel transform will turn ES6 modules into
							// CommonJS modules, which undoes the work RollupJS
							// needs to do, so we don't transform the module types
							modules: false
						}
					]
				],
				plugins: [
					// npm install --save-dev babel-plugin-external-helpers
					'external-helpers'
				]
			})
		]
	}

	return rollup
		.rollup(rollupOptions)
		.then(bundle => bundle.write({
			file: output,
			// normally you would want to export a default function from
			// a JS module, but Lambdas are all named exports, so we hide
			// the RollupJS warning related to this
			exports: 'named',
			// the output file format needs to be CommonJS to be
			// runnable as an AWS Lambda
			format: 'cjs',
			// here it is merely coincidental that the Lambda handler
			// name is used, it had to be something, so it was that
			name
		}))
}
