// # src / index.tsx
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

import { Component, Prop, Element, Watch, State, Method } from '@stencil/core';

import { Subject, ReplaySubject, Observable, combineLatest, merge, NEVER, of } from "rxjs";
import {
  catchError,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  share,
  startWith,
  switchMap,
  // withLatestFrom,
  // takeUntil,
  tap,
} from "rxjs/operators";

import { isExternal, /* subscribeWhen, */ createResizeObservable, createItersectionObserver, fetchRx } from "./common";
import { parseSrcset, srcsetFromSrc, Srcset } from './srcset';

@Component({
  tag: 'hy-img',
  // styleUrl: 'hy-img.css',
  shadow: true,
})
export class HyImg {
  @Element() el: HTMLElement;

  @Prop({ mutable: true, reflectToAttr: true }) root: string;
  @Prop({ mutable: true, reflectToAttr: true }) rootMargin: string;
  @Prop({ mutable: true, reflectToAttr: true }) src: string;
  @Prop({ mutable: true, reflectToAttr: true }) srcset: string;
  @Prop({ mutable: true, reflectToAttr: true }) w: number = 0;
  @Prop({ mutable: true, reflectToAttr: true }) h: number = 0;
  @Prop({ mutable: true, reflectToAttr: true }) @State() alt: string;
  @Prop({ mutable: true, reflectToAttr: true }) @State() decoding: 'sync' | 'async' | 'auto';
  @Prop({ mutable: true, reflectToAttr: true, attr: 'usemap' }) @State() useMap: string;

  private root$: Subject<string>;
  private rootMargin$: Subject<string>;
  private w$: Subject<number>;
  private h$: Subject<number>;
  private src$: Subject<string>;
  private srcset$: Subject<string>;

  @Watch('root') setRoot(_: string) { this.root$.next(_); }
  @Watch('rootMargin') setRootMargin(_: string) { this.rootMargin$.next(_); }
  @Watch('w') setW(_: number) { this.w$.next(_); }
  @Watch('h') setH(_: number) { this.h$.next(_); }
  @Watch('src') setSrc(_: string) { this.src$.next(_); }
  @Watch('srcset') setSrcset(_: string) { this.srcset$.next(_); }

  private connected$: Subject<boolean> = new ReplaySubject();

  private loadImage$: Subject<boolean> = new Subject();
  private cache: Map<string, string> = new Map();

  @State() private renderWidth: number
  @State() private renderHeight: number
  @State() private contentWidth: number
  // @State() private loading: boolean;
  @State() private url: string = null;
  @State() private visibility = 'hidden';

  private createAttrSubject<T>(key: string): Subject<T> {
    const sub = new ReplaySubject<T>();
    sub.next(this[key]);
    return sub;
  }

  private getIsIntersecting() {
    return combineLatest(this.root$, this.rootMargin$).pipe(
      // subscribeWhen(this.connected$),
      switchMap(([root, rootMargin]) =>
        "IntersectionObserver" in window
          ? createItersectionObserver(this.el, {
            root: document.querySelector(root),
            rootMargin,
          })
          : of({ isIntersecting: true })
      ),
      map(({ isIntersecting }) => isIntersecting)
    );
  }

  private getResize() {
    const initialRect = this.el.getBoundingClientRect() as DOMRect;

    return "ResizeObserver" in window
      ? createResizeObservable(this.el).pipe(
        map(x => x.contentRect),
        startWith(initialRect),
      )
      : of(initialRect);
  }

  componentWillLoad() {
    this.connected$.next(true);

    // HACK
    const noscript = this.el.querySelector('noscript');
    if (noscript) noscript.parentNode.removeChild(noscript);

    // HACK
    // this.el.style.position = 'relative';

    this.root$ = this.createAttrSubject('root');
    this.rootMargin$ = this.createAttrSubject('rootMargin');
    this.w$ = this.createAttrSubject('w');
    this.h$ = this.createAttrSubject('h');
    this.src$ = this.createAttrSubject('src');
    this.srcset$ = this.createAttrSubject('srcset');

    const resize$ = this.getResize();

    combineLatest(resize$, this.w$, this.h$)
      // .pipe(subscribeWhen(this.connected$))
      .subscribe(([{ width: contentWidth }, width, height]) => {
        this.contentWidth = contentWidth;
        this.renderWidth = width;
        this.renderHeight = height;
      });

    const isIntersecting$ = this.getIsIntersecting();

    const trigger$ = merge(isIntersecting$, this.loadImage$).pipe(
      // subscribeWhen(this.connected$),
      share(),
    );

    trigger$
      .pipe(filter(x => !!x), distinctUntilChanged())
      .subscribe(() => this.triggered(trigger$, resize$));
  }

