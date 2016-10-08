"use strict";

define( ["locale", "../udd_build_common/udd_common_error_vm.js"], function ( locale, UDDE04XxVM ) {

    var config = {
        errorMessage: locale.try_again_later,
        centerMessage: true
    };

    return UDDE04XxVM( config );

} );