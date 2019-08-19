/**
 * Copyright (c) 2019 Florian Klampfer <https://qwtel.com/>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * @license
 * @nocompile
 */
import { LitElement } from 'lit-element';
import { Subject, Observable } from "rxjs";
import { Srcset } from './srcset';
declare class RxLitElement extends LitElement {
    $connected: Subject<boolean>;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private firstUpdate;
    $: {};
    firstUpdated(): void;
    updated(changedProperties: Map<string, any>): void;
}
export declare class HTMLHyImgElement extends RxLitElement {
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
    renderWidth: number;
    renderHeight: number;
    contentWidth: number;
    url: string;
    visibility: string;
    $: {
        root?: Subject<string>;
        rootMargin?: Subject<string>;
        w?: Subject<number>;
        h?: Subject<number>;
        src?: Subject<string>;
        srcset?: Subject<string>;
    };
    $loadImage: Subject<boolean>;
    cache: Map<string, string>;
    getIsIntersecting(): Observable<boolean>;
    getContentWidth(): Observable<number>;
    connectedCallback(): void;
    triggered($trigger: Observable<boolean>, contentWidth$: Observable<number>): void;
    selectSrcsetURL(width: number, srcsetObj: Srcset): URL;
    cacheStrategy(fetch$: Observable<Response>, url: URL): Observable<string>;
    revokeStrategy(url: string): void;
    fetchImage(url: URL, isIntersecting: boolean): Observable<string>;
    render(): import("lit-element").TemplateResult;
    calcImageStyle(): {
        [key: string]: string;
    };
    calcSizerStyle(): {
        [key: string]: string;
    };
    disconnectedCallback(): void;
    loadImage(): void;
    static styles: import("lit-element").CSSResult;
}
export {};
