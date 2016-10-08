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
     * @param {String} options.content
     * @param {observable} options.isViewDisabled
     * @constructor
     */
    function XmlDocumentBody( options ) {

        var self = this;

        utils.merge( self, {
            content: options.content,
            type: 'xml',
            noFooter: false,
            styleScale: '',
            isViewDisabled: null
        }, options );

        self.tabIndex = knockout.computed( function () {
            return self.isViewDisabled() ? null : constants.DOCUMENT_XML_TABINDEX;
        } );

        /**
         * Set focus on XML iframe
         */
        self.focus = function () {
            var $iframe = $( "iframe", self.fragment ).element();
            if ( $iframe && !utils.isTouchDevice() && !self.isViewDisabled() ) {
                $iframe.focus();
            }
        };

    }

    return XmlDocumentBody;

} );