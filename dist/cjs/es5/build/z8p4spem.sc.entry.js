"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hy_img_core_js_1 = require("../hy-img.core.js");
var extendStatics = function (t, r) { return (extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (t, r) { t.__proto__ = r; } || function (t, r) { for (var e in r)
    r.hasOwnProperty(e) && (t[e] = r[e]); })(t, r); };
function __extends(t, r) { function e() { this.constructor = t; } extendStatics(t, r), t.prototype = null === r ? Object.create(r) : (e.prototype = r.prototype, new e); }
function isFunction(t) { return "function" == typeof t; }
var _enable_super_gross_mode_that_will_cause_bad_things = !1, config = { Promise: void 0, set useDeprecatedSynchronousErrorHandling(t) { _enable_super_gross_mode_that_will_cause_bad_things = t; }, get useDeprecatedSynchronousErrorHandling() { return _enable_super_gross_mode_that_will_cause_bad_things; } };
function hostReportError(t) { setTimeout(function () { throw t; }); }
var empty = { closed: !0, next: function (t) { }, error: function (t) { if (config.useDeprecatedSynchronousErrorHandling)
        throw t; hostReportError(t); }, complete: function () { } }, isArray = Array.isArray || function (t) { return t && "number" == typeof t.length; };
function isObject(t) { return null !== t && "object" == typeof t; }
function UnsubscriptionErrorImpl(t) { return Error.call(this), this.message = t ? t.length + " errors occurred during unsubscription:\n" + t.map(function (t, r) { return r + 1 + ") " + t.toString(); }).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t, this; }
UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
var UnsubscriptionError = UnsubscriptionErrorImpl, Subscription = function () { function t(t) { this.closed = !1, this._parent = null, this._parents = null, this._subscriptions = null, t && (this._unsubscribe = t); } var r; return t.prototype.unsubscribe = function () { var t, r = !1; if (!this.closed) {
    var e = this._parent, n = this._parents, o = this._unsubscribe, i = this._subscriptions;
    this.closed = !0, this._parent = null, this._parents = null, this._subscriptions = null;
    for (var s = -1, c = n ? n.length : 0; e;)
        e.remove(this), e = ++s < c && n[s] || null;
    if (isFunction(o))
        try {
            o.call(this);
        }
        catch (e) {
            r = !0, t = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
        }
    if (isArray(i))
        for (s = -1, c = i.length; ++s < c;) {
            var u = i[s];
            if (isObject(u))
                try {
                    u.unsubscribe();
                }
                catch (e) {
                    r = !0, t = t || [], e instanceof UnsubscriptionError ? t = t.concat(flattenUnsubscriptionErrors(e.errors)) : t.push(e);
                }
        }
    if (r)
        throw new UnsubscriptionError(t);
} }, t.prototype.add = function (r) { var e = r; switch (typeof r) {
    case "function": e = new t(r);
    case "object":
        if (e === this || e.closed || "function" != typeof e.unsubscribe)
            return e;
        if (this.closed)
            return e.unsubscribe(), e;
        if (!(e instanceof t)) {
            var n = e;
            (e = new t)._subscriptions = [n];
        }
        break;
    default:
        if (!r)
            return t.EMPTY;
        throw new Error("unrecognized teardown " + r + " added to Subscription.");
} if (e._addParent(this)) {
    var o = this._subscriptions;
    o ? o.push(e) : this._subscriptions = [e];
} return e; }, t.prototype.remove = function (t) { var r = this._subscriptions; if (r) {
    var e = r.indexOf(t);
    -1 !== e && r.splice(e, 1);
} }, t.prototype._addParent = function (t) { var r = this._parent, e = this._parents; return r !== t && (r ? e ? -1 === e.indexOf(t) && (e.push(t), !0) : (this._parents = [t], !0) : (this._parent = t, !0)); }, t.EMPTY = ((r = new t).closed = !0, r), t; }();
function flattenUnsubscriptionErrors(t) { return t.reduce(function (t, r) { return t.concat(r instanceof UnsubscriptionError ? r.errors : r); }, []); }
var rxSubscriber = "function" == typeof Symbol ? Symbol("rxSubscriber") : "@@rxSubscriber_" + Math.random(), Subscriber = function (t) { function r(e, n, o) { var i = t.call(this) || this; switch (i.syncErrorValue = null, i.syncErrorThrown = !1, i.syncErrorThrowable = !1, i.isStopped = !1, arguments.length) {
    case 0:
        i.destination = empty;
        break;
    case 1:
        if (!e) {
            i.destination = empty;
            break;
        }
        if ("object" == typeof e) {
            e instanceof r ? (i.syncErrorThrowable = e.syncErrorThrowable, i.destination = e, e.add(i)) : (i.syncErrorThrowable = !0, i.destination = new SafeSubscriber(i, e));
            break;
        }
    default: i.syncErrorThrowable = !0, i.destination = new SafeSubscriber(i, e, n, o);
} return i; } return __extends(r, t), r.prototype[rxSubscriber] = function () { return this; }, r.create = function (t, e, n) { var o = new r(t, e, n); return o.syncErrorThrowable = !1, o; }, r.prototype.next = function (t) { this.isStopped || this._next(t); }, r.prototype.error = function (t) { this.isStopped || (this.isStopped = !0, this._error(t)); }, r.prototype.complete = function () { this.isStopped || (this.isStopped = !0, this._complete()); }, r.prototype.unsubscribe = function () { this.closed || (this.isStopped = !0, t.prototype.unsubscribe.call(this)); }, r.prototype._next = function (t) { this.destination.next(t); }, r.prototype._error = function (t) { this.destination.error(t), this.unsubscribe(); }, r.prototype._complete = function () { this.destination.complete(), this.unsubscribe(); }, r.prototype._unsubscribeAndRecycle = function () { var t = this._parent, r = this._parents; return this._parent = null, this._parents = null, this.unsubscribe(), this.closed = !1, this.isStopped = !1, this._parent = t, this._parents = r, this; }, r; }(Subscription), SafeSubscriber = function (t) { function r(r, e, n, o) { var i, s = t.call(this) || this; s._parentSubscriber = r; var c = s; return isFunction(e) ? i = e : e && (i = e.next, n = e.error, o = e.complete, e !== empty && (isFunction((c = Object.create(e)).unsubscribe) && s.add(c.unsubscribe.bind(c)), c.unsubscribe = s.unsubscribe.bind(s))), s._context = c, s._next = i, s._error = n, s._complete = o, s; } return __extends(r, t), r.prototype.next = function (t) { if (!this.isStopped && this._next) {
    var r = this._parentSubscriber;
    config.useDeprecatedSynchronousErrorHandling && r.syncErrorThrowable ? this.__tryOrSetError(r, this._next, t) && this.unsubscribe() : this.__tryOrUnsub(this._next, t);
} }, r.prototype.error = function (t) { if (!this.isStopped) {
    var r = this._parentSubscriber, e = config.useDeprecatedSynchronousErrorHandling;
    if (this._error)
        e && r.syncErrorThrowable ? (this.__tryOrSetError(r, this._error, t), this.unsubscribe()) : (this.__tryOrUnsub(this._error, t), this.unsubscribe());
    else if (r.syncErrorThrowable)
        e ? (r.syncErrorValue = t, r.syncErrorThrown = !0) : hostReportError(t), this.unsubscribe();
    else {
        if (this.unsubscribe(), e)
            throw t;
        hostReportError(t);
    }
} }, r.prototype.complete = function () { var t = this; if (!this.isStopped) {
    var r = this._parentSubscriber;
    if (this._complete) {
        var e = function () { return t._complete.call(t._context); };
        config.useDeprecatedSynchronousErrorHandling && r.syncErrorThrowable ? (this.__tryOrSetError(r, e), this.unsubscribe()) : (this.__tryOrUnsub(e), this.unsubscribe());
    }
    else
        this.unsubscribe();
} }, r.prototype.__tryOrUnsub = function (t, r) { try {
    t.call(this._context, r);
}
catch (t) {
    if (this.unsubscribe(), config.useDeprecatedSynchronousErrorHandling)
        throw t;
    hostReportError(t);
} }, r.prototype.__tryOrSetError = function (t, r, e) { if (!config.useDeprecatedSynchronousErrorHandling)
    throw new Error("bad call"); try {
    r.call(this._context, e);
}
catch (r) {
    return config.useDeprecatedSynchronousErrorHandling ? (t.syncErrorValue = r, t.syncErrorThrown = !0, !0) : (hostReportError(r), !0);
} return !1; }, r.prototype._unsubscribe = function () { var t = this._parentSubscriber; this._context = null, this._parentSubscriber = null, t.unsubscribe(); }, r; }(Subscriber);
function canReportError(t) { for (; t;) {
    var r = t.destination;
    if (t.closed || t.isStopped)
        return !1;
    t = r && r instanceof Subscriber ? r : null;
} return !0; }
function toSubscriber(t, r, e) { if (t) {
    if (t instanceof Subscriber)
        return t;
    if (t[rxSubscriber])
        return t[rxSubscriber]();
} return t || r || e ? new Subscriber(t, r, e) : new Subscriber(empty); }
var observable = "function" == typeof Symbol && Symbol.observable || "@@observable";
function noop() { }
function pipeFromArray(t) { return t ? 1 === t.length ? t[0] : function (r) { return t.reduce(function (t, r) { return r(t); }, r); } : noop; }
var Observable = function () { function t(t) { this._isScalar = !1, t && (this._subscribe = t); } return t.prototype.lift = function (r) { var e = new t; return e.source = this, e.operator = r, e; }, t.prototype.subscribe = function (t, r, e) { var n = this.operator, o = toSubscriber(t, r, e); if (o.add(n ? n.call(o, this.source) : this.source || config.useDeprecatedSynchronousErrorHandling && !o.syncErrorThrowable ? this._subscribe(o) : this._trySubscribe(o)), config.useDeprecatedSynchronousErrorHandling && o.syncErrorThrowable && (o.syncErrorThrowable = !1, o.syncErrorThrown))
    throw o.syncErrorValue; return o; }, t.prototype._trySubscribe = function (t) { try {
    return this._subscribe(t);
}
catch (r) {
    config.useDeprecatedSynchronousErrorHandling && (t.syncErrorThrown = !0, t.syncErrorValue = r), canReportError(t) ? t.error(r) : console.warn(r);
} }, t.prototype.forEach = function (t, r) { var e = this; return new (r = getPromiseCtor(r))(function (r, n) { var o; o = e.subscribe(function (r) { try {
    t(r);
}
catch (t) {
    n(t), o && o.unsubscribe();
} }, n, r); }); }, t.prototype._subscribe = function (t) { var r = this.source; return r && r.subscribe(t); }, t.prototype[observable] = function () { return this; }, t.prototype.pipe = function () { for (var t = [], r = 0; r < arguments.length; r++)
    t[r] = arguments[r]; return 0 === t.length ? this : pipeFromArray(t)(this); }, t.prototype.toPromise = function (t) { var r = this; return new (t = getPromiseCtor(t))(function (t, e) { var n; r.subscribe(function (t) { return n = t; }, function (t) { return e(t); }, function () { return t(n); }); }); }, t.create = function (r) { return new t(r); }, t; }();
