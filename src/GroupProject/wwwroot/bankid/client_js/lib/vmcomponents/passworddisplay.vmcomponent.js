"use strict";

define( [
        "ko",
        "dom",
        "lib/global",
        "utils",
        "templateGenerator",
        "lib/constants",
        "./dialog.vmcomponent",
        "./textcontent.vmcomponent",
        "./button.vmcomponent"
    ], function ( knockout, $, global, utils, templateGenerator, constants, Dialog, TextContent, Button ) {

        /**
         * View model for password display
         * @memberof vmcomponents
         * @constructor
         * @param {Array} arrStr The different labels for the button.
         * @param {Array} arrShowPswStr
         * @param {Array|Function} input Input viewmodel(s).
         * @param {Object} [options] Options parameters
         * @param {observable} [options.isViewDisabled] Is view disabled observable
         * @param {Function} [options.onHide] On password hide callback
         * @return {Object} self
         */
        function PasswordDisplay( arrStr, arrShowPswStr, input, options ) {
            options = options || {};

            // ------------------------------------------------------------------
            // VARIABLES
            // ------------------------------------------------------------------

            var self = this;
            var resetTimer;
            /**
             * @type {observable}
             * @private
             */
            var active_ = knockout.observable( false );
            /**
             * Temp. password display document fragment
             * @type {Object}
             * @private
             */
            var tplDisplay = {};
            /**
             * Is in edit mode
             * @type {boolean}
             * @private
             */
            var isEditMode_ = false;
            /**
             * Dialog header id
             * @type {string}
             * @private
             */
            var headerId = utils.getRandomKey();
            /**
             * Text content to contain password and placed inside dialog
             * @private
             */
            var textContent = createTextContent();
            /**
             * Password dialog
             * @private
             */
            var passwordDialog = createPasswordDialog();

            self.tabIndex = constants.PASSWORD_DISPLAY_BUTTON_TABINDEX;
            /**
             * @type {Array}
             */
            self.inputs = utils.isArray( input ) ? input : [input];
            /**
             * @memberof vmcomponents.PasswordDisplay
             * @type {Observable}
             */
            self.text = knockout.observable( arrStr[0] );
            /**
             * @memberof vmcomponents.PasswordDisplay
             * @type {Observable}
             */
            self.shortText = knockout.observable( arrShowPswStr[0] );
            /**
             * Click handler
             * @type {Function}
             */
            self.onClick = function () {
                self.toggle();
            };
            /**
             * @type {*}
             */
            self.disabled = knockout.computed( function () {
                var active = false;
                utils.each( self.inputs, function ( input ) {
                    active = active || input.val().length > 0;
                } );
                return options.isViewDisabled ? !active || options.isViewDisabled() : !active;
            } );
            /**
             * @type {*}
             */
            self.visible = knockout.computed( function () {
                var active = false;
                utils.each( self.inputs, function ( input ) {
                    active = active || input.val().length > 0;
                } );
                return active;
            } );

            // ------------------------------------------------------------------
            // FUNCTIONS
            // ------------------------------------------------------------------

            /**
             * Focus password button
             */
            self.focus = function () {
                if ( self.fragment ) {
                    var element = $( "button", self.fragment ).element();
                    if ( element ) {
                        element.focus();
                    }
                }
            };

            /**
             * Toggle show/hide of Password Display
             * @param {boolean} [active] Set password display to active/not active
             * @param {number} [inputIndex] Input index to set focus on when hiding
             * @param {boolean} [skipFocus] We do not try to set focus if this is true
             */
            self.toggle = function ( active, inputIndex, skipFocus ) {
                active_( typeof active === "boolean" ? active : !active_() );

                if ( active_() ) {
                    doShow( skipFocus );
                }
                else {
                    doHide( inputIndex, false, skipFocus );
                }
            };

            /**
             * Hide dialog if it is visible.
             * @param {number} [inputIndex] Input index to set focus on
             * @param {boolean} [isEditMode] True if still in edit mode
             */
            function doHide( inputIndex, isEditMode, skipFocus ) {

                if ( !isEditMode ) {

                    // set text and short text
                    self.text( arrStr[0] );
                    self.shortText( arrShowPswStr[0] );

                    active_( false );

                    // set input type and unbind keydown
                    self.inputs.forEach( function ( input ) {
                        input.type( "password" );
                        $( "input", input.fragment ).unbind( "keydown", resetTimeout );
                    } );

                    clearTimeout( resetTimer );

                    isEditMode_ = false;

                }
                else {
                    resetTimeout();
                }

                // hide dialog, if shown
                if ( passwordDialog.isOpen() ) {
                    passwordDialog.doClose();
                }

                // reset dialog content text content
                textContent.body( null );

                // call on hide callback
                if ( options.onHide ) {
                    options.onHide();
                }

                // focus index
                if ( !skipFocus ) {
                    self.inputs[inputIndex || 0].focus();
                }

            }

            /**
             * Show password. Show dialog if password is overriding input field.
             */
            function doShow( skipFocus ) {

                var showDialog = false;

                // set text and short text
                self.text( arrStr[1] );
                self.shortText( arrShowPswStr[1] );

                // clear text content body
                textContent.body( null );

                utils.each( self.inputs, function ( input, i ) {

                    // generate password display template
                    tplDisplay[i] = templateGenerator( {
                        tmpl: {
                            file: 'form',
                            id: 'passwordDisplay'
                        },
                        mod: {
                            title: (utils.isArray( options.title ) ? options.title[i] : options.title),
                            text: input.val(),
                            onClick: function () {
                                self.toggle( false, i );
                            }
                        }
                    } );

                    // append template to topNode
                    $( global.topNode ).append( tplDisplay[i] );
                    var $input = $( ".wrp input", input.fragment ).element(),
                        inputWidth = 0,
                        displayWidth = 0;

                    if ( $input ) {
                        inputWidth = $input.offsetWidth;
                        displayWidth = tplDisplay[i].offsetWidth;
                    }

                    // is the height of the display bigger than its container?
                    showDialog = showDialog || displayWidth > inputWidth;

                    // remove template from container
                    $( tplDisplay[i] ).remove();

                    // set input type to text
                    input.type( "text" );

                    // reset timeout on keydown
                    $( "input", input.fragment ).bind( "keydown", resetTimeout );

                } );

                // show dialog
                if ( showDialog ) {

                    // each dialog template
                    utils.each( tplDisplay, function ( tplDisplay_ ) {
                        // add template display to text content
                        textContent.body( tplDisplay_ );
                    } );

                    // show dialog
                    passwordDialog.doOpen();

                    // set max height in dialog body
                    $( ".body", passwordDialog.fragment ).css( "max-height", (document.body.offsetHeight - 90) + "px" );

                }
                else {
                    if ( !skipFocus ) {
                        self.inputs[0].focus();
                    }
                }

                // reset timeout
                resetTimeout();

            }

            /**
             * Reset timeout
             * @private
             */
            function resetTimeout() {

                // stop any previous timer
                clearTimeout( resetTimer );

                // start a new timer
                resetTimer = setTimeout( function () {
                    self.toggle( false );
                }, options.timeout || 5000 );

            }

            function createPasswordDialog() {
                return new Dialog( {
                    closeButton: true,
                    content: textContent.fragment,
                    onClosedDialog: function () {
                        // hide password if not in edit mode
                        if ( !isEditMode_ ) {
                            self.toggle( false );
                        }
                    },
                    closeButtonTitle: options.closeButtonTitle,
                    closeButtonLabel: options.closeButtonLabel,
                    id: headerId,
                    isViewDisabled: options.isViewDisabled
                } );
            }

            function createTextContent() {
                return new TextContent( {
                    type: "password_display",
                    header: options.headerText,
                    footer: templateGenerator( {
                        tmpl: {
                            file: 'btn',
                            id: 'button'
                        },
                        mod: new Button( {
                            text: options.buttonEditPassword,
                            type: "edit_password",
                            onClick: function () {
                                isEditMode_ = true;
                                // hide dialog
                                doHide( 0, true );
                            },
                            tabIndex: constants.EDIT_PASSWORD_DIALOG_TABINDEX
                        } )
                    } ),
                    id: headerId
                } );
            }

            return self;

        }

        return PasswordDisplay;

    }
);