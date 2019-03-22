"use strict";
// HyImg: Custom Elements Define Library, ES Module/es5 Target
Object.defineProperty(exports, "__esModule", { value: true });
var hy_img_core_js_1 = require("./hy-img.core.js");
var hy_img_components_js_1 = require("./hy-img.components.js");
function defineCustomElements(win, opts) {
    return hy_img_core_js_1.defineCustomElement(win, hy_img_components_js_1.COMPONENTS, opts);
}
exports.defineCustomElements = defineCustomElements;
