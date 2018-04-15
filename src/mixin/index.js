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

import { combineLatest } from "rxjs/_esm5/observable/combineLatest";
import { never } from "rxjs/_esm5/observable/never";
import { of } from "rxjs/_esm5/observable/of";

import { ajax } from "rxjs/_esm5/observable/dom/ajax";

import { distinctUntilChanged } from "rxjs/_esm5/operators/distinctUntilChanged";
import { distinctUntilKeyChanged } from "rxjs/_esm5/operators/distinctUntilKeyChanged";
import { filter } from "rxjs/_esm5/operators/filter";
import { map } from "rxjs/_esm5/operators/map";
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

const idle = x => new Promise(res => window.requestIdleCallback(() => res(x)));
/* const anim = x => new Promise(res => window.requestAnimationFrame(() => res(x))); */

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

    static get sideEffects() {
      return {};
    }

    /*
    static get observers() {
      if (!this._observers) this._observers = new WeakMap();
      return this._observers;
    }
    */

    // ### Setup
    updateImage(url) {
      /* this.img.style.width = "100%"; */
      if (this.alt) this.img.setAttribute("alt", this.alt);
    }

    get img() {
      if (!this.img_) {
        this.img_ = document.createElement("img");
        window.requestAnimationFrame(() => this.el.appendChild(this.img_));
      }
      return this.img_;
    }

    // Calling the [setup observables function](./setup.md) function.
    connectComponent() {
      /*
      this.el.style.display = "inline-block";
      this.el.style.position = "relative";
      */
      window.requestIdleCallback(() => {
        // if (process.env.DEBUG) console.time("shy-img");

        const isIntersecting$ = combineLatest(this.subjects.root, this.subjects.rootMargin).pipe(
          switchMap(
            ([root, rootMargin]) =>
              "IntersectionObserver" in window
                ? createIntersectionObservable(this.el, { root, rootMargin })
                : of({ isIntersecting: true })
          ),
          map(({ isIntersecting }) => isIntersecting),
          takeUntil(this.subjects.disconnect),
          share()
        );

        isIntersecting$.pipe(filter(x => x), distinctUntilChanged()).subscribe(() => {
          // TODO: polyfill?
          const cache = (this.cache = new Map());

          const resize$ =
            "ResizeObserver" in window
              ? createResizeObservable(this.el).pipe(
                  startWith({ contentRect: this.el.getBoundingClientRect() })
                )
              : of({ contentRect: this.el.getBoundingClientRect() });

          const srcset$ = combineLatest(this.subjects.src, this.subjects.srcset).pipe(
            filter(([a, b]) => a != null || b != null),
            distinctUntilChanged(([p1, p2], [q1, q2]) => p1 === q1 && p2 === q2),
            map(([src, srcset]) => (srcset ? parseSrcset(srcset) : srcsetFromSrc(src)))
          );

          const url$ = combineLatest(resize$, srcset$).pipe(
            map(
              ([{ contentRect: { width } }, srcsetObj]) =>
                new URL(
                  srcsetObj.select(width || window.screen.width, window.devicePixelRatio || 1),
                  window.location
                )
            ),
            distinctUntilKeyChanged("href")
          );

          const isIntersecting2$ = isIntersecting$.pipe(startWith(true), distinctUntilChanged());

          combineLatest(url$, isIntersecting2$)
            .pipe(
              switchMap(([url, isIntersecting]) => {
                const { href } = url;

                if (isIntersecting && !cache.has(href))
                  return ajax({
                    method: "GET",
                    responseType: "blob",
                    url,
                    crossDomain: isExternal(url),
                  }).pipe(
                    map(({ response }) => URL.createObjectURL(response)),
                    tap(objectURL => cache.set(href, objectURL))
                  );
                else if (cache.has(href)) return of(cache.get(href));
                else return never();
              }),
              takeUntil(this.subjects.disconnect)
            )

            // Whenever the object URL changes, we set the new image src.
            .subscribe(
              url => (this.img.src = url),

              // In case of an error, we just set all the original attributes on the image
              // and let the browser handle the rest.
              err => {
                if (process.env.DEBUG) console.error(err);

                if (this.el.hasAttribute("sizes"))
                  this.img.setAttribute("sizes", this.getAttribute("sizes"));
                if (this.el.hasAttribute("crossorigin"))
                  this.img.setAttribute("crossorigin", this.getAttribute("crossorigin"));
                if (this.el.hasAttribute("referrerpolicy"))
                  this.img.setAttribute("referrerpolicy", this.getAttribute("referrerpolicy"));

                /* TODO: pass on width/height? */

                if (this.srcset) this.img.srcset = this.srcset;
                if (this.src) this.img.src = this.src;
              }
            );

          // Reflect attributes changes on the original on the inner img.
          const updateAttr = name => x =>
            x == null || x === false
              ? this.img.removeAttribute(name)
              : this.img.setAttribute(name, x === true ? "" : x);

          /*
            const updateAttr2 = name => x =>
              x == null ? this.img.removeAttribute(name) : this.img.setAttribute(name, x);
            */

          this.subjects.alt.subscribe(updateAttr("alt"));
          this.subjects.decoding.subscribe(updateAttr("decoding"));
          this.subjects.longdesc.subscribe(updateAttr("longdesc"));

          // TODO: necessary?
          this.subjects.ismap.subscribe(updateAttr("ismap"));
          this.subjects.usemap.subscribe(updateAttr("usemap"));
        });

        // TODO: meh..
        super.connectComponent();

        // Firing an event to let the outside world know the drawer is ready.
        this.fireEvent("init");

        // if (process.env.DEBUG) console.timeEnd("shy-img");
      });

      /*
      const scrollEl = this.root == null ? window : document.querySelector(this.root);
      const { observers } = this.constructor;
      if (observers.has(scrollEl)) {
        this.observer = observers.get(scrollEl);
      } else {
        this.observer = new IntersectionObserver(callback, {
          root: this.root,
        });
        observers.set(scrollEl, this.observer);
      }

      console.log(observers);
      this.observer.observe(this.el);
      */
    }

    /*
    intersectionCallback(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.done && !this.inProgress) {
          this.loadImage();
        }
        if (!entry.isIntersecting && this.inProgress) {
          this.cancelLoadImage();
        }
      });
    }
    */

    loadImage() {
      /*
      ajax({
        method: "GET",
        responseType: "blob",
        url: this.getAttribute("src")
        // crossDomain: isExternal(this)
      })
        .subscribe(({ response }) => console.log(response));
      */
      /*
      const noscript = this.el.querySelector("noscript");
      const div = document.createElement("div");
      div.innerHTML = noscript.textContent;
      const [img] = div.childNodes;
      // img.src = "";
      this.img = img;

      console.log("load", img);

      if (process.env.DEBUG && img.tagName !== "IMG") {
        console.log("Content of <noscript> does not appear to be an <img>", img);
      }

      this.inProgress = true;
      img.addEventListener("load", () => {
        console.log("loaded", img);
        this.el.appendChild(img);
        this.inProgress = false;
        this.done = true;
      });

      window.requestAnimationFrame(() => {
        this.fireEvent("load-img", { detail: img });
        this.el.removeChild(noscript);
      });
      */
      /*
      const img = (this.done = new Image());
      img.classList = this.el.classList;
      if (this.el.hasAttribute('sizes')) {
        img.sizes = this.el.getAttribute('sizes');
      }
      if (this.el.hasAttribute('srcset')) {
        img.srcset = this.el.getAttribute('srcset');
      }
      if (this.el.hasAttribute('src')) {
        img.src = this.el.getAttribute('src');
      }
      img.onload = e => this.fireEvent('load', { detail: e });
      // img.onerror =...
      this.el.appendChild(img);
      */
    }

    /*
    cancelLoadImage() {
      const { img } = this;
      console.log("cancel", img);
      img.src = "";
      this.inProgress = false;
      // window.requestAnimationFrame(() => this.el.removeChild(img));
    }
    */

    disconnectComponent() {
      super.disconnectComponent();
      if (this.cache)
        this.cache.forEach(objURL => {
          // if (process.env.DEBUG) console.log("revoke", objURL);
          URL.revokeObjectURL(objURL);
        });
    }
  };
