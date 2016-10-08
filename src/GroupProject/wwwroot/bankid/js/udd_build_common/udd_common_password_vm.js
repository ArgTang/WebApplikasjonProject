/*jshint devel: true */

"use strict";

define( ["dom", "vm_components", "builds", "utils", "gfx", "ko", "locale", "event_handler", "lib/constants"], function ( $, comp, builds, utils, gfx, ko, locale, eventHandler, constants ) {

        return function ( config ) {


            // ------------------------------------------------------------------
            // Variables
            // ------------------------------------------------------------------

            var self = {},
                INPUT_EMPTY = 0,
                INPUT_VALID = 1,
                INPUT_INVALID = 2
                ;

            config = utils.merge( true, {
                /**
                 * UDD type
                 */
                type: "password",
                /**
                 * UDD action
                 */
                action: "auth",
                /**
                 * Input id, random generated
                 * @private
                 */
                id: utils.getRandomKey(),
                /**
                 * Is input valid
                 * @private
                 */
                isValid: false,
                /**
                 * Minimum length for input to be valid
                 * @private
                 */
                minInputLengthPassword: 6,
                /**
                 * BankID devices
                 * @type {Array}
                 * @private
                 */
                bankIdDevices: [],
                /**
                 * Merchant certificate
                 */
                merchantCertificate: "ACOS Sparebank", // DUMMY
                /**
                 * Merchant certificate
                 */
                bankIdCertificate: "Ola Norman", // DUMMY
                /**
                 * Header subtitle
                 */
                headerTitleSubtitle: "Navn på dokument", // DUMMY
                listContentCloseDialogTimeout: builds.listContentCloseDialogTimeout,
                labelText: locale.label_password,
                inputIcon: "ico_password",
                hasBackButton: false,
                errorMessage: "",
                passwordShowTimeout: builds.passwordDisplayTimeout
            }, config, builds.customise );

            /**
             * BankId viewmodel
             */
            var bidVM = new comp.BankIdViewModel();

            // add otp devices to BidVM
            utils.each( config.bankIdDevices, function ( bankIdDevice ) {
                bidVM.addObject( bankIdDevice );
            } );

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
            /**
             * Has multiple BankId devices
             * @type {boolean}
             */
            var hasMultipleBankIdDevices = bidVM.all().length > 1;
            /**
             * Disabled view observable
             */
            var disabledView = ko.observable( false );
            /**
             * Error observable
             */
            var inputError = ko.observable( false );
            /**
             * Histories observable
             */
            var historiesVm = {
                attempted: ko.observable( null ),
                used: ko.observable( null ),
                disabled: disabledView
            };
            /**
             * Certificates observable
             */
            var certificatesVm = ko.observableArray( [{
                text: config.merchantCertificate
            }] );
            certificatesVm.disabled = disabledView;
            /**
             * Is value valid observable
             */
            var isValid = ko.observable( INPUT_EMPTY );
            /**
             * Is value entered
             * @type {boolean}
             */
            var isValueEntered = false;
            /**
             * Should read assistive history
             * @type {boolean}
             */
            var shouldReadAssistiveHistory = false;
            var isOpenErrorOnReady = false;

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
             * Handle error
             */
            if ( config.errorMessage ) {
                // open error on ready
                isOpenErrorOnReady = true;

                if ( config.errorMessage in locale ) {
                    config.errorMessage = locale[config.errorMessage];
                }
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
                text: ko.observable( config.labelText )
            } );

            /**
             * Input field component
             * @private
             */
            var inputComponent = null;

            if ( hasMultipleBankIdDevices ) {
                inputComponent = new comp.ButtonTextInput( {
                    src: gfx.getB64( config.inputIcon ),
                    srcRight: gfx.getB64( 'ico_dropdown' ),
                    id: config.id,
                    err: inputError,
                    hasFocus: ko.observable( false ),
                    type: ko.observable( 'password' ),
                    dataType: "password",
                    maxlength: 255,
                    onClick: function () {
                        dialogBankidComponent.doOpen();
                    },
                    titleButton: ko.observable( locale.label_choose_bankid ),
                    placeholder: ko.observable( "" ),
                    disabled: disabledView,
                    disabledButton: disabledView,
                    tabIndex: constants.PASSWORD_INPUT_TABINDEX,
                    isInvalid: ko.observable( true )
                } );
            }
            else {
                inputComponent = new comp.TextInput( {
                    src: gfx.getB64( config.inputIcon ),
                    id: config.id,
                    err: inputError,
                    hasFocus: ko.observable( false ),
                    type: ko.observable( 'password' ),
                    dataType: "password",
                    maxlength: 255,
                    placeholder: ko.observable( "" ),
                    disabled: disabledView,
                    tabIndex: constants.PASSWORD_INPUT_TABINDEX,
                    isInvalid: ko.observable( true )
                } );
            }

            inputComponent.isModePassword = ko.computed( function () {
                return inputComponent.type() === "password";
            } );

            inputComponent.isModeText = ko.computed( function () {
                return inputComponent.type() !== "password";
            } );

            function onSelectBankIdItem( bankIdItem ) {
                doChangeBankID( bankIdItem, false );
            }

            /**
             * Bankid list content component
             * @private
             */
            var listContentBankidComponent = new comp.ListContent( {
                title: locale.label_choose_bankid,
                selectedListItem: bidVM.current().value,
                closeDialogTimeout: config.listContentCloseDialogTimeout,
                isViewDisabled: disabledView,
                onSelectItem: onSelectBankIdItem
            } );

            /**
             * Bankid dialog component
             * @private
             */
            var dialogBankidComponent = new comp.Dialog( {
                closeButton: true,
                build: builds.listContent( listContentBankidComponent ),
                onOpenedDialog: onOpenedBankidDialog,
                onClosedDialog: onClosedBankidDialog,
                closeButtonTitle: locale.label_close_dialog,
                closeButtonLabel: locale.button_close,
                isViewDisabled: disabledView
            } );

            /**
             * Password display
             * @private
             */
            var passwordDisplayComponent = new comp.PasswordDisplay(
                [locale.label_password_show, locale.label_password_hide],
                [locale.label_show, locale.label_hide],
                inputComponent,
                {
                    timeout: config.passwordShowTimeout,
                    isViewDisabled: disabledView,
                    headerText: locale.label_password_entered,
                    buttonEditPassword: locale.button_edit_password,
                    closeButtonTitle: locale.label_close_dialog,
                    closeButtonLabel: locale.button_close
                }
            );

            // bind input has padding on right to password component visible
            inputComponent.hasPaddingOnRightSide = passwordDisplayComponent.visible;

            /**
             * Info bubble component
             * @private
             */
            var infoBubbleComponent = new comp.InfoBubble( {
                text: ko.observable( config.errorMessage ),
                nextFocus: inputComponent
            } );

            /**
             * Help component
             * @private
             */
            var helpComponent = new comp.HelpDialog( {
                title: ko.observable( locale.label_tooltip_open_dialog_help ),
                header: ko.observable( locale.personal_password_help_header ),
                text: ko.observable( locale.personal_password_help_text ),
                isViewDisabled: disabledView,
                closeButtonTitle: locale.label_tooltip_close_dialog_help,
                closeButtonLabel: locale.button_close
            } );

            // ------------------------------------------------------------------
            // Viewmodels
            // ------------------------------------------------------------------

            /**
             * Call to action button viewmodel
             * @type {Object}
             * @private
             */
            var call2actionVm = {
                isInvalid: ko.computed( function () {
                    return isValid() !== INPUT_VALID;
                } ),
                isDisabled: disabledView,
                onClick: function () {
                    _onSubmit();
                },
                tabIndex: constants.CALLTOACTION_BUTTON_TABINDEX
            };

            /**
             * Feedback viewmodel
             * @type {Object}
             * @private
             */
            var messageVm = {
                text: ko.observable( "" ), // DUMMY
                title: ko.observable( "" ),
                label: ko.observable( "" ),
                disabled: disabledView,
                onClick: function () {
                    // open dialog
                    if ( !disabledView() ) {
                        dialogBankidComponent.doOpen();
                    }
                },
                tabIndex: constants.CHOOSE_ANCHOR_TABINDEX,
                icon: gfx.getB64( 'ico_dropdown' )
            };

            /**
             * OTP type viewmodel
             * @private
             */
            var infoVm = {
                text: ko.observable( "[chosen BanbkId type]" ) // DUMMY
            };

            /**
             * Signature
             * @private
             */
            var signatureVM = { // DUMMY
                title: ko.computed( function () {
                    return bidVM.current().type === "employee" ? locale.certificate_employee_label : locale.certificate_personal;
                } ),
                text: ko.computed( function () {
                    return bidVM.currentPeronalCertificate().text;
                } )
            };

            /**
             * Form viewmodel
             * @private
             */
            var formVm = {
                onSubmit: function () {
                    _onSubmit();
                },
                hasInfoContent: ko.computed( function () {
                    return !!infoVm.text();
                } ),
                hasMessageContent: ko.computed( function () {
                    return !!messageVm.text();
                } )
            };

            /**
             * Header title viewmodel
             */
            var headerTitleVm = {
                text: headerTitle,
                subtext: headerTitleSubtitle,
                isViewDisabled: disabledView
            };

            /**
             * Header menu view model
             */
            var headerMenuVm = {
                changePassword: headerMenuChangePassword,
                disabled: disabledView
            };

            var headerBackVm = config.hasBackButton ? {} : false;

            /**
             * Logo view model
             */
            var logoVm = {
                crop: headerLogoCrop
            };

            // ------------------------------------------------------------------
            // Functions
            // ------------------------------------------------------------------

            /**
             * Change BankId
             * @param {Object} bankId
             * @param {boolean} [isInit]
             * @private
             */
            function doChangeBankID( bankId, isInit ) {

                bidVM.current( bankId );

                // clear input
                inputComponent.val( "" );

                // set placeholder
                inputComponent.placeholder( hasMultipleBankIdDevices ? bankId.title : "" );

                // validate input
                doValidate();

                // set histories
                historiesVm.used( bankId.histories ? bankId.histories.used : null );
                historiesVm.attempted( bankId.histories ? bankId.histories.attempted : null );

                // certificates
                certificatesVm( [
                    {
                        text: config.merchantCertificate
                    },
                    {
                        text: bankId.certificate || config.bankIdCertificate
                    }
                ] );

                // set label text
                labelComponent.text( locale.label_password );

                if ( hasMultipleBankIdDevices ) {

                    // set input button title
                    inputComponent.titleButton( locale.replace( locale.label_selected_bankid_choose_bankid, bankId.title ) );

                    // set feedback
                    messageVm.text( hasMultipleBankIdDevices ? locale.label_choose_other_bankid : null );
                    messageVm.title( locale.replace( locale.label_selected_bankid_choose_bankid, bankId.title ) );

                }

                // set otp type text
                infoVm.text( getBankIdType( bankId ) );

                // set help
                helpComponent.header( bankId.type === "employee" ? locale.employee_password_help_header : locale.personal_password_help_header );
                helpComponent.text( bankId.type === "employee" ? locale.employee_password_help_text : locale.personal_password_help_text );

                doFocus( isInit );

            }

            /**
             * Set focus in input button
             *
             * - Don't set if touch device
             */
            function doFocusInputButton() {
                if ( inputComponent.focusButton && !utils.isTouchDevice() ) {
                    inputComponent.focusButton();
                }
            }

            /**
             * Set focus on input field
             *
             * - Don't set focus if init and no debug focus is set or is touch device
             * @param {boolean} isInit Called from init
             */
            function doFocus( isInit ) {
                var isNotInitAndDebugOrTouch = !(isInit && (self.debugNoFocus || utils.isTouchDevice()));
                var doSetFocusOnInput = function () {
                    inputComponent.focus();
                };

                if ( isNotInitAndDebugOrTouch ) {
                    doSetFocusOnInput();
                }
            }

            /**
             * @param {Object} bankId
             * @returns {String} BankId type
             */
            function getBankIdType( bankId ) {
                switch ( bankId.type ) {
                    case "personal":
                        return locale.label_person_bankid;
                    case "employee":
                        return locale.label_employee_bankid;
                }
                return "";
            }

            /**
             * Show info bubble
             * @private
             */
            var doShowInfoBubble = function ( text, noFocus ) {

                // set text
                if ( text ) {
                    infoBubbleComponent.text( text );
                }

                // show bubble
                infoBubbleComponent.doShow( $( ".input_wrapper", inputComponent.tpl ), null, null, noFocus );

            };

            /**
             * Do validate input
             * @private
             */
            var doValidate = function () {

                var val = inputComponent.val();

                if ( val.length >= config.minInputLengthPassword ) {
                    isValid( INPUT_VALID );
                }
                else {
                    isValid( INPUT_INVALID );
                }

                inputComponent.isInvalid( isValid() !== INPUT_VALID );

                infoBubbleComponent.doRemove();

            };

            /**
             * On submit
             * @private
             */
            var _onSubmit = function () {

                // disable password display
                passwordDisplayComponent.toggle( false, 0, true );

                // validate
                doValidate();

                if ( isValid() === INPUT_VALID ) {
                    alert( locale.button_next );
                }
                else if ( isValid() === INPUT_INVALID ) {
                    doShowInfoBubble( locale.replace( locale.password_must_be_correct_length, config.minInputLengthPassword ) );
                }
            };

            function onOpenedBankidDialog() {
                // show input caret
                if ( utils.features.visibleCursorBehindOverlay ) {
                    inputComponent.hideCaret( true );
                }

                // disable password display
                passwordDisplayComponent.toggle( false, 0, true );
            }

            function onClosedBankidDialog( isCancel ) {
                if ( isCancel ) {
                    doFocusInputButton();
                }

                // hide input caret
                if ( utils.features.visibleCursorBehindOverlay ) {
                    inputComponent.hideCaret( false );
                }

                // read assistive history message
                if ( !isCancel ) {
                    readAssistiveHistoryMessage();
                }
            }

            function readAssistiveHistoryMessage() {
                if ( shouldReadAssistiveHistory ) {
                    var assistiveMessage = "",
                        historyUsed = historiesVm.used(),
                        historyAttempted = historiesVm.attempted();
                    if ( historyUsed ) {
                        assistiveMessage += locale.label_bankid_used_last + ": " + historyUsed.date + ", " + historyUsed.merchant + ". ";
                    }
                    if ( historyAttempted ) {
                        assistiveMessage += locale.label_bankid_tried_used_last + ": " + historyAttempted.date + ", " + historyAttempted.error + ", " + historyAttempted.merchant + ". ";
                    }
                    if ( assistiveMessage ) {
                        assistiveMessage = locale.label_bankid_history + ": " + assistiveMessage;
                        eventHandler.fire( "assistive_message", assistiveMessage );
                    }
                    shouldReadAssistiveHistory = false;
                }
            }

            // ------------------------------------------------------------------
            // READY
            // ------------------------------------------------------------------

            // subscribe to input change
            inputComponent.val.subscribe( function () {
                // validate input value
                doValidate();

                if ( !isValueEntered ) {
                    eventHandler.fire( "histories_close" );
                }

                isValueEntered = true;
            } );

            // subscribe to info bubble and set error to its value
            infoBubbleComponent.isOpen.subscribe( function ( val ) {
                inputError( val );
            } );

            inputComponent.hasFocus.subscribe( function () {
                isValueEntered = false;
            } );

            // add OTP devices to OTP list content
            listContentBankidComponent.addContent( bidVM.all() );

            // event listen on UDD fragment ready
            eventHandler.on( "udd_fragment_ready", function () {

                // change BankId to selected BankId
                doChangeBankID( bidVM.current(), true );

                // fire error open event
                if ( isOpenErrorOnReady ) {
                    doShowInfoBubble( null, self.debugNoFocus );
                }

                // read assitive history message
                readAssistiveHistoryMessage();

            } );

            // ------------------------------------------------------------------
            // RETURN
            // ------------------------------------------------------------------

            return {
                header: {
                    title: headerTitleVm,
                    back: headerBackVm,
                    logo: logoVm,
                    menu: headerMenuVm
                },
                body: {
                    form: formVm,
                    label: labelComponent,
                    help: helpComponent,
                    input: inputComponent,
                    password: passwordDisplayComponent,
                    callToAction: call2actionVm,
                    feedback: messageVm,
                    certType: infoVm
                },
                footer: {
                    certificates: certificatesVm,
                    signature: signatureVM,
                    histories: historiesVm
                },
                customise: config,
                hasMultipleBankIdDevices: hasMultipleBankIdDevices
            };

        };

    }
)
;
