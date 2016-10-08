/**
 * Created by flemmingl on 25.02.2015.
 *
 * This module is a global singleton to ease the sharing of properties shared by a range of modules at different times
 * during the client's lifetime.
 */

define( {
    /**
     * The root node if using shadow DOM. Set as null if shadow DOM is not used.
     */
    shadowRoot: null,

    /*
     * This is the top node for doing queries within the client. It is an important reference point in the DOM tree when
     * using shadow DOM - queries originating above the shadow DOM will not be able to target nodes within the shadow DOM.
     *
     * The topNode is set in the lib/components/layout module.
     */
    topNode: null,

    /*
     * When docDisplayMode is retrieved it is stored here for easy reference.
     */
    docDisplayMode: null,

    /*
     * In docDisplayMode=window we need to create a window during handling of the click-event. This variable stores the
     * window reference for future reference.
     */
    docWindow: null,
    docWindowWidth: 500,
    docWindowHeight: 500,

    /*
     * This variable tracks the current document ID when using docDisplayMode:window. This can then later be used to
     * check whether a document is (already) loaded.
     */
    docWindowId: null,

    /*
     * The default features for a new window.
     */
    strWinFeatures: [
        "toolbar=no",
        "location=no",
        "directories=no",
        "status=no",
        "menubar=no",
        "scrollbars=yes",
        "resizable=yes"
    ].join( "," ),

    /*
     * Set global flags
     */
    isSHAEnabled: false,
    isMUTEnabled: false,
    isSFEEnabled: false,

    // Whether or not a page (overlay) is shown.
    isPageShown: false

} );