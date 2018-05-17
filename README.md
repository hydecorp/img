# hy-img

[![npm version](https://badge.fury.io/js/hy-img.svg)](https://badge.fury.io/js/hy-img)

**hy-img** is a image tag drop-in replacement that lazy-loads TODO

<!--more-->

## Example

* [WebComponent Example](https://qwtel.com/hy-img/example/webcomponent/){:.external}
* [jQuery Example](https://qwtel.com/hy-img/example/jquery/){:.external}
* [Vanilla JS Example](https://qwtel.com/hy-img/example/vanilla/){:.external}
* [Mixin Example](https://qwtel.com/hy-img/example/mixin/){:.external}


## License

**hy-img** is Open Source but not free.

You may use the component in accordance with the [GPL-3.0 license](licenses/GPL-3.0.md),
but this means you must be willing to release your code under a GPLv3-compatible license in turn.

For cases were this is not acceptable the following commercial licenses available:

|              | Personal           | Startup            | Enterprise         |
|:-------------|:------------------:|:------------------:|:------------------:|
| # Developers | 2                  | 15                 | ∞                  |
| License      | [Personal][pl]     | [Startup][sl]      | [Enterprise][el]   |
| Price        | $29                | $249               | $499               |
| | [**Buy**][bp]{:.gumroad-button} | [**Buy**][bs]{:.gumroad-button} | [**Buy**][be]{:.gumroad-button} |
{:.stretch-table}

[pl]: licenses/personal.md
[sl]: licenses/startup.md
[el]: licenses/enterprise.md
[bp]: https://gumroad.com/l/hy-img-personal
[bs]: https://gumroad.com/l/hy-img-startup
[be]: https://gumroad.com/l/hy-img-enterprise


## Usage

**hy-img** can be used in a variety of ways:
* As [Web Component](usage/#web-component), both as *ES6 Module* and *HTML Import*
* As [jQuery](usage/#jquery) plugin
* As [Vanilla](usage/#vanilla) JavaScript class
* As part of [bundled frontend code](usage/#bundlers).
* (Advanced) Possibly as part of your own component hierarchy as [ES6 Mixin][esmixins].

[esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/

### Web Component
The Web Component is the preferred way of using **hy-img**, but requires [support] in the browser or a [polyfill]. There are multiple ways of including it on your page:

#### Bundled ES6 Module
This is the version that is going to have native support across all major browsers the soonest.

~~~html
<script type="module" href="https://unpkg.com/hy-img/dist/webcomponent/module"></script>

<hy-img src="..." srcset="..." width="800" height="600">
  <noscript><img src="..." srcset="..." /></noscript>
  <div slot="loading" hidden><!-- ... --></div>
</hy-img>
~~~

#### HTML Import
Some browsers have decided against implementing HTML Imports, but they are easily polyfilled.

~~~html
<link rel="import" href="https://unpkg.com/hy-img/dist/webcomponent/hy-img.html">

<hy-img src="..." srcset="..." width="800" height="600">
  <noscript><img src="..." srcset="..." /></noscript>
  <div slot="loading" hidden><!-- ... --></div>
</hy-img>
~~~

#### Unbundled ES6 Module (experimental)
When loading the component form the [unpkg] CDN, you can import the source directly by appending the `?module` query parameter.

~~~html
<script type="module" src="https://unpkg.com/hy-img/src/webcomponent/module?module"></script>

<hy-img src="..." srcset="..." width="800" height="600">
  <noscript><img src="..." srcset="..." /></noscript>
  <div slot="loading" hidden><!-- ... --></div>
</hy-img>
~~~

Note that this approach will result in hundreds of separate HTTP requests (one for each module) and is intended for testing and prototypes only. Importing unbundled ES6 modules is much slower than bundled distributions and will remain so for the foreseeable future.

One advantage of this approach is that shared dependencies will not be included twice when using more than one component from the Hydejack component family. However, setting up webpack is a better solution in these cases:

#### Bundlers
You can use **hy-img** with a frontend bundler like webpack or rollup.
Just install the component with npm or yarn and import the source in your code:

```js
import 'hy-img/src/webcomponent/module';
```

If you want to have control over when the custom element gets `define`d, you can also import the `HTMLElement` like so:

```js
import { HyImageElement } from 'hy-img/src/webcomponent';
// ...
customElements.define('hy-img', HyImageElement);
```

Note that all of **hy-img**'s dependencies are valid ES6 modules, so that they can be inlined with webpack's [`ModuleConcatenationPlugin`][mcp].

[support]: https://caniuse.com/#feat=template,custom-elementsv1,shadowdomv1,es6-module,imports
[polyfill]: https://github.com/webcomponents/webcomponentsjs
[unpkg]: https://unpkg.com/
[mcp]: https://webpack.js.org/plugins/module-concatenation-plugin/


## Documentation

* [Options](doc/options.md){:.flip-title}
* [Methods](doc/methods.md){:.flip-title}
* [Events](doc/events.md){:.flip-title}

<!-- ## Usage
The most straight-forward way to use **hy-img** is by using the vanilla JS version and load it from a CDN:

~~~html
<script src="https://unpkg.com/hy-img/dist/vanilla/hy-img.min.js"></script>
~~~

~~~html
<shy-img>
  <noscript>
    <img src="..." srcset="..." alt="..." />
  </noscript>
</shy-img>
~~~

This assumes all pages have an element with `id="pushStateEl"`, which will be used for replacement.
You can get more fine-grained control over which elements get replaced with the [`replaceIds` option](doc/doc/options.md#replaceids).


### Gold Standard
This component follows the Web Components [Gold Standard](doc/gold-standard.md){:.flip-title}.


### Source
The source code is written in a *literal programming* style, and should be reasonably approachable.
However, some knowledge of [RxJS] is required.

The core functionality is implemented in [`mixin / index.js`](doc/source/mixin/README.md),
which is used to create the framework-specific versions of the component.

* `jquery`
  * [`index.js`](doc/source/jquery/README.md)
* `mixin`
  * [`constants.js`](doc/source/mixin/constants.md)
  * [`events.js`](doc/source/mixin/events.md)
  * [`fetching.js`](doc/source/mixin/fetching.md)
  * [`history.js`](doc/source/mixin/history.md)
  * [`index.js`](doc/source/mixin/README.md)
  * [`methods.js`](doc/source/mixin/methods.md)
  * [`operators.js`](doc/source/mixin/operators.md)
  * [`script-hack.js`](doc/source/mixin/script-hack.md)
  * [`scrolling.js`](doc/source/mixin/scrolling.md)
  * [`setup.js`](doc/source/mixin/setup.md)
  * [`update.js`](doc/source/mixin/update.md)
* `vanilla`
  * [`index.js`](doc/source/vanilla/README.md)
* `webcomponent`
  * [`html-import.s`](doc/source/webcomponent/html-import.md)
  * [`index.js`](doc/source/webcomponent/README.md)
  * [`module.js`](doc/source/webcomponent/module.md)
* [`common.js`](doc/source/common.md)
* [`index.js`](doc/source/README.md)
* [`url.js`](doc/source/url.md) -->
