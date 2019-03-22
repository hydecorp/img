
// HyImg: Custom Elements Define Library, ES Module/es2017 Target

import { defineCustomElement } from './hy-img.core.js';
import { COMPONENTS } from './hy-img.components.js';

export function defineCustomElements(win, opts) {
  return defineCustomElement(win, COMPONENTS, opts);
}
