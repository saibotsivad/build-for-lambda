#!/usr/bin/env node

const minimist = require('minimist')
const rollup = require('./rollup-configuration.js')

const argv = minimist(process.argv.slice(2))
const option = {
	input: argv.in || argv.i,
	output: argv.out || argv.o,
	name: argv.name || argv.n
}

if (!option.input) {
	console.log('Required parameter: --input / -i')
	console.log('The path to the input file.')
	process.exit(1)
}

if (!option.output) {
	console.log('Required parameter: --output / -o')
	console.log('The path to the output file.')
	process.exit(1)
}

if (!option.name) {
	console.log('Required parameter: --name / -n')
	console.log('The name of the exported handler function.')
	process.exit(1)
}

rollup(option)
	.then(() => {
		console.log(`Success writing ${option.input} => ${option.output}`)
	})
	.catch(error => {
		console.log(`Failure writing ${option.input} => ${option.output}`)
		console.log(error)
	})