function getPromiseCtor(t) { if (t || (t = config.Promise || Promise), !t)
    throw new Error("no Promise impl found"); return t; }
function ObjectUnsubscribedErrorImpl() { return Error.call(this), this.message = "object unsubscribed", this.name = "ObjectUnsubscribedError", this; }
ObjectUnsubscribedErrorImpl.prototype = Object.create(Error.prototype);
var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl, SubjectSubscription = function (t) { function r(r, e) { var n = t.call(this) || this; return n.subject = r, n.subscriber = e, n.closed = !1, n; } return __extends(r, t), r.prototype.unsubscribe = function () { if (!this.closed) {
    this.closed = !0;
    var t = this.subject, r = t.observers;
    if (this.subject = null, r && 0 !== r.length && !t.isStopped && !t.closed) {
        var e = r.indexOf(this.subscriber);
        -1 !== e && r.splice(e, 1);
    }
} }, r; }(Subscription), SubjectSubscriber = function (t) { function r(r) { var e = t.call(this, r) || this; return e.destination = r, e; } return __extends(r, t), r; }(Subscriber), Subject = function (t) { function r() { var r = t.call(this) || this; return r.observers = [], r.closed = !1, r.isStopped = !1, r.hasError = !1, r.thrownError = null, r; } return __extends(r, t), r.prototype[rxSubscriber] = function () { return new SubjectSubscriber(this); }, r.prototype.lift = function (t) { var r = new AnonymousSubject(this, this); return r.operator = t, r; }, r.prototype.next = function (t) { if (this.closed)
    throw new ObjectUnsubscribedError; if (!this.isStopped)
    for (var r = this.observers, e = r.length, n = r.slice(), o = 0; o < e; o++)
        n[o].next(t); }, r.prototype.error = function (t) { if (this.closed)
    throw new ObjectUnsubscribedError; this.hasError = !0, this.thrownError = t, this.isStopped = !0; for (var r = this.observers, e = r.length, n = r.slice(), o = 0; o < e; o++)
    n[o].error(t); this.observers.length = 0; }, r.prototype.complete = function () { if (this.closed)
    throw new ObjectUnsubscribedError; this.isStopped = !0; for (var t = this.observers, r = t.length, e = t.slice(), n = 0; n < r; n++)
    e[n].complete(); this.observers.length = 0; }, r.prototype.unsubscribe = function () { this.isStopped = !0, this.closed = !0, this.observers = null; }, r.prototype._trySubscribe = function (r) { if (this.closed)
    throw new ObjectUnsubscribedError; return t.prototype._trySubscribe.call(this, r); }, r.prototype._subscribe = function (t) { if (this.closed)
    throw new ObjectUnsubscribedError; return this.hasError ? (t.error(this.thrownError), Subscription.EMPTY) : this.isStopped ? (t.complete(), Subscription.EMPTY) : (this.observers.push(t), new SubjectSubscription(this, t)); }, r.prototype.asObservable = function () { var t = new Observable; return t.source = this, t; }, r.create = function (t, r) { return new AnonymousSubject(t, r); }, r; }(Observable), AnonymousSubject = function (t) { function r(r, e) { var n = t.call(this) || this; return n.destination = r, n.source = e, n; } return __extends(r, t), r.prototype.next = function (t) { var r = this.destination; r && r.next && r.next(t); }, r.prototype.error = function (t) { var r = this.destination; r && r.error && this.destination.error(t); }, r.prototype.complete = function () { var t = this.destination; t && t.complete && this.destination.complete(); }, r.prototype._subscribe = function (t) { return this.source ? this.source.subscribe(t) : Subscription.EMPTY; }, r; }(Subject);
