"use strict";

define( [
    "ko",
    "dom",
    "utils",
    "lib/constants"
], function ( knockout, $, utils, constants ) {

    /**
     * @memberof vmcomponents
     * @param {Object} options
     * @param {observable} options.isViewDisabled
     * @param {String} options.content
     * @constructor
     */
    function TextDocumentBody( options ) {

        var self = this;

        utils.merge( self, {
            content: null,
            type: 'text',
            noFooter: false,
            percent: function () {
            },
            isViewDisabled: null
        }, options );

        self.tabIndex = knockout.computed( function () {
            return self.isViewDisabled() ? null : constants.TEXT_DOCUMENT_BODY_TABINDEX;
        } );

        /**
         * Set focs on document
         */
        self.focus = function () {
            var $inner = $( this.fragment ).parentUntil( ".inner" ).element();
            if ( $inner && !utils.isTouchDevice() && !self.isViewDisabled() ) {
                $inner.focus();
            }
        };

    }

    return TextDocumentBody;

} );