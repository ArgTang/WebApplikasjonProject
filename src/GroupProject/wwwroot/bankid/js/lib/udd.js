/**
 * @name Udd
 * @exports udd
 *
 * @description The udd module loads udd builders and view models into memory and delivers them on demand
 */

"use strict";

(function(){

    /**
     * Get files from config
     * @type {*}
     */
    var config = require.s.contexts._.config.config.udd,
        filesToLoad = [];

    filesToLoad.push('udd_builder');

    // Find the udd param or fallback to First udd
    var res = /udd=([^&]*)&?/g.exec(location.search);
    var udd = res ? res[1] : config.views[0];

    // If we at in test environment we load all tests
    var isTest = !!window.__karma__;

    for(var i = 0; i < config.views.length; i++){

        var view = config.views[i];
        if(isTest || udd === view){

            var uview = "udd_" + view;
            // Builders to load
            filesToLoad.push(config.prefix + config.path + uview + ".js!" + view);

            // ViewModels to load
            filesToLoad.push(config.prefix + config.path + uview + "_vm.js!" + view + "_vm");
        }

    }

    define(

        filesToLoad,

        function udd(udd_builder){

            /**
             * This object wil hold all svg dependencies by key name
             * @type {Object}
             */
            var udd = {
                udd_builder: udd_builder
            };

            /**
             * Put all incomming svg's in the svg object
             */
            for(var i = 1; i < arguments.length; i++){
                udd[ arguments[ i ].name ] = arguments[ i ].module;
            }

            return udd;

        });

}());