"use strict";

define( [
        "ko",
        "dom",
        "gfx",
        "utils",
        "lib/dom_utils"
    ], function ( knockout, $, gfx, utils, domUtils ) {

        /**
         * Button icon component
         * @param {Object} options The options parameters for the component
         * @param {observable} [options.isVisible=true] Button is visible observable
         * @param {observable} [options.isDisabled=false] Button is disabled observable
         * @param {observable} [options.isInvalid=true] Button is invalid observable
         * @param {String} [options.id=null] Button id
         * @param {String} [options.label=null] Button label text
         * @param {String} [options.title=""] Button title
         * @param {String} [options.src=""] Button icon source
         * @param {boolean} [options.nooutline=false] No outline on button
         * @param {String} [options.svg=null] Button icon SVG name. Used to set icon source from graphics module.
         * @param {Function} [options.onClick=null] Button on click callback handler
         * @param {String} [options.type=null] Button data type
         * @param {String} [options.buttonType=button] Button type
         * @param {number} [options.tabIndex=null] Button tab index
         * @param {observable} [options.hasFocus=false] Button has focus observable
         * @param {boolean} [options.hasPopup=false] Button has popup
         * @param {boolean} [options.isExpandable=false] Button has expandable content, as dialog or popover
         * @memberOf vmcomponents
         * @constructor
         */
        function ButtonIcon( options ) {
            var self = this;

            utils.merge( self, {
                isVisible: knockout.observable( true ),
                isDisabled: knockout.observable( false ),
                isInvalid: knockout.observable( false ),
                id: null,
                label: null,
                ariaLabel: null,
                title: "",
                src: "",
                nooutline: false,
                svg: null,
                onClick: null,
                type: null,
                buttonType: "button",
                tabIndex: null,
                hasFocus: knockout.observable( false ),
                hasPopup: false,
                isActive: knockout.observable( false ),
                isExpandable: false
            }, options );

            /**
             * No button outline observable
             */
            this.nooutline = knockout.observable( self.nooutline );
            this.isExpanded = knockout.computed( function () {
                return self.isExpandable ? (self.isActive() ? "true" : "false") : null;
            } );

            if ( self.svg ) {
                self.src = gfx.getB64( self.svg );
            }

            function getButtonElement( context ) {
                return context.fragment ? (context.fragment.tagName === "BUTTON" ? context.fragment : $( "button", context.fragment ).element()) : false;
            }

            /**
             * Sets focus on button
             */
            this.focus = function () {
                var $element = getButtonElement( this );
                if ( $element && !utils.isTouchDevice() ) {
                    $element.focus();
                }
            };

            /**
             * Blur focused button
             */
            this.blur = function () {
                var buttonElement = getButtonElement( this );
                if ( buttonElement ) {
                    buttonElement.blur();
                }
            };

            /**
             * Is disabled or invalid observable
             */
            this.isDisabledOrInvalid = knockout.computed( function () {
                return (self.isDisabled && self.isDisabled()) || (self.isInvalid && self.isInvalid());
            } );

            /**
             * @returns {boolean} True if button is focused
             */
            this.isFocused = function () {
                return getButtonElement( this ) === domUtils.getActiveElement();
            };

            /**
             * Subscribe to has focus, focuses button if true, blurs if false
             */
            self.hasFocus.subscribe( function ( val ) {
                if ( val ) {
                    self.focus();
                }
                else {
                    self.blur();
                }
            } );

        }

        return ButtonIcon;

    }
);