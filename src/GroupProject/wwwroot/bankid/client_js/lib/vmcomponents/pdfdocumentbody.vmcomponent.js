"use strict";

define( [
    "ko",
    "dom",
    "gfx",
    "utils",
    "lib/constants"
], function ( knockout, $, gfx, utils, constants ) {

    /**
     * @memberof vmcomponents
     * @param {Object} options
     * @param {observable} options.isViewDisabled
     * @param {String} options.title
     * @param {String} options.name
     * @param {Function} options.onClick
     * @constructor
     */
    function PdfDocumentBody( options ) {

        var self = this;

        utils.merge( self, {
            isDisabled: options.isViewDisabled,
            title: options.title,
            name: options.name,
            src: gfx.getB64( "pdf" ),
            onClick: options.onClick,
            type: 'pdf',
            isViewDisabled: null
        }, options );

        self.tabIndex = knockout.computed( function () {
            return self.isViewDisabled() ? null : constants.DOCUMENT_PDF_TABINDEX;
        } );

        /**
         * Set focus on PDF link
         */
        self.focus = function () {
            var $pdfLinkButton = $( '.link_wrapper button', this.fragment ).element();
            if ( $pdfLinkButton && !utils.isTouchDevice() && !self.isViewDisabled() ) {
                $pdfLinkButton.focus();
            }
        };

    }

    return PdfDocumentBody;

} );