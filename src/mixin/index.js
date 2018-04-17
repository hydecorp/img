// # src / mixin / index.js
// Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// Importing the hy-compontent base libary,
// which helps with making multiple versions of the component (Vanilla JS, WebComponent, etc...).
import { componentMixin, COMPONENT_FEATURE_TESTS, Set } from "hy-component/src/component";
import { rxjsMixin } from "hy-component/src/rxjs";
import { arrayOf, bool, oneOf, number, string } from "hy-component/src/types";

import { Observable } from "rxjs/_esm5/Observable";
import { Subject } from "rxjs/_esm5/Subject";

import { combineLatest } from "rxjs/_esm5/observable/combineLatest";
import { fromEvent } from "rxjs/_esm5/observable/fromEvent";
import { never } from "rxjs/_esm5/observable/never";
import { of } from "rxjs/_esm5/observable/of";

import { ajax } from "rxjs/_esm5/observable/dom/ajax";

import { distinctUntilChanged } from "rxjs/_esm5/operators/distinctUntilChanged";
import { distinctUntilKeyChanged } from "rxjs/_esm5/operators/distinctUntilKeyChanged";
import { filter } from "rxjs/_esm5/operators/filter";
import { finalize } from "rxjs/_esm5/operators/finalize";
import { map } from "rxjs/_esm5/operators/map";
import { merge } from "rxjs/_esm5/operators/merge";
import { share } from "rxjs/_esm5/operators/share";
import { startWith } from "rxjs/_esm5/operators/startWith";
import { switchMap } from "rxjs/_esm5/operators/switchMap";
import { takeUntil } from "rxjs/_esm5/operators/takeUntil";
import { tap } from "rxjs/_esm5/operators/tap";

import { parseSrcset, srcsetFromSrc } from "./srcset";

/*
function blobToDataURL(blob) {
  return new Promise((res, rej) => {
    const a = new FileReader();
    a.onload = ({ target: { result } }) => res(result);
    a.onerror = rej;
    a.readAsDataURL(blob);
  });
}
*/

/*
const createObjectURL = blob =>
  Observable.create(obs => {
    const objURL = URL.createObjectURL(blob);
    obs.next(objURL);
    return () => {
      if (process.env.DEBUG) console.log("revoke", objURL);
      URL.revokeObjectURL(objURL);
    };
  });
*/

const createXObservable = X => (el, cOpts, oOpts) =>
  Observable.create(obs => {
    const next = obs.next.bind(obs);
    const observer = new X(xs => Array.from(xs).forEach(next), cOpts);
    // if (process.env.DEBUG) console.log("observe", X.name);
    observer.observe(el, oOpts);
    return () => {
      // if (process.env.DEBUG) console.log("unobserve", X.name);
      observer.unobserve(el);
    };
  });

const createIntersectionObservable = createXObservable(window.IntersectionObserver);
const createResizeObservable = createXObservable(window.ResizeObserver);

/* const idle = x => new Promise(res => requestIdleCallback(() => res(x))); */
/* const anim = x => new Promise(res => requestAnimationFrame(() => res(x))); */

// Consider a URL external if either the protocol, hostname or port is different.
function isExternal({ protocol, host }, location = window.location) {
  return protocol !== location.protocol || host !== location.host;
}

// A set of [Modernizr] tests that are required for this component to work.
export const MIXIN_FEATURE_TESTS = new Set([
  ...COMPONENT_FEATURE_TESTS,
  // 'eventlistener',
  "queryselector",
  // 'requestanimationframe',
  // 'classlist',
  // 'opacity',
  // 'csstransforms',
  // 'csspointerevents',
]);

