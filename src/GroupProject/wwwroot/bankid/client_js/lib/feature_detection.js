/**
 * Feature Detection
 * @name FeatureDetection
 * @exports features
 * @author Ståle Raknes, Knowit 2014
 * @version 0.1.1
 */

"use strict";

( function ( factory ) {
    if ( typeof requirejs === "function" && typeof define === "function" ) {
        define( factory );
    } else {
        window["bid_features"] = factory();
    }
}( function () {

    var features = {
        /**
         * True if the browser supports Cross Origin Resource Sharing (CORS)
         */
        cors: !!((window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest()) || window.XDomainRequest),
        /**
         * True if the browser supports Cross Document Messaging (XDM)
         */
        xdm: (typeof window.postMessage === "function"),
        /**
         * True if browser supports Scalable Vector Graphics (SVG)
         */
        svg: !!(document.implementation.hasFeature( "http://www.w3.org/TR/SVG11/feature#Image", "1.1" )),
        /**
         * True if browser supports Object.keys
         */
        objectKeys: !!(Object.keys),
        /**
         * True if browser supports document query selector and query selector all
         */
        querySelector: !!(document.querySelector && document.querySelectorAll),
        /**
         * True if browser supports native JSON handling (parse/stringify)
         */
        json: ( ("JSON" in window) && (typeof JSON.parse === "function") && (typeof JSON.stringify === "function")),
        /**
         * True if browser supports element.outerHTML
         */
        outerHtml: ( typeof ( document.createElement( "div" ) ).outerHTML === "string" ),
        /**
         * Check all features
         * @returns {Boolean}
         */
        checkAll: function () {
            var f = features;
            return ( f.cors && f.xdm && f.svg && f.objectKeys && f.querySelector && f.json && f.outerHtml );
        }
    };

    return features;

} ));