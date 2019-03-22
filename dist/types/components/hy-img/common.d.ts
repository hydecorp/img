import { Observable } from 'rxjs';
export declare function isExternal({ protocol, host }: {
    protocol: any;
    host: any;
}, location?: Location): boolean;
export declare function subscribeWhen<T>(p$: Observable<boolean>): (source: Observable<T>) => Observable<T>;
export declare function createResizeObservable(el: HTMLElement): Observable<ResizeObserverEntry>;
export declare function createItersectionObservable(el: HTMLElement, options?: IntersectionObserverInit): Observable<IntersectionObserverEntry>;
export declare function fetchRx(input: RequestInfo, init?: RequestInit): Observable<Response>;
