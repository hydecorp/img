# src / mixin / index.js
Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Importing the hy-compontent base libary,
which helps with making multiple versions of the component (Vanilla JS, WebComponent, etc...).


```js
import { componentMixin, COMPONENT_FEATURE_TESTS, Set } from 'hy-component/src/component';
import { arrayOf, string, number } from 'hy-component/src/types';
```

A set of [Modernizr] tests that are required for this component to work.


```js
export const MIXIN_FEATURE_TESTS = new Set([
  ...COMPONENT_FEATURE_TESTS,
```

'eventlistener',


```js
  'queryselector',
```

'requestanimationframe',
'classlist',
'opacity',
'csstransforms',
'csspointerevents',


```js
]);

export const imageMixin = C =>
  class extends componentMixin(C) {
    static get componentName() {
      return 'hy-img';
    }

    static get defaults() {
      return {
        root2: null,
        rootMargin: '0px',
        threshold: [0],
      };
    }

    static get types() {
      return {
        root2: string,
        rootMargin: string,
        threshold: arrayOf(number),
      };
    }
```

Side effects of changing configuration options (if any).
Mostly we just put the value on an observable and deal with it from there.


```js
    static get sideEffects() {
      return {};
    }
```

### Setup
Overriding the setup function.


```js
    setupComponent(el, props) {
      super.setupComponent(el, props);
    }
```

Calling the [setup observables function](./setup.md) function.


```js
    connectComponent() {
      if ('IntersectionObserver' in window) {
        this.intersectionObserver = new IntersectionObserver(
          (entries) => {
```

console.log(entries.length);


```js
            entries.forEach((entry) => {
              if (entry.isIntersecting && !this.done) {
                this.loadImage();
              }
            });
          },
          {
            root: this.root2,
            rootMargin: this.rootMargin,
            threshold: this.threshold,
          },
        );

        this.intersectionObserver.observe(this.el);
      } else {
```

Just load image


```js
        this.loadImage();
      }
```

Firing an event to let the outside world know the drawer is ready.


```js
      this.fireEvent('init');
    }

    loadImage() {
      const noscript = this.el.querySelector('noscript');
      const temp = document.createElement('div');
      temp.innerHTML = noscript.textContent;
      const cn = Array.from(temp.childNodes);
      this.fireEvent('asdf', { detail: cn });
      cn.forEach(node => this.el.appendChild(node));
      this.done = true;
    }

    disconnectComponent() {
```

this.teardown$.next({});


```js
    }

    adoptComponent() {
```

this.document$.next(document);


```js
    }
  };
```


