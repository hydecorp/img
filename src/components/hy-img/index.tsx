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
import { Component, Prop, Element, Watch, State, Method } from './pencil';

import { Subject, BehaviorSubject, Observable, combineLatest, merge, NEVER, of } from "rxjs";
import { catchError, distinctUntilChanged, distinctUntilKeyChanged, filter, map, share, startWith, switchMap, tap } from "rxjs/operators";

import { PropTypes } from '@skatejs/element';
import SkateElement, { h } from '@skatejs/element-preact/dist/esm/index';
import { props } from '@skatejs/element/dist/esm/props';

import { isExternal, createResizeObservable, createItersectionObservable, fetchRx } from "./common";
import { parseSrcset, srcsetFromSrc, Srcset } from './srcset';

console.log('hello?');

@Component({
  tag: 'hy-img',
  styleUrl: 'style.css',
  shadow: true,
})
export class HTMLHyImgElement extends SkateElement {
  static props: PropTypes = {
    root: { ...props.string, target: 'root' },
    rootMargin: { ...props.string, target: 'root-margin' },
    src: { ...props.string, target: 'src' },
    srsset: { ...props.string, target: 'srcset' },
    w: { ...props.number, target: 'w' },
    h: { ...props.number, target: 'h' },
    alt: { ...props.string, target: 'alt' },
    decoding: { ...props.string, target: 'decoding' },
    useMap: { ...props.string, target: 'usemap' },
    strategy: { ...props.string, target: 'strategy' },
    renderWidth: Number,
    renderHeight: Number,
    contentWidth: Number,
    url: String,
    visibility: String,
  }

  static shadowRootOptions: ShadowRootInit = {
    mode: 'open',
  }

  // @Element() el: HTMLElement;
  el: HTMLElement = this;

  @Prop({ mutable: true, reflectToAttr: true }) root: string;
  @Prop({ mutable: true, reflectToAttr: true }) rootMargin: string;
  @Prop({ mutable: true, reflectToAttr: true }) src: string;
  @Prop({ mutable: true, reflectToAttr: true }) srcset: string;
  @Prop({ mutable: true, reflectToAttr: true }) w: number = 0;
  @Prop({ mutable: true, reflectToAttr: true }) h: number = 0;
  @Prop({ mutable: true, reflectToAttr: true }) @State() alt: string;
  @Prop({ mutable: true, reflectToAttr: true }) @State() decoding: 'sync' | 'async' | 'auto';
  @Prop({ mutable: true, reflectToAttr: true, attr: 'usemap' }) @State() useMap: string;
  @Prop({ mutable: true, reflectToAttr: true }) strategy: 'cache' | 'blob' = 'cache';

  root$: Subject<string>;
  rootMargin$: Subject<string>;
  w$: Subject<number>;
  h$: Subject<number>;
  src$: Subject<string>;
  srcset$: Subject<string>;

  @Watch('root') setRoot(_: string) { this.root$.next(_); }
  @Watch('rootMargin') setRootMargin(_: string) { this.rootMargin$.next(_); }
  @Watch('w') setW(_: number) { this.w$.next(_); }
  @Watch('h') setH(_: number) { this.h$.next(_); }
  @Watch('src') setSrc(_: string) { this.src$.next(_); }
  @Watch('srcset') setSrcset(_: string) { this.srcset$.next(_); }

  connected$: Subject<boolean>;

  loadImage$: Subject<boolean> = new Subject();
  cache: Map<string, string> = new Map();

  @State() renderWidth: number
  @State() renderHeight: number
  @State() contentWidth: number
  @State() url: string = null;
  @State() visibility = 'hidden';

  getIsIntersecting() {
    return combineLatest(this.root$, this.rootMargin$).pipe(
      // subscribeWhen(this.connected$),
      switchMap(([root, rootMargin]) =>
        "IntersectionObserver" in window
          ? createItersectionObservable(this.el, {
            root: document.querySelector(root),
            rootMargin,
          })
          : of({ isIntersecting: true })
      ),
      map(({ isIntersecting }) => isIntersecting)
    );
  }

