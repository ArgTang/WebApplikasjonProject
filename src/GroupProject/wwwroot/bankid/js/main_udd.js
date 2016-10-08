/**
 * @author: Flemming Lauritzen (flemming.lauritzen@knowit.no)
 */

"use strict";

require.config(
    //<autoconf>
{"baseUrl":"client_js","paths":{"knockout":"external/knockout","mousetrap":"external/mousetrap","ko":"lib/knockout.secureBindingProvider","gfx":"lib/graphics","dom":"lib/dom","utils":"lib/utils","dom_utils":location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/lib/dom_utils_udd","domx":"lib/dom.extensions","vm_components":location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/lib/vm_provider_udd","templates":"lib/templates","templateGenerator":"lib/template_generator","event_handler":"lib/event_handler","layout_manager":"lib/layout.manager","xdm":"lib/xdm","pagedna":"lib/pagedna","feature_detection":"lib/feature_detection","components":"lib/components","views":"lib/views","pages":"lib/pages","behavioweb":"lib/behavioweb","locale":location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/locale/locale","live_region":"lib/live.region","secure_observer":"lib/mutation.observer","secure_dtbs":"lib/secure.dtbs","secure_form":"lib/secure.form.element","csp_integrity":"lib/csp.integrity.check","csr_integrity":"lib/csr.integrity.check","csfelogger":"bid/csfelogger","textdocumentviewmodel":"lib/views/viewmodels/text.document.viewmodel","paytextdocumentviewmodel":"lib/views/viewmodels/paytext.document.viewmodel","pdfdocumentviewmodel":"lib/views/viewmodels/pdf.document.viewmodel","xmldocumentviewmodel":"lib/views/viewmodels/xml.document.viewmodel","stm":"bid/stm","cryptojs":"external/cryptojs","jsbn":"external/jsbn","_ul":location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/lib/udd.loader","builds":location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/lib/builds","udd":location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/lib/udd","udd_debug":location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/lib/udd_debug","udd_builder":location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/lib/udd_builder"},"config":{"xdm":{"remote":"*","autoconnect":true},"udd":{"prefix":"_ul!","path":location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/udd_build/","views":["n01","n06_b_password","e24","_error","_idle","_password","_userid"]},"locale":{"query":"locale","path":location.pathname.replace(/\/[a-z]+\.[a-z]+$/,"/") + "js/locale/","file":"locale_%.js","default":null,"list":["en","no","zz"]}},"shim":{"cryptojs":{"exports":"CryptoJS"},"jsbn":{"exports":"BigInteger"}}}
//</autoconf>
);

require( [

    'templateGenerator',
    'dom',
    'udd',
    'lib/global',
    'event_handler',
    'utils',
    'lib/live.region'

], function ( templateGenerator, $, udd, global, eventHandler, utils /*, live region*/ ) {

    // retrieve the UDD id from get parameters (ie. "d01" from /udd/udd.html?udd=d01)
    var uddId = udd.udd_builder.uddId();
    
    global.topNode = document.body;

    // retrieve the UDD build (ie. "udd_d01.js")

    var uddBuild = udd[uddId];

    // if we don't have a build something has gone wrong
    if ( !uddBuild ) {
        console.error( uddId, uddBuild );
        throw "UDD build error";
    }

    // retrieve the UDD's view model (ie. "udd_d01_vm.js")
    var vm = udd[uddId + '_vm'];

    // if VM is function, create new instance
    if ( typeof vm === "function" ) {
        vm = new vm();
    }

    vm.debugNoFocus = window.location.href.indexOf( 'autoFocus=false' ) >= 0;

    // retrieve the build model
    var buildModel = uddBuild( vm );

    // generate a document fragment based on the build and templates
    var documentFragment = templateGenerator( buildModel );

    // append fragment to body
    $( 'body' ).append( documentFragment );

    // fire UDD fragment ready event
    eventHandler.fire( "udd_fragment_ready" );

    // feature detection
    if ( utils.features.noPlaceholder ) {
        $( "html" ).addClass( "no-placeholder" );
    }
    if ( utils.features.partialPlaceholder ) {
        $( "html" ).addClass( "partial-placeholder" );
    }



} );

