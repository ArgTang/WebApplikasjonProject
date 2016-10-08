"use strict";

define( [
        "ko",
        "dom",
        "gfx",
        "utils"
    ], function ( knockout, $, gfx, utils ) {

        /**
         * Text input component
         * @param {Object} options The options parameters for the component
         * @param {String} [options.id=null] Input id
         * @param {observable} [options.err=false] Input error observable
         * @param {observable} [options.type=text] Input type
         * @param {String} [options.dataType=null] Input data type
         * @param {observable} [options.val=null] Input value observable
         * @param {observable} [options.maxlength=""] Input max length observable
         * @param {observable} [options.valueUpdate=keyup] Input value update, when to detect value change
         * @param {observable} [options.hasFocus=false] Input has focus observable
         * @param {observable} [options.placeholder=""] Input placeholder observable
         * @param {observable} [options.isHidden=false] Input is hidden observable, hides text input if true
         * @param {observable} [options.disabled=false] Input disabled observable
         * @param {observable} [options.title=false] Input title observable
         * @param {String} [options.pattern=null] Input pattern
         * @param {number} [options.max=null] Input max numeric value, if type is number
         * @param {number} [options.min=null] Input min numeric value, if type is number
         * @param {number} [options.step=null] Input step numeric value, if type is number
         * @param {observable} [options.isInvalid=false] Input is invalid observable
         * @memberOf vmcomponents
         * @constructor
         */
        function TextInput( options ) {

            var self = this;

            utils.merge( self, {
                id: null,
                err: knockout.observable( false ),
                type: knockout.observable( 'text' ),
                dataType: null,
                val: knockout.observable( '' ),
                maxlength: knockout.observable( '' ),
                valueUpdate: ['keyup', 'afterpaste', 'aftercut', 'afterkeydown', 'input'],
                hasFocus: knockout.observable( false ),
                placeholder: knockout.observable( '' ),
                isHidden: knockout.observable( false ),
                disabled: knockout.observable( false ),
                title: knockout.observable( '' ),
                pattern: null,
                max: null,
                min: null,
                step: null,
                isInvalid: knockout.observable( false ),
                label: null
            }, options );

            /**
             * Input field has value
             * @type {computed}
             */
            this.hasValue = knockout.computed( function () {
                return self.val().length > 0;
            } );

            this.onFocus = function () {
                self.hasFocus( true );
            };

            this.onBlur = function () {
                self.hasFocus( false );
            };

            /**
             * Set focus on the input field
             */
            this.focus = function ( dontMoveCaretToEnd ) {
                if ( this.fragment ) {
                    var $input = $( ".wrp input", this.fragment ).element();
                    if ( $input ) {
                        $input.focus();

                        // move caret to end
                        if ( !dontMoveCaretToEnd ) {
                            setTimeout( function () {
                                utils.moveCaretToEnd( $input );
                            }, 1 );
                        }
                    }
                }
            };

            this.blur = function () {
                if ( this.fragment ) {
                    var $input = $( "input", this.fragment ).element();
                    if ( $input ) {
                        $input.blur();
                    }
                }
            };

            /**
             * Hide input caret observable
             * @type {observable}
             */
            this.hideCaret = knockout.observable( false );

        }

        return TextInput;

    }
);