function refCount() { return function (t) { return t.lift(new RefCountOperator(t)); }; }
var RefCountOperator = function () { function t(t) { this.connectable = t; } return t.prototype.call = function (t, r) { var e = this.connectable; e._refCount++; var n = new RefCountSubscriber(t, e), o = r.subscribe(n); return n.closed || (n.connection = e.connect()), o; }, t; }(), RefCountSubscriber = function (t) { function r(r, e) { var n = t.call(this, r) || this; return n.connectable = e, n; } return __extends(r, t), r.prototype._unsubscribe = function () { var t = this.connectable; if (t) {
    this.connectable = null;
    var r = t._refCount;
    if (r <= 0)
        this.connection = null;
    else if (t._refCount = r - 1, r > 1)
        this.connection = null;
    else {
        var e = this.connection, n = t._connection;
        this.connection = null, !n || e && n !== e || n.unsubscribe();
    }
}
else
    this.connection = null; }, r; }(Subscriber), ConnectableObservable = function (t) { function r(r, e) { var n = t.call(this) || this; return n.source = r, n.subjectFactory = e, n._refCount = 0, n._isComplete = !1, n; } return __extends(r, t), r.prototype._subscribe = function (t) { return this.getSubject().subscribe(t); }, r.prototype.getSubject = function () { var t = this._subject; return t && !t.isStopped || (this._subject = this.subjectFactory()), this._subject; }, r.prototype.connect = function () { var t = this._connection; return t || (this._isComplete = !1, (t = this._connection = new Subscription).add(this.source.subscribe(new ConnectableSubscriber(this.getSubject(), this))), t.closed ? (this._connection = null, t = Subscription.EMPTY) : this._connection = t), t; }, r.prototype.refCount = function () { return refCount()(this); }, r; }(Observable), connectableProto = ConnectableObservable.prototype, connectableObservableDescriptor = { operator: { value: null }, _refCount: { value: 0, writable: !0 }, _subject: { value: null, writable: !0 }, _connection: { value: null, writable: !0 }, _subscribe: { value: connectableProto._subscribe }, _isComplete: { value: connectableProto._isComplete, writable: !0 }, getSubject: { value: connectableProto.getSubject }, connect: { value: connectableProto.connect }, refCount: { value: connectableProto.refCount } }, ConnectableSubscriber = function (t) { function r(r, e) { var n = t.call(this, r) || this; return n.connectable = e, n; } return __extends(r, t), r.prototype._error = function (r) { this._unsubscribe(), t.prototype._error.call(this, r); }, r.prototype._complete = function () { this.connectable._isComplete = !0, this._unsubscribe(), t.prototype._complete.call(this); }, r.prototype._unsubscribe = function () { var t = this.connectable; if (t) {
    this.connectable = null;
    var r = t._connection;
    t._refCount = 0, t._subject = null, t._connection = null, r && r.unsubscribe();
} }, r; }(SubjectSubscriber), BehaviorSubject = function (t) { function r(r) { var e = t.call(this) || this; return e._value = r, e; } return __extends(r, t), Object.defineProperty(r.prototype, "value", { get: function () { return this.getValue(); }, enumerable: !0, configurable: !0 }), r.prototype._subscribe = function (r) { var e = t.prototype._subscribe.call(this, r); return e && !e.closed && r.next(this._value), e; }, r.prototype.getValue = function () { if (this.hasError)
    throw this.thrownError; if (this.closed)
    throw new ObjectUnsubscribedError; return this._value; }, r.prototype.next = function (r) { t.prototype.next.call(this, this._value = r); }, r; }(Subject), EMPTY = new Observable(function (t) { return t.complete(); });
