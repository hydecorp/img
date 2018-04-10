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
import { arrayOf, number, string } from "hy-component/src/types";

import { Observable } from "rxjs/_esm5/Observable";
import { Subject } from "rxjs/_esm5/Subject";

import { never } from "rxjs/_esm5/observable/never";

import { ajax } from "rxjs/_esm5/observable/dom/ajax";

/* import { distinctUntilKeyChanged } from "rxjs/_esm5/operators/distinctUntilKeyChanged"; */
import { filter } from "rxjs/_esm5/operators/filter";
import { map } from "rxjs/_esm5/operators/map";
/* import { partition } from "rxjs/_esm5/operators/partition"; */
import { switchMap } from "rxjs/_esm5/operators/switchMap";
import { take } from "rxjs/_esm5/operators/take";
import { takeUntil } from "rxjs/_esm5/operators/takeUntil";
import { tap } from "rxjs/_esm5/operators/tap";

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

const createXObservable = X => (el, opts) =>
  Observable.create(obs => {
    const next = obs.next.bind(obs);
    const observer = new X(xs => Array.from(xs).forEach(next), opts);
    observer.observe(el);
    return () => observer.unobserve(el);
  });

const createIntersectionObservable = createXObservable(IntersectionObserver);
const createResizeObservable = createXObservable(ResizeObserver);

// Consider a URL external if either the protocol, hostname or port is different.
function isExternal({ protocol, host }, location = window.location) {
  return protocol !== location.protocol || host !== location.host;
}

// A set of [Modernizr] tests that are required for this component to work.
export const MIXIN_FEATURE_TESTS = new Set([
  ...COMPONENT_FEATURE_TESTS,
  // 'eventlistener',
  "queryselector"
  // 'requestanimationframe',
  // 'classlist',
  // 'opacity',
  // 'csstransforms',
  // 'csspointerevents',
]);

/*
function callback(entries, observer) {
  console.log(entries[0]);
  // console.log(entries, observer);
}
*/

export const imageMixin = C =>
  class extends componentMixin(C) {
    static get componentName() {
      return "shy-img";
    }

    static get defaults() {
      return {
        root: null,
        padding: [0]
      };
    }

    static get types() {
      return {
        root: string,
        padding: arrayOf(number)
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
    // Overriding the setup function.
    setupComponent(el, props) {
      super.setupComponent(el, props);
      this.teardown$ = new Subject();
    }

    createImage(url) {
      /* if (process.env.DEBUG) console.log("create image", this.el.getAttribute("src")); */
      this.img = document.createElement("img");
      /* this.img.style.width = "100%"; */
      this.img.src = url;
      if (this.el.hasAttribute("alt")) this.img.setAttribute("alt", this.el.getAttribute("alt"));
      this.el.appendChild(this.img);
    }

    // Calling the [setup observables function](./setup.md) function.
    connectComponent() {
      /*
      this.el.style.display = "inline-block";
      this.el.style.position = "relative";
      */

      if ("IntersectionObserver" in window) {
        createIntersectionObservable(this.el)
          .pipe(
            takeUntil(this.teardown$),
            /* distinctUntilKeyChanged("isIntersecting"), */
            switchMap(({ isIntersecting }) => {
              // TODO: use js implementation of srcset (+sizes) to determine size
              // TODO: use resize observer to keep src up-2-date
              const url = new URL(this.el.getAttribute("src"), window.location);

              return !isIntersecting
                ? never()
                : ajax({
                    method: "GET",
                    url,
                    crossDomain: isExternal(url),
                    responseType: "blob"
                  });
            }),
            take(1),
            map(({ response }) => URL.createObjectURL(response))
            /* switchMap(({ response }) => blobToDataURL(response)) */
          )
          .subscribe(
            url => {
              this.createImage(url);
              this.objectURL = url;
            },
            err => {
              if (process.env.DEBUG) console.error(err);
              this.createImage(this.el.getAttribute("src"));
            }
          );

        /*
        this.intersectionObserver = new IntersectionObserver(this.intersectionCallback.bind(this), {
          root: this.root,
          rootMargin: (this.padding || [0]).map(x => `${x}px`).join(" ")
        });
        this.intersectionObserver.observe(this.el);
        */
      } else {
        // When no intersection observer, just load image
        this.loadImage();
      }

      // Firing an event to let the outside world know the drawer is ready.
      this.fireEvent("init");

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
      if (this.objectURL) URL.revokeObjectURL(this.objectURL);
      this.teardown$.next({});
    }

    adoptComponent() {
      // this.document$.next(document);
    }
  };
