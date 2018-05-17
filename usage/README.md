# Usage

**hy-img** can be used in a variety of ways:
* As [Web Component](#web-component), both as *ES6 Module* and *HTML Import*
* As [jQuery](#jquery) plugin
* As [Vanilla](#vanilla) JavaScript class
* As part of [bundled frontend code](#bundlers).
* (Advanced) Possibly as part of your own component hierarchy as [ES6 Mixin][esmixins].

[esmixins]: http://justinfagnani.com/2015/12/21/real-mixins-with-javascript-classes/

## Web Component
The Web Component is the preferred way of using **hy-img**, but requires [support] in the browser or a [polyfill]. There are multiple ways of including it on your page:

### Bundled ES6 Module
This is the version that is going to have native support across all major browsers the soonest.

~~~html
<script type="module" href="https://unpkg.com/hy-img/dist/webcomponent/module"></script>

<hy-img src="..." srcset="..." width="800" height="600">
  <noscript><img src="..." srcset="..." /></noscript>
  <div slot="loading" hidden><!-- ... --></div>
</hy-img>
~~~

### HTML Import
Some browsers have decided against implementing HTML Imports, but they are easily polyfilled.

~~~html
<link rel="import" href="https://unpkg.com/hy-img/dist/webcomponent/hy-img.html">

<hy-img src="..." srcset="..." width="800" height="600">
  <noscript><img src="..." srcset="..." /></noscript>
  <div slot="loading" hidden><!-- ... --></div>
</hy-img>
~~~

### Unbundled ES6 Module (experimental)
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

### Bundlers
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

<!--more-->

## jQuery
The jQuery version follows jQuery conventions to the extent possible.

The plugin function is all lowercase and without the leading "hy".
Options can be passed via `data-*` attributes, or alternatively as an object to the plugin function.
Methods are called like `.img('<name>', <arg1>, <arg2>, ...)`.
Events are of the form `<name>.hy.img`.

~~~html
<div class="hy-img" data-src="..." data-srcset="..." data-width="800" data-height="600">
  <noscript><img src="..." /></noscript>
  <div slot="loading" hidden><!-- ... --></div>
</div>

<script src="https://unpkg.com/jquery"></script>
<script src="https://unpkg.com/hy-img/dist/jquery"></script>
<script>
  $('.hy-img').img()
</script>
~~~

Note that you are responsible for calling the `disconnectComponent` function on the component when removing it from the DOM.

## Vanilla

~~~html
<div id="img-el">
  <noscript><img src="..." /></noscript>
  <div slot="loading" hidden><!-- ... --></div>
</div>

<script src="https://unpkg.com/hy-img/dist/vanilla"></script>
<script>
  var HyImage = window.hyImg.HyImage;
  var img = new HyImage(document.getElementById('img-el'), {
    src: '...',
    srcset: '...',
    width: 800,
    height: 600,
  });
</script>
~~~

Note that you are responsible for calling the `disconnectComponent` function on the component when removing it from the DOM.
