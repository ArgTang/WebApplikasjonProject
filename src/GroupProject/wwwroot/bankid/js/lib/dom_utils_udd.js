"use strict";

define( [
    "dom",
    "lib/dom_utils"
], function ( $, domUtils ) {

    /**
     * Set focus on header
     */
    domUtils.focusHeader = function ( topNode ) {
        var $headerTitle = $( "header h1", topNode ).element();
        if ( $headerTitle ) {
            $headerTitle.focus();
        }
    };

    domUtils.focusSecondaryHeader = function ( topNode ) {
        var $documentHeader = $( "h2", topNode ).element();

        if ( $documentHeader ) {
            $documentHeader.focus();
        }
    };

    domUtils.focusFirstTab = function ( topNode ) {
        var $firstTab = $( ".tab-list .tab", topNode ).element();

        if ( $firstTab ) {
            $firstTab.focus();
        }
    };

    domUtils.doSetLayoutAsPage = function () {
        var $layout = $( ".layout" );
        $layout.addClass( "page" );
        $layout.attribute( "role", "dialog" );
    };

    return domUtils;

} );