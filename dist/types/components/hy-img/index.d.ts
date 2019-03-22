import '../../stencil.core';
import { Subject, Observable } from "rxjs";
import { Srcset } from './srcset';
export declare class HyImg {
    el: HTMLElement;
    root: string;
    rootMargin: string;
    src: string;
    srcset: string;
    w: number;
    h: number;
    alt: string;
    decoding: 'sync' | 'async' | 'auto';
    useMap: string;
    strategy: 'cache' | 'blob';
    root$: Subject<string>;
    rootMargin$: Subject<string>;
    w$: Subject<number>;
    h$: Subject<number>;
    src$: Subject<string>;
    srcset$: Subject<string>;
    setRoot(_: string): void;
    setRootMargin(_: string): void;
    setW(_: number): void;
    setH(_: number): void;
    setSrc(_: string): void;
    setSrcset(_: string): void;
    connected$: Subject<boolean>;
    loadImage$: Subject<boolean>;
    cache: Map<string, string>;
    renderWidth: number;
    renderHeight: number;
    contentWidth: number;
    url: string;
    visibility: string;
    getIsIntersecting(): Observable<boolean>;
    getContentWidth(): Observable<number>;
    componentWillLoad(): void;
    triggered(trigger$: Observable<boolean>, contentWidth$: Observable<number>): void;
    selectSrcsetURL(width: number, srcsetObj: Srcset): URL;
    cacheStrategy(fetch$: Observable<Response>): Observable<string>;
    fetchImage(url: URL, isIntersecting: boolean): Observable<string>;
    render(): JSX.Element[];
    calcImageStyle(): {
        [key: string]: string;
    };
    calcSizerStyle(): {
        [key: string]: string;
    };
    componentDidUnload(): void;
    loadImage(): void;
}
