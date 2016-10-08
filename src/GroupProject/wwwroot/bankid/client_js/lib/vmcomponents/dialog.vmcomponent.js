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
    ], function ( knockout, $, utils, templateGenerator, constants, global, domUtil, commonVmComponents, ButtonIcon ) {

        /**
         * Displays a modal Dialog. Fill content with either build or content parameter.
         * @memberof commonVmComponents
         * @constructor
         * @param {Object} options Configuration parameters
         * @param {templategenerator.ViewBuild} [options.build] Content build, generated and appended to dialog body
         * @param {templategenerator.DocumentFragment} [options.content] Content fragment, appended to dialog body
         * @param {boolean} [options.closeButton] Dialog close button
         * @param {Function} [options.onOpenDialog] On dialog open callback (before animation) Function()
         * @param {Function} [options.onOpenedDialog] On dialog opened callback (after animation) Function()
         * @param {Function} [options.onCloseDialog] Dialog is closing callback (before animation) Function(isCancel)
         * @param {Function} [options.onClosedDialog] Dialog is closed (after animation) Function(isCancel)
         * @param {observable} [options.isViewDisabled] Is view disabled observable
         * @param {String} [options.id=random string] Dialog id
         */
        function Dialog( options ) {

            // ------------------------------------------------------------------
            // VARIABLES
            // ------------------------------------------------------------------

            var self = this,
                closeIconButtonVm = null,
                defaultMaxWith;

            utils.merge( self, {
                // build object
                build: null,
                // content
                content: null,
                closeButton: false,
                onClosedDialog: null,
                onOpenedDialog: null,
                id: utils.getRandomKey(),
                tabIndex: null
            }, options );

            /**
             * Dialog fragment
             * @type {templategenerator.DocumentFragment}
             */
            this.fragment = templateGenerator( {
                tmpl: {
                    file: 'dialog',
                    id: 'dialog'
                },
                mod: self
            } );

            self.isOpen = knockout.observable( false );

            // ------------------------------------------------------------------
            // FUNCTIONS
            // ------------------------------------------------------------------

            /**
             * @param {Event} event Mouse event
             * @returns {boolean} True if event target is outside dialog content
             * @private
             */
            function isTargetOutsideContent( event ) {
                return event.target && $( ".content", event.target ).length > 0;
            }

            /**
             * @param {Event} event Key event
             * @returns {boolean} True if should remove dialog from keyboard event
             * @private
             */
            function shouldRemoveFromKeyboard( event ) {
                return event.which === constants.ESC_KEY;
            }

            /**
             * On click event inside the root of dialog
             * @param {Event} event
             * @private
             */
            function onClickDialog( event ) {
                event.stopPropagation();

                if ( isTargetOutsideContent( event ) ) {
                    self.doClose( true );
                }
            }

            /**
             * On key event inside dialog
             * @param {Event} event
             * @private
             */
            function onKeyDialog( event ) {
                if ( shouldRemoveFromKeyboard( event ) ) {
                    self.doClose( true );
                }
            }

            // ... BUILD

            /**
             * Build content and append it to dialog content container
             * @private
             */
            function doBuildContent() {

                if ( self.build ) {
                    if ( self.build.mod.onBuildingDialog ) {
                        self.build.mod.onBuildingDialog( self );
                    }

                    var fragment = templateGenerator( self.build );

                    if ( fragment ) {
                        // append content to dialog content container
                        $( '[data-container=content]', self.fragment ).element().innerHTML = '';
                        $( '[data-container=content]', self.fragment ).append( fragment );

                        // set dialog reference to build viewmodel
                        if ( self.build.mod ) {
                            self.build.mod.dialog = self;
                        }

                    }
                }

                if ( self.content ) {
                    // append content to dialog content container
                    $( '[data-container=content]', self.fragment ).append( self.content );
                }

            }

            /**
             * Build close button
             * @private
             */
            function doBuildCloseButton() {

                // build if not already created
                if ( !closeIconButtonVm && self.closeButton ) {

                    closeIconButtonVm = new ButtonIcon( {
                        title: self.closeButtonTitle,
                        svg: "ico_close",
                        cls: "small",
                        label: self.closeButtonLabel,
                        nooutline: true,
                        onClick: function ( element, event ) {
                            event.stopPropagation();
                            self.doClose();
                        },
                        tabIndex: constants.CLOSE_DIALOG_TABINDEX,
                        type: "dialog_close"
                    } );

                    var closeIconButtonElement = templateGenerator( {
                        tmpl: {
                            file: 'btn',
                            id: 'buttonIcon'

                        },
                        mod: closeIconButtonVm
                    } );

                    // append close button icon to btn close wrapper
                    $( ".button_close", self.fragment ).append( closeIconButtonElement );

                }

            }

            // ... /BUILD

            /**
             * Open the dialog. Generates the dialog and the content and appends to body.
             * @private
             */
            this.doOpen = function ( noFocus ) {
                if ( self.isOpen() ) {
                    self.doClose();
                    return;
                }

                self.isOpen( true );

                // blur focused element
                var activeElement = domUtil.getActiveElement();
                if ( activeElement && activeElement !== global.topNode && activeElement.blur ) {
                    activeElement.blur();
                }

                // bind click to dialog
                $( self.fragment ).bind( "click", onClickDialog );

                // bind key up to dialog
                $( "body" ).bind( "keyup", onKeyDialog );

                // build content
                doBuildContent();

                // build close button
                doBuildCloseButton();

                // append dialog to body
                $( global.topNode ).append( self.fragment );

                // max width
                var $wrapperCenter = $( ".wrapper.center", self.fragment );
                defaultMaxWith = defaultMaxWith || parseInt( window.getComputedStyle( $wrapperCenter.element() ).getPropertyValue( "max-width" ) );
                $wrapperCenter.css( "max-width", Math.min( Math.round( document.body.offsetWidth * 0.9 ), defaultMaxWith ) + "px" );

                // disable view
                if ( options.isViewDisabled ) {
                    options.isViewDisabled( true );
                }

                // call open dialog callback
                if ( self.onOpenDialog ) {
                    self.onOpenDialog();
                }

                // ... call open dialog callback on content viewmodel
                var contentVm = getContentViewmodel();
                if ( contentVm && contentVm.onOpenDialog ) {
                    contentVm.onOpenDialog();
                }

                // call after dialog open animation
                commonVmComponents.callAfterAnimation( function () {

                    // focus header
                    if ( !noFocus ) {
                        self.focusHeader();
                    }

                    // call opened dialog callback
                    if ( self.onOpenedDialog ) {
                        self.onOpenedDialog();
                    }

                    // ... call opened dialog callback on content viewmodel
                    var contentVm = getContentViewmodel();
                    if ( contentVm && contentVm.onOpenedDialog ) {
                        contentVm.onOpenedDialog();
                    }

                    // update dom tree so all browsers notices the opened dialog
                    commonVmComponents.updateDomTree();

                }, commonVmComponents.animationDuration.dialogOpen );

            };

            /**
             * Close the dialog. Removes the dialog with its content from the DOM.
             * @param {boolean} [isCancel] Called by cancel action
             * @private
             */
            self.doClose = function ( isCancel ) {

                if ( !self.isOpen() ) {
                    return;
                }

                self.isOpen( false );

                // unbind click to dialog
                $( self.fragment ).unbind( "click", onClickDialog );

                // unbind keyup to dialog
                $( "body" ).unbind( "keyup", onKeyDialog );

                // enable view
                if ( options.isViewDisabled ) {
                    options.isViewDisabled( false );
                }

                // call close dialog callback
                if ( self.onCloseDialog ) {
                    self.onCloseDialog( isCancel );
                }

                // ... call close dialog callback on content viewmodel
                var contentVm = getContentViewmodel();
                if ( contentVm && contentVm.onCloseDialog ) {
                    contentVm.onCloseDialog( isCancel );
                }

                // remove fragment after animation
                commonVmComponents.removeElementAfterAnimation( $( self.fragment ), commonVmComponents.animationDuration.dialogRemove, function () {

                    // call opened dialog callback
                    if ( self.onClosedDialog ) {
                        self.onClosedDialog( isCancel );
                    }

                    // ... call opened dialog callback on content viewmodel
                    if ( contentVm && contentVm.onClosedDialog ) {
                        contentVm.onClosedDialog( isCancel );
                    }
                } );

            };

            /**
             * @returns {Object} The content's view model, if build is given
             */
            function getContentViewmodel() {
                return self.build ? self.build.mod : null;
            }

            this.focusCloseButton = function () {
                var $closeButton = $( ".button_close button", this.fragment ).element();
                if ( $closeButton && !utils.isTouchDevice() ) {
                    $closeButton.focus();
                }
            };

            this.focusHeader = function () {
                var $headline = $( "h2.headline", this.fragment ).element();
                if ( $headline ) {
                    $headline.focus();
                }
            };

        }

        return Dialog;

    }
);