function empty$1(t) { return t ? emptyScheduled(t) : EMPTY; }
function emptyScheduled(t) { return new Observable(function (r) { return t.schedule(function () { return r.complete(); }); }); }
function isScheduler(t) { return t && "function" == typeof t.schedule; }
var subscribeToArray = function (t) { return function (r) { for (var e = 0, n = t.length; e < n && !r.closed; e++)
    r.next(t[e]); r.closed || r.complete(); }; };
function fromArray(t, r) { return new Observable(r ? function (e) { var n = new Subscription, o = 0; return n.add(r.schedule(function () { o !== t.length ? (e.next(t[o++]), e.closed || n.add(this.schedule())) : e.complete(); })), n; } : subscribeToArray(t)); }
function scalar(t) { var r = new Observable(function (r) { r.next(t), r.complete(); }); return r._isScalar = !0, r.value = t, r; }
function of() { for (var t = [], r = 0; r < arguments.length; r++)
    t[r] = arguments[r]; var e = t[t.length - 1]; switch (isScheduler(e) ? t.pop() : e = void 0, t.length) {
    case 0: return empty$1(e);
    case 1: return e ? fromArray(t, e) : scalar(t[0]);
    default: return fromArray(t, e);
} }
function identity(t) { return t; }
function map(t, r) { return function (e) { if ("function" != typeof t)
    throw new TypeError("argument is not a function. Are you looking for `mapTo()`?"); return e.lift(new MapOperator(t, r)); }; }
