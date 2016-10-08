"use strict";

define( [
    "dom",
    "ko",
    "utils",
    "gfx",
    "./buttonicon.vmcomponent"
], function ( $, knockout, utils, gfx, ButtonIcon ) {

    /**
     * Call to action button component
     * @memberof vmcomponents
     * @param {Object} [config]
     * @param {String} config.title
     * @param {String|Function} [config.svg]
     * @param {String} [config.svgC2a]
     * @param {String} [config.svgSpinner]
     * @param {String|Function} [config.isSpinning]
     * @constructor
     */
    function CallToAction( config ) {

        var self = this,
            isSpinning = false,
            spinningClass = "spinning";

        utils.merge( self, new ButtonIcon( utils.merge( {
            src: null,
            svgC2a: 'ico_arrow_right',
            svgSpinner: 'ico_spinner',
            gifSpinner: gfx.gif.spinner_white,
            title: null,
            isInvalid: knockout.observable( false ),
            type: 'call_to_action',
            buttonType: 'submit'
        }, config ) ) );

        if ( typeof self.src !== "function" ) {
            self.src = knockout.observable( self.src );
        }
        if ( typeof self.isSpinning !== "function" ) {
            self.isSpinning = knockout.observable( self.isSpinning );
        }

        // set source to c2a
        self.src( gfx.getB64( self.svgC2a ) );

        /**
         * Toggles spinning mode
         * @param {boolean} [doSpin] True if C2A is set to spinning mode, leave undefined to make it toggle
         */
        self.toggleSpinner = function ( doSpin ) {
            isSpinning = typeof doSpin === "boolean" ? doSpin : !isSpinning;
            self.src( gfx.getB64( isSpinning ? self.svgSpinner : self.svgC2a ) );

            if ( isSpinning && !utils.features.cssAnimation ) {
                self.src( self.gifSpinner );
            }

            if ( self.fragment ) {
                var $button = $( "button", self.fragment );
                if ( isSpinning ) {
                    $button.addClass( spinningClass );
                }
                else {
                    $button.removeClass( spinningClass );
                }
            }
        };

    }

    return CallToAction;

} );