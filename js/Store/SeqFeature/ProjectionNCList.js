define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'dojo/_base/array',
           'dojo/promise/all',
           'dojo/Deferred', 
           'JBrowse/Store/SeqFeature/NCList',
           'JBrowse/Model/SimpleFeature'
       ],
       function(
           declare,
           lang,
           array,
           all,
           Deferred,
           NCList,
           SimpleFeature
       ) {
return declare( NCList,
{
    getGlobalStats: function( successCallback, errorCallback ) {
        var projection = this.browser.config.projectionStruct;
        var s0,s1;
        if( projection ) {
            s0 = projection[0];
            s1 = projection[1];
        }
        return ( this._deferred.root || this.getDataRoot( s0.name ) )
           .then( function( data ) { successCallback( data.stats ); },
                  errorCallback
                );
    },


    getFeatures: function( query, origFeatCallback, finishCallback, errorCallback ) {
        var thisB = this;
        var rev = this.config.reverseComplement||this.browser.config.reverseComplement;
        var startBase  = query.start;
        var endBase    = query.end;
        var len = this.refSeq.length;
        var projection = this.browser.config.projectionStruct;
        var s0,s1;

        if( projection ) {
            s0 = projection[0];
            s1 = projection[1];
        }

        if(rev) {
            query.start = len - endBase
            query.end = len - startBase
        }

        var flip = function(s) {
            return new SimpleFeature({
                id: s.get('id'),
                data: {
                    start: len-s.get('end'),
                    name: s.get('name'),
                    id: s.get('id'),
                    type: s.get('type'),
                    description: s.get('description'),
                    end: len-s.get('start'),
                    strand: -s.get('strand'),
                    subfeatures: array.map(s.get('subfeatures'), flip)
                }
            });
        }
        var shift = function(s) {
            return new SimpleFeature({
                id: s.get('id'),
                data: {
                    start: s.get('seq_id')==s1.name?s.get('start')+s0.length:s.get('start'),
                    end: s.get('seq_id')==s1.name?s.get('end')+s0.length:s.get('end'),
                    name: s.get('name'),
                    id: s.get('id'),
                    type: s.get('type'),
                    description: s.get('description'),
                    strand: s.get('strand'),
                    subfeatures: array.map(s.get('subfeatures'), shift)
                }
            });
        }
        var featCallback = function( feature ) {
            var ret = feature;
            //if(rev) ret = flip(feature);
            if(projection) ret = shift(feature);
            return origFeatCallback(ret);
        };

        if(projection&&query.start>s0.length) {
            this.inherited(arguments, [{ref:s1.name,start:query.start-s0.length,end:query.end-s0.length}, featCallback, finishCallback, errorCallback] );
        }
        else if(projection&&query.end<s0.length) {
            this.inherited(arguments, [{ref:s0.name,start:query.start,end:query.end}, featCallback, finishCallback, errorCallback] );
        }
        else if(projection&&query.start<s0.length&&query.end>s0.length) {
            var def1 = new Deferred();
            var def2 = new Deferred();
            var query = {ref:s0.name,start:query.start,end:s0.length-1};
            var query2 = {ref:s1.name,start:0,end:query.end-s0.length};
            var supermethod = this.getInherited(arguments);
            var callback = function() {
                def1.resolve();
                supermethod.apply(thisB, [query2, featCallback, function() { def2.resolve(); }, errorCallback] );
            }
            supermethod.apply(this, [query, featCallback, callback, errorCallback] );
            all([def1.promise,def2.promise]).then(finishCallback);
        }
    }

});
});

