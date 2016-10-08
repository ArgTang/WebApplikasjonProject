"use strict";

define( [
        "ko",
        "dom",
        "utils",
        "templateGenerator",
        "lib/constants",
        "lib/global",
        "lib/dom_utils",
        "./common.vmcomponent",
        "./buttonicon.vmcomponent"
    ], function ( knockout, $, utils, templateGenerator, constants, global, domUtils, commonVmComponents, ButtonIcon ) {

        /**
         * Creates a popover and has several methods to show, destroy and position the popover.
         * Note that the popover is content agnostic. Any content should be passed when {@link commonVmComponents.Popover#doShow|showing} the popover
         * @memberof commonVmComponents
         * @constructor
         * @param {Object} options The options parameters for the popover.
         * @param {templategenerator.ViewBuild} options.build View build for popover content
         * @param {Object} options.position Position for popover {x:left|center|right, y:top|bottom [,width=fill]}
         * @param {DomHelper} options.$button Button connected to popover, popover is positioned according to button position
         * @param {boolean} [options.closeButton=false] Add close button in popover
         * @param {String} options.title Popover title
         * @param {String} options.type Popover type
         * @param {Function} [options.onRemoveCallback=null] Popover removed callback handler
         * @param {observable|boolean} [options.isViewDisabled=false] Popover is disabled observable
         * @param {boolean} [options.navigateItems=false] Navigate popover contents with keyboard arrows
         * @param {Array<String>} [options.buttonTitles] Button titles, changes button title according to open/close state
         */
        function Popover( options ) {


            // ------------------------------------------------------------------
            // VARIABLES
            // ------------------------------------------------------------------

            var self = this;

            // merge config parameters with the default values
            utils.merge( self, {
                // the build script for the popover itself
                build: null,
                // the position of the popover relative to element that opened it
                position: {x: 'center', y: 'top'},
                // element that last opened the popover
                $button: null,
                // close button
                closeButton: false,
                // close button tab index
                closeButtonTabIndex: null,
                // popover title
                title: null,
                // popover type
                type: null,
                // on remove callback function
                onRemoveCallback: null,
                // is view disabled
                isViewDisabled: null,
                // navigate content with keyboard arrows
                navigateItems: false,
                buttonTitles: null
            }, options );

            /**
             * Generate a new document fragment based on the build
             * @type {templategenerator.ViewFragment}
             * @private
             */
            var fragment = templateGenerator( options.build );
            /**
             * A wrapper reference to the popover itself
             * @type {DomHelper}
             * @private
             */
            var $popover = $( fragment );
            /**
             * Viewmodel component reference to the button
             * @type {ButtonIcon}
             * @private
             */
            var button_ = null;
            /**
             * A wrapper reference to the content
             * @type {DomHelper}
             * @private
             */
            var $content_ = null;
            var hasBuildCloseButton = false;
            /**
             * Is popover open observable
             */
            self.isOpen = knockout.observable( false );

            // ------------------------------------------------------------------
            // FUNCTIONS
            // ------------------------------------------------------------------

            /**
             * @returns {string} Returns a space separated string with positions. Ie. "left top".
             * @public
             */
            this.getPosition = function () {
                return utils.objectToArray( self.position ).join( " " );
            };

            /**
             * @returns {boolean} True if popover child element is focused
             * @private
             */
            function isChildFocused() {
                var activeElement = domUtils.getActiveElement();
                return activeElement ? $( activeElement ).hasParent( $popover.element() ) : false;
            }

            /**
             * @returns {boolean} True if popover button is focused
             * @private
             */
            function isButtonFocused() {
                return domUtils.getActiveElement() && button_ ? button_.isFocused() : false;
            }

            /**
             * @returns {boolean} True if view is enabled
             * @private
             */
            function isViewEnabled() {
                return !(typeof self.isViewDisabled === "function" ? self.isViewDisabled() : self.isViewDisabled || false);
            }

            /**
             * @param event Keyboard event
             * @returns {boolean} True if event is ESC key. True if event is TAB key and no popover child element is focused
             * @private
             */
            function shouldRemoveFromKeyboard( event ) {
                var isEscKey = event.which === constants.ESC_KEY,
                    isTabKey = event.which === constants.TAB_KEY;

                return isEscKey || (isTabKey && !isChildFocused());
            }

            /**
             * @param event Keyboard event
             * @returns {boolean} True if popover supports navigate items, and either button or child element is focused, and event is UP/DOWN key
             * @private
             */
            function shouldNavigateItemsKeyboard( event ) {
                var isButtonOrChildFocused = isButtonFocused() || isChildFocused();
                var isUpDownKey = (event.which === 38 || event.which === 40);

                return self.navigateItems && isButtonOrChildFocused && isUpDownKey;
            }

            /**
             * On global key event
             * @param event Keyboard event
             * @private
             */
            function onGlobalKey( event ) {
                if ( isViewEnabled() ) {
                    return onKey( event );
                }
                return true;
            }

            /**
             * Handle popover click event
             * @private
             */
            function onGlobalClick() {
                if ( isViewEnabled() ) {
                    self.doRemove();
                }
            }

            /**
             * Handle keyboard event
             * @param event Keyboard event
             * @private
             */
            function onKey( event ) {
                if ( event.type === "keyup" && shouldRemoveFromKeyboard( event ) ) {
                    self.doRemove();
                }
                else if ( event.type === "keydown" && shouldNavigateItemsKeyboard( event ) ) {
                    event.preventDefault();
                    doNavigateItems( event.which === constants.UP_KEY );
                    return false;
                }
                return true;
            }

            function onCloseButtonClick() {
                self.doRemove();
            }

            /**
             * Callback after popover is removed
             * @private
             */
            function handleRemoved() {
                // focus button if focus was not to any other element
                var activeElement = domUtils.getActiveElement();
                if ( activeElement && activeElement.tagName && activeElement.tagName.toLowerCase() === "body" && button_ ) {
                    button_.focus();
                }

                button_ = null;
            }

            /**
             * Navigate popover content items. Sets focus to a item, either the sibling to the focused item or the first/last item in list.
             * @param {boolean} directionUp Set focus on previous sibling
             * @private
             */
            function doNavigateItems( directionUp ) {

                var $items = $( ".item:NOT(:disabled)", $content_ ),
                    focusedItemIndex = -1;

                $items.forEach( function ( $item, i ) {
                    if ( $item === domUtils.getActiveElement() ) {
                        focusedItemIndex = i;
                    }
                } );

                if ( directionUp ) {
                    focusedItemIndex = focusedItemIndex <= 0 ? $items.length - 1 : focusedItemIndex - 1;
                }
                else {
                    focusedItemIndex = (focusedItemIndex + 1) % $items.length;
                }

                if ( $items[focusedItemIndex] ) {
                    $items[focusedItemIndex].focus();
                }

            }

            /**
             * Removes the popover and its bindings
             */
            this.doRemove = function () {

                self.isOpen( false );

                var $body = $( "body" );
                $body.unbind( "click", onGlobalClick );
                $body.unbind( "keydown", onGlobalKey );
                $body.unbind( "keyup", onGlobalKey );

                if ( button_ ) {
                    button_.isActive( false );
                }

                doUpdateButtonAccordingToState( button_ );

                commonVmComponents.removeElementAfterAnimation( $popover, commonVmComponents.animationDuration.popoverRemove, handleRemoved.bind( self ) );

                $content_ = null;

            };

            /**
             * Shows the popover relative to button position
             * @param {ButtonIcon} button The popover is positioned relative to this viewmodel component
             * @param {DomHelper} $content The contents of the popover
             * @param {boolean} [clear] True if to clear the contents before appending content
             */
            this.doShow = function ( button, $content, clear ) {

                if ( self.isOpen() ) {
                    self.doRemove();
                    return;
                }

                button_ = button;
                $content_ = $content;

                // build close button
                doBuildCloseButton();

                // clear contents
                if ( clear ) {
                    $( "[data-container]", fragment ).element().innerHTML = "";
                }

                // append contents
                $( "[data-container]", fragment ).append( $content_ );

                // make sure click events are NOT listened to until timer completes
                setTimeout( function () {
                    var $body = $( "body" );

                    // any click to document should close the popover
                    $body.bind( "click", onGlobalClick );

                    // bind keydown/up to body
                    $body.bind( "keydown", onGlobalKey );
                    $body.bind( "keyup", onGlobalKey );

                }, 10 );

                // inject popover into DOM
                $( button_.fragment ).after( $popover );

                // set button as active
                button_.isActive( true );

                self.isOpen( true );

                doUpdateButtonAccordingToState( button );

                commonVmComponents.callAfterAnimation( function () {
                    // update dom tree so all browsers notices the opened popover
                    commonVmComponents.updateDomTree();
                }, commonVmComponents.animationDuration.dialogOpen );

            };

            /**
             * Build close button
             * @private
             */
            function doBuildCloseButton() {

                if ( self.closeButton && !hasBuildCloseButton ) {

                    var _vm = new ButtonIcon( {
                        title: self.closeButtonTitle,
                        svg: "ico_close",
                        cls: "small",
                        nooutline: true,
                        onClick: onCloseButtonClick,
                        tabIndex: self.closeButtonTabIndex
                    } );

                    var closeIconButtonElement = templateGenerator( {
                        tmpl: {
                            file: 'btn',
                            id: 'buttonIcon'
                        },
                        mod: _vm
                    } );

                    // append close button icon to btn close wrapper
                    $( ".button_close", fragment ).append( closeIconButtonElement );

                    hasBuildCloseButton = true;

                }

            }

            function doUpdateButtonAccordingToState( button ) {
                if ( button && self.buttonTitles && typeof button.title === "function" ) {
                    button.title( options.buttonTitles[self.isOpen() ? 0 : 1] );
                }
            }

            /**
             * Set focus to bubble contents
             */
            self.focus = function () {
                var $tabIndexContent = $( "[tabindex='-1']", $popover.element() ).element();

                if ( $tabIndexContent ) {
                    $tabIndexContent.focus();
                }
            };

            // ------------------------------------------------------------------
            // OPERATIONS
            // ------------------------------------------------------------------

            // apply knockout bindings to popover
            knockout.applyBindings( self, $popover.element() );

        }

        return Popover;

    }
);