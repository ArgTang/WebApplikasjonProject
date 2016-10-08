"use strict";

define( [
        "ko",
        "dom",
        "utils",
        "./textinput.vmcomponent"
    ], function ( knockout, $, utils, TextInput ) {

        /**
         * Button with {@link vmcomponents.TextInput|text input} component
         * @memberof vmcomponents
         * @param {Object} options The options parameters for the component
         * @param {observable} [options.srcRight=""] Button icon source
         * @param {Function} [options.onClick=null] Button on click callback handler
         * @param {boolean} [options.disabledButton=false] Button is disabled
         * @param {string} [options.titleButton=null] Button title
         * @see {@link vmcomponents.TextInput|Inherits from TextInput}
         * @constructor
         */
        function ButtonTextInput( options ) {

            var self = this;

            utils.merge( self, new TextInput( utils.merge( {
                srcRight: knockout.observable( '' ),
                onClick: null,
                disabledButton: false,
                titleButton: null
            }, options ) ) );

            /**
             * Set focus on the button
             */
            this.focusButton = function () {
                if ( this.fragment ) {
                    var $button = $( "button.input_button", this.fragment.parentElement ).element();
                    $button.focus();
                }
            };

        }

        return ButtonTextInput;

    }
);