"use strict";

define( ['builds'], function ( builds ) {

    return function ( vm ) {
        return {

            tmpl: {
                file: 'layout',
                id: 'layout'
            },

            container: {
                header_left: builds.headerLeft( {
                    logo: vm.header.logo,
                    title: vm.header.title,
                    back: vm.header.back
                } ),
                header_right: builds.headerRight( {
                    menu: vm.header.menu
                } ),

                body: {
                    tmpl: {
                        file: 'layout',
                        id: 'view'
                    },
                    container: {
                        tmpl: {
                            file: 'form',
                            id: 'contentWrapper'
                        },
                        container: [
                            {
                                tmpl: {
                                    file: 'content',
                                    id: 'contentIdleScreen'
                                },
                                mod: vm.body.idleScreen,
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
                                    id: 'rowInfo'
                                },
                                mod: vm.body.info
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