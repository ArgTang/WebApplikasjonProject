"use strict";

/**
 * Knockout observable
 * @typedef {Function} observable
 * @see {@link http://knockoutjs.com/documentation/observables.html|Knockout observable}
 */

/**
 * Knockout observable array
 * @typedef {Function} observableArray
 * @see {@link http://knockoutjs.com/documentation/observables.html|Knockout observable array}
 */

/**
 * Knockout computed
 * @typedef {Function} computed
 * @see {@link http://knockoutjs.com/documentation/computedObservables.html|Knockout computed}
 */

define( ["ko"], function ( knockout ) {

    var knockoutUtils = {};

    /**
     * @param {Function|*} value
     * @param {*} [def]
     * @returns {observable}
     */
    knockoutUtils.observable = function ( value, def ) {
        return typeof value === "function" ? value : knockout.observable( typeof value !== "undefined" ? value : def );
    };

    /**
     * @param {Function|*} value
     * @param {*} [def]
     * @returns {observableArray}
     */
    knockoutUtils.observableArray = function ( value, def ) {
        return typeof value === "function" ? value : knockout.observableArray( typeof value !== "undefined" ? value : def );
    };

    /**
     * @param {observable|*} par
     * @returns {*}
     */
    knockoutUtils.toValue = function ( par ) {
        return typeof par === "function" ? par() : par;
    };

    /**
     * @param {observable}
     * @returns {observable}
     */
    knockoutUtils.not = function ( observable ) {
        return knockout.computed( function () {
            return !observable();
        } );
    };

    return knockoutUtils;

} );