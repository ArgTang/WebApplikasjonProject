"use strict";

define( ["locale", "dom", "lib/global"], function ( locale, $, global ) {

    var domUtils = {};

    /**
     * Set the title of the HTML document
     * @param {String} documentTitle
     */
    domUtils.setDocumentTitle = function ( documentTitle ) {
        document.title = locale.get( 'document_title', documentTitle );
    };

    /**
     * Set focus on header
     */
    domUtils.focusHeader = function () {
        var $headerTitle = $( "header h1", global.topNode ).element();
        if ( $headerTitle ) {
            $headerTitle.focus();
        }
    };

    /**
     * Set focus on secondary header
     */
    domUtils.focusSecondaryHeader = function () {
        var $header = $( "h2", global.topNode ).element();

        if ( $header ) {
            $header.focus();
        }
    };

    /**
     * Set focus on header inside page
     */
    domUtils.focusPageHeader = function ( topNode ) {
        var $pageHeaderTitle = $( "header h1", topNode ).element();
        if ( $pageHeaderTitle ) {
            $pageHeaderTitle.focus();
        }
    };

    /**
     * Set focus on first tab list tab
     *
     * @param topNode
     */
    domUtils.focusFirstTab = function ( topNode ) {
        var $tab = $( ".tab-list .tab.active", topNode ).element();

        if ( !$tab ) {
            $tab = $( ".tab-list .tab", topNode ).element();
        }

        if ( $tab ) {
            $tab.focus();
        }
    };

    /**
     * Set focus on section scroller
     */
    domUtils.focusScroller = function () {
        var $scroller = $( "main .scroller", global.topNode ).element();
        if ( $scroller ) {
            $scroller.focus();
        }
    };

    /**
     * Set focus on secondary header
     */
    domUtils.focusSecondaryHeader = function ( topNode ) {
        var $section = $( "h2", topNode );
        var $documentHeader = $section.element();

        if ( $documentHeader ) {
            $documentHeader.focus();
        }
    };

    /**
     * Set focus on document body
     */
    domUtils.focusDocumentBody = function () {
        var $documentHeader = $( "main .document_body", global.topNode ).element();
        if ( $documentHeader ) {
            $documentHeader.focus();
        }
    };

    /**
     * Set focus on document body
     */
    domUtils.focusReferenceHeader = function () {
        var $referenceHeader = $( "main h2", global.topNode ).element();
        if ( $referenceHeader ) {
            $referenceHeader.focus();
        }
    };

    /**
     * Retrieves active element (from root node if shadow DOM, from document if not)
     */
    domUtils.getActiveElement = function () {
        return global.shadowRoot ? global.shadowRoot.activeElement : document.activeElement;
    };

    return domUtils;

} );
