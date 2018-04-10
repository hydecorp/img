# shy-img

[![npm version](https://badge.fury.io/js/shy-img.svg)](https://badge.fury.io/js/shy-img)

<!--more-->

## Example

* [Mixin Example](https://qwtel.com/shy-img/example/mixin/){:.external}
* [Vanilla JS Example](https://qwtel.com/shy-img/example/vanilla/){:.external}
* [jQuery Example](https://qwtel.com/shy-img/example/jquery/){:.external}
* [WebComponent Example](https://qwtel.com/shy-img/example/webcomponent/){:.external}

## Usage

```html
<shy-img>
  <noscript>
    <img src="..." />
  </noscript>
</shy-img>
```

## License

**shy-img** is licensed under [GPL-3.0](LICENSE.md).
Commercial licenses will be available once the API stabilizes.

<!-- |              | Personal           | Startup            | Enterprise         |
|:-------------|:------------------:|:------------------:|:------------------:|
| # Developers | 2                  | 15                 | ∞                  |
| License      | [Personal][pl]     | [Startup][sl]      | [Enterprise][el]   |
| Price        | $29                | $249               | $499               |
| | [**Buy**][bp]{:.gumroad-button} | [**Buy**][bs]{:.gumroad-button} | [**Buy**][be]{:.gumroad-button} |
{:.stretch-table} -->

<!-- Unless you've obtained one of the licenses above, **hy-push-state** must be used in accordance with the [GPL-3.0](LICENSE.md) license. -->

[pl]: licenses/personal.md
[sl]: licenses/startup.md
[el]: licenses/enterprise.md
[bp]: https://gumroad.com/l/hy-push-state-personal
[bs]: https://gumroad.com/l/hy-push-state-startup
[be]: https://gumroad.com/l/hy-push-state-enterprise


## Documentation

* [Options](doc/options.md){:.flip-title}
* [Methods](doc/methods.md){:.flip-title}
* [Events](doc/events.md){:.flip-title}

<!-- ## Usage
The most straight-forward way to use **hy-push-state** is by using the vanilla JS version and load it from a CDN:

~~~html
<script src="https://unpkg.com/hy-push-state/dist/vanilla/hy-push-state.min.js"></script>
~~~

~~~html
<shy-img>
  <noscript>
    <img src="..." srcset="..." alt="..." />
  </noscript>
</shy-img>
~~~

This assumes all pages have an element with `id="pushStateEl"`, which will be used for replacement.
You can get more fine-grained control over which elements get replaced with the [`replaceIds` option](doc/options.md#replaceids).


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
