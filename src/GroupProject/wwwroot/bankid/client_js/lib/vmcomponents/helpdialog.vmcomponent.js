"use strict";

define( [
    "dom",
    "gfx",
    "utils",
    "lib/constants",
    "./dialog.vmcomponent",
    "./textcontent.vmcomponent",
    "ko"
], function ( $, gfx, utils, constants, Dialog, TextContent, knockout ) {

    /**
     * @memberof vmcomponents
     * @param {Object} [options] Help dialog options parameter
     * @param {Function} [options.onOpenHelpDialog] On help dialog open callback (before animation) Function()
     * @param {Function} [options.onOpenedHelpDialog] On help dialog opened callback (after animation) Function()
     * @param {Function} [options.onCloseHelpDialog] On help dialog close callback (before animation) Function(isCancel)
     * @param {Function} [options.onClosedHelpDialog] On help dialog closed callback (after animation) Function(isCancel)
     * @param {observable} [options.isViewDisabled] Is view disabled observable, disables view when dialog is open
     * @constructor
     */
    function HelpDialog( options ) {

        // ------------------------------------------------------------------
        // VARIABLES
        // ------------------------------------------------------------------

        var self = this;

        utils.merge( self, {
            title: null,
            header: null,
            text: null,
            src: gfx.getB64( 'help' ),
            svg: 'help',
            onClosHelpDialog: null,
            onClosedHelpDialog: null,
            onOpenHelpDialog: null,
            onOpenedHelpDialog: null,
            tabIndex: constants.HELP_BUTTON_TABINDEX,
            isViewDisabled: null
        }, options );

        /**
         * Help dialog header id
         * @type {string}
         * @private
         */
        var headerId = utils.getRandomKey();

        /**
         * Help text content component
         * @private
         */
        var textContentComponent = createTextContent();

        /**
         * Help dialog component
         * @private
         */
        var dialogComponent = createDialog();

        self.disabled = self.isViewDisabled || false;

        self.isExpanded = knockout.computed( function () {
            return dialogComponent.isOpen() ? "true" : "false";
        } );

        // ------------------------------------------------------------------
        // FUNCTIONS
        // ------------------------------------------------------------------

        function createTextContent() {
            return new TextContent( {
                header: self.header,
                text: self.text,
                type: 'help_dialog_content',
                id: headerId
            } );
        }

        function createDialog() {
            return new Dialog( {
                closeButton: true,
                build: {
                    tmpl: {
                        file: 'dialog',
                        id: 'txtContent'
                    },
                    mod: textContentComponent
                },
                onOpenDialog: onOpenDialog,
                onOpenedDialog: onOpenedDialog,
                onCloseDialog: onCloseDialog,
                onClosedDialog: onClosedDialog,
                closeButtonTitle: options.closeButtonTitle,
                closeButtonLabel: options.closeButtonLabel,
                isViewDisabled: self.isViewDisabled,
                id: headerId
            } );
        }

        function onOpenDialog() {

            if ( self.onOpenHelpDialog ) {
                self.onOpenHelpDialog();
            }

        }

        function onOpenedDialog() {

            // set max height for dialog content according to body height
            $( ".body", dialogComponent.fragment ).css( "max-height", (document.body.offsetHeight - 70) + "px" );

            if ( self.onOpenedHelpDialog ) {
                self.onOpenedHelpDialog();
            }

        }

        function onCloseDialog( isCancel ) {

            if ( self.onCloseHelpDialog ) {
                self.onCloseHelpDialog( isCancel );
            }

        }

        function onClosedDialog( isCancel ) {

            if ( self.onClosedHelpDialog ) {
                self.onClosedHelpDialog( isCancel );
            }

            // focus help button
            self.focus();

        }

        /**
         * On help button click
         */
        self.onClick = function () {
            dialogComponent.doOpen();
        };

        /**
         * Close help dialog
         */
        self.closeDialog = function () {
            dialogComponent.doClose();
        };

        /**
         * Sets focus to help button
         */
        self.focus = function () {
            if ( this.fragment && !utils.isTouchDevice() ) {
                var $button = $( "button[data-type=help]", this.fragment.parentNode ).element();
                if ( $button ) {
                    $button.focus();
                }
            }
        };

    }

    return HelpDialog;

} );