"use strict";

var assert = require('core-assert'),
    timer = require('nano-timer'),
    Promise = require('nano-promise'),
    util = require('util');


/* ------------------------------------------------------------------------ */
function Logger(stage, job) {

	var context = job.sched.name + ':' + job.name + '#' + stage;

	this.stage = stage;
	this.job = job;
	this.acc = [];
	this.dumps = [];

	this.log = function (code, format, a, b, etc) {
		acc.push(util.format('  %s: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.trace = function () {
		this.log.apply(this, Array.prototype.concat.apply(['trace'], arguments));
	};

	this.warn = function (code, format, a, b, etc) {
		acc.push(util.format('W.%s: warning: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.error = function (format, a, b, etc) {
		acc.push(util.format('E.%s: error: %s', context, util.format.apply(util.format, Array.prototype.slice.call(arguments, 1))));
	};

	this.fail = function (format, a, b, etc) {
		acc.push(util.format('F.%s: FAIL: %s', context, util.format.apply(util.format, arguments)));
	};

	this.writeListing = function (name, data) {
		this.dumps.push({
			name: name, 
			data: data
		});

		return Promise.resolve();
	};
}

Logger.prototype = {
};


var ui_plugin = require('../index.js'),
    ui_parser = require('nano-ui-parser'),
    UiScheme = require('nano-ui-scheme');

ui_parser.Node.tab = '\t';

function logger(opts, data) {
	var log = new Logger('ejs', {
			name: 'test',
			sched: {
				name: 'test',
				opts: opts
			}
		});

	data.opts = opts;
	return log;
}

suite('ui.parse', function () {
	test('1 - fine', function (done) {
		var source = 'lex AD .+\n',
		    data = {
		    	encoding: 'utf8',
		    	content: source
		    },
		    log = logger({}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.parse)
			.then(function () {
				var reverse = data.content.childrenToString('', 1);
				assert.deepStrictEqual(reverse, source);
				done();
			}).catch(done);
	});
	test('2 - bad encoding', function (done) {
		var source = 'lex AD .+',
		    data = {
		    	encoding: 'sutf8',
		    	content: source
		    },
		    log = logger({}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.parse)
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
	test('3 - bad source', function (done) {
		var source = '.l4ex AD .+',
		    data = {
		    	encoding: 'utf8',
		    	content: source
		    },
		    log = logger({}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.parse)
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
	test('4', function (done) {
		done();
	});
});

suite('ui.stringify', function () {
	test('1 - fine', function (done) {
		var source = 'lex AD .+\n',
		    data = {
		    	encoding: 'ui-tree',
		    	content: ui_parser(source)
		    },
		    log = logger({}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.stringify)
			.then(function () {
				assert.deepStrictEqual(data.content, source);
				done();
			}).catch(done);
	});
	test('2 - bad encoding', function (done) {
		var source = 'lex AD .+\n',
		    data = {
		    	encoding: 'ui-trees',
		    	content: ui_parser(source)
		    },
		    log = logger({}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.stringify)
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
	test('3', function (done) {
		done();
	});
	test('4', function (done) {
		done();
	});
});

suite('ui.to-scheme', function () {
	test('1 - fine', function (done) {
		var source = 'lex AD .+\n',
		    data = {
		    	id: 'lex',
		    	encoding: 'ui-tree',
		    	content: ui_parser(source)
		    },
		    log = logger({}, data)
		Promise.resolve(log, data)
			.then(ui_plugin['to-scheme'])
			.then(function () {
				assert.deepStrictEqual(data.opts.ui_schemes.lex.toString(), source);
				done();
			}).catch(done);
	});
	test('2 - bad encoding', function (done) {
		var source = 'lex AD .+\n',
		    data = {
		    	encoding: 'ui-trees',
		    	content: ui_parser(source)
		    },
		    log = logger({}, data)
		Promise.resolve(log, data)
			.then(ui_plugin['to-scheme'])
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
	test('3', function (done) {
		var source = 'leex AD .+\n',
		    data = {
		    	encoding: 'ui-tree',
		    	content: ui_parser(source)
		    },
		    log = logger({}, data)
		Promise.resolve(log, data)
			.then(ui_plugin['to-scheme'])
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
	test('4', function (done) {
		var source = 'lex AD .+\n',
		    data = {
		    	id: 'lex',
		    	encoding: 'ui-tree',
		    	content: ui_parser(source)
		    },
		    log = logger({
		    		ui_schemes: { }
		    	}, data)
		Promise.resolve(log, data)
			.then(ui_plugin['to-scheme'])
			.then(function () {
				assert.deepStrictEqual(data.opts.ui_schemes.lex.toString(), source);
				done();
			}).catch(done);
	});
});

suite('ui.validate', function () {

	var scheme = new UiScheme(ui_parser('lex ID [a-z][a-z0-9]+\nroot-rule node ID\nrule node ID'));

	test('1 - fine', function (done) {
		var data = {
		    	encoding: 'ui-tree',
		    	content: ui_parser('node erer'),
		    	scheme: 'demo'
		    },
		    log = logger({
		    		ui_schemes: { demo: scheme }
		    	}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.validate)
			.then(function () {
				done();
			}).catch(done);
	});
	test('2 - bad', function (done) {
		var data = {
		    	encoding: 'ui-trees',
		    	content: ui_parser('o'),
		    	scheme: 'demo'
		    },
		    log = logger({
		    		ui_schemes: { demo: scheme }
		    	}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.validate)
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
	test('3', function (done) {
		var data = {
		    	encoding: 'ui-tree',
		    	content: ui_parser('o'),
		    	scheme: 'demo'
		    },
		    log = logger({
		    		ui_schemes: { demo: scheme }
		    	}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.validate)
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
	test('4', function (done) {
		var data = {
		    	encoding: 'ui-tree',
		    	content: ui_parser('o'),
		    	scheme: undefined
		    },
		    log = logger({
		    		ui_schemes: { demo: scheme }
		    	}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.validate)
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
	test('5 - unknown scheme', function (done) {
		var data = {
		    	encoding: 'ui-tree',
		    	content: ui_parser('o'),
		    	scheme: 'demo'
		    },
		    log = logger({
		    		ui_schemes: { demos: scheme }
		    	}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.validate)
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
	test('6 - unknown scheme', function (done) {
		var data = {
		    	encoding: 'ui-tree',
		    	content: ui_parser('o'),
		    	scheme: 'demo'
		    },
		    log = logger({
		    	}, data)
		Promise.resolve(log, data)
			.then(ui_plugin.validate)
			.then(function () {
				done(Error('not failed'));
			}, function (e) {
				done();
			}).catch(done);
	});
});
