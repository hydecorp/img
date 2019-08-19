var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
// import { h, Component, Prop, Element, Watch, State, Method } from 'pencil-runtime';
import { LitElement, html, css, property, customElement } from 'lit-element';
import { styleMap } from 'lit-html/directives/style-map';
import { ifDefined } from 'lit-html/directives/if-defined';
import { Subject, BehaviorSubject, combineLatest, merge, NEVER, of } from "rxjs";
import { catchError, distinctUntilChanged, distinctUntilKeyChanged, filter, map, mapTo, share, startWith, switchMap, tap } from "rxjs/operators";
import { isExternal, createResizeObservable, createItersectionObservable, fetchRx } from "./common";
import { parseSrcset, srcsetFromSrc } from './srcset';
class RxLitElement extends LitElement {
    constructor() {
        super(...arguments);
        this.$connected = new Subject();
    }
    connectedCallback() {
        super.connectedCallback();
        this.$connected.next(true);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.$connected.next(false);
    }
    firstUpdated() {
        this.firstUpdate = true;
    }
    updated(changedProperties) {
        if (!this.firstUpdate)
            for (const prop of changedProperties.keys()) {
                if (prop in this.$)
                    this.$[prop].next(this[prop]);
            }
        this.firstUpdate = false;
    }
}
let HTMLHyImgElement = class HTMLHyImgElement extends RxLitElement {
    constructor() {
        super(...arguments);
        this.w = 0;
        this.h = 0;
        this.strategy = 'cache';
        this.url = null;
        this.visibility = 'hidden';
        this.$ = {};
        this.$loadImage = new Subject();
        this.cache = new Map();
    }
    getIsIntersecting() {
        return combineLatest(this.$.root, this.$.rootMargin).pipe(
        // subscribeWhen(this.connected$),
        switchMap(([root, rootMargin]) => "IntersectionObserver" in window
            ? createItersectionObservable(this, {
                root: root ? document.querySelector(root) : undefined,
                rootMargin,
            })
            : of({ isIntersecting: true })), map(({ isIntersecting }) => isIntersecting));
    }
    getContentWidth() {
        return "ResizeObserver" in window
            ? createResizeObservable(this).pipe(map(x => x.contentRect.width), startWith(this.clientWidth))
            : NEVER;
    }
    connectedCallback() {
        super.connectedCallback();
        this.$.root = new BehaviorSubject(this.root);
        this.$.rootMargin = new BehaviorSubject(this.rootMargin);
        this.$.w = new BehaviorSubject(this.w);
        this.$.h = new BehaviorSubject(this.h);
        this.$.src = new BehaviorSubject(this.src);
        this.$.srcset = new BehaviorSubject(this.srcset);
        const noscript = this.querySelector('noscript');
        if (noscript)
            noscript.parentNode.removeChild(noscript);
        const $contentWidth = this.getContentWidth();
        combineLatest($contentWidth, this.$.w, this.$.h)
            // .pipe(subscribeWhen(this.connected$))
            .subscribe(([contentWidth, width, height]) => {
            this.contentWidth = contentWidth;
            this.renderWidth = width;
            this.renderHeight = height;
        });
        const $trigger = merge(this.getIsIntersecting(), this.$loadImage).pipe(share());
        $trigger
            .pipe(filter(x => !!x), distinctUntilChanged())
            .subscribe(() => this.triggered($trigger, $contentWidth));
    }
    // TODO: rename
    triggered($trigger, contentWidth$) {
        // this.loading = true;
        const $srcset = combineLatest(this.$.src, this.$.srcset).pipe(
        // subscribeWhen(this.connected$),
        filter(([a, b]) => a != null || b != null), distinctUntilChanged(([p1, p2], [q1, q2]) => p1 === q1 && p2 === q2), map(([src, srcset]) => (srcset ? parseSrcset(srcset) : srcsetFromSrc(src))));
        const $url = combineLatest(contentWidth$, $srcset).pipe(map(args => this.selectSrcsetURL(...args)), distinctUntilKeyChanged("href"));
        const $trigger2 = $trigger.pipe(
        // distinctUntilChanged(), // ???
        startWith(true));
        combineLatest($url, $trigger2).pipe(switchMap(args => this.fetchImage(...args)), catchError((e) => (console.error(e), $url)), 
        // tap(() => (this.loading = false)),
        tap((url) => {
            this.url = url;
        })).subscribe();
    }
    selectSrcsetURL(width, srcsetObj) {
        const dpr = window.devicePixelRatio || 1;
        const selection = srcsetObj.select(width || window.screen.width, dpr);
        return new URL(selection, window.location.href);
    }
    cacheStrategy(fetch$, url) {
        switch (this.strategy) {
            case 'blob': {
                return fetch$.pipe(switchMap(re => re.blob()), map(blob => URL.createObjectURL(blob)));
            }
            case 'cache':
            default: {
                return fetch$.pipe(mapTo(url.href));
            }
        }
    }
    revokeStrategy(url) {
        switch (this.strategy) {
            case 'blob': {
                return URL.revokeObjectURL(url);
            }
            case 'cache':
            default: {
                return;
            }
        }
    }
    fetchImage(url, isIntersecting) {
        const { href } = url;
        const { cache } = this;
        if (isIntersecting && !cache.has(href)) {
            const fetch$ = fetchRx(href, {
                method: "GET",
                headers: { Accept: "image/*" },
                mode: isExternal(url) ? 'cors' : undefined,
            });
            return this.cacheStrategy(fetch$, url).pipe(tap(objectURL => cache.set(href, objectURL)));
        }
        else if (cache.has(href)) {
            return of(cache.get(href));
        }
        else {
            return NEVER;
        }
    }
    render() {
        return html `
      <div class="sizer" style=${styleMap(this.calcSizerStyle())}>
        ${!this.url || this.visibility === 'hidden' ? html `
        <slot name="loading" />` : null} ${this.url ? html `
        <img src=${this.url} style=${styleMap(this.calcImageStyle())} alt=${ifDefined(this.alt)} decoding=${ifDefined(this.decoding)}
          useMap=${ifDefined(this.useMap)} @load=${() => (this.visibility = 'visible')} />` : null}
      </div>
    `;
    }
    calcImageStyle() {
        return { visibility: this.visibility };
    }
    calcSizerStyle() {
        const { renderWidth, renderHeight, contentWidth } = this;
        const style = {};
        if (renderWidth !== 0 && renderHeight !== 0) {
            if (renderWidth >= contentWidth) {
                style.width = "100%";
                style.paddingTop = `${(renderHeight / renderWidth) * 100}%`;
            }
            else {
                style.width = `${renderWidth}px`;
                style.height = `${renderHeight}px`;
            }
            // } else if (renderHeight !== 0) {
            //   style.width = "";
            //   style.height = `${renderHeight}px`;
        }
        else {
            style.width = "100%";
            style.height = "100%";
        }
        return style;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.cache) {
            this.cache.forEach(objURL => {
                this.revokeStrategy(objURL);
            });
        }
    }
    loadImage() {
        this.$loadImage.next(true);
    }
};
HTMLHyImgElement.styles = css `
    .sizer {
      position: relative;
    }

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  `;
__decorate([
    property({ type: String, reflect: true })
], HTMLHyImgElement.prototype, "root", void 0);
__decorate([
    property({ type: String, reflect: true, attribute: 'root-margin' })
], HTMLHyImgElement.prototype, "rootMargin", void 0);
__decorate([
    property({ type: String, reflect: true })
], HTMLHyImgElement.prototype, "src", void 0);
__decorate([
    property({ type: String, reflect: true })
], HTMLHyImgElement.prototype, "srcset", void 0);
__decorate([
    property({ type: Number, reflect: true })
], HTMLHyImgElement.prototype, "w", void 0);
__decorate([
    property({ type: Number, reflect: true })
], HTMLHyImgElement.prototype, "h", void 0);
__decorate([
    property({ type: String, reflect: true })
], HTMLHyImgElement.prototype, "alt", void 0);
__decorate([
    property({ type: String, reflect: true })
], HTMLHyImgElement.prototype, "decoding", void 0);
__decorate([
    property({ type: String, reflect: true, attribute: 'usemap' })
], HTMLHyImgElement.prototype, "useMap", void 0);
__decorate([
    property({ type: String, reflect: true })
], HTMLHyImgElement.prototype, "strategy", void 0);
__decorate([
    property()
], HTMLHyImgElement.prototype, "renderWidth", void 0);
__decorate([
    property()
], HTMLHyImgElement.prototype, "renderHeight", void 0);
__decorate([
    property()
], HTMLHyImgElement.prototype, "contentWidth", void 0);
__decorate([
    property()
], HTMLHyImgElement.prototype, "url", void 0);
__decorate([
    property()
], HTMLHyImgElement.prototype, "visibility", void 0);
__decorate([
    property()
], HTMLHyImgElement.prototype, "loadImage", null);
HTMLHyImgElement = __decorate([
    customElement('hy-img')
], HTMLHyImgElement);
export { HTMLHyImgElement };
