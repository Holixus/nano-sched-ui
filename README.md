[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]


# nano-sched-ui
'nano-sched' plugin for parse, generate, validate UI-text format

## ui.parse(log, data)

* data Object
   * encoding `String` = 'utf8'
   * content `String`
* result data Object
   * encoding `String` = 'ui-tree'
   * content `Object`

Converts UI-source into UI-tree.

## ui.stringify(log, data)

* data Object
   * encoding `String` = 'ui-tree'
   * content `Object`
* result data Object
   * encoding `String` = 'utf8'
   * content `String`

Converts UI-tree into UI-source text

## ui.to-scheme(log, data)

* data Object
   * opts `Object`
   * encoding `String` = 'ui-tree'
   * content `Object`
   * id `String` -- scheme identifier

Compiles and saves UiScheme Object into `opts.ui_schemes[id]`

## ui.validate(log, data)

* data Object
   * opts `Object`
      * ui_schemes `Object`
   * encoding `String` = 'ui-tree'
   * content `Object`
   * scheme `String` -- scheme identifier

Validates ui-tree according to `opts.ui_schemes[data.scheme]` ui-scheme and translates all nodes args properties into objects with parsed arguments.


[bithound-image]: https://www.bithound.io/github/Holixus/nano-sched-ui/badges/score.svg
[bithound-url]: https://www.bithound.io/github/Holixus/nano-sched-ui

[gitter-image]: https://badges.gitter.im/Holixus/nano-sched-ui.svg
[gitter-url]: https://gitter.im/Holixus/nano-sched-ui

[npm-image]: https://badge.fury.io/js/nano-sched-ui.svg
[npm-url]: https://badge.fury.io/js/nano-sched-ui

[github-tag]: http://img.shields.io/github/tag/Holixus/nano-sched-ui.svg
[github-url]: https://github.com/Holixus/nano-sched-ui/tags

[travis-image]: https://travis-ci.org/Holixus/nano-sched-ui.svg?branch=master
[travis-url]: https://travis-ci.org/Holixus/nano-sched-ui

[coveralls-image]: https://coveralls.io/repos/github/Holixus/nano-sched-ui/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/Holixus/nano-sched-ui?branch=master

[david-image]: https://david-dm.org/Holixus/nano-sched-ui.svg
[david-url]: https://david-dm.org/Holixus/nano-sched-ui

[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: LICENSE

[downloads-image]: http://img.shields.io/npm/dt/nano-sched-ui.svg
[downloads-url]: https://npmjs.org/package/nano-sched-ui
