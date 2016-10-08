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
                    title: vm.header.title,
                    logo: vm.header.logo
                } ),
                header_right: builds.headerRight( {
                    close: vm.header.close,
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
                                                    id: vm.hasMultipleBankIdDevices ? "inputButton" : "icon"
                                                },
                                                mod: vm.body.input
                                            },
                                            {
                                                tmpl: {
                                                    file: 'form',
                                                    id: 'inputPasswordWrapper'
                                                },
                                                mod: vm.body.input
                                            }
                                        ]
                                    },
                                    {
                                        tmpl: {
                                            file: 'form',
                                            id: 'buttonDisplayPassword'
                                        },
                                        mod: vm.body.password
                                    },
                                    builds.callToActionButton( vm.body.callToAction )
                                ]
                            },
                            {
                                tmpl: {
                                    file: 'form',
                                    id: 'rowMessageLink'
                                },
                                mod: vm.body.feedback
                            },
                            {
                                tmpl: {
                                    file: 'form',
                                    id: 'rowInfo'
                                },
                                mod: vm.body.certType
                            }
                        ]
                    }
                },

                footer_left: builds.footerLeft( {
                    certificates: vm.footer.certificates,
                    signature: vm.footer.signature
                } ),
                footer_right: builds.footerRight( {
                    histories: vm.footer.histories
                } )

            }

        };
    };
} );