var MapOperator = function () { function t(t, r) { this.project = t, this.thisArg = r; } return t.prototype.call = function (t, r) { return r.subscribe(new MapSubscriber(t, this.project, this.thisArg)); }, t; }(), MapSubscriber = function (t) { function r(r, e, n) { var o = t.call(this, r) || this; return o.project = e, o.count = 0, o.thisArg = n || o, o; } return __extends(r, t), r.prototype._next = function (t) { var r; try {
    r = this.project.call(this.thisArg, t, this.count++);
}
catch (t) {
    return void this.destination.error(t);
} this.destination.next(r); }, r; }(Subscriber), OuterSubscriber = function (t) { function r() { return null !== t && t.apply(this, arguments) || this; } return __extends(r, t), r.prototype.notifyNext = function (t, r, e, n, o) { this.destination.next(r); }, r.prototype.notifyError = function (t, r) { this.destination.error(t); }, r.prototype.notifyComplete = function (t) { this.destination.complete(); }, r; }(Subscriber), InnerSubscriber = function (t) { function r(r, e, n) { var o = t.call(this) || this; return o.parent = r, o.outerValue = e, o.outerIndex = n, o.index = 0, o; } return __extends(r, t), r.prototype._next = function (t) { this.parent.notifyNext(this.outerValue, t, this.outerIndex, this.index++, this); }, r.prototype._error = function (t) { this.parent.notifyError(t, this), this.unsubscribe(); }, r.prototype._complete = function () { this.parent.notifyComplete(this), this.unsubscribe(); }, r; }(Subscriber), subscribeToPromise = function (t) { return function (r) { return t.then(function (t) { r.closed || (r.next(t), r.complete()); }, function (t) { return r.error(t); }).then(null, hostReportError), r; }; };
function getSymbolIterator() { return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator"; }
var iterator = getSymbolIterator(), subscribeToIterable = function (t) { return function (r) { for (var e = t[iterator]();;) {
    var n = e.next();
    if (n.done) {
        r.complete();
        break;
    }
    if (r.next(n.value), r.closed)
        break;
} return "function" == typeof e.return && r.add(function () { e.return && e.return(); }), r; }; }, subscribeToObservable = function (t) { return function (r) { var e = t[observable](); if ("function" != typeof e.subscribe)
    throw new TypeError("Provided object does not correctly implement Symbol.observable"); return e.subscribe(r); }; }, isArrayLike = function (t) { return t && "number" == typeof t.length && "function" != typeof t; };
function isPromise(t) { return !!t && "function" != typeof t.subscribe && "function" == typeof t.then; }
var subscribeTo = function (t) { if (t instanceof Observable)
    return function (r) { return t._isScalar ? (r.next(t.value), void r.complete()) : t.subscribe(r); }; if (t && "function" == typeof t[observable])
    return subscribeToObservable(t); if (isArrayLike(t))
    return subscribeToArray(t); if (isPromise(t))
    return subscribeToPromise(t); if (t && "function" == typeof t[iterator])
    return subscribeToIterable(t); var r = isObject(t) ? "an invalid object" : "'" + t + "'"; throw new TypeError("You provided " + r + " where a stream was expected. You can provide an Observable, Promise, Array, or Iterable."); };
function subscribeToResult(t, r, e, n, o) { if (void 0 === o && (o = new InnerSubscriber(t, e, n)), !o.closed)
    return subscribeTo(r)(o); }
var NONE = {};
function combineLatest() { for (var t = [], r = 0; r < arguments.length; r++)
    t[r] = arguments[r]; var e = null, n = null; return isScheduler(t[t.length - 1]) && (n = t.pop()), "function" == typeof t[t.length - 1] && (e = t.pop()), 1 === t.length && isArray(t[0]) && (t = t[0]), fromArray(t, n).lift(new CombineLatestOperator(e)); }
var CombineLatestOperator = function () { function t(t) { this.resultSelector = t; } return t.prototype.call = function (t, r) { return r.subscribe(new CombineLatestSubscriber(t, this.resultSelector)); }, t; }(), CombineLatestSubscriber = function (t) { function r(r, e) { var n = t.call(this, r) || this; return n.resultSelector = e, n.active = 0, n.values = [], n.observables = [], n; } return __extends(r, t), r.prototype._next = function (t) { this.values.push(NONE), this.observables.push(t); }, r.prototype._complete = function () { var t = this.observables, r = t.length; if (0 === r)
    this.destination.complete();
else {
    this.active = r, this.toRespond = r;
    for (var e = 0; e < r; e++) {
        var n = t[e];
        this.add(subscribeToResult(this, n, n, e));
    }
} }, r.prototype.notifyComplete = function (t) { 0 == (this.active -= 1) && this.destination.complete(); }, r.prototype.notifyNext = function (t, r, e, n, o) { var i = this.values, s = this.toRespond ? i[e] === NONE ? --this.toRespond : this.toRespond : 0; i[e] = r, 0 === s && (this.resultSelector ? this._tryResultSelector(i) : this.destination.next(i.slice())); }, r.prototype._tryResultSelector = function (t) { var r; try {
    r = this.resultSelector.apply(this, t);
}
catch (t) {
    return void this.destination.error(t);
} this.destination.next(r); }, r; }(OuterSubscriber);
function isInteropObservable(t) { return t && "function" == typeof t[observable]; }
function isIterable(t) { return t && "function" == typeof t[iterator]; }
function fromPromise(t, r) { return new Observable(r ? function (e) { var n = new Subscription; return n.add(r.schedule(function () { return t.then(function (t) { n.add(r.schedule(function () { e.next(t), n.add(r.schedule(function () { return e.complete(); })); })); }, function (t) { n.add(r.schedule(function () { return e.error(t); })); }); })), n; } : subscribeToPromise(t)); }
function fromIterable(t, r) { if (!t)
    throw new Error("Iterable cannot be null"); return new Observable(r ? function (e) { var n, o = new Subscription; return o.add(function () { n && "function" == typeof n.return && n.return(); }), o.add(r.schedule(function () { n = t[iterator](), o.add(r.schedule(function () { if (!e.closed) {
    var t, r;
    try {
        var o = n.next();
        t = o.value, r = o.done;
    }
    catch (t) {
        return void e.error(t);
    }
    r ? e.complete() : (e.next(t), this.schedule());
} })); })), o; } : subscribeToIterable(t)); }
function fromObservable(t, r) { return new Observable(r ? function (e) { var n = new Subscription; return n.add(r.schedule(function () { var o = t[observable](); n.add(o.subscribe({ next: function (t) { n.add(r.schedule(function () { return e.next(t); })); }, error: function (t) { n.add(r.schedule(function () { return e.error(t); })); }, complete: function () { n.add(r.schedule(function () { return e.complete(); })); } })); })), n; } : subscribeToObservable(t)); }
function from(t, r) { if (!r)
    return t instanceof Observable ? t : new Observable(subscribeTo(t)); if (null != t) {
    if (isInteropObservable(t))
        return fromObservable(t, r);
    if (isPromise(t))
        return fromPromise(t, r);
    if (isArrayLike(t))
        return fromArray(t, r);
    if (isIterable(t) || "string" == typeof t)
        return fromIterable(t, r);
} throw new TypeError((null !== t && typeof t || t) + " is not observable"); }
function mergeMap(t, r, e) { return void 0 === e && (e = Number.POSITIVE_INFINITY), "function" == typeof r ? function (n) { return n.pipe(mergeMap(function (e, n) { return from(t(e, n)).pipe(map(function (t, o) { return r(e, t, n, o); })); }, e)); } : ("number" == typeof r && (e = r), function (r) { return r.lift(new MergeMapOperator(t, e)); }); }
var MergeMapOperator = function () { function t(t, r) { void 0 === r && (r = Number.POSITIVE_INFINITY), this.project = t, this.concurrent = r; } return t.prototype.call = function (t, r) { return r.subscribe(new MergeMapSubscriber(t, this.project, this.concurrent)); }, t; }(), MergeMapSubscriber = function (t) { function r(r, e, n) { void 0 === n && (n = Number.POSITIVE_INFINITY); var o = t.call(this, r) || this; return o.project = e, o.concurrent = n, o.hasCompleted = !1, o.buffer = [], o.active = 0, o.index = 0, o; } return __extends(r, t), r.prototype._next = function (t) { this.active < this.concurrent ? this._tryNext(t) : this.buffer.push(t); }, r.prototype._tryNext = function (t) { var r, e = this.index++; try {
    r = this.project(t, e);
}
catch (t) {
    return void this.destination.error(t);
} this.active++, this._innerSub(r, t, e); }, r.prototype._innerSub = function (t, r, e) { var n = new InnerSubscriber(this, void 0, void 0); this.destination.add(n), subscribeToResult(this, t, r, e, n); }, r.prototype._complete = function () { this.hasCompleted = !0, 0 === this.active && 0 === this.buffer.length && this.destination.complete(), this.unsubscribe(); }, r.prototype.notifyNext = function (t, r, e, n, o) { this.destination.next(r); }, r.prototype.notifyComplete = function (t) { var r = this.buffer; this.remove(t), this.active--, r.length > 0 ? this._next(r.shift()) : 0 === this.active && this.hasCompleted && this.destination.complete(); }, r; }(OuterSubscriber);
function mergeAll(t) { return void 0 === t && (t = Number.POSITIVE_INFINITY), mergeMap(identity, t); }
function concatAll() { return mergeAll(1); }
function concat() { for (var t = [], r = 0; r < arguments.length; r++)
    t[r] = arguments[r]; return concatAll()(of.apply(void 0, t)); }
function merge() { for (var t = [], r = 0; r < arguments.length; r++)
    t[r] = arguments[r]; var e = Number.POSITIVE_INFINITY, n = null, o = t[t.length - 1]; return isScheduler(o) ? (n = t.pop(), t.length > 1 && "number" == typeof t[t.length - 1] && (e = t.pop())) : "number" == typeof o && (e = t.pop()), null === n && 1 === t.length && t[0] instanceof Observable ? t[0] : mergeAll(e)(fromArray(t, n)); }
var NEVER = new Observable(noop);
function catchError(t) { return function (r) { var e = new CatchOperator(t), n = r.lift(e); return e.caught = n; }; }
var CatchOperator = function () { function t(t) { this.selector = t; } return t.prototype.call = function (t, r) { return r.subscribe(new CatchSubscriber(t, this.selector, this.caught)); }, t; }(), CatchSubscriber = function (t) { function r(r, e, n) { var o = t.call(this, r) || this; return o.selector = e, o.caught = n, o; } return __extends(r, t), r.prototype.error = function (r) { if (!this.isStopped) {
    var e = void 0;
    try {
        e = this.selector(r, this.caught);
    }
    catch (r) {
        return void t.prototype.error.call(this, r);
    }
    this._unsubscribeAndRecycle();
    var n = new InnerSubscriber(this, void 0, void 0);
    this.add(n), subscribeToResult(this, e, void 0, void 0, n);
} }, r; }(OuterSubscriber);
function distinctUntilChanged(t, r) { return function (e) { return e.lift(new DistinctUntilChangedOperator(t, r)); }; }
var DistinctUntilChangedOperator = function () { function t(t, r) { this.compare = t, this.keySelector = r; } return t.prototype.call = function (t, r) { return r.subscribe(new DistinctUntilChangedSubscriber(t, this.compare, this.keySelector)); }, t; }(), DistinctUntilChangedSubscriber = function (t) { function r(r, e, n) { var o = t.call(this, r) || this; return o.keySelector = n, o.hasKey = !1, "function" == typeof e && (o.compare = e), o; } return __extends(r, t), r.prototype.compare = function (t, r) { return t === r; }, r.prototype._next = function (t) { var r; try {
    var e = this.keySelector;
    r = e ? e(t) : t;
}
catch (t) {
    return this.destination.error(t);
} var n = !1; if (this.hasKey)
    try {
        n = (0, this.compare)(this.key, r);
    }
    catch (t) {
        return this.destination.error(t);
    }
else
    this.hasKey = !0; n || (this.key = r, this.destination.next(t)); }, r; }(Subscriber);
function distinctUntilKeyChanged(t, r) { return distinctUntilChanged(function (e, n) { return r ? r(e[t], n[t]) : e[t] === n[t]; }); }
function filter(t, r) { return function (e) { return e.lift(new FilterOperator(t, r)); }; }
var FilterOperator = function () { function t(t, r) { this.predicate = t, this.thisArg = r; } return t.prototype.call = function (t, r) { return r.subscribe(new FilterSubscriber(t, this.predicate, this.thisArg)); }, t; }(), FilterSubscriber = function (t) { function r(r, e, n) { var o = t.call(this, r) || this; return o.predicate = e, o.thisArg = n, o.count = 0, o; } return __extends(r, t), r.prototype._next = function (t) { var r; try {
    r = this.predicate.call(this.thisArg, t, this.count++);
}
catch (t) {
    return void this.destination.error(t);
} r && this.destination.next(t); }, r; }(Subscriber);
function tap(t, r, e) { return function (n) { return n.lift(new DoOperator(t, r, e)); }; }
var DoOperator = function () { function t(t, r, e) { this.nextOrObserver = t, this.error = r, this.complete = e; } return t.prototype.call = function (t, r) { return r.subscribe(new TapSubscriber(t, this.nextOrObserver, this.error, this.complete)); }, t; }(), TapSubscriber = function (t) { function r(r, e, n, o) { var i = t.call(this, r) || this; return i._tapNext = noop, i._tapError = noop, i._tapComplete = noop, i._tapError = n || noop, i._tapComplete = o || noop, isFunction(e) ? (i._context = i, i._tapNext = e) : e && (i._context = e, i._tapNext = e.next || noop, i._tapError = e.error || noop, i._tapComplete = e.complete || noop), i; } return __extends(r, t), r.prototype._next = function (t) { try {
    this._tapNext.call(this._context, t);
}
catch (t) {
    return void this.destination.error(t);
} this.destination.next(t); }, r.prototype._error = function (t) { try {
    this._tapError.call(this._context, t);
}
catch (t) {
    return void this.destination.error(t);
} this.destination.error(t); }, r.prototype._complete = function () { try {
    this._tapComplete.call(this._context);
}
catch (t) {
    return void this.destination.error(t);
} return this.destination.complete(); }, r; }(Subscriber);
function multicast(t, r) { return function (e) { var n; if (n = "function" == typeof t ? t : function () { return t; }, "function" == typeof r)
    return e.lift(new MulticastOperator(n, r)); var o = Object.create(e, connectableObservableDescriptor); return o.source = e, o.subjectFactory = n, o; }; }
var MulticastOperator = function () { function t(t, r) { this.subjectFactory = t, this.selector = r; } return t.prototype.call = function (t, r) { var e = this.selector, n = this.subjectFactory(), o = e(n).subscribe(t); return o.add(r.subscribe(n)), o; }, t; }();
function shareSubjectFactory() { return new Subject; }
function share() { return function (t) { return refCount()(multicast(shareSubjectFactory)(t)); }; }
function startWith() { for (var t = [], r = 0; r < arguments.length; r++)
    t[r] = arguments[r]; return function (r) { var e = t[t.length - 1]; isScheduler(e) ? t.pop() : e = null; var n = t.length; return concat(1 !== n || e ? n > 0 ? fromArray(t, e) : empty$1(e) : scalar(t[0]), r); }; }
function switchMap(t, r) { return "function" == typeof r ? function (e) { return e.pipe(switchMap(function (e, n) { return from(t(e, n)).pipe(map(function (t, o) { return r(e, t, n, o); })); })); } : function (r) { return r.lift(new SwitchMapOperator(t)); }; }
var SwitchMapOperator = function () { function t(t) { this.project = t; } return t.prototype.call = function (t, r) { return r.subscribe(new SwitchMapSubscriber(t, this.project)); }, t; }(), SwitchMapSubscriber = function (t) { function r(r, e) { var n = t.call(this, r) || this; return n.project = e, n.index = 0, n; } return __extends(r, t), r.prototype._next = function (t) { var r, e = this.index++; try {
    r = this.project(t, e);
}
catch (t) {
    return void this.destination.error(t);
} this._innerSub(r, t, e); }, r.prototype._innerSub = function (t, r, e) { var n = this.innerSubscription; n && n.unsubscribe(); var o = new InnerSubscriber(this, void 0, void 0); this.destination.add(o), this.innerSubscription = subscribeToResult(this, t, r, e, o); }, r.prototype._complete = function () { var r = this.innerSubscription; r && !r.closed || t.prototype._complete.call(this), this.unsubscribe(); }, r.prototype._unsubscribe = function () { this.innerSubscription = null; }, r.prototype.notifyComplete = function (r) { this.destination.remove(r), this.innerSubscription = null, this.isStopped && t.prototype._complete.call(this); }, r.prototype.notifyNext = function (t, r, e, n, o) { this.destination.next(r); }, r; }(OuterSubscriber);
function isExternal(t, r) { return void 0 === r && (r = window.location), t.protocol !== r.protocol || t.host !== r.host; }
function createResizeObservable(t) { return Observable.create(function (r) { var e = new window.ResizeObserver(function (t) { return t.forEach(function (t) { return r.next(t); }); }); return e.observe(t), function () { e.unobserve(t); }; }); }
function createItersectionObservable(t, r) { return Observable.create(function (e) { var n = new IntersectionObserver(function (t) { return t.forEach(function (t) { return e.next(t); }); }, r); return n.observe(t), function () { n.unobserve(t); }; }); }
function fetchRx(t, r) { return Observable.create(function (e) { var n = new AbortController, o = null; return fetch(t, Object.assign({}, r, { signal: n.signal })).then(function (t) { o = t, e.next(t), e.complete(); }).catch(function (t) { return e.error(t); }), function () { o || n.abort(); }; }); }
var userAssert = function (t) { for (var r = [], e = 1; e < arguments.length; e++)
    r[e - 1] = arguments[e]; return t; }, srcsetRegex = /(\S+)(?:\s+(?:(-?\d+(?:\.\d+)?)([a-zA-Z]*)))?\s*(?:,|$)/g;
function srcsetFromSrc(t) { return new Srcset([{ url: t, width: void 0, dpr: 1 }]); }
function parseSrcset(t) { for (var r, e = []; r = srcsetRegex.exec(t);) {
    var n = r[1], o = void 0, i = void 0;
    if (r[2]) {
        var s = r[3].toLowerCase();
        if ("w" == s)
            o = parseInt(r[2], 10);
        else {
            if ("x" != s)
                continue;
            i = parseFloat(r[2]);
        }
    }
    else
        i = 1;
    e.push({ url: n, width: o, dpr: i });
} return new Srcset(e); }
var Srcset = function () { function t(t) { userAssert(t.length > 0, "Srcset must have at least one source"), this.sources_ = t; for (var r = !1, e = !1, n = 0; n < t.length; n++) {
    var o = t[n];
    r = r || !!o.width, e = e || !!o.dpr;
} t.sort(r ? sortByWidth : sortByDpr), this.widthBased_ = r; } return t.prototype.select = function (t, r) { var e; return e = this.widthBased_ ? this.selectByWidth_(t * r) : this.selectByDpr_(r), this.sources_[e].url; }, t.prototype.selectByWidth_ = function (t) { for (var r = this.sources_, e = 0, n = 1 / 0, o = 1 / 0, i = 0; i < r.length; i++) {
    var s = r[i].width, c = Math.abs(s - t);
    if (!(c <= 1.1 * n || t / o > 1.2))
        break;
    e = i, n = c, o = s;
} return e; }, t.prototype.selectByDpr_ = function (t) { for (var r = this.sources_, e = 0, n = 1 / 0, o = 0; o < r.length; o++) {
    var i = Math.abs(r[o].dpr - t);
    if (!(i <= n))
        break;
    e = o, n = i;
} return e; }, t.prototype.getUrls = function () { return this.sources_.map(function (t) { return t.url; }); }, t.prototype.stringify = function (t) { for (var r = [], e = this.sources_, n = 0; n < e.length; n++) {
    var o = e[n], i = o.url;
    t && (i = t(i)), r.push(i += this.widthBased_ ? " " + o.width + "w" : " " + o.dpr + "x");
} return r.join(", "); }, t; }();
function sortByWidth(t, r) { return userAssert(t.width != r.width, "Duplicate width: %s", t.width), t.width - r.width; }
function sortByDpr(t, r) { return userAssert(t.dpr != r.dpr, "Duplicate dpr: %s", t.dpr), t.dpr - r.dpr; }
var HyImg = function () { function t() { this.w = 0, this.h = 0, this.strategy = "cache", this.loadImage$ = new Subject, this.cache = new Map, this.url = null, this.visibility = "hidden"; } return t.prototype.setRoot = function (t) { this.root$.next(t); }, t.prototype.setRootMargin = function (t) { this.rootMargin$.next(t); }, t.prototype.setW = function (t) { this.w$.next(t); }, t.prototype.setH = function (t) { this.h$.next(t); }, t.prototype.setSrc = function (t) { this.src$.next(t); }, t.prototype.setSrcset = function (t) { this.srcset$.next(t); }, t.prototype.getIsIntersecting = function () { var t = this; return combineLatest(this.root$, this.rootMargin$).pipe(switchMap(function (r) { var e = r[1]; return "IntersectionObserver" in window ? createItersectionObservable(t.el, { root: document.querySelector(r[0]), rootMargin: e }) : of({ isIntersecting: !0 }); }), map(function (t) { return t.isIntersecting; })); }, t.prototype.getContentWidth = function () { return "ResizeObserver" in window ? createResizeObservable(this.el).pipe(map(function (t) { return t.contentRect.width; }), startWith(this.el.clientWidth)) : NEVER; }, t.prototype.componentWillLoad = function () { var t = this; this.connected$ = new BehaviorSubject(!0), this.root$ = new BehaviorSubject(this.root), this.rootMargin$ = new BehaviorSubject(this.rootMargin), this.w$ = new BehaviorSubject(this.w), this.h$ = new BehaviorSubject(this.h), this.src$ = new BehaviorSubject(this.src), this.srcset$ = new BehaviorSubject(this.srcset); var r = this.getContentWidth(); combineLatest(r, this.w$, this.h$).subscribe(function (r) { var e = r[1], n = r[2]; t.contentWidth = r[0], t.renderWidth = e, t.renderHeight = n; }); var e = merge(this.getIsIntersecting(), this.loadImage$).pipe(share()); e.pipe(filter(function (t) { return !!t; }), distinctUntilChanged()).subscribe(function () { return t.triggered(e, r); }); }, t.prototype.triggered = function (t, r) { var e = this, n = combineLatest(this.src$, this.srcset$).pipe(filter(function (t) { return null != t[0] || null != t[1]; }), distinctUntilChanged(function (t, r) { return t[0] === r[0] && t[1] === r[1]; }), map(function (t) { var r = t[0], e = t[1]; return e ? parseSrcset(e) : srcsetFromSrc(r); })), o = combineLatest(r, n).pipe(map(function (t) { return e.selectSrcsetURL.apply(e, t); }), distinctUntilKeyChanged("href")), i = t.pipe(startWith(!0)); combineLatest(o, i).pipe(switchMap(function (t) { return e.fetchImage.apply(e, t); }), catchError(function () { return o; })).subscribe(function (t) { e.url = t; }); }, t.prototype.selectSrcsetURL = function (t, r) { var e = window.devicePixelRatio || 1, n = r.select(t || window.screen.width, e); return new URL(n, window.location.href); }, t.prototype.cacheStrategy = function (t) { switch (this.strategy) {
    case "blob": return t.pipe(switchMap(function (t) { return t.blob(); }), map(function (t) { return URL.createObjectURL(t); }));
    case "cache":
    default: return t.pipe(map(function (t) { return t.url; }));
} }, t.prototype.fetchImage = function (t, r) { var e = t.href, n = this.cache; if (r && !n.has(e)) {
    var o = fetchRx(e, { method: "GET", headers: { Accept: "image/*" }, mode: isExternal(t) ? "cors" : void 0 });
    return this.cacheStrategy(o).pipe(tap(function (t) { return n.set(e, t); }));
} return n.has(e) ? of(n.get(e)) : NEVER; }, t.prototype.render = function () { var t = this; return [hy_img_core_js_1.h("div", { class: "sizer", style: this.calcSizerStyle() }, hy_img_core_js_1.h("slot", { name: "loading" }), this.url ? hy_img_core_js_1.h("img", { src: this.url, style: this.calcImageStyle(), alt: this.alt, decoding: this.decoding, useMap: this.useMap, onLoad: function () { return t.visibility = "visible"; } }) : null)]; }, t.prototype.calcImageStyle = function () { return { visibility: this.visibility }; }, t.prototype.calcSizerStyle = function () { var t = this.renderWidth, r = this.renderHeight, e = {}; return 0 !== t && 0 !== r ? t >= this.contentWidth ? (e.width = "100%", e.paddingTop = r / t * 100 + "%") : (e.width = t + "px", e.height = r + "px") : 0 !== r ? (e.width = "", e.height = r + "px") : (e.width = "", e.height = ""), e; }, t.prototype.componentDidUnload = function () { this.connected$.next(!1), this.cache && this.cache.forEach(function (t) { URL.revokeObjectURL(t); }); }, t.prototype.loadImage = function () { this.loadImage$.next(!0); }, Object.defineProperty(t, "is", { get: function () { return "hy-img"; }, enumerable: !0, configurable: !0 }), Object.defineProperty(t, "encapsulation", { get: function () { return "shadow"; }, enumerable: !0, configurable: !0 }), Object.defineProperty(t, "properties", { get: function () { return { alt: { type: String, attr: "alt", reflectToAttr: !0, mutable: !0 }, contentWidth: { state: !0 }, decoding: { type: String, attr: "decoding", reflectToAttr: !0, mutable: !0 }, el: { elementRef: !0 }, h: { type: Number, attr: "h", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setH"] }, loadImage: { method: !0 }, renderHeight: { state: !0 }, renderWidth: { state: !0 }, root: { type: String, attr: "root", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setRoot"] }, rootMargin: { type: String, attr: "root-margin", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setRootMargin"] }, src: { type: String, attr: "src", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setSrc"] }, srcset: { type: String, attr: "srcset", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setSrcset"] }, strategy: { type: String, attr: "strategy", reflectToAttr: !0, mutable: !0 }, url: { state: !0 }, useMap: { type: String, attr: "usemap", reflectToAttr: !0, mutable: !0 }, visibility: { state: !0 }, w: { type: Number, attr: "w", reflectToAttr: !0, mutable: !0, watchCallbacks: ["setW"] } }; }, enumerable: !0, configurable: !0 }), Object.defineProperty(t, "style", { get: function () { return ".sizer.sc-hy-img{position:relative}img.sc-hy-img{position:absolute;top:0;left:0;max-width:100%;max-height:100%}"; }, enumerable: !0, configurable: !0 }), t; }();
exports.HyImg = HyImg;
