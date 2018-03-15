# src / mixin / script-hack.js
Copyright (c) 2018 Florian Klampfer <https://qwtel.com/>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


```js

import { Observable } from 'rxjs/_esm5/Observable';
```

Importing the subset of RxJS functions that we are going to use.


```js
import { from } from 'rxjs/_esm5/observable/from';
import { of } from 'rxjs/_esm5/observable/of';

import { catchError } from 'rxjs/_esm5/operators/catchError';
import { tap } from 'rxjs/_esm5/operators/tap';
import { concatMap } from 'rxjs/_esm5/operators/concatMap';
```

For convenience....


```js
const assign = Object.assign.bind(Object);
```

### Experimental script feature
TODO

This function removes all script tags (as query'ed by `scriptSelector`) from the response.


```js
export function tempRemoveScriptTags(replaceEls) {
  const scripts = [];

  replaceEls.forEach(docfrag =>
    Array.from(docfrag.querySelectorAll(this.scriptSelector)).forEach((script) => {
      const pair = [script, script.previousSibling];
      script.parentNode.removeChild(script);
      scripts.push(pair);
    }));

  return scripts;
}
```

Attempts to (synchronously) insert a `script` tag into the DOM, *before* a given `ref` element.


```js
function insertScript([script, ref]) {
```

Temporarily overwrite `document.wirte` to simulate its behavior during the initial load.
This only works because scripts are inserted one-at-a-time (via `concatMap`).


```js
  const originalWrite = document.write;

  document.write = (...args) => {
    const temp = document.createElement('div');
    temp.innerHTML = args.join();
    Array.from(temp.childNodes).forEach((node) => {
      ref.parentNode.insertBefore(node, ref.nextSibling);
    });
  };
```

If the script tag needs to fetch its source code, we insert it into the DOM,
but we return an observable that only completes once the script has fired its `load` event.


```js
  return script.src !== '' ?
    Observable.create((observer) => {
      script.addEventListener('load', (x) => {
        document.write = originalWrite;
        observer.complete(x);
      });

      script.addEventListener('error', (x) => {
        document.write = originalWrite;
        observer.error(x);
      });

      ref.parentNode.insertBefore(script, ref.nextSibling);
    }) :
```

Otherwise we insert it into the DOM and reset the `document.write` function.


```js
    of({}).pipe(tap(() => {
      ref.parentNode.insertBefore(script, ref.nextSibling);
      document.write = originalWrite;
    }));
}
```

Takes a list of `script`--`ref` pairs, and inserts them into the DOM one-by-one.


```js
export function reinsertScriptTags(context) {
  if (!this.scriptSelector) return of(context);

  const { scripts } = context;

  return from(scripts).pipe(
    concatMap(insertScript),
    catchError((error) => { throw assign(context, { error }); }),
  )
    .toPromise()
    .then(() => context);
}
```


