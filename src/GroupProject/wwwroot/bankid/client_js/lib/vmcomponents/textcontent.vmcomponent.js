"use strict";

define( [
    "dom",
    "utils",
    "templateGenerator",
    "lib/constants"
], function ( $, utils, templateGenerator, constants ) {

    /**
     * Text content.
     * @memberof vmcomponents
     * @constructor
     * @param {Object} [config]
     */
    function TextContent( config ) {

        // CONSTRUCTOR

        var self = this,
            _content = null;

        utils.merge( self, {
            header: null,
            footer: null,
            text: null,
            type: null,
            headerTabIndex: constants.HEADER_DIALOG_TABINDEX,
            tabIndex: constants.BODY_DIALOG_TABINDEX
        }, config );

        // generate template
        self.fragment = templateGenerator( {
            tmpl: {
                file: 'dialog',
                id: 'txtContent'
            },
            mod: self
        } );

        if ( self.footer ) {
            $( ".footer", self.fragment ).append( self.footer );
        }

        // /CONSTRUCTOR

        // BIND

        // /BIND

        // FUNCTIONS

        /**
         * Append content to body
         * @param {*} content
         */
        self.body = function ( content ) {
            if ( typeof content === "undefined" ) {
                return _content;
            }
            if ( content === null ) {
                $( ".body", self.fragment ).element().innerHTML = '';
            } else {
                _content = content;
                $( ".body", self.fragment ).append( content );
            }
        };

        // /FUNCTIONS

    }

    return TextContent;

} );