  getContentWidth() {
    return "ResizeObserver" in window
      ? createResizeObservable(this.el).pipe(
        map(x => x.contentRect.width),
        startWith(this.el.clientWidth),
      )
      : NEVER
  }

  componentWillLoad() {
    this.connected$ = new BehaviorSubject(true);

    this.root$ = new BehaviorSubject(this.root);
    this.rootMargin$ = new BehaviorSubject(this.rootMargin);
    this.w$ = new BehaviorSubject(this.w);
    this.h$ = new BehaviorSubject(this.h);
    this.src$ = new BehaviorSubject(this.src);
    this.srcset$ = new BehaviorSubject(this.srcset);

    // HACK
    // const noscript = this.el.querySelector('noscript');
    // if (noscript) noscript.parentNode.removeChild(noscript);

    const contentWidth$ = this.getContentWidth();

    combineLatest(contentWidth$, this.w$, this.h$)
      // .pipe(subscribeWhen(this.connected$))
      .subscribe(([contentWidth, width, height]) => {
        this.contentWidth = contentWidth;
        this.renderWidth = width;
        this.renderHeight = height;
      });

    const trigger$ = merge(this.getIsIntersecting(), this.loadImage$).pipe(share());

    trigger$
      .pipe(filter(x => !!x), distinctUntilChanged())
      .subscribe(() => this.triggered(trigger$, contentWidth$));
  }

  // TODO: rename
  triggered(trigger$: Observable<boolean>, contentWidth$: Observable<number>) {
    // this.loading = true;

    const srcset$ = combineLatest(this.src$, this.srcset$).pipe(
      // subscribeWhen(this.connected$),
      filter(([a, b]) => a != null || b != null),
      distinctUntilChanged(([p1, p2], [q1, q2]) => p1 === q1 && p2 === q2),
      map(([src, srcset]) => (srcset ? parseSrcset(srcset) : srcsetFromSrc(src))),
    );

    const url$ = combineLatest(contentWidth$, srcset$).pipe(
      map(args => this.selectSrcsetURL(...args)),
      distinctUntilKeyChanged("href"),
    );

    const trigger2$ = trigger$.pipe(
      // distinctUntilChanged(), // ???
      startWith(true),
    );

    combineLatest(url$, trigger2$).pipe(
      switchMap(args => this.fetchImage(...args)),
      catchError(() => url$),
      // tap(() => (this.loading = false)),
    )
      .subscribe(url => {
        this.url = url as string;
      });
  }

  selectSrcsetURL(width: number, srcsetObj: Srcset) {
    const dpr = window.devicePixelRatio || 1;
    const selection = srcsetObj.select(width || window.screen.width, dpr);
    return new URL(selection, window.location.href)
  }

  cacheStrategy(fetch$: Observable<Response>) {
    switch (this.strategy) {
      case 'blob': {
        return fetch$.pipe(
          switchMap(x => x.blob()),
          map(blob => URL.createObjectURL(blob))
        );
      }
      case 'cache':
      default: {
        return fetch$.pipe(map(x => x.url));
      }
    }
  }

  fetchImage(url: URL, isIntersecting: boolean): Observable<string> {
    const { href } = url;
    const { cache } = this;

    if (isIntersecting && !cache.has(href)) {
      const fetch$ = fetchRx(href, {
        method: "GET",
        headers: { Accept: "image/*" },
        mode: isExternal(url) ? 'cors' : undefined,
      });
      return this.cacheStrategy(fetch$).pipe(
        tap(objectURL => cache.set(href, objectURL))
      );
    } else if (cache.has(href)) {
      return of(cache.get(href));
    } else {
      return NEVER;
    }
  }

  render() {
    return [
      <div class="sizer" style={this.calcSizerStyle()}>
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

  calcImageStyle(): { [key: string]: string } {
    return { visibility: this.visibility };
  }

  calcSizerStyle() {
    const { renderWidth, renderHeight, contentWidth } = this;

    const style: { [key: string]: string } = {};

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
