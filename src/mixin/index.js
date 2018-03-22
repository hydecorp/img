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
import {
  componentMixin,
  COMPONENT_FEATURE_TESTS,
  Set
} from "hy-component/src/component";
import { arrayOf, number, string } from "hy-component/src/types";

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
    }

    // Calling the [setup observables function](./setup.md) function.
    connectComponent() {
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

      if ("IntersectionObserver" in window) {
        this.intersectionObserver = new IntersectionObserver(
          this.intersectionCallback.bind(this),
          {
            root: this.root,
            rootMargin: this.padding.map(x => `${x}px`).join(" ")
          }
        );
        this.intersectionObserver.observe(this.el);
      } else {
        // When no intersection observer, just load image
        this.loadImage();
      }

      // Firing an event to let the outside world know the drawer is ready.
      this.fireEvent("init");
    }

    intersectionCallback(entries) {
      // console.log(entries.length);
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.done) {
          this.loadImage();
        }
      });
    }

    loadImage() {
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

      const noscript = this.el.querySelector("noscript");
      const temp = document.createElement("div");
      temp.innerHTML = noscript.textContent;
      const [img] = temp.childNodes;
      if (process.env.DEBUG && img.tagName !== "IMG") {
        console.log(
          "Content of <noscript> does not appear to be an <img>",
          img
        );
      }
      this.fireEvent("load-img", { detail: img });

      this.el.removeChild(noscript);
      this.el.appendChild(img);

      this.done = true;
    }

    disconnectComponent() {
      /* this.teardown$.next({}); */
      this.intersectionObserver.unobserve(this.el);
    }

    adoptComponent() {
      // this.document$.next(document);
    }
  };
