/*jshint devel: true */

"use strict";

/**
 * Common viewmodel template for UDD E04_X
 */
define( ["dom", "ko", "utils", "vm_components", "locale", "gfx", "templates", "event_handler", "lib/constants", "dom_utils", "templateGenerator"], function ( $, ko, utils, comp, locale, gfx, tmpl, eventHandler, constants, domUtils, templateGenerator ) {

    return function ( config ) {

        config = utils.merge( {
            errorMessage: "",
            c2aHidden: false,
            headerTitle: locale.label_error,
            broadcast: {
                title: null,
                ingress: null
            }
        }, config );

        var self = {},
            hasBroadcast = !!config.broadcast && !!config.broadcast.title,
            hasFooter = hasBroadcast;

        var broadcastData = {
            titleWindow: locale.label_warning,
            title: config.broadcast.title,
            ingress: config.broadcast.ingress,
            linkTitle: locale.label_tooltip_show_broadcast,
            icon: {
                src: gfx.getB64( 'readmore' ),
                title: locale.label_readmore
            },
            onClick: function () {
                redirect("id")
            }
        };

        function redirect(location) {
            if(location === "id"){
                window.location.replace("bankid.html?udd=n01&locale=no");
            }else if(location === "error"){
                window.location.replace("bankid.html?udd=e24&locale=no");
            }
        }

        function getBroadCastPopover() {
            return new comp.Popover( {
                build: {
                    tmpl: {
                        file: 'popover',
                        id: 'popoverBroadcast'
                    }
                },
                type: "broadcast",
                position: {x: 'right', y: 'bottom', width: 'fill'},
                navigateItems: true,
                buttonTitles: [locale.label_tooltip_close_broadcast, locale.label_tooltip_open_broadcast]
            } );
        }

        function getBroadcastContent() {
            return templateGenerator( {
                tmpl: {
                    file: 'popover',
                    id: 'broadcastContents'
                },
                mod: broadcastData
            } );
        }

        function onReady() {
            // focus header title
            if ( !self.debugNoFocus ) {
                domUtils.focusHeader();
            }

            // open broadcast popover
            if ( hasBroadcast ) {
                self.broadcastButton.onClick();
            }
        }

        /**
         * Error message
         */
        self.error = {
            message: config.errorMessage || "[error message]",
            title: locale.exit_bankid,
            src: gfx.getB64( 'ico_arrow_right' ),
            onClick: function () {
                redirect("id")
            },
            c2aHidden: config.c2aHidden,
            tabIndex: constants.ERROR_BODY_TABINDEX
        };

        /**
         * Broadcast button
         */
        self.broadcastButton = new comp.ButtonIcon( {
            src: gfx.getB64( 'ico_broadcast' ),
            outline: true,
            onClick: function () {
                getBroadCastPopover().doShow( self.broadcastButton, getBroadcastContent() );
            },
            title: ko.observable( locale.label_tooltip_open_broadcast ),
            ariaLabel: locale.label_tooltip_broadcast,
            hasPopup: true,
            isExpandable: true
        } );

        /**
         * Call to action VM
         */
        self.callToAction = {
            hasFocus: ko.observable( false )
        };

        self.headerTitle = config.headerTitle;
        self.hasFooter = hasFooter;

        // remove footer
        if ( !hasFooter ) {
            tmpl.removeFooter();
        }

        // event listen on UDD fragment ready@

        eventHandler.on( "udd_fragment_ready", onReady );

        return self;

    };
} );