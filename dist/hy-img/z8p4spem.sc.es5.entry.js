HyImg.loadBundle("z8p4spem",["exports"],function(t){var e=window.HyImg.h,r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)};function n(t,e){function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}function o(t){return"function"==typeof t}var i=!1,s={Promise:void 0,set useDeprecatedSynchronousErrorHandling(t){i=t},get useDeprecatedSynchronousErrorHandling(){return i}};function c(t){setTimeout(function(){throw t})}var u={closed:!0,next:function(t){},error:function(t){if(s.useDeprecatedSynchronousErrorHandling)throw t;c(t)},complete:function(){}},h=Array.isArray||function(t){return t&&"number"==typeof t.length};function a(t){return null!==t&&"object"==typeof t}function p(t){return Error.call(this),this.message=t?t.length+" errors occurred during unsubscription:\n"+t.map(function(t,e){return e+1+") "+t.toString()}).join("\n  "):"",this.name="UnsubscriptionError",this.errors=t,this}p.prototype=Object.create(Error.prototype);var l=p,f=function(){function t(t){this.closed=!1,this._parent=null,this._parents=null,this._subscriptions=null,t&&(this._unsubscribe=t)}var e;return t.prototype.unsubscribe=function(){var t,e=!1;if(!this.closed){var r=this._parent,n=this._parents,i=this._unsubscribe,s=this._subscriptions;this.closed=!0,this._parent=null,this._parents=null,this._subscriptions=null;for(var c=-1,u=n?n.length:0;r;)r.remove(this),r=++c<u&&n[c]||null;if(o(i))try{i.call(this)}catch(r){e=!0,t=r instanceof l?b(r.errors):[r]}if(h(s))for(c=-1,u=s.length;++c<u;){var p=s[c];if(a(p))try{p.unsubscribe()}catch(r){e=!0,t=t||[],r instanceof l?t=t.concat(b(r.errors)):t.push(r)}}if(e)throw new l(t)}},t.prototype.add=function(e){var r=e;switch(typeof e){case"function":r=new t(e);case"object":if(r===this||r.closed||"function"!=typeof r.unsubscribe)return r;if(this.closed)return r.unsubscribe(),r;if(!(r instanceof t)){var n=r;(r=new t)._subscriptions=[n]}break;default:if(!e)return t.EMPTY;throw new Error("unrecognized teardown "+e+" added to Subscription.")}if(r._addParent(this)){var o=this._subscriptions;o?o.push(r):this._subscriptions=[r]}return r},t.prototype.remove=function(t){var e=this._subscriptions;if(e){var r=e.indexOf(t);-1!==r&&e.splice(r,1)}},t.prototype._addParent=function(t){var e=this._parent,r=this._parents;return e!==t&&(e?r?-1===r.indexOf(t)&&(r.push(t),!0):(this._parents=[t],!0):(this._parent=t,!0))},t.EMPTY=((e=new t).closed=!0,e),t}();function b(t){return t.reduce(function(t,e){return t.concat(e instanceof l?e.errors:e)},[])}var d="function"==typeof Symbol?Symbol("rxSubscriber"):"@@rxSubscriber_"+Math.random(),y=function(t){function e(r,n,o){var i=t.call(this)||this;switch(i.syncErrorValue=null,i.syncErrorThrown=!1,i.syncErrorThrowable=!1,i.isStopped=!1,arguments.length){case 0:i.destination=u;break;case 1:if(!r){i.destination=u;break}if("object"==typeof r){r instanceof e?(i.syncErrorThrowable=r.syncErrorThrowable,i.destination=r,r.add(i)):(i.syncErrorThrowable=!0,i.destination=new v(i,r));break}default:i.syncErrorThrowable=!0,i.destination=new v(i,r,n,o)}return i}return n(e,t),e.prototype[d]=function(){return this},e.create=function(t,r,n){var o=new e(t,r,n);return o.syncErrorThrowable=!1,o},e.prototype.next=function(t){this.isStopped||this._next(t)},e.prototype.error=function(t){this.isStopped||(this.isStopped=!0,this._error(t))},e.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},e.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,t.prototype.unsubscribe.call(this))},e.prototype._next=function(t){this.destination.next(t)},e.prototype._error=function(t){this.destination.error(t),this.unsubscribe()},e.prototype._complete=function(){this.destination.complete(),this.unsubscribe()},e.prototype._unsubscribeAndRecycle=function(){var t=this._parent,e=this._parents;return this._parent=null,this._parents=null,this.unsubscribe(),this.closed=!1,this.isStopped=!1,this._parent=t,this._parents=e,this},e}(f),v=function(t){function e(e,r,n,i){var s,c=t.call(this)||this;c._parentSubscriber=e;var h=c;return o(r)?s=r:r&&(s=r.next,n=r.error,i=r.complete,r!==u&&(o((h=Object.create(r)).unsubscribe)&&c.add(h.unsubscribe.bind(h)),h.unsubscribe=c.unsubscribe.bind(c))),c._context=h,c._next=s,c._error=n,c._complete=i,c}return n(e,t),e.prototype.next=function(t){if(!this.isStopped&&this._next){var e=this._parentSubscriber;s.useDeprecatedSynchronousErrorHandling&&e.syncErrorThrowable?this.__tryOrSetError(e,this._next,t)&&this.unsubscribe():this.__tryOrUnsub(this._next,t)}},e.prototype.error=function(t){if(!this.isStopped){var e=this._parentSubscriber,r=s.useDeprecatedSynchronousErrorHandling;if(this._error)r&&e.syncErrorThrowable?(this.__tryOrSetError(e,this._error,t),this.unsubscribe()):(this.__tryOrUnsub(this._error,t),this.unsubscribe());else if(e.syncErrorThrowable)r?(e.syncErrorValue=t,e.syncErrorThrown=!0):c(t),this.unsubscribe();else{if(this.unsubscribe(),r)throw t;c(t)}}},e.prototype.complete=function(){var t=this;if(!this.isStopped){var e=this._parentSubscriber;if(this._complete){var r=function(){return t._complete.call(t._context)};s.useDeprecatedSynchronousErrorHandling&&e.syncErrorThrowable?(this.__tryOrSetError(e,r),this.unsubscribe()):(this.__tryOrUnsub(r),this.unsubscribe())}else this.unsubscribe()}},e.prototype.__tryOrUnsub=function(t,e){try{t.call(this._context,e)}catch(t){if(this.unsubscribe(),s.useDeprecatedSynchronousErrorHandling)throw t;c(t)}},e.prototype.__tryOrSetError=function(t,e,r){if(!s.useDeprecatedSynchronousErrorHandling)throw new Error("bad call");try{e.call(this._context,r)}catch(e){return s.useDeprecatedSynchronousErrorHandling?(t.syncErrorValue=e,t.syncErrorThrown=!0,!0):(c(e),!0)}return!1},e.prototype._unsubscribe=function(){var t=this._parentSubscriber;this._context=null,this._parentSubscriber=null,t.unsubscribe()},e}(y),_="function"==typeof Symbol&&Symbol.observable||"@@observable";function w(){}var g=function(){function t(t){this._isScalar=!1,t&&(this._subscribe=t)}return t.prototype.lift=function(e){var r=new t;return r.source=this,r.operator=e,r},t.prototype.subscribe=function(t,e,r){var n=this.operator,o=function(t,e,r){if(t){if(t instanceof y)return t;if(t[d])return t[d]()}return t||e||r?new y(t,e,r):new y(u)}(t,e,r);if(o.add(n?n.call(o,this.source):this.source||s.useDeprecatedSynchronousErrorHandling&&!o.syncErrorThrowable?this._subscribe(o):this._trySubscribe(o)),s.useDeprecatedSynchronousErrorHandling&&o.syncErrorThrowable&&(o.syncErrorThrowable=!1,o.syncErrorThrown))throw o.syncErrorValue;return o},t.prototype._trySubscribe=function(t){try{return this._subscribe(t)}catch(e){s.useDeprecatedSynchronousErrorHandling&&(t.syncErrorThrown=!0,t.syncErrorValue=e),function(t){for(;t;){var e=t.destination;if(t.closed||t.isStopped)return!1;t=e&&e instanceof y?e:null}return!0}(t)?t.error(e):console.warn(e)}},t.prototype.forEach=function(t,e){var r=this;return new(e=m(e))(function(e,n){var o;o=r.subscribe(function(e){try{t(e)}catch(t){n(t),o&&o.unsubscribe()}},n,e)})},t.prototype._subscribe=function(t){var e=this.source;return e&&e.subscribe(t)},t.prototype[_]=function(){return this},t.prototype.pipe=function(){for(var t,e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];return 0===e.length?this:((t=e)?1===t.length?t[0]:function(e){return t.reduce(function(t,e){return e(t)},e)}:w)(this)},t.prototype.toPromise=function(t){var e=this;return new(t=m(t))(function(t,r){var n;e.subscribe(function(t){return n=t},function(t){return r(t)},function(){return t(n)})})},t.create=function(e){return new t(e)},t}();function m(t){if(t||(t=s.Promise||Promise),!t)throw new Error("no Promise impl found");return t}function S(){return Error.call(this),this.message="object unsubscribed",this.name="ObjectUnsubscribedError",this}S.prototype=Object.create(Error.prototype);var x=S,E=function(t){function e(e,r){var n=t.call(this)||this;return n.subject=e,n.subscriber=r,n.closed=!1,n}return n(e,t),e.prototype.unsubscribe=function(){if(!this.closed){this.closed=!0;var t=this.subject,e=t.observers;if(this.subject=null,e&&0!==e.length&&!t.isStopped&&!t.closed){var r=e.indexOf(this.subscriber);-1!==r&&e.splice(r,1)}}},e}(f),j=function(t){function e(e){var r=t.call(this,e)||this;return r.destination=e,r}return n(e,t),e}(y),T=function(t){function e(){var e=t.call(this)||this;return e.observers=[],e.closed=!1,e.isStopped=!1,e.hasError=!1,e.thrownError=null,e}return n(e,t),e.prototype[d]=function(){return new j(this)},e.prototype.lift=function(t){var e=new I(this,this);return e.operator=t,e},e.prototype.next=function(t){if(this.closed)throw new x;if(!this.isStopped)for(var e=this.observers,r=e.length,n=e.slice(),o=0;o<r;o++)n[o].next(t)},e.prototype.error=function(t){if(this.closed)throw new x;this.hasError=!0,this.thrownError=t,this.isStopped=!0;for(var e=this.observers,r=e.length,n=e.slice(),o=0;o<r;o++)n[o].error(t);this.observers.length=0},e.prototype.complete=function(){if(this.closed)throw new x;this.isStopped=!0;for(var t=this.observers,e=t.length,r=t.slice(),n=0;n<e;n++)r[n].complete();this.observers.length=0},e.prototype.unsubscribe=function(){this.isStopped=!0,this.closed=!0,this.observers=null},e.prototype._trySubscribe=function(e){if(this.closed)throw new x;return t.prototype._trySubscribe.call(this,e)},e.prototype._subscribe=function(t){if(this.closed)throw new x;return this.hasError?(t.error(this.thrownError),f.EMPTY):this.isStopped?(t.complete(),f.EMPTY):(this.observers.push(t),new E(this,t))},e.prototype.asObservable=function(){var t=new g;return t.source=this,t},e.create=function(t,e){return new I(t,e)},e}(g),I=function(t){function e(e,r){var n=t.call(this)||this;return n.destination=e,n.source=r,n}return n(e,t),e.prototype.next=function(t){var e=this.destination;e&&e.next&&e.next(t)},e.prototype.error=function(t){var e=this.destination;e&&e.error&&this.destination.error(t)},e.prototype.complete=function(){var t=this.destination;t&&t.complete&&this.destination.complete()},e.prototype._subscribe=function(t){return this.source?this.source.subscribe(t):f.EMPTY},e}(T);function O(){return function(t){return t.lift(new C(t))}}var C=function(){function t(t){this.connectable=t}return t.prototype.call=function(t,e){var r=this.connectable;r._refCount++;var n=new P(t,r),o=e.subscribe(n);return n.closed||(n.connection=r.connect()),o},t}(),P=function(t){function e(e,r){var n=t.call(this,e)||this;return n.connectable=r,n}return n(e,t),e.prototype._unsubscribe=function(){var t=this.connectable;if(t){this.connectable=null;var e=t._refCount;if(e<=0)this.connection=null;else if(t._refCount=e-1,e>1)this.connection=null;else{var r=this.connection,n=t._connection;this.connection=null,!n||r&&n!==r||n.unsubscribe()}}else this.connection=null},e}(y),A=function(t){function e(e,r){var n=t.call(this)||this;return n.source=e,n.subjectFactory=r,n._refCount=0,n._isComplete=!1,n}return n(e,t),e.prototype._subscribe=function(t){return this.getSubject().subscribe(t)},e.prototype.getSubject=function(){var t=this._subject;return t&&!t.isStopped||(this._subject=this.subjectFactory()),this._subject},e.prototype.connect=function(){var t=this._connection;return t||(this._isComplete=!1,(t=this._connection=new f).add(this.source.subscribe(new R(this.getSubject(),this))),t.closed?(this._connection=null,t=f.EMPTY):this._connection=t),t},e.prototype.refCount=function(){return O()(this)},e}(g).prototype,N={operator:{value:null},_refCount:{value:0,writable:!0},_subject:{value:null,writable:!0},_connection:{value:null,writable:!0},_subscribe:{value:A._subscribe},_isComplete:{value:A._isComplete,writable:!0},getSubject:{value:A.getSubject},connect:{value:A.connect},refCount:{value:A.refCount}},R=function(t){function e(e,r){var n=t.call(this,e)||this;return n.connectable=r,n}return n(e,t),e.prototype._error=function(e){this._unsubscribe(),t.prototype._error.call(this,e)},e.prototype._complete=function(){this.connectable._isComplete=!0,this._unsubscribe(),t.prototype._complete.call(this)},e.prototype._unsubscribe=function(){var t=this.connectable;if(t){this.connectable=null;var e=t._connection;t._refCount=0,t._subject=null,t._connection=null,e&&e.unsubscribe()}},e}(j),$=function(t){function e(e){var r=t.call(this)||this;return r._value=e,r}return n(e,t),Object.defineProperty(e.prototype,"value",{get:function(){return this.getValue()},enumerable:!0,configurable:!0}),e.prototype._subscribe=function(e){var r=t.prototype._subscribe.call(this,e);return r&&!r.closed&&e.next(this._value),r},e.prototype.getValue=function(){if(this.hasError)throw this.thrownError;if(this.closed)throw new x;return this._value},e.prototype.next=function(e){t.prototype.next.call(this,this._value=e)},e}(T),k=new g(function(t){return t.complete()});function M(t){return t?function(t){return new g(function(e){return t.schedule(function(){return e.complete()})})}(t):k}function H(t){return t&&"function"==typeof t.schedule}var D=function(t){return function(e){for(var r=0,n=t.length;r<n&&!e.closed;r++)e.next(t[r]);e.closed||e.complete()}};function U(t,e){return new g(e?function(r){var n=new f,o=0;return n.add(e.schedule(function(){o!==t.length?(r.next(t[o++]),r.closed||n.add(this.schedule())):r.complete()})),n}:D(t))}function V(t){var e=new g(function(e){e.next(t),e.complete()});return e._isScalar=!0,e.value=t,e}function W(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=t[t.length-1];switch(H(r)?t.pop():r=void 0,t.length){case 0:return M(r);case 1:return r?U(t,r):V(t[0]);default:return U(t,r)}}function Y(t){return t}function L(t,e){return function(r){if("function"!=typeof t)throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");return r.lift(new F(t,e))}}var F=function(){function t(t,e){this.project=t,this.thisArg=e}return t.prototype.call=function(t,e){return e.subscribe(new B(t,this.project,this.thisArg))},t}(),B=function(t){function e(e,r,n){var o=t.call(this,e)||this;return o.project=r,o.count=0,o.thisArg=n||o,o}return n(e,t),e.prototype._next=function(t){var e;try{e=this.project.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}this.destination.next(e)},e}(y),z=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return n(e,t),e.prototype.notifyNext=function(t,e,r,n,o){this.destination.next(e)},e.prototype.notifyError=function(t,e){this.destination.error(t)},e.prototype.notifyComplete=function(t){this.destination.complete()},e}(y),K=function(t){function e(e,r,n){var o=t.call(this)||this;return o.parent=e,o.outerValue=r,o.outerIndex=n,o.index=0,o}return n(e,t),e.prototype._next=function(t){this.parent.notifyNext(this.outerValue,t,this.outerIndex,this.index++,this)},e.prototype._error=function(t){this.parent.notifyError(t,this),this.unsubscribe()},e.prototype._complete=function(){this.parent.notifyComplete(this),this.unsubscribe()},e}(y),q=function(t){return function(e){return t.then(function(t){e.closed||(e.next(t),e.complete())},function(t){return e.error(t)}).then(null,c),e}};function G(){return"function"==typeof Symbol&&Symbol.iterator?Symbol.iterator:"@@iterator"}var Z=G(),J=function(t){return function(e){for(var r=t[Z]();;){var n=r.next();if(n.done){e.complete();break}if(e.next(n.value),e.closed)break}return"function"==typeof r.return&&e.add(function(){r.return&&r.return()}),e}},Q=function(t){return function(e){var r=t[_]();if("function"!=typeof r.subscribe)throw new TypeError("Provided object does not correctly implement Symbol.observable");return r.subscribe(e)}},X=function(t){return t&&"number"==typeof t.length&&"function"!=typeof t};function tt(t){return!!t&&"function"!=typeof t.subscribe&&"function"==typeof t.then}var et=function(t){if(t instanceof g)return function(e){return t._isScalar?(e.next(t.value),void e.complete()):t.subscribe(e)};if(t&&"function"==typeof t[_])return Q(t);if(X(t))return D(t);if(tt(t))return q(t);if(t&&"function"==typeof t[Z])return J(t);var e=a(t)?"an invalid object":"'"+t+"'";throw new TypeError("You provided "+e+" where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.")};function rt(t,e,r,n,o){if(void 0===o&&(o=new K(t,r,n)),!o.closed)return et(e)(o)}var nt={};function ot(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=null,n=null;return H(t[t.length-1])&&(n=t.pop()),"function"==typeof t[t.length-1]&&(r=t.pop()),1===t.length&&h(t[0])&&(t=t[0]),U(t,n).lift(new it(r))}var it=function(){function t(t){this.resultSelector=t}return t.prototype.call=function(t,e){return e.subscribe(new st(t,this.resultSelector))},t}(),st=function(t){function e(e,r){var n=t.call(this,e)||this;return n.resultSelector=r,n.active=0,n.values=[],n.observables=[],n}return n(e,t),e.prototype._next=function(t){this.values.push(nt),this.observables.push(t)},e.prototype._complete=function(){var t=this.observables,e=t.length;if(0===e)this.destination.complete();else{this.active=e,this.toRespond=e;for(var r=0;r<e;r++){var n=t[r];this.add(rt(this,n,n,r))}}},e.prototype.notifyComplete=function(t){0==(this.active-=1)&&this.destination.complete()},e.prototype.notifyNext=function(t,e,r,n,o){var i=this.values,s=this.toRespond?i[r]===nt?--this.toRespond:this.toRespond:0;i[r]=e,0===s&&(this.resultSelector?this._tryResultSelector(i):this.destination.next(i.slice()))},e.prototype._tryResultSelector=function(t){var e;try{e=this.resultSelector.apply(this,t)}catch(t){return void this.destination.error(t)}this.destination.next(e)},e}(z);function ct(t,e){if(!e)return t instanceof g?t:new g(et(t));if(null!=t){if(function(t){return t&&"function"==typeof t[_]}(t))return function(t,e){return new g(e?function(r){var n=new f;return n.add(e.schedule(function(){var o=t[_]();n.add(o.subscribe({next:function(t){n.add(e.schedule(function(){return r.next(t)}))},error:function(t){n.add(e.schedule(function(){return r.error(t)}))},complete:function(){n.add(e.schedule(function(){return r.complete()}))}}))})),n}:Q(t))}(t,e);if(tt(t))return function(t,e){return new g(e?function(r){var n=new f;return n.add(e.schedule(function(){return t.then(function(t){n.add(e.schedule(function(){r.next(t),n.add(e.schedule(function(){return r.complete()}))}))},function(t){n.add(e.schedule(function(){return r.error(t)}))})})),n}:q(t))}(t,e);if(X(t))return U(t,e);if(function(t){return t&&"function"==typeof t[Z]}(t)||"string"==typeof t)return function(t,e){if(!t)throw new Error("Iterable cannot be null");return new g(e?function(r){var n,o=new f;return o.add(function(){n&&"function"==typeof n.return&&n.return()}),o.add(e.schedule(function(){n=t[Z](),o.add(e.schedule(function(){if(!r.closed){var t,e;try{var o=n.next();t=o.value,e=o.done}catch(t){return void r.error(t)}e?r.complete():(r.next(t),this.schedule())}}))})),o}:J(t))}(t,e)}throw new TypeError((null!==t&&typeof t||t)+" is not observable")}var ut=function(){function t(t,e){void 0===e&&(e=Number.POSITIVE_INFINITY),this.project=t,this.concurrent=e}return t.prototype.call=function(t,e){return e.subscribe(new ht(t,this.project,this.concurrent))},t}(),ht=function(t){function e(e,r,n){void 0===n&&(n=Number.POSITIVE_INFINITY);var o=t.call(this,e)||this;return o.project=r,o.concurrent=n,o.hasCompleted=!1,o.buffer=[],o.active=0,o.index=0,o}return n(e,t),e.prototype._next=function(t){this.active<this.concurrent?this._tryNext(t):this.buffer.push(t)},e.prototype._tryNext=function(t){var e,r=this.index++;try{e=this.project(t,r)}catch(t){return void this.destination.error(t)}this.active++,this._innerSub(e,t,r)},e.prototype._innerSub=function(t,e,r){var n=new K(this,void 0,void 0);this.destination.add(n),rt(this,t,e,r,n)},e.prototype._complete=function(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()},e.prototype.notifyNext=function(t,e,r,n,o){this.destination.next(e)},e.prototype.notifyComplete=function(t){var e=this.buffer;this.remove(t),this.active--,e.length>0?this._next(e.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()},e}(z);function at(t){return void 0===t&&(t=Number.POSITIVE_INFINITY),function t(e,r,n){return void 0===n&&(n=Number.POSITIVE_INFINITY),"function"==typeof r?function(o){return o.pipe(t(function(t,n){return ct(e(t,n)).pipe(L(function(e,o){return r(t,e,n,o)}))},n))}:("number"==typeof r&&(n=r),function(t){return t.lift(new ut(e,n))})}(Y,t)}var pt=new g(w),lt=function(){function t(t){this.selector=t}return t.prototype.call=function(t,e){return e.subscribe(new ft(t,this.selector,this.caught))},t}(),ft=function(t){function e(e,r,n){var o=t.call(this,e)||this;return o.selector=r,o.caught=n,o}return n(e,t),e.prototype.error=function(e){if(!this.isStopped){var r=void 0;try{r=this.selector(e,this.caught)}catch(e){return void t.prototype.error.call(this,e)}this._unsubscribeAndRecycle();var n=new K(this,void 0,void 0);this.add(n),rt(this,r,void 0,void 0,n)}},e}(z);function bt(t,e){return function(r){return r.lift(new dt(t,e))}}var dt=function(){function t(t,e){this.compare=t,this.keySelector=e}return t.prototype.call=function(t,e){return e.subscribe(new yt(t,this.compare,this.keySelector))},t}(),yt=function(t){function e(e,r,n){var o=t.call(this,e)||this;return o.keySelector=n,o.hasKey=!1,"function"==typeof r&&(o.compare=r),o}return n(e,t),e.prototype.compare=function(t,e){return t===e},e.prototype._next=function(t){var e;try{var r=this.keySelector;e=r?r(t):t}catch(t){return this.destination.error(t)}var n=!1;if(this.hasKey)try{n=(0,this.compare)(this.key,e)}catch(t){return this.destination.error(t)}else this.hasKey=!0;n||(this.key=e,this.destination.next(t))},e}(y);function vt(t,e){return function(r){return r.lift(new _t(t,e))}}var _t=function(){function t(t,e){this.predicate=t,this.thisArg=e}return t.prototype.call=function(t,e){return e.subscribe(new wt(t,this.predicate,this.thisArg))},t}(),wt=function(t){function e(e,r,n){var o=t.call(this,e)||this;return o.predicate=r,o.thisArg=n,o.count=0,o}return n(e,t),e.prototype._next=function(t){var e;try{e=this.predicate.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}e&&this.destination.next(t)},e}(y),gt=function(){function t(t,e,r){this.nextOrObserver=t,this.error=e,this.complete=r}return t.prototype.call=function(t,e){return e.subscribe(new mt(t,this.nextOrObserver,this.error,this.complete))},t}(),mt=function(t){function e(e,r,n,i){var s=t.call(this,e)||this;return s._tapNext=w,s._tapError=w,s._tapComplete=w,s._tapError=n||w,s._tapComplete=i||w,o(r)?(s._context=s,s._tapNext=r):r&&(s._context=r,s._tapNext=r.next||w,s._tapError=r.error||w,s._tapComplete=r.complete||w),s}return n(e,t),e.prototype._next=function(t){try{this._tapNext.call(this._context,t)}catch(t){return void this.destination.error(t)}this.destination.next(t)},e.prototype._error=function(t){try{this._tapError.call(this._context,t)}catch(t){return void this.destination.error(t)}this.destination.error(t)},e.prototype._complete=function(){try{this._tapComplete.call(this._context)}catch(t){return void this.destination.error(t)}return this.destination.complete()},e}(y);function St(){return new T}function xt(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return function(e){var r=t[t.length-1];H(r)?t.pop():r=null;var n=t.length;return function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return at(1)(W.apply(void 0,t))}(1!==n||r?n>0?U(t,r):M(r):V(t[0]),e)}}function Et(t,e){return"function"==typeof e?function(r){return r.pipe(Et(function(r,n){return ct(t(r,n)).pipe(L(function(t,o){return e(r,t,n,o)}))}))}:function(e){return e.lift(new jt(t))}}var jt=function(){function t(t){this.project=t}return t.prototype.call=function(t,e){return e.subscribe(new Tt(t,this.project))},t}(),Tt=function(t){function e(e,r){var n=t.call(this,e)||this;return n.project=r,n.index=0,n}return n(e,t),e.prototype._next=function(t){var e,r=this.index++;try{e=this.project(t,r)}catch(t){return void this.destination.error(t)}this._innerSub(e,t,r)},e.prototype._innerSub=function(t,e,r){var n=this.innerSubscription;n&&n.unsubscribe();var o=new K(this,void 0,void 0);this.destination.add(o),this.innerSubscription=rt(this,t,e,r,o)},e.prototype._complete=function(){var e=this.innerSubscription;e&&!e.closed||t.prototype._complete.call(this),this.unsubscribe()},e.prototype._unsubscribe=function(){this.innerSubscription=null},e.prototype.notifyComplete=function(e){this.destination.remove(e),this.innerSubscription=null,this.isStopped&&t.prototype._complete.call(this)},e.prototype.notifyNext=function(t,e,r,n,o){this.destination.next(e)},e}(z),It=function(t){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];return t},Ot=/(\S+)(?:\s+(?:(-?\d+(?:\.\d+)?)([a-zA-Z]*)))?\s*(?:,|$)/g,Ct=function(){function t(t){It(t.length>0,"Srcset must have at least one source"),this.sources_=t;for(var e=!1,r=!1,n=0;n<t.length;n++){var o=t[n];e=e||!!o.width,r=r||!!o.dpr}t.sort(e?Pt:At),this.widthBased_=e}return t.prototype.select=function(t,e){var r;return r=this.widthBased_?this.selectByWidth_(t*e):this.selectByDpr_(e),this.sources_[r].url},t.prototype.selectByWidth_=function(t){for(var e=this.sources_,r=0,n=1/0,o=1/0,i=0;i<e.length;i++){var s=e[i].width,c=Math.abs(s-t);if(!(c<=1.1*n||t/o>1.2))break;r=i,n=c,o=s}return r},t.prototype.selectByDpr_=function(t){for(var e=this.sources_,r=0,n=1/0,o=0;o<e.length;o++){var i=Math.abs(e[o].dpr-t);if(!(i<=n))break;r=o,n=i}return r},t.prototype.getUrls=function(){return this.sources_.map(function(t){return t.url})},t.prototype.stringify=function(t){for(var e=[],r=this.sources_,n=0;n<r.length;n++){var o=r[n],i=o.url;t&&(i=t(i)),e.push(i+=this.widthBased_?" "+o.width+"w":" "+o.dpr+"x")}return e.join(", ")},t}();function Pt(t,e){return It(t.width!=e.width,"Duplicate width: %s",t.width),t.width-e.width}function At(t,e){return It(t.dpr!=e.dpr,"Duplicate dpr: %s",t.dpr),t.dpr-e.dpr}var Nt=function(){function t(){this.w=0,this.h=0,this.strategy="cache",this.loadImage$=new T,this.cache=new Map,this.url=null,this.visibility="hidden"}return t.prototype.setRoot=function(t){this.root$.next(t)},t.prototype.setRootMargin=function(t){this.rootMargin$.next(t)},t.prototype.setW=function(t){this.w$.next(t)},t.prototype.setH=function(t){this.h$.next(t)},t.prototype.setSrc=function(t){this.src$.next(t)},t.prototype.setSrcset=function(t){this.srcset$.next(t)},t.prototype.getIsIntersecting=function(){var t=this;return ot(this.root$,this.rootMargin$).pipe(Et(function(e){var r,n,o=e[1];return"IntersectionObserver"in window?(r=t.el,n={root:document.querySelector(e[0]),rootMargin:o},g.create(function(t){var e=new IntersectionObserver(function(e){return e.forEach(function(e){return t.next(e)})},n);return e.observe(r),function(){e.unobserve(r)}})):W({isIntersecting:!0})}),L(function(t){return t.isIntersecting}))},t.prototype.getContentWidth=function(){return"ResizeObserver"in window?(t=this.el,g.create(function(e){var r=new window.ResizeObserver(function(t){return t.forEach(function(t){return e.next(t)})});return r.observe(t),function(){r.unobserve(t)}})).pipe(L(function(t){return t.contentRect.width}),xt(this.el.clientWidth)):pt;var t},t.prototype.componentWillLoad=function(){var t=this;this.connected$=new $(!0),this.root$=new $(this.root),this.rootMargin$=new $(this.rootMargin),this.w$=new $(this.w),this.h$=new $(this.h),this.src$=new $(this.src),this.srcset$=new $(this.srcset);var e=this.getContentWidth();ot(e,this.w$,this.h$).subscribe(function(e){var r=e[1],n=e[2];t.contentWidth=e[0],t.renderWidth=r,t.renderHeight=n});var r=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=Number.POSITIVE_INFINITY,n=null,o=t[t.length-1];return H(o)?(n=t.pop(),t.length>1&&"number"==typeof t[t.length-1]&&(r=t.pop())):"number"==typeof o&&(r=t.pop()),null===n&&1===t.length&&t[0]instanceof g?t[0]:at(r)(U(t,n))}(this.getIsIntersecting(),this.loadImage$).pipe(function(t){return O()((e=St,function(t){var r;r="function"==typeof e?e:function(){return e};var n=Object.create(t,N);return n.source=t,n.subjectFactory=r,n})(t));var e});r.pipe(vt(function(t){return!!t}),bt()).subscribe(function(){return t.triggered(r,e)})},t.prototype.triggered=function(t,e){var r,n=this,o=ot(this.src$,this.srcset$).pipe(vt(function(t){return null!=t[0]||null!=t[1]}),bt(function(t,e){return t[0]===e[0]&&t[1]===e[1]}),L(function(t){var e=t[0],r=t[1];return r?function(t){for(var e,r=[];e=Ot.exec(t);){var n=e[1],o=void 0,i=void 0;if(e[2]){var s=e[3].toLowerCase();if("w"==s)o=parseInt(e[2],10);else{if("x"!=s)continue;i=parseFloat(e[2])}}else i=1;r.push({url:n,width:o,dpr:i})}return new Ct(r)}(r):function(t){return new Ct([{url:t,width:void 0,dpr:1}])}(e)})),i=ot(e,o).pipe(L(function(t){return n.selectSrcsetURL.apply(n,t)}),("href",bt(function(t,e){return t.href===e.href}))),s=t.pipe(xt(!0));ot(i,s).pipe(Et(function(t){return n.fetchImage.apply(n,t)}),(r=function(){return i},function(t){var e=new lt(r),n=t.lift(e);return e.caught=n})).subscribe(function(t){n.url=t})},t.prototype.selectSrcsetURL=function(t,e){var r=window.devicePixelRatio||1,n=e.select(t||window.screen.width,r);return new URL(n,window.location.href)},t.prototype.cacheStrategy=function(t){switch(this.strategy){case"blob":return t.pipe(Et(function(t){return t.blob()}),L(function(t){return URL.createObjectURL(t)}));case"cache":default:return t.pipe(L(function(t){return t.url}))}},t.prototype.fetchImage=function(t,e){var r,n,o,i,s,c=t.href,u=this.cache;if(e&&!u.has(c)){var h=(n=c,o={method:"GET",headers:{Accept:"image/*"},mode:(i=t,void 0===s&&(s=window.location),i.protocol!==s.protocol||i.host!==s.host?"cors":void 0)},g.create(function(t){var e=new AbortController,r=null;return fetch(n,Object.assign({},o,{signal:e.signal})).then(function(e){r=e,t.next(e),t.complete()}).catch(function(e){return t.error(e)}),function(){r||e.abort()}}));return this.cacheStrategy(h).pipe((r=function(t){return u.set(c,t)},function(t){return t.lift(new gt(r,void 0,void 0))}))}return u.has(c)?W(u.get(c)):pt},t.prototype.render=function(){var t=this;return[e("div",{class:"sizer",style:this.calcSizerStyle()},e("slot",{name:"loading"}),this.url?e("img",{src:this.url,style:this.calcImageStyle(),alt:this.alt,decoding:this.decoding,useMap:this.useMap,onLoad:function(){return t.visibility="visible"}}):null)]},t.prototype.calcImageStyle=function(){return{visibility:this.visibility}},t.prototype.calcSizerStyle=function(){var t=this.renderWidth,e=this.renderHeight,r={};return 0!==t&&0!==e?t>=this.contentWidth?(r.width="100%",r.paddingTop=e/t*100+"%"):(r.width=t+"px",r.height=e+"px"):0!==e?(r.width="",r.height=e+"px"):(r.width="",r.height=""),r},t.prototype.componentDidUnload=function(){this.connected$.next(!1),this.cache&&this.cache.forEach(function(t){URL.revokeObjectURL(t)})},t.prototype.loadImage=function(){this.loadImage$.next(!0)},Object.defineProperty(t,"is",{get:function(){return"hy-img"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"encapsulation",{get:function(){return"shadow"},enumerable:!0,configurable:!0}),Object.defineProperty(t,"properties",{get:function(){return{alt:{type:String,attr:"alt",reflectToAttr:!0,mutable:!0},contentWidth:{state:!0},decoding:{type:String,attr:"decoding",reflectToAttr:!0,mutable:!0},el:{elementRef:!0},h:{type:Number,attr:"h",reflectToAttr:!0,mutable:!0,watchCallbacks:["setH"]},loadImage:{method:!0},renderHeight:{state:!0},renderWidth:{state:!0},root:{type:String,attr:"root",reflectToAttr:!0,mutable:!0,watchCallbacks:["setRoot"]},rootMargin:{type:String,attr:"root-margin",reflectToAttr:!0,mutable:!0,watchCallbacks:["setRootMargin"]},src:{type:String,attr:"src",reflectToAttr:!0,mutable:!0,watchCallbacks:["setSrc"]},srcset:{type:String,attr:"srcset",reflectToAttr:!0,mutable:!0,watchCallbacks:["setSrcset"]},strategy:{type:String,attr:"strategy",reflectToAttr:!0,mutable:!0},url:{state:!0},useMap:{type:String,attr:"usemap",reflectToAttr:!0,mutable:!0},visibility:{state:!0},w:{type:Number,attr:"w",reflectToAttr:!0,mutable:!0,watchCallbacks:["setW"]}}},enumerable:!0,configurable:!0}),Object.defineProperty(t,"style",{get:function(){return".sizer.sc-hy-img{position:relative}img.sc-hy-img{position:absolute;top:0;left:0;max-width:100%;max-height:100%}"},enumerable:!0,configurable:!0}),t}();t.HyImg=Nt,Object.defineProperty(t,"__esModule",{value:!0})});