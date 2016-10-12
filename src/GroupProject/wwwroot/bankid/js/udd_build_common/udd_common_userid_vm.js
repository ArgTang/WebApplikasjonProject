/*jshint devel: true */

"use strict";

define( [
    "dom",
    "vm_components",
    "builds",
    "utils",
    "gfx",
    "ko",
    "locale",
    "event_handler",
    "lib/constants"
], function ( $, comp, builds, utils, gfx, ko, locale, eventHandler, constants ) {
     
    
    return function ( config ) {
        config = config || {};

        // ------------------------------------------------------------------
        // Variables
        // ------------------------------------------------------------------

        var self = {},
            INPUT_EMPTY = 0,
            INPUT_VALID = 1,
            INPUT_INVALID = 2
            ;

        config = utils.merge({
            /**
             * UDD type
             */
            type: "userid",
            /**
             * UDD action
             */
            action: "auth",
            /**
             * Input id, random generated
             */
            id: utils.getRandomKey(),
            /**
             * Is input valid
             */
            isValid: false,
            /**
             * Minimum length for input to be valid
             */
            minInputLength: 11,
            /**
             * Maximum length for input
             */
            maxInputLength: 11,
            /**
             * Error message
             */
            errorMessage: null,
            /**
             * Merchant certificate
             */
            merchantCertificate: "ACOS Sparebank", // DUMMY
            /**
             * Header subtitle
             */
            headerTitleSubtitle: "Navn på dokument" // DUMMY
        }, config, builds.customise);
        

        /**
         * Is input valid observable
         */
        var isValid = ko.observable( INPUT_EMPTY );
        var isError = ko.observable( false );
        /**
         * Disabled view observable
         */
        var isViewDisabled = ko.observable( false );
        /**
         * Certificates observable
         */
        var certificatesVm = [{
            text: config.merchantCertificate
        }];
        certificatesVm.disabled = isViewDisabled;
        /**
         * Header logo crop
         */
        var headerLogoCrop = false;
        /**
         * Header title
         */
        var headerTitle = "[header title]"; // DUMMY
        /**
         * Header subtitle
         */
        var headerTitleSubtitle = null;
        /**
         * Header menu change password
         */
        var headerMenuChangePassword = config.action === "auth";

        /*
         * Handle UDD action auth/netpay/sign
         * Overwrite certain variables
         */
        switch ( config.action ) {
            case "netpay":
                headerTitle = locale.label_header_bankaxess;
                break;
            case "sign":
                headerTitle = locale.label_header_signing;
                headerTitleSubtitle = config.headerTitleSubtitle;
                headerLogoCrop = true;
                break;
            default:
                headerTitle = builds.debugEditPasswordMode ? locale.label_header_change_password : locale.label_header_identification;
        }

        /*
         * Handle error message
         */
        if ( config.errorMessage && config.errorMessage in locale ) {
            config.errorMessage = locale[config.errorMessage];
        }

        // ------------------------------------------------------------------
        // Components
        // ------------------------------------------------------------------

        /**
         * Label component
         * @private
         */
        var labelComponent = new comp.Label( {
            id: config.id,
            text: locale.label_bankid_userid
        } );

        /**
         * Input field component
         * @private
         */
        var inputComponent = new comp.TextInput( {
            src: gfx.getB64( 'ico_userid' ),
            id: config.id,
            err: isError,
            maxlength: config.maxInputLength,
            type: "tel",
            pattern: "[0-9]*",
            disabled: isViewDisabled,
            tabIndex: constants.USERID_INPUT_TABINDEX,
            isInvalid: ko.observable( true )
        } );

        /**
         * Input bubble component
         * @private
         */
        var errorBubbleComponent = new comp.InfoBubble( {
            text: ko.observable( "" ),
            nextFocus: inputComponent
        } );

        /**
         * Help component
         * @private
         */
        var helpComponent = new comp.HelpDialog( {
            title: locale.label_tooltip_open_dialog_help,
            header: locale.user_id_help_header,
            text: locale.user_id_help_text,
            closeButtonTitle: locale.label_tooltip_close_dialog_help,
            closeButtonLabel: locale.button_close,
            isViewDisabled: isViewDisabled
        } );

        // ------------------------------------------------------------------
        // View models
        // ------------------------------------------------------------------

        /**
         * Call to action component
         * @private
         */
        var callToActionVm = {
            isInvalid: ko.computed( function () {
                return isValid() !== INPUT_VALID;
            } ),
            isDisabled: isViewDisabled,
            onClick: doSubmit,
            tabIndex: constants.CALLTOACTION_BUTTON_TABINDEX
        };

        /**
         * Feedback component
         * @private
         */
        var feedbackVm = {
            text: ko.observable( locale.label_userid )
        };

        /**
         * Form viewmodel
         * @private
         */
        var formVm = {
            onSubmit: doSubmit
        };

        /**
         * Header title viewmodel
         */
        var headerTitleVm = {
            text: headerTitle,
            subtext: headerTitleSubtitle,
            isViewDisabled: isViewDisabled
        };

        /**
         * Logo viewmodel
         */
        var headerLogoVm = {
            crop: headerLogoCrop
        };

        /**
         * Header menu vm
         */
        var headerMenuVm = {
            changePassword: headerMenuChangePassword,
            disabled: isViewDisabled
        };

        /**
         * Signature
         * @private
         */
        var footerSignatureVm = { // DUMMY
            title: locale.bankid_merchant,
            text: certificatesVm[0] && certificatesVm[0].text || "[signature]" // DUMMY
        };

        // ------------------------------------------------------------------
        // Functions
        // ------------------------------------------------------------------

        /**
         * Show input error bubble
         * @private
         */
        function doShowErrorMessage( text, noFocus ) {
            var $inputWrapper = $( ".input_wrapper", inputComponent.tpl );
            errorBubbleComponent.doShow( $inputWrapper, text, null, noFocus );
        }

        /**
         * Submit
         * @private
         */
        function doSubmit() {
            doValidate();

            if(false){
                //Ajax call for fødselsnummer
            }
            else if ( isValid() === INPUT_VALID ) {
                redirect("bankIDmobil")
            }
            else if ( isValid() === INPUT_INVALID ) {
                doShowErrorMessage( locale.replace( locale.label_userid_wrong, config.minInputLength ) );
            }
        }

        function redirect(location) {
            if(location === "bankIDmobil"){
                window.location.replace("login/reference");
            }else if(location === "error"){
                window.location.replace("login?udd=e24&locale=no");
            }
        }

        function birthNumber(birthNumber){
            //Kilde: http://miles.no/blogg/validering-av-norske-data
            var birthNumber = birthNumber.toString();
            if(!birthNumber || birthNumber.length !== 11){
                return false;
            }

            var _sum = function(birthNumber, factors){
                var sum = 0;
                for(var i = 0, l = factors.length; i < l; ++i){
                    sum += parseInt(birthNumber.charAt(i),10) * factors[i];
                }
                return sum;
            };

            var checksum1 = 11 - (_sum(birthNumber, [3, 7, 6, 1, 8, 9, 4, 5, 2]) % 11);
            if (checksum1 === 11) checksum1 = 0;
            var checksum2 = 11 - (_sum(birthNumber, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]) % 11);
            if (checksum2 === 11) checksum2 = 0;
            return checksum1 === parseInt(birthNumber.charAt(9), 10)
                && checksum2 === parseInt(birthNumber.charAt(10), 10);
        }

        /**
         * Do validate input
         * @private
         */
        function doValidate() {
            var val = inputComponent.val();

            if (birthNumber(val)) {
                isValid( INPUT_VALID );
            }
            else {
                isValid( INPUT_INVALID );
            }

            inputComponent.isInvalid( isValid() !== INPUT_VALID );

            errorBubbleComponent.doRemove();
        }

        /**
         * UDD is loaded
         */
        function onReady() {

            // show error
            if ( config.errorMessage ) {
                doShowErrorMessage( config.errorMessage, self.debugNoFocus );
            }
            // focus input
            else if ( !self.debugNoFocus && !utils.isTouchDevice() ) {
                inputComponent.focus();
            }

        }

        // ------------------------------------------------------------------
        // READY
        // ------------------------------------------------------------------

        // subscribe to input change
        inputComponent.val.subscribe( function () {
            // validate input
            doValidate();
        } );

        // subscribe to info bubble and set error to its value
        errorBubbleComponent.isOpen.subscribe( function ( val ) {
            isError( val );
        } );

        // event listen on UDD fragment ready
        eventHandler.on( "udd_fragment_ready", onReady );

        // ------------------------------------------------------------------
        // RETURN
        // ------------------------------------------------------------------

        return {
            header: {
                title: headerTitleVm,
                logo: headerLogoVm,
                menu: headerMenuVm
            },
            body: {
                form: formVm,
                label: labelComponent,
                input: inputComponent,
                callToAction: callToActionVm,
                feedback: feedbackVm,
                help: helpComponent
            },
            footer: {
                certificates: certificatesVm,
                signature: footerSignatureVm
            },
            customise: config
        };

    };

} );