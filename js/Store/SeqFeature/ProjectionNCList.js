define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'dojo/_base/array',
           'JBrowse/Store/SeqFeature/NCList',
           'JBrowse/Model/SimpleFeature'
       ],
       function(
           declare,
           lang,
           array,
           NCList,
           SimpleFeature
       ) {
return declare( NCList,
{
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
            var k = 0;
            var f = function() {
                console.log("here",k);
               if(++k==2) finishCallback();
            }
            this.inherited(arguments, [{ref:s0.name,start:query.start,end:s0.length}, featCallback, f, errorCallback] );
            this.inherited(arguments, [{ref:s1.name,start:0,end:query.end-s0.length}, featCallback, f, errorCallback] );
        }
    }

});
});

