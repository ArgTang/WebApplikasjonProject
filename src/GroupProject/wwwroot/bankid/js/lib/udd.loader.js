

"use strict";

define(function (){

    return {

        version: '0.1',

        load: function( name, req, onLoad, config ) {

            var arrName = name.split("!"),
                nName = arrName[0],
                altName = arrName[1];

            req([ nName ], function( udd ) {

                // Do not bother with the work if its a build
                if (config.isBuild) {
                    onLoad();
                    return;
                }

                var spl = nName.split("/");
                var newName = altName || spl[spl.length-1];

                onLoad({
                    name : newName,
                    module : udd
                });

            });

        }

    };

});
