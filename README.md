# build-for-lambda

Documentation and CLI for building a JavaScript module to run in AWS Lambda.

The purpose of this repo is:

* [documentation](#documentation): cheat sheet for AWS Lambdas
* [build reference](#build): cheat sheet for building modern JS
	for the Lambda environment
* [cli tool](#cli): a tool to make building super duper easy

---

## documentation

[AWS Lambda official docs.](http://docs.aws.amazon.com/lambda/)

[AWS Lambda official *JavaScript* docs.](http://docs.aws.amazon.com/lambda/latest/dg/programming-model.html)

The goal here is to give you a sort of cheat-sheet of things you need
to know in order to write a module that will be usable as an AWS Lambda.

If you find errors in here, please file issues discussing it, or make
pull requests correcting the docs.

## system limitations

Here are the short notes on Lambda limitations:

* If you use Lambda runtime v0.10.42 much of this documentation
	will not work. You should be using the latest and greatest
	anyway, though.
* You need to write for the 4.3 or 6.10 NodeJS environment.
* You can only have 100 Lambda instances running at the same
	time, unless you write to Amazon and ask nicely.

### how lambdas are used

The final JavaScript code that you end up putting out as an AWS Lambda
essentially looks like this:

```js
exports.nameOfHandler = function(event, context, callback) {
	// your code executes here, and at the end
	// if it completes without errors:
	callback(null, 'my success payload')
}
```

###### `nameOfHandler`

This (plus the file name) is the name that the Lambda "handler" invokes.

If you push a file named `myLambdaFile` then `myLambdaFile.nameOfHandler`
is the full handler name to invoke this function.

Basically, you should name this something unique in your project, and
descriptive of the Lambda action, because you'll see it show up in
your code when you want to call this Lambda.

###### `event`

"Event data" passed in to the Lambda.

###### `context` [AWS Docs](http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html)

An object that has a bunch of runtime information about the Lambda:

* `context.getRemainingTimeInMillis()`: Get the time remaining before
	the Lambda is forcefully stopped (timeout).
* `context.functionName`: The name of the function, e.g. `nameOfHandler`.


###### `callback` *(optional)*

An optional error-first callback that is used if you want to pass
information back to whatever is executing the Lambda.

## build

These instructions are for using [RollupJS](http://rollupjs.org/) to
build modern JavaScript for the AWS Lambda environment.

You need to write and/or transpile for the 4.3 or 6.10 NodeJS environment.

Here are some reference tools:

* [Rollup configuration](./rollup-configuration.js): a well commented
	configuration file that you can use as a reference for making your own

## cli

The CLI tool uses the configuration from the build section of this
document, and is really just meant as an easy-to-use tool to poke
around and see how things work.

What you're probably going to want to do is add this to your module
as a build step, perhaps as part of an integration test suite or
something similar, before publishing or deploying.

Install the normal way:

```bash
npm install --save-dev build-for-lambda
```

Then in your `package.json` add something like this:

```json
{
	"scripts": {
		"build": "build-for-lambda --in index.js --name nameOfHandler --out build.js"
	}
}
```

### cli api

The options for this CLI tool are fairly limited. They are fine
for testing things out, but if you want to make something that
you can maintain and work from, you'll want to review the [build](#build)
section of this document for good practices.

* `--in`/`-i`: The relative path to the input file. This file is what
	will be executed as the Lambda.
* `--out`/`-o`: The relative path to the output, built, transpiled file.
* `--name`/`-n`: The exported name of the handler.

## license

The documentation and source code of this repository is released
without reservations under the [Very Open License](http://veryopenlicense.com).
