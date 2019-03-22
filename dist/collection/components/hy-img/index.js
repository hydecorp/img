import { Subject, BehaviorSubject, combineLatest, merge, NEVER, of } from "rxjs";
import { catchError, distinctUntilChanged, distinctUntilKeyChanged, filter, map, share, startWith, switchMap, tap } from "rxjs/operators";
import { isExternal, createResizeObservable, createItersectionObservable, fetchRx } from "./common";
import { parseSrcset, srcsetFromSrc } from './srcset';
export class HyImg {
    constructor() {
        this.w = 0;
        this.h = 0;
        this.strategy = 'cache';
        this.loadImage$ = new Subject();
        this.cache = new Map();
        this.url = null;
        this.visibility = 'hidden';
    }
    setRoot(_) { this.root$.next(_); }
    setRootMargin(_) { this.rootMargin$.next(_); }
    setW(_) { this.w$.next(_); }
    setH(_) { this.h$.next(_); }
    setSrc(_) { this.src$.next(_); }
    setSrcset(_) { this.srcset$.next(_); }
    getIsIntersecting() {
        return combineLatest(this.root$, this.rootMargin$).pipe(switchMap(([root, rootMargin]) => "IntersectionObserver" in window
            ? createItersectionObservable(this.el, {
                root: document.querySelector(root),
                rootMargin,
            })
            : of({ isIntersecting: true })), map(({ isIntersecting }) => isIntersecting));
    }
    getContentWidth() {
        return "ResizeObserver" in window
            ? createResizeObservable(this.el).pipe(map(x => x.contentRect.width), startWith(this.el.clientWidth))
            : NEVER;
    }
    componentWillLoad() {
        this.connected$ = new BehaviorSubject(true);
        this.root$ = new BehaviorSubject(this.root);
        this.rootMargin$ = new BehaviorSubject(this.rootMargin);
        this.w$ = new BehaviorSubject(this.w);
        this.h$ = new BehaviorSubject(this.h);
        this.src$ = new BehaviorSubject(this.src);
        this.srcset$ = new BehaviorSubject(this.srcset);
        const contentWidth$ = this.getContentWidth();
        combineLatest(contentWidth$, this.w$, this.h$)
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
    triggered(trigger$, contentWidth$) {
        const srcset$ = combineLatest(this.src$, this.srcset$).pipe(filter(([a, b]) => a != null || b != null), distinctUntilChanged(([p1, p2], [q1, q2]) => p1 === q1 && p2 === q2), map(([src, srcset]) => (srcset ? parseSrcset(srcset) : srcsetFromSrc(src))));
        const url$ = combineLatest(contentWidth$, srcset$).pipe(map(args => this.selectSrcsetURL(...args)), distinctUntilKeyChanged("href"));
        const trigger2$ = trigger$.pipe(startWith(true));
        combineLatest(url$, trigger2$).pipe(switchMap(args => this.fetchImage(...args)), catchError(() => url$))
            .subscribe(url => {
            this.url = url;
        });
    }
    selectSrcsetURL(width, srcsetObj) {
        const dpr = window.devicePixelRatio || 1;
        const selection = srcsetObj.select(width || window.screen.width, dpr);
        return new URL(selection, window.location.href);
    }
    cacheStrategy(fetch$) {
        switch (this.strategy) {
            case 'blob': {
                return fetch$.pipe(switchMap(x => x.blob()), map(blob => URL.createObjectURL(blob)));
            }
            case 'cache':
            default: {
                return fetch$.pipe(map(x => x.url));
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
            return this.cacheStrategy(fetch$).pipe(tap(objectURL => cache.set(href, objectURL)));
        }
        else if (cache.has(href)) {
            return of(cache.get(href));
        }
        else {
            return NEVER;
        }
    }
    render() {
        return [
            h("div", { class: "sizer", style: this.calcSizerStyle() },
                h("slot", { name: "loading" }),
                this.url ? h("img", { src: this.url, style: this.calcImageStyle(), alt: this.alt, decoding: this.decoding, useMap: this.useMap, onLoad: () => (this.visibility = 'visible') }) : null),
        ];
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
        }
        else if (renderHeight !== 0) {
            style.width = "";
            style.height = `${renderHeight}px`;
        }
        else {
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
    loadImage() {
        this.loadImage$.next(true);
    }
    static get is() { return "hy-img"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "alt": {
            "type": String,
            "attr": "alt",
            "reflectToAttr": true,
            "mutable": true
        },
        "contentWidth": {
            "state": true
        },
        "decoding": {
            "type": String,
            "attr": "decoding",
            "reflectToAttr": true,
            "mutable": true
        },
        "el": {
            "elementRef": true
        },
        "h": {
            "type": Number,
            "attr": "h",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setH"]
        },
        "loadImage": {
            "method": true
        },
        "renderHeight": {
            "state": true
        },
        "renderWidth": {
            "state": true
        },
        "root": {
            "type": String,
            "attr": "root",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setRoot"]
        },
        "rootMargin": {
            "type": String,
            "attr": "root-margin",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setRootMargin"]
        },
        "src": {
            "type": String,
            "attr": "src",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setSrc"]
        },
        "srcset": {
            "type": String,
            "attr": "srcset",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setSrcset"]
        },
        "strategy": {
            "type": String,
            "attr": "strategy",
            "reflectToAttr": true,
            "mutable": true
        },
        "url": {
            "state": true
        },
        "useMap": {
            "type": String,
            "attr": "usemap",
            "reflectToAttr": true,
            "mutable": true
        },
        "visibility": {
            "state": true
        },
        "w": {
            "type": Number,
            "attr": "w",
            "reflectToAttr": true,
            "mutable": true,
            "watchCallbacks": ["setW"]
        }
    }; }
    static get style() { return "/**style-placeholder:hy-img:**/"; }
}
