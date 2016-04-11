"use strict";

var ui_parser = require('nano-ui-parser'),
    UiScheme = require('nano-ui-scheme');

module.exports = {

	parse: function sync(log, data) {
		if (data.encoding !== 'utf8')
			throw TypeError('data.encoding is not "utf8"');

		data.content = ui_parser(data.content);
		data.type = 'ui-tree';
	},

	stringify: function sync(log, data) {
		if (data.encoding !== 'ui-tree')
			throw TypeError('data.encoding is not "ui-tree"');

		data.type = 'text';
		data.encoding = 'utf8';
		ui_parser.Node.tab = '\t';
		data.content = data.content.childrenToString('', 1);
	},

	'to-scheme': function sync(log, data) {
		if (data.encoding !== 'ui-tree')
			throw TypeError('data.encoding is not "ui-tree"');

		var opts = data.opts,
		    scheme = new UiScheme(data.content);
		if (!opts.ui_schemes)
			opts.ui_schemes = {};
		opts.ui_schemes[data.id] = scheme;
		//log.msg('s', 'scheme %s created', data.id);
	},

	'validate': function sync(log, data) {
		if (data.encoding !== 'ui-tree')
			throw TypeError('data.encoding is not "ui-tree"');

		if (!data.scheme)
			throw Error('data.scheme is not defined');
		var opts = data.opts,
		    schemas = opts.ui_schemes || {};

		var scheme = schemas[data.scheme];
		if (!scheme)
			throw Error('unknown ui-scheme "'+data.scheme+'"');
		scheme.process(data.content, 1);
	}
};