  // TODO: rename
  private triggered(trigger$: Observable<boolean>, resize$: Observable<DOMRect>) {
    // this.loading = true;

    const srcset$ = combineLatest(this.src$, this.srcset$).pipe(
      // subscribeWhen(this.connected$),
      filter(([a, b]) => a != null || b != null),
      distinctUntilChanged(([p1, p2], [q1, q2]) => p1 === q1 && p2 === q2),
      map(([src, srcset]) => (srcset ? parseSrcset(srcset) : srcsetFromSrc(src))),
    );

    const url$ = combineLatest(resize$, srcset$).pipe(
      map(args => this.selectSrcsetURL(...args)),
      distinctUntilKeyChanged("href"),
    );

    const isIntersecting$ = trigger$.pipe(
      distinctUntilChanged(),
      startWith(true),
    );

    combineLatest(url$, isIntersecting$).pipe(
      switchMap(args => this.fetchImage(...args)),
      catchError(() => url$),
      // tap(() => (this.loading = false)),
    )
      .subscribe(url => {
        this.url = url as string;
      });
  }

  private selectSrcsetURL({ width }: DOMRect, srcsetObj: Srcset) {
    const dpr = window.devicePixelRatio || 1;
    const selection = srcsetObj.select(width || window.screen.width, dpr);
    return new URL(selection, window.location.href)
  }

  private fetchImage(url: URL, isIntersecting: boolean): Observable<string> {
    const { href } = url;
    const { cache } = this;

    if (isIntersecting && !cache.has(href)) {
      return fetchRx(href, {
        method: "GET",
        headers: { Accept: "image/*" },
        mode: isExternal(url) ? 'cors' : undefined,
      }).pipe(
        // map(x => x.url),
        switchMap(x => x.blob()),
        map(blob => URL.createObjectURL(blob)),
        tap(objectURL => cache.set(href, objectURL)),
      );
    } else if (cache.has(href)) {
      return of(cache.get(href));
    } else {
      return NEVER;
    }
  }

  render() {
    return [
      <div class="sizer" style={{ position: 'relative', ...this.calcSizerStyle() }}>
        <slot name="loading" />
        {this.url ? <img
          src={this.url}
          style={this.calcImageStyle()}
          alt={this.alt}
          decoding={this.decoding}
          useMap={this.useMap}
          onLoad={() => (this.visibility = 'visible')}
        /> : null}
      </div>,
    ];
  }

  private calcImageStyle() {
    return {
      visibility: this.visibility,
      position: 'absolute',
      top: '0',
      left: '0',
      maxWidth: '100%',
      maxHeight: '100%',
    };
  }

  private calcSizerStyle() {
    const { renderWidth, renderHeight, contentWidth } = this;

    const style: { width?: string, height?: string, paddingTop?: string } = {};

    if (renderWidth !== 0 && renderHeight !== 0) {
      if (renderWidth >= contentWidth) {
        style.width = "100%";
        style.paddingTop = `${(renderHeight / renderWidth) * 100}%`;
      } else {
        style.width = `${renderWidth}px`;
        style.height = `${renderHeight}px`;
      }
    } else if (renderHeight !== 0) {
      style.width = "";
      style.height = `${renderHeight}px`;
    } else {
      style.width = "";
      style.height = "";
    }

    return style;
  }

  componentDidUnload() {
    this.connected$.next(false);

    if (this.cache) {
      this.cache.forEach(objURL => {
        URL.revokeObjectURL(objURL);
      });
    }
  }

  @Method() loadImage() {
    this.loadImage$.next(true);
  }
}
