/**
 * Common builds
 */

/*jshint devel: true */

"use strict";

define( [
    "gfx",
    "ko",
    "vm_components",
    "dom",
    'utils',
    'templateGenerator',
    "locale",
    "event_handler",
    "udd_debug",
    "lib/constants"
], function ( gfx, ko, comp, $, utils, templateGenerator, locale, eventHandler, udd_debug, constants ) {

    var builds = {};

    builds.buttonIcon = function ( mod ) {
        return {
            tmpl: {
                file: 'btn',
                id: 'buttonIcon'
            },
            mod: mod
        };
    };

    /**
     * Signature template container
     * @param {Object} signature Signature viewmodel
     * @returns {{tmpl: {file: string, id: string}, mod: *}}
     */
    builds.signatureContainer = function ( signature ) {
        return {
            tmpl: {
                file: 'layout',
                id: 'signature'
            },
            mod: signature
        };
    };

    /**
     * Certificate template container button with popover
     * @param {Array|Function} certificates Certificates Array(Object())
     */
    builds.certificateContainer = function ( certificates ) {

        // build popover
        var buildPopover = {
            tmpl: {
                file: 'popover',
                id: 'popover'
            }
        };

        // add on certificate click
        var _onCertificateClick = function ( item ) {
                alert( "Certificate: " + item.text );
            },
            icon = {
                src: gfx.getB64( "readmore" )
            };

        // create popover content
        var createPopoverContent = function () {
            var buildPopoverContents = {
                tmpl: {
                    file: 'popover',
                    id: 'popoverContentsDynamic'
                },
                mod: typeof certificates === "function" ? certificates() : certificates
            };

            buildPopoverContents.mod.onClick = _onCertificateClick;
            buildPopoverContents.mod.title = locale.label_tooltip_show_certificate;
            buildPopoverContents.mod.icon = icon;
            buildPopoverContents.mod.tabIndex = constants.CERTIFICATE_ITEM_TABINDEX;
            buildPopoverContents.mod.label = locale.label_sertificate_show;

            return templateGenerator( buildPopoverContents );
        };

        // certificate popover
        var certificatePopover = new comp.Popover( {
            build: buildPopover,
            type: "menu",
            position: {x: 'left', y: 'bottom'},
            title: locale.label_sertificate_show,
            buttonTitles: [locale.label_close_certificates, locale.label_open_certificates],
            navigateItems: true,
            closeButton: true,
            closeButtonTitle: locale.label_close_certificates,
            closeButtonTabIndex: constants.CERTIFICATE_CLOSE_BUTTON_TABINDEX
        } );

        // certificate button
        var certificateButton = new comp.ButtonIcon( {
            svg: 'ico_certificate',
            type: 'certificate',
            title: ko.observable( locale.label_open_certificates ),
            ariaLabel: locale.label_certificates,
            onClick: function () {
                var content = createPopoverContent();
                certificatePopover.doShow( certificateButton, content, true );
            },
            tabIndex: constants.CERTIFICATE_BUTTON_TABINDEX,
            hasPopup: true,
            isExpandable: true
        } );
        if ( certificates.disabled ) {
            certificateButton.isDisabled = certificates.disabled;
        }

        return {
            tmpl: {
                file: 'btn',
                id: 'buttonIcon'
            },
            mod: certificateButton
        };

    };

    /**
     * Menu template container button with popover
     * @param [options] {Object} Menu options
     */
    builds.menuContainer = function ( options ) {

        options = options || {};

        if ( options.hide ) {
            return null;
        }

        // menu items
        var menuItems = [];

        // Change password
        if ( options.changePassword ) {
            menuItems.push( {
                text: locale.label_menu_password_change,
                disabled: options.active === "edit_password" || builds.debugEditPasswordMode,
                onClick: menuItemOnClick
            } );
        }

        // Policy
        menuItems.push( {
            text: locale.label_menu_policy,
            disabled: options.active === "policy",
            onClick: menuItemOnClick
        } );

        // Cancel
        if ( !options.noCancel ) {
            menuItems.push( {
                text: locale.label_menu_cancel_bankid,
                onClick: menuItemOnClick
            } );
        }

        // popover build
        var buildPopover = {
            tmpl: {
                file: 'popover',
                id: 'popover'
            }
        };

        function menuItemOnClick( item, event ) {
            if ( item.disabled ) {
                event.preventDefault();
            }
            else {
                alert( "Menu item: " + item.text );
            }
        }

        // popover build contents
        var buildPopoverContents = {
            tmpl: {
                file: 'popover',
                id: 'popoverContentsMenu'
            },
            mod: {
                items: menuItems,
                tabIndex: constants.MENU_ITEM_TABINDEX
            }
        };

        // generate a document fragment based on the build and templates
        var tplContents = templateGenerator( buildPopoverContents );

        var menuPopover = new comp.Popover( {
            build: buildPopover,
            type: "menu",
            position: {x: 'right', y: 'top'},
            buttonCloseTitle: locale.button_close,
            navigateItems: true,
            buttonTitles: [locale.label_close_menu, locale.label_open_menu]
        } );

        // now that we have the popover, let's add the identification button
        var menuButton = new comp.ButtonIcon( {
            svg: 'ico_menu',
            label: locale.label_menu,
            ariaLabel: locale.label_menu,
            title: ko.observable( locale.label_open_menu ),
            outline: true,
            onClick: function () {
                menuPopover.doShow( menuButton, tplContents );
            },
            type: 'menu',
            tabIndex: constants.MENU_TABINDEX,
            hasPopup: true,
            isExpandable: true
        } );
        if ( options.disabled ) {
            menuButton.isDisabled = options.disabled;
        }

        return {
            tmpl: {
                file: 'btn',
                id: 'buttonIcon'
            },
            mod: menuButton
        };

    };

    builds.historiesFooterContainer = function ( _histories ) {

        // return null if no histories
        if ( !_histories ) {
            return null;
        }

        // create histories object
        var histories = {
            used: !_histories.used || typeof _histories.used !== "function" ? ko.observable( _histories.used || null ) : _histories.used,
            attempted: !_histories.attempted || typeof _histories.attempted !== "function" ? ko.observable( _histories.attempted || null ) : _histories.attempted,
            disabled: typeof _histories.attempted !== "function" ? ko.observable( _histories.disabled ) : _histories.disabled
        };

        /**
         * History popover component
         */
        var historyPopoverComponent = new comp.Popover( {
            build: {
                tmpl: {
                    file: 'popover',
                    id: 'popover'
                }
            },
            type: "history",
            title: locale.label_bankid_history,
            buttonTitles: [locale.label_tooltip_close_history, locale.label_tooltip_open_history],
            position: {x: 'right', y: 'bottom', width: 'fill'},
            closeButton: true,
            closeButtonTitle: locale.label_tooltip_close_history,
            closeButtonTabIndex: constants.HISTORY_CLOSE_BUTTON_TABINDEX,
            navigateItems: true
        } );

        /**
         * History button component
         */
        var historyButtonComponent = new comp.ButtonIcon( {
            isVisible: ko.computed( function () {
                return histories.used() || histories.attempted();
            } ),
            svg: "clock",
            title: ko.observable( locale.label_tooltip_open_history ),
            ariaLabel: locale.label_tooltip_history,
            onClick: doOpenPopover,
            type: "history",
            tabIndex: constants.HISTORY_BUTTON_TABINDEX,
            isDisabled: histories.disabled,
            hasPopup: true,
            isExpandable: true
        } );

        /**
         * Create menu popover content
         * * @returns {*}
         */
        function createHistoryPopoverContent() {

            // create histories VM
            var historiesVM = [];
            if ( histories.used() ) {
                historiesVM.push( {
                    type: "history_used",
                    icon: {
                        src: gfx.getB64( "ico_history_used" ),
                        title: locale.label_bankid_used_last,
                        alt: locale.label_bankid_used_last // TODO Should have own alternative text
                    },
                    date: histories.used().date,
                    merchant: histories.used().merchant
                } );
            }
            if ( histories.attempted() ) {
                historiesVM.push( {
                    type: "history_attempted",
                    icon: {
                        src: gfx.getB64( "ico_history_attempted" ),
                        title: locale.label_bankid_tried_used_last,
                        alt: locale.label_bankid_tried_used_last // TODO Should have own alternative text
                    },
                    date: histories.attempted().date,
                    error: histories.attempted().error,
                    merchant: histories.attempted().merchant
                } );
            }

            // create history VM
            var historyVM = {
                histories: historiesVM,
                historiesLength: historiesVM.length,
                tabIndex: constants.HISTORY_ITEM_TABINDEX,
                onClick: onClickHistories,
                title: locale.label_tooltip_display_history,
                readMore: {
                    src: gfx.getB64( "readmore" ),
                    title: locale.label_tooltip_display_history,
                    alt: locale.label_readmore
                }
            };

            return templateGenerator( {
                tmpl: {
                    file: 'popover',
                    id: 'popoverContents'
                },
                container: {
                    tmpl: {
                        file: 'popover',
                        id: 'historyContent'
                    },
                    mod: historyVM
                }
            } );
        }

        /**
         * Do open history popover
         */
        function doOpenPopover() {
            if ( !histories.used() && !histories.attempted() ) {
                return;
            }

            historyPopoverComponent.doShow( historyButtonComponent, createHistoryPopoverContent(), true );
        }

        /**
         * On click histories
         */
        function onClickHistories() {
            alert( "Display BankID history" );
        }

        // on histories open
        eventHandler.on( "histories_open", function () {
            // open popover
            doOpenPopover();
        } );
        // on histories close
        eventHandler.on( "histories_close", function () {
            // remove popover
            historyPopoverComponent.doRemove();
        } );

        return builds.buttonIcon( historyButtonComponent );

    };

    /**
     * BID logo container
     */
    builds.bidLogoContainer = function ( options ) {
        options = options || {};

        return {
            tmpl: {
                file: 'img',
                id: 'bidlogo'
            },
            mod: utils.merge( {
                src: gfx.getB64( "bankid_logo" ),
                svg: "bankid_logo",
                title: locale.label_title_logo_bankid,
                crop: false
            }, options )
        };
    };

    /**
     * Standard header left layout
     * @param {Object} [options]
     * @param {Object|String} [options.title]
     * @param {Object} [options.title.text]
     * @param {Object} [options.title.subtext]
     * @param {Function|Observable} [options.title.isViewDisabled]
     * @param {Object} [options.headerLogo]
     * @param {boolean|Object} [options.back]
     */
    builds.headerLeft = function ( options ) {
        options = options || {};
        var container = [];

        // back button
        if ( options.back ) {
            if ( typeof options.back !== "object" ) {
                options.back = {};
            }
            options.back.tabIndex = constants.BACK_BUTTON_TABINDEX;
            container.push( builds.backButton( options.back ) );
        }
        // bid logo
        else {
            container.push( builds.bidLogoContainer( options.logo || {} ) );
        }

        // header title
        if ( options.title ) {
            if ( typeof options.title !== "object" ) {
                options.title = {text: options.title};
            }

            container.push( builds.headerTitle( options.title.text, options.title.subtext, options.title.isViewDisabled ) );
        }

        return {
            tmpl: {
                file: 'layout',
                id: 'container'
            },
            container: container
        };
    };

    /**
     * @param {Object} options
     * @param {Object} [options.menu]
     * @param {Object|boolean} [options.close]
     */
    builds.headerRight = function ( options ) {
        options = options || {};
        var build = {
            tmpl: {
                file: 'layout',
                id: 'container'
            },
            container: []
        };

        // close
        if ( options.close ) {
            if ( typeof options.close !== "object" ) {
                options.close = {};
            }
            options.close.tabIndex = constants.CLOSE_BUTTON_TABINDEX;
            build.container.push( builds.closeButton( options.close ) );
        }
        // menu
        else if ( options.menu ) {
            if ( typeof options.menu !== "object" ) {
                options.menu = {};
            }
            build.container.push( builds.menuContainer( options.menu ) );
        }

        if ( build.container.length === 0 ) {
            return null;
        }

        return build;
    };

    /**
     * Standard header title layout
     * @param {String} text
     * @param {String} [subtext]
     * @param {Function|Observable} [isViewDisabled]
     */
    builds.headerTitle = function ( text, subtext, isViewDisabled ) {
        return {
            tmpl: {
                file: 'layout',
                id: 'title'
            },
            mod: {
                text: text,
                subtext: subtext || null,
                tabIndex: isViewDisabled ? ko.computed( function () {
                    return isViewDisabled() ? null : constants.HEADER_TITLE_TABINDEX;
                } ) : constants.HEADER_TITLE_TABINDEX
            }
        };
    };

    /**
     * Standard footer layout
     * @param {Object} [options] Object(certificates: Array, signature: Object, zoomTools: Object)
     */
    builds.footerLeft = function ( options ) {
        options = options || {};

        var build = {
            tmpl: {
                file: 'layout',
                id: 'container'
            },
            container: []
        };

        // zoom tools
        if ( options.zoomTools ) {
            build.container.push( {
                tmpl: {
                    file: 'btn',
                    id: 'zoomTools'
                },
                mod: options.zoomTools
            } );
        }

        // certificates
        if ( options.certificates ) {
            build.container.push( builds.certificateContainer( options.certificates ) );
        }

        // signature
        if ( options.signature ) {
            build.container.push( builds.signatureContainer( options.signature ) );
        }

        if ( build.container.length === 0 ) {
            return null;
        }

        return build;
    };

    /**
     * Standard footer layout
     * @param {Object} [options] Object(histories: Array, ownWindow: Object)
     */
    builds.footerRight = function ( options ) {
        options = options || {};

        var build = {
            tmpl: {
                file: 'layout',
                id: 'container'
            },
            container: []
        };

        // own window
        if ( options.ownWindow ) {
            build.container.push( builds.ownWindowButton( options.ownWindow ) );
        }

        // histories
        if ( options.histories ) {
            build.container.push( builds.historiesFooterContainer( options.histories ) );
        }

        // zoom tools
        if ( options.zoomTools ) {
            build.container.push( {
                tmpl: {
                    file: 'btn',
                    id: 'zoomTools'
                },
                mod: options.zoomTools
            } );
        }

        // call to action on footer, used in document signing
        if ( options.c2a ) {
            if ( typeof options.c2a !== "object" ) {
                options.c2a = {};
            }
            options.c2a.tabIndex = constants.CALLTOACTION_FOOTER_BUTTON_TABINDEX;
            build.container.push( builds.callToActionButton( options.c2a ) );
        }

        if ( build.container.length === 0 ) {
            return null;
        }

        return build;
    };

    /**
     * List content
     * @param mod
     * @returns {Object} List content build template
     */
    builds.listContent = function ( mod ) {
        return {
            tmpl: {
                file: 'dialog',
                id: 'listContent'
            },
            mod: mod
        };
    };

    /**
     * Text content
     * @param mod
     * @returns {Object} Text content build template
     */
    builds.textContent = function ( mod ) {
        return {
            tmpl: {
                file: 'dialog',
                id: 'txtContent'
            },
            mod: mod
        };
    };

    /**
     * Call to action build
     * @param {Object} options
     * @returns {Object}
     */
    builds.callToActionButton = function ( options ) {
        return builds.buttonIcon( new comp.ButtonIcon( utils.merge( {
            src: gfx.getB64( 'ico_arrow_right' ),
            title: locale.button_next,
            onClick: function () {
                alert( locale.button_next );
            },
            type: 'call_to_action',
            buttonType: 'submit'
        }, options ) ) );
    };

    builds.ownWindowButton = function ( options ) {
        return builds.buttonIcon( new comp.ButtonIcon( utils.merge( {
            //label: locale.label_show_in_window,
            src: gfx.getB64( 'new_window' ),
            title: locale.label_show_in_window,
            onClick: function () {
                alert( locale.label_show_in_window );
            },
            type: "new_window",
            tabIndex: constants.OWN_WINDOW_BUTTON_TABINDEX
        }, options ) ) );
    };

    /**
     * @param {Object} options
     * @param {boolean} [options.isSecondary]
     * @returns {*}
     */
    builds.closeButton = function ( options ) {
        return builds.buttonIcon( new comp.ButtonIcon( utils.merge( {
            svg: options.isSecondary ? 'ico_close_grey' : 'ico_close_white',
            title: locale.button_close,
            onClick: function () {
                alert( locale.button_close );
            },
            type: options.isSecondary ? "close_secondary" : "close"
        }, options ) ) );
    };

    builds.backButton = function ( options ) {
        return builds.buttonIcon( new comp.ButtonIcon( utils.merge( {
            svg: 'ico_arrow_left',
            title: locale.button_back,
            onClick: function () {
                alert( locale.button_back );
            },
            nooutline: true,
            type: "back"
        }, options ) ) );
    };

    return utils.merge( builds, udd_debug );
} );