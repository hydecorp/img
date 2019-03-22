import { Observable, NEVER } from 'rxjs';
import { switchMap } from 'rxjs/operators';
export function isExternal({ protocol, host }, location = window.location) {
    return protocol !== location.protocol || host !== location.host;
}
export function subscribeWhen(p$) {
    return (source) => {
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
        fetch(input, Object.assign({}, init, { signal }))
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
