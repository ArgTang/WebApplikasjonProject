"use strict";

define( [
        "ko",
        "dom",
        "gfx",
        "utils",
        "templateGenerator",
        "lib/constants",
        "lib/knockout_utils",
        "./common.vmcomponent"
    ], function ( knockout, $, gfx, utils, templateGenerator, constants, knockoutUtils, commonVmComponents ) {

        /**
         * Creates a info bubble. Use {@link vmcomponents.InfoBubble.doShow} to display the bubble relative to a target.
         * @memberof vmcomponents
         * @constructor
         * @param {Object} [options] The options parameters for the info bubble
         * @param {observable|String} [options.text] Info bubble text observable
         * @param {Object} [options.position] Info bubble position {x:top|bottom}
         * @param {Object} [options.type] Info bubble type
         * @param {TextInput} [options.nextFocus]
         */
        function InfoBubble( options ) {

            // ------------------------------------------------------------------
            // VARIABLES
            // ------------------------------------------------------------------

            var self = this,
                targetHasBubbleClass = "has_bubble",
                $target_ = null,
                $bubble_ = null;

            // merge config parameters with the default values
            utils.merge( self, {
                text: knockout.observable( "" ),
                position: {x: "top"},
                type: null,
                icon: {
                    src: gfx.getB64( "ico_warning" )
                },
                tabIndex: constants.INFO_BUBBLE_TABINDEX,
                nextFocus: null
            }, options );

            /**
             * Is open observable
             * @type {observable}
             */
            self.isOpen = knockout.observable( false );

            // ------------------------------------------------------------------
            // FUNCTIONS
            // ------------------------------------------------------------------

            /**
             * Returns a space separated string with positions. Ie. "left top".
             * @returns {string}
             */
            this.getPosition = function () {
                return utils.objectToArray( self.position ).join( " " );
            };

            /**
             * @param event Keyboard event
             * @returns {boolean} True if event is ESC or TAB key
             * @private
             */
            function shouldRemoveFromKeyboard( event ) {
                var isEscKey = event.which === constants.ESC_KEY;
                var isTabKey = event.which === constants.TAB_KEY;

                return isEscKey || isTabKey;
            }

            /**
             * @param event
             * @private
             */
            function onGlobalKeyUp( event ) {
                if ( shouldRemoveFromKeyboard( event ) ) {
                    self.doRemove();
                }
            }

            /**
             * @param event
             * @private
             */
            function onGlobalKeyDown( event ) {
                var isTabKey = event.which === constants.TAB_KEY;

                if ( event.type === "keydown" && self.nextFocus ) {
                    if ( !isTabKey ) {
                        self.nextFocus.focus( true );
                    }

                    doUnbindGlobalKeyDown();
                }
            }

            /**
             * @private
             */
            function onGlobalClick() {
                self.doRemove();
            }

            /**
             * @private
             */
            function createBubbleTemplate() {
                return templateGenerator( {
                    tmpl: {
                        file: 'popover',
                        id: 'infoBubble'
                    },
                    mod: self
                } );
            }

            /**
             * Shows and positions the bubble. Also binds events.
             * @param {lib.DomHelper} $target The bubble is positioned relative to this wrapper element.
             * @param {String} [text] Info bubble text
             * @param {Object} [position] Info bubble position
             */
            this.doShow = function ( $target, text, position ) {

                // close if already open
                if ( self.isOpen() ) {
                    self.doRemove();
                }

                self.isOpen( true );

                if ( text ) {
                    self.text( text );
                }

                if ( !$target ) {
                    return;
                }

                $target_ = $target;

                // set position
                utils.merge( true, self.position, position );

                // build bubble fragment
                $bubble_ = $( createBubbleTemplate() );

                // append/prepend bubble fragment to target
                if ( self.position.x === "bottom" ) {
                    $target_.append( $bubble_ );
                } else {
                    $target_.prepend( $bubble_ );
                }

                // make sure click events are NOT listened to until timer completes
                setTimeout( function () {
                    var $body = $( "body" );

                    // any click to document should close the popover
                    $body.bind( "click", onGlobalClick );

                    // bind key to body
                    $body.bind( "keyup", onGlobalKeyUp );
                    $body.bind( "keydown", onGlobalKeyDown );
                }, 10 );

                commonVmComponents.callAfterAnimation( function () {
                    // update dom tree so all browsers notices the opened info bubble
                    commonVmComponents.updateDomTree();

                    // set focus to info bubble
                    self.focus();
                }, commonVmComponents.animationDuration.infoBubbleOpen );

            };

            /**
             * Removes the bubble and its bindings
             */
            this.doRemove = function () {

                if ( !self.isOpen() ) {
                    return;
                }

                var $body = $( "body" );
                $body.unbind( "click", onGlobalClick );
                $body.unbind( "keyup", onGlobalKeyUp );
                doUnbindGlobalKeyDown();

                if ( $target_ ) {
                    $target_.removeClass( targetHasBubbleClass );
                }

                // remove info bubble
                commonVmComponents.removeElementAfterAnimation( $bubble_, commonVmComponents.animationDuration.infoBubbleRemove );

                $target_ = null;
                $bubble_ = null;
                self.isOpen( false );

            };

            function doUnbindGlobalKeyDown() {
                $( "body" ).unbind( "keydown", onGlobalKeyDown );
            }

            /**
             * Set focus to bubble
             */
            this.focus = function () {
                var $infobuble = $( ".infobubble", self.fragment ).element();
                if ( $infobuble ) {
                    $infobuble.focus();
                }
            };

        }

        return InfoBubble;

    }
);