export const imageMixin = C =>
  class extends rxjsMixin(componentMixin(C)) {
    static get componentName() {
      return "shy-img";
    }

    static get defaults() {
      return {
        root: null,
        rootMargin: "0px",
        src: null,
        srcset: null,
        width: null,
        height: null,
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

    // ### Setup
    // Calling the [setup observables function](./setup.md) function.
    connectComponent() {
      this.updateAttr = this.updateAttr.bind(this);

      this.loadImage$ = new Subject();

      this.img = document.createElement("img");
      this.sizer = document.createElement("div");

      this.loading = this.el.querySelector('[slot="loading"]');

      /* requestAnimationFrame(() => { */
      this.img.style.display = "block";
      if (this.loading) this.sizer.appendChild(this.loading);
      this.el.appendChild(this.sizer);
      /* }); */

      requestIdleCallback(() => {
        const resize$ =
          "ResizeObserver" in window
            ? createResizeObservable(this.el).pipe(
                startWith({ contentRect: this.el.getBoundingClientRect() })
              )
            : of({ contentRect: this.el.getBoundingClientRect() });

        combineLatest(this.subjects.width, this.subjects.height, resize$)
          .pipe(takeUntil(this.subjects.disconnect))
          .subscribe(([width, height, { contentRect: { width: contentWidth } }]) => {
            this.sizer.style.position = "relative";

            if (width != null && height != null) {
              if (width >= contentWidth) {
                this.sizer.style.width = "100%";
                this.sizer.style.paddingTop = `${height / width * 100}%`;
              } else {
                this.sizer.style.width = `${width}px`;
                this.sizer.style.height = `${height}px`;
              }
            } else {
              this.sizer.style.width = "100%";
              this.sizer.style.height = "100%";
            }
          });

        const isIntersecting$ = combineLatest(this.subjects.root, this.subjects.rootMargin).pipe(
          switchMap(
            ([root, rootMargin]) =>
              "IntersectionObserver" in window
                ? createIntersectionObservable(this.el, { root, rootMargin })
                : of({ isIntersecting: true })
          ),
          map(({ isIntersecting }) => isIntersecting),
          merge(this.loadImage$),
          takeUntil(this.subjects.disconnect),
          share()
        );

        isIntersecting$.pipe(filter(x => x), distinctUntilChanged()).subscribe(() => {
          // TODO: polyfill?
          const cache = (this.cache = new Map());

          const srcset$ = combineLatest(this.subjects.src, this.subjects.srcset).pipe(
            filter(([a, b]) => a != null || b != null),
            distinctUntilChanged(([p1, p2], [q1, q2]) => p1 === q1 && p2 === q2),
            map(([src, srcset]) => (srcset ? parseSrcset(srcset) : srcsetFromSrc(src)))
          );

          const url$ = combineLatest(resize$, srcset$).pipe(
            map(this.selectURL.bind(this)),
            distinctUntilKeyChanged("href")
          );

          const isIntersecting2$ = isIntersecting$.pipe(startWith(true), distinctUntilChanged());

          const img$ = combineLatest(url$, isIntersecting2$).pipe(
            switchMap(this.makeRequest.bind(this)),
            switchMap(this.setImgSrcAndLoad.bind(this)),
            takeUntil(this.subjects.disconnect)
          );

          // ### Subscriptions
          // Whenever the object URL changes, we set the new image src.
          img$.subscribe(
            () =>
              requestAnimationFrame(() => {
                if (this.sizer.parentNode != null) this.el.removeChild(this.sizer);
                if (this.img.parentNode == null) this.el.appendChild(this.img);
              }),

            // In case of an error, we just set all the original attributes on the image
            // and let the browser handle the rest.
            err => {
              if (process.env.DEBUG) console.error(err);
              this.loadImageFallback();
            }
          );

          this.subjects.alt.subscribe(this.updateAttr("alt"));
          this.subjects.decoding.subscribe(this.updateAttr("decoding"));
          this.subjects.longdesc.subscribe(this.updateAttr("longdesc"));

          // TODO: necessary?
          this.subjects.ismap.subscribe(this.updateAttr("ismap"));
          this.subjects.usemap.subscribe(this.updateAttr("usemap"));
        });

        // TODO: meh..
        super.connectComponent();

        // Firing an event to let the outside world know the drawer is ready.
        this.fireEvent("init");
      });
    }

    selectURL([{ contentRect: { width } }, srcsetObj]) {
      return new URL(
        srcsetObj.select(width || window.screen.width, window.devicePixelRatio || 1),
        window.location
      );
    }

    // TODO: rename?
    // TODO: doc
    makeRequest([url, isIntersecting]) {
      const { href } = url;
      const { cache } = this;

      if (isIntersecting && !cache.has(href)) {
        return ajax({
          method: "GET",
          responseType: "blob",
          url,
          crossDomain: isExternal(url),
        }).pipe(
          map(({ response }) => URL.createObjectURL(response)),
          tap(objectURL => cache.set(href, objectURL))
        );
      } else if (cache.has(href)) {
        return of(cache.get(href));
      } else {
        return never();
      }
    }

    setImgSrcAndLoad(url) {
      const load$ = fromEvent(this.img, "load");
      this.img.src = url;
      return load$;
    }

    // Reflect attributes changes on the original on the inner img.
    updateAttr(name) {
      return x =>
        x == null || x === false
          ? this.img.removeAttribute(name)
          : this.img.setAttribute(name, x === true ? "" : x);
    }

    /*
      const updateAttr2 = name => x =>
        x == null ? this.img.removeAttribute(name) : this.img.setAttribute(name, x);
      */

    loadImage() {
      this.loadImage$.next(true);
    }

    loadImageFallback() {
      if (this.el.hasAttribute("sizes")) {
        this.img.setAttribute("sizes", this.getAttribute("sizes"));
      }

      if (this.el.hasAttribute("crossorigin")) {
        this.img.setAttribute("crossorigin", this.getAttribute("crossorigin"));
      }

      if (this.el.hasAttribute("referrerpolicy")) {
        this.img.setAttribute("referrerpolicy", this.getAttribute("referrerpolicy"));
      }

      /* TODO: pass on width/height? */

      if (this.srcset) this.img.srcset = this.srcset;
      if (this.src) this.img.src = this.src;

      requestAnimationFrame(() => {
        if (this.sizer.parentNode != null) this.el.removeChild(this.sizer);
        if (this.img.parentNode == null) this.el.appendChild(this.img);
      });
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
  };
