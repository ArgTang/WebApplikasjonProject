"use strict";

define(['utils'], function (utils) {
    var udd_debug = {};
    /**
     * Default challenge response timeout
     * @type {number}
     */
    udd_debug.crDefaultTimeout = window.cr_timeout || utils.urlParameter( "challengeResponse", 3000 );

    /**
     * Default dialog item select timeout
     * @type {number}
     */
    udd_debug.listContentCloseDialogTimeout = typeof window.list_content_close_dialog_timeout === "number" ? window.list_content_close_dialog_timeout : 150;

    /**
     * Default password display timeout
     * @type {number}
     */
    udd_debug.passwordDisplayTimeout = window.password_display_timeout || utils.urlParameter( "passwordDelay", 15 * 1000 );

    /**
     * True if debug edit password mode
     * @type {boolean}
     */
    udd_debug.debugEditPasswordMode = window.location.href.indexOf( 'editPassword=true' ) >= 0;

    /**
     * True if debug no focus
     * @type {boolean}
     */
    udd_debug.debugNoFocus = window.location.href.indexOf( 'autoFocus=false' ) >= 0;

    return udd_debug;
});