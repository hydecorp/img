// export const hasCSSOM = "attributeStyleMap" in Element.prototype && "CSS" in window && CSS.number;
/* export const idle = x => new Promise(res => requestIdleCallback(() => res(x))); */
/* export const anim = x => new Promise(res => requestAnimationFrame(() => res(x))); */
import { Observable, NEVER } from 'rxjs';
import { switchMap } from 'rxjs/operators';
// Consider a URL external if either the protocol, hostname or port is different.
export function isExternal({ protocol, host }, location = window.location) {
    return protocol !== location.protocol || host !== location.host;
}
export function subscribeWhen(p$) {
    return (source) => {
        // if (process.env.DEBUG && !p$) throw Error();
        return p$.pipe(switchMap(p => (p ? source : NEVER)));
    };
}
export function createResizeObservable(el) {
    return Observable.create((obs) => {
        const observer = new window.ResizeObserver(xs => xs.forEach(x => obs.next(x)));
        observer.observe(el);
        return () => { observer.unobserve(el); };
    });
}
export function createItersectionObservable(el, options) {
    return Observable.create((obs) => {
        const observer = new IntersectionObserver(xs => xs.forEach(x => obs.next(x)), options);
        observer.observe(el);
        return () => { observer.unobserve(el); };
    });
}
export function fetchRx(input, init) {
    return Observable.create((observer) => {
        const controller = new AbortController();
        const { signal } = controller;
        let response = null;
        fetch(input, { ...init, signal })
            .then(r => {
            response = r;
            observer.next(r);
            observer.complete();
        })
            .catch(x => observer.error(x));
        return () => { if (!response)
            controller.abort(); };
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
