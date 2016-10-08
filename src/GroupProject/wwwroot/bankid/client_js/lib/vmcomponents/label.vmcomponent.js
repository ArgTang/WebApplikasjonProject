"use strict";

define( [
    "utils",
    "ko"
], function ( utils, knockout ) {

    /**
     * Label component
     * @param {Object} options The options parameters for the component
     * @param {String} [options.id=""] Label id
     * @param {String} [options.text=""] Label text
     * @param {observable} [options.isHidden=false] Label is hidden observable
     * @memberof vmcomponents
     * @constructor
     */
    function Label( options ) {

        var self = this;

        utils.merge( self, {
            id: "",
            text: "",
            isHidden: knockout.observable( false )
        }, options );

    }

    return Label;

} );