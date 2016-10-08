/**
 * @description: Main JS file for the UDD Viewer.
 * @author: Flemming Lauritzen (flemming.lauritzen@knowit.no)
 */

"use strict";

require.config(
//<autoconf>
{
    "baseUrl":"client_js",
    "paths": {
        "knockout": "",
        "mousetrap": "external/mousetrap",
        "ko": "external/knockout",
        "gfx": "lib/graphics",
        "dom": "lib/dom",
        "utils": "lib/utils",
        "dom_utils": "lib/dom_utils",
        "domx": "lib/dom.extensions",
        "vm_components": "lib/vm_provider",
        "templates": "lib/templates",
        "templateGenerator": "lib/template_generator",
        "event_handler": "lib/event_handler",
        "layout_manager": "lib/layout.manager",
        "xdm": "lib/xdm",
        "pagedna": "lib/pagedna",
        "feature_detection": "lib/feature_detection",
        "components": "lib/components",
        "views": "lib/views",
        "pages": "lib/pages",
        "behavioweb": "lib/behavioweb",
        "locale": "dev_locale",
        "live_region": "lib/live.region",
        "secure_observer": "lib/mutation.observer",
        "secure_dtbs": "lib/secure.dtbs",
        "secure_form": "lib/secure.form.element",
        "csp_integrity": "lib/csp.integrity.check",
        "csr_integrity": "lib/csr.integrity.check",
        "csfelogger": "bid/csfelogger",
        "textdocumentviewmodel": "lib/views/viewmodels/text.document.viewmodel",
        "paytextdocumentviewmodel": "lib/views/viewmodels/paytext.document.viewmodel",
        "pdfdocumentviewmodel": "lib/views/viewmodels/pdf.document.viewmodel",
        "xmldocumentviewmodel": "lib/views/viewmodels/xml.document.viewmodel",
        "stm": "bid/stm",
        "cryptojs": "external/cryptojs",
        "jsbn": "external/jsbn",
        "text": "external/require.text",
        "tmpl": "lib/template.loader",
        "uc": location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/config",
        "dimension": location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/lib/dimension",
        "ViewModel": location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/viewer/ViewModel",
        "viewerConfig": location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/viewer/config"
    },
    "config": {
        "xdm": {
            "remote": "*",
            "autoconnect": true
        }
    },
    "shim": {
        "cryptojs": {
            "exports": "CryptoJS"
        },
        "jsbn": {
            "exports": "BigInteger"
        }
    }
}
//</autoconf>
);

require( [
    'ko',
    'uc',
    'dom',
    'dimension',
    'ViewModel'
], function ( ko, uc, $, dimension, ViewModel ) {

    // instantiate the view model
    var vm = new ViewModel();

    // apply instance to document
    ko.applyBindings( vm );

    // ------------------------------------------------------------------
    // Draggable elements
    // ------------------------------------------------------------------

    // reusable on start handler
    function _onStart() {
        vm.isDragging( true );
    }

    // reusable on stop handler
    function _onStop() {
        vm.isDragging( false );
    }
} );
