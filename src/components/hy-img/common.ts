// # src / common.ts
// Copyright (c) 2019 Florian Klampfer <https://qwtel.com/>
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

// export const hasCSSOM = "attributeStyleMap" in Element.prototype && "CSS" in window && CSS.number;

/* export const idle = x => new Promise(res => requestIdleCallback(() => res(x))); */
/* export const anim = x => new Promise(res => requestAnimationFrame(() => res(x))); */

import { Observable, PartialObserver, NEVER } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Consider a URL external if either the protocol, hostname or port is different.
export function isExternal({ protocol, host }, location = window.location) {
  return protocol !== location.protocol || host !== location.host;
}

export function subscribeWhen<T>(p$: Observable<boolean>) {
  return (source: Observable<T>) => {
    // if (process.env.DEBUG && !p$) throw Error();
    return p$.pipe(switchMap(p => (p ? source : NEVER)));
  };
}

export function createResizeObservable(el: HTMLElement): Observable<ResizeObserverEntry> {
  return Observable.create((obs: PartialObserver<ResizeObserverEntry>) => {
    const observer = new window.ResizeObserver(xs => Array.from(xs).forEach(x => obs.next(x)));
    observer.observe(el);
    return () => { observer.unobserve(el); };
  });
}

export function createItersectionObserver(el: HTMLElement, init: IntersectionObserverInit): Observable<IntersectionObserverEntry> {
  return Observable.create((obs: PartialObserver<IntersectionObserverEntry>) => {
    const observer = new IntersectionObserver(xs => Array.from(xs).forEach(x => obs.next(x)), init);
    observer.observe(el);
    return () => { observer.unobserve(el); };
  });
}

export function fetchRx(input: RequestInfo, init?: RequestInit): Observable<Response> {
  return Observable.create((observer: PartialObserver<Response>) => {
    const controller = new AbortController();
    const { signal } = controller;

    fetch(input, { ...init, signal })
      .then(x => {
        observer.next(x);
        observer.complete();
      })
      .catch(x => observer.error(x));

    return () => controller.abort();
  });
}

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
