/**
 * Common build template for UDD X01
 * @description This module defines the build for udd d01.
 * @name UDD d01 build definition
 * @author Flemming Lauritzen | flemming.lauritzen@knowit.no
 */

"use strict";

define( ['builds'], function ( builds ) {

    /**
     * Accepts an overall view model and generates a complete build object.
     * @param vm The view model from which to populate the build.
     * @returns {object} A complete build object integrated with the view model (mod).
     * This can be later be used as the base for generating a document fragment.
     * @constructor
     */
    return function ( vm ) {

        /**
         * Each node in the build tree is an object literal and consists of the following attributes:
         * - tmpl {object} mandatory
         * - container {object | array} optional
         * - mod {object} optional
         */
        return {

            /**
             * tmpl {object}
             * Describes the whereabouts of the template snippet to be used.
             */
            tmpl: {
                /**
                 * file {string}
                 * The file name where the template snippet resides.
                 */
                file: 'layout',
                /**
                 * id {string}
                 * Refers to the snippet's [collect-as] attribute value.
                 */
                id: 'layout'
            },

            /**
             * container {object | array} Describes sub nodes (if any).
             * If an array; the sub nodes are appended to the snippets' [data-container] element.
             * If an object; the sub nodes are appended to the snippets' [data-container="key"] element.
             * The sub node's key determines the exact [data-container].
             * Ie. object "left" is appended to <div data-container="left"> of the current template.
             */
            /**
             * This container is an array indicating that every object within will be appended
             * to this node's [data-container].
             */
            container: {

                header_left: builds.headerLeft( {
                    title: vm.header.title,
                    logo: vm.header.logo
                } ),
                header_right: builds.headerRight( {
                    menu: vm.header.menu
                } ),

                body: {
                    tmpl: {
                        file: 'layout',
                        id: 'view_noscroll'
                    },
                    container: {
                        tmpl: {
                            file: 'form',
                            id: 'form'
                        },
                        mod: vm.body.form,
                        container: [
                            {
                                tmpl: {
                                    file: 'form',
                                    id: 'rowLabel'
                                },
                                mod: vm.body.label,
                                container: {
                                    help: {
                                        tmpl: {
                                            file: 'btn',
                                            id: 'helpIcon'
                                        },
                                        mod: vm.body.help
                                    }
                                }
                            },
                            {
                                tmpl: {
                                    file: 'form',
                                    id: 'rowPid'
                                },
                                container: [
                                    {
                                        tmpl: {
                                            file: 'form',
                                            id: 'inputWrapper'
                                        },
                                        mod: vm.body.input,
                                        container: [
                                            {
                                                tmpl: {
                                                    file: 'form',
                                                    id: 'icon'
                                                },
                                                mod: vm.body.input
                                            },
                                            {
                                                tmpl: {
                                                    file: 'form',
                                                    id: 'input'
                                                },
                                                mod: vm.body.input
                                            }
                                        ]
                                    },
                                    builds.callToActionButton( vm.body.callToAction )
                                ]
                            },
                            {
                                tmpl: {
                                    file: 'form',
                                    id: 'rowMessage'
                                },
                                mod: vm.body.feedback
                            }
                        ]
                    }

                },

                footer_left: builds.footerLeft( {
                    certificates: vm.footer.certificates,
                    signature: vm.footer.signature
                } )
            }
        };
    };

} );