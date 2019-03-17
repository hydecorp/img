/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Extracts `srcset` and fallbacks to `src` if not available.
 * @param {!Element} element
 * @return {!Srcset}
 */
export declare function srcsetFromElement(element: any): Srcset;
/**
 * Creates a Srcset from a `src` attribute value.
 * @param {string} src
 * @return {!Srcset}
 */
export declare function srcsetFromSrc(src: any): Srcset;
/**
 * Parses the text representation of srcset into Srcset object.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes.
 * See http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-img-srcset.
 * @param {string} s
 * @return {!Srcset}
 */
export declare function parseSrcset(s: any): Srcset;
/**
 * A srcset object contains one or more sources.
 *
 * There are two types of sources: width-based and DPR-based. Only one type
 * of sources allowed to be specified within a single srcset. Depending on a
 * usecase, the components are free to choose any source that best corresponds
 * to the required rendering quality and network and CPU conditions. See
 * "select" method for details on how this selection is performed.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes
 */
export declare class Srcset {
    /**
     * @param {!Array<!SrcsetSourceDef>} sources
     */
    constructor(sources: any);
    /**
     * Performs selection for specified width and DPR. Here, width is the width
     * in screen pixels and DPR is the device-pixel-ratio or pixel density of
     * the device. Depending on the circumstances, such as low network conditions,
     * it's possible to manipulate the result of this method by passing a lower
     * DPR value.
     *
     * The source selection depends on whether this is width-based or DPR-based
     * srcset.
     *
     * In a width-based source, the source's width is the physical width of a
     * resource (e.g. an image). Depending on the provided DPR, this width is
     * converted to the screen pixels as following:
     *   pixelWidth = sourceWidth / DPR
     *
     * Then, the source closest to the requested "width" is selected using
     * the "pixelWidth". The slight preference is given to the bigger sources to
     * ensure the most optimal quality.
     *
     * In a DPR-based source, the source's DPR is used to return the source that
     * is closest to the requested DPR.
     *
     * Based on
     * http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-img-srcset.
     * @param {number} width
     * @param {number} dpr
     * @return {string}
     */
    select(width: any, dpr: any): any;
    /**
     * @param {number} width
     * @return {number}
     * @private
     */
    selectByWidth_(width: any): number;
    /**
     * @param {number} dpr
     * @return {number}
     * @private
     */
    selectByDpr_(dpr: any): number;
    /**
     * Returns all URLs in the srcset.
     * @return {!Array<string>}
     */
    getUrls(): any;
    /**
     * Reconstructs the string expression for this srcset.
     * @param {function(string):string=} opt_mapper
     * @return {string}
     */
    stringify(opt_mapper: any): string;
}
