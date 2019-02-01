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
import { componentMixin, COMPONENT_FEATURE_TESTS, Set } from "hy-component/src/component";
import { rxjsMixin, createXObservable } from "hy-component/src/rxjs";
import { bool, oneOf, number, string } from "hy-component/src/types";

import { Subject, combineLatest, fromEvent, merge, NEVER, of } from "rxjs/_esm5";
import { ajax } from "rxjs/_esm5/ajax";
import {
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/_esm5/operators";

import { hasCSSOM, isExternal } from "../common";

import { parseSrcset, srcsetFromSrc } from "./srcset";
```

A set of [Modernizr] tests that are required for this component to work.


```js
export const MIXIN_FEATURE_TESTS = new Set([
  ...COMPONENT_FEATURE_TESTS,
  "eventlistener",
  "queryselector",
  "requestanimationframe",
]);

export const imageMixin = C =>
  class extends rxjsMixin(componentMixin(C)) {
    static get componentName() {
      return "hy-img";
    }

    static get defaults() {
      return {
        root: null,
        rootMargin: "0px",
        src: null,
        srcset: null,
        width: null,
        height: null,
        dataWidth: null,
        dataHeight: null,
        alt: null,
        decoding: null,
        longdesc: null,
        ismap: false,
        usemap: null,
        /* referrerpolicy: null, */
      };
    }

    static get types() {
      return {
        root: string,
        rootMargin: string,
        src: string,
        srcset: string,
        width: number,
        height: number,
        dataWidth: number,
        dataHeight: number,
        alt: string,
        decoding: oneOf(["sync", "async", "auto"]),
        longdesc: string,
        ismap: bool,
        usemap: string,
        /*
        referrerpolicy: oneOf([
          "no-referrer",
          "no-referrer-when-downgrade",
          "origin",
          "origin-when-cross-origin",
          "unsafe-url"
        ]),
        */
      };
    }
```

### Setup
Calling the [setup observables function](./setup.md) function.


```js
    setupComponent(el, props) {
      super.setupComponent(el, props);
      this.loadImage$ = new Subject();
    }

    connectComponent() {
      super.connectComponent();

      this.img = document.createElement("img");
      this.sizer = document.createElement("div");
```

TODO: update loading when dom changes... use shadow dom after all?


```js
      this.loading = this.el.querySelector('[slot="loading"]');
      if (this.loading) this.sizer.appendChild(this.loading);
```

TODO: don't force inline styles


```js
      if (hasCSSOM) this.img.attributeStyleMap.set("display", "block");
      else this.img.style.display = "block";

      this.el.appendChild(this.sizer);
```

TODO: This triggers are layout event for every hy-img,
but we need to get the width of the image somehow.


```js
      const initialRect = { contentRect: this.el.getBoundingClientRect() };

      this.resize$ =
        "ResizeObserver" in window
          ? createXObservable(ResizeObserver)(this.el).pipe(startWith(initialRect))
          : of(initialRect);
```

Prefer `width` over `data-width`.


```js
      const selector = (a, b) => a || b;
      const width$ = combineLatest(this.subjects.width, this.subjects.dataWidth, selector);
      const height$ = combineLatest(this.subjects.height, this.subjects.dataHeight, selector);

      const dimensions$ = combineLatest(this.resize$, width$, height$);

      const isIntersecting$ = combineLatest(this.subjects.root, this.subjects.rootMargin).pipe(
        takeUntil(this.subjects.disconnect),
        switchMap(([root, rootMargin]) =>
          "IntersectionObserver" in window
            ? createXObservable(IntersectionObserver)(this.el, { root, rootMargin })
            : of({ isIntersecting: true })
        ),
        map(({ isIntersecting }) => isIntersecting)
      );

      this.trigger$ = merge(isIntersecting$, this.loadImage$).pipe(share());
```

Subscriptions:


```js
      dimensions$
        .pipe(takeUntil(this.subjects.disconnect))
        .subscribe(this.updateSizerStyle.bind(this));

      this.trigger$
        .pipe(
          filter(x => x),
          distinctUntilChanged()
        )
        .subscribe(this.triggered.bind(this));
```

Firing an event to let the outside world know the drawer is ready.


```js
      this.fireEvent("init");
    }

    triggered() {
```

TODO: polyfill?


```js
      const cache = (this.cache = new Map());

      const srcset$ = combineLatest(this.subjects.src, this.subjects.srcset).pipe(
        filter(([a, b]) => a != null || b != null),
        distinctUntilChanged(([p1, p2], [q1, q2]) => p1 === q1 && p2 === q2),
        map(([src, srcset]) => (srcset ? parseSrcset(srcset) : srcsetFromSrc(src)))
      );

      const url$ = combineLatest(this.resize$, srcset$).pipe(
        map(this.selectImgURL.bind(this)),
        distinctUntilKeyChanged("href")
      );

      const isIntersecting$ = this.trigger$.pipe(
        distinctUntilChanged(),
        startWith(true)
      );

      const img$ = combineLatest(url$, isIntersecting$).pipe(
        takeUntil(this.subjects.disconnect),
        tap(() => this.loading && this.loading.removeAttribute("hidden")),
        switchMap(this.makeRequest.bind(this)),
        switchMap(this.setImgSrcAndLoad.bind(this))
      );
```

#### Subscriptions
Whenever the object URL changes, we set the new image source.


```js
      img$.subscribe(
        () => {
          if (this.sizer.parentNode != null) this.el.removeChild(this.sizer);
          if (this.img.parentNode == null) this.el.appendChild(this.img);
          this.fireEvent("load");
        },
```

In case of an error, we just set all the original attributes on the image
and let the browser handle the rest.


```js
        err => {
          if (process.env.DEBUG) console.error(err);
          this.loadImageFallback();
        }
      );
```

Keeping other properties up-to-date.


```js
      this.updateAttr = this.updateAttr.bind(this);
      this.subjects.alt.subscribe(this.updateAttr("alt"));
      this.subjects.decoding.subscribe(this.updateAttr("decoding"));
      this.subjects.longdesc.subscribe(this.updateAttr("longdesc"));

      /* TODO: necessary? */
      this.subjects.ismap.subscribe(this.updateAttr("ismap"));
      this.subjects.usemap.subscribe(this.updateAttr("usemap"));
    }

    selectImgURL([intersectionEntry, srcsetObj]) {
      const {
        contentRect: { width },
      } = intersectionEntry;

      return new URL(
        srcsetObj.select(width || window.screen.width, window.devicePixelRatio || 1),
        window.location
      );
    }
```

TODO: rename?
TODO: doc


```js
    makeRequest([url, isIntersecting]) {
      const { href } = url;
      const { cache } = this;

      if (isIntersecting && !cache.has(href)) {
        return ajax({
          method: "GET",
          responseType: "blob",
          url,
          crossDomain: isExternal(url),
          headers: { Accept: "image/*" },
        }).pipe(
          map(({ response }) => URL.createObjectURL(response)),
          tap(objectURL => cache.set(href, objectURL))
        );
      } else if (cache.has(href)) {
        return of(cache.get(href));
      } else {
        return NEVER;
      }
    }

    setImgSrcAndLoad(url) {
      const load$ = fromEvent(this.img, "load");
      this.img.src = url;
      return load$;
    }
```

Reflect attributes changes on the original on the inner img.


```js
    updateAttr(name) {
      return x =>
        x == null || x === false
          ? this.img.removeAttribute(name)
          : this.img.setAttribute(name, x === true ? "" : x);
      /* return x => (x == null ? this.img.removeAttribute(name) : this.img.setAttribute(name, x));
       */
    }

    loadImageFallback() {
      if (this.el.hasAttribute("sizes")) this.img.setAttribute("sizes", this.getAttribute("sizes"));
      if (this.el.hasAttribute("crossorigin"))
        this.img.setAttribute("crossorigin", this.getAttribute("crossorigin"));
      if (this.el.hasAttribute("referrerpolicy"))
        this.img.setAttribute("referrerpolicy", this.getAttribute("referrerpolicy"));

      /* TODO: pass on width/height? */

      if (this.srcset) this.img.srcset = this.srcset;
      if (this.src) this.img.src = this.src;

      if (this.sizer.parentNode != null) this.el.removeChild(this.sizer);
      if (this.img.parentNode == null) this.el.appendChild(this.img);
      this.fireEvent("load");
    }

    updateSizerStyle([intersectionEntry, width, height]) {
      const {
        contentRect: { width: contentWidth },
      } = intersectionEntry;

      if (hasCSSOM) {
        this.sizer.attributeStyleMap.set("position", "relative");
        if (width != null && height != null) {
          if (width >= contentWidth) {
            this.sizer.attributeStyleMap.set("width", CSS.percent(100));
            this.sizer.attributeStyleMap.set("padding-top", CSS.percent((height / width) * 100));
          } else {
            this.sizer.attributeStyleMap.set("width", CSS.px(width));
            this.sizer.attributeStyleMap.set("height", CSS.px(height));
          }
        } else {
          this.sizer.attributeStyleMap.set("width", CSS.percent(100));
          this.sizer.attributeStyleMap.set("height", CSS.percent(100));
        }
      } else {
        this.sizer.style.position = "relative";
        if (width != null && height != null) {
          if (width >= contentWidth) {
            this.sizer.style.width = "100%";
            this.sizer.style.paddingTop = `${(height / width) * 100}%`;
          } else {
            this.sizer.style.width = `${width}px`;
            this.sizer.style.height = `${height}px`;
          }
        } else {
          this.sizer.style.width = "100%";
          this.sizer.style.height = "100%";
        }
      }
    }

    disconnectComponent() {
      super.disconnectComponent();

      if (this.cache) {
        this.cache.forEach(objURL => {
          /* if (process.env.DEBUG) console.log("revoke", objURL); */
          URL.revokeObjectURL(objURL);
        });
      }
    }
```

## Methods


```js
    loadImage() {
      this.loadImage$.next(true);
    }
  };
```


