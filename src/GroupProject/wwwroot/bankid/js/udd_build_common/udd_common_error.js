/**
 * Common build template for Error UDDs
 * @description This module defines the build for an error message.
 * @name Error message build definition
 * @author Flemming Lauritzen | flemming.lauritzen@knowit.no
 */

"use strict";

define( ['builds'], function ( builds ) {

    return function ( vm ) {

        return {

            tmpl: {
                file: 'layout',
                id: 'layout'
            },
            container: {

                header_left: builds.headerLeft( {title: vm.headerTitle} ),
                header_right: builds.menuContainer( {changePassword: vm.menuChangePassword} ),

                body: {
                    tmpl: {
                        file: 'layout',
                        id: 'view'
                    },
                    mod: vm.error,
                    container: [
                        {
                            tmpl: {
                                file: 'content',
                                id: 'error'
                            },
                            mod: vm.error,
                            container: {
                                c2a: builds.callToActionButton( vm.callToAction )
                            }
                        }
                    ]
                },

                footer_right: vm.hasFooter ? {
                    tmpl: {
                        file: 'btn',
                        id: 'buttonIcon'
                    },
                    mod: vm.broadcastButton
                } : null
            }

        };
    };

} );