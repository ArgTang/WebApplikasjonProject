"use strict";

define( [
    "utils"
], function ( utils ) {

    /**
     * @memberof vmcomponents
     * @param {Object} [options] The options parameters for the component
     * @param {String} [options.title] Button title
     * @param {String} [options.text] Button text
     * @param {Function} [options.onClick] Button text
     * @param {String} [options.type] Button data type
     * @constructor
     */
    function Button( options ) {
        var self = this;

        utils.merge( self, {
            title: null,
            text: null,
            onClick: null,
            type: null
        }, options );

    }

    return Button;

} );