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

        if(rev) {
            query.start = len - endBase
            query.end = len - startBase
        }

        var flip = function(s) {
            return new SimpleFeature({
                id: s.get('id'),
                data: {
                    start: len-s.get('end'),
                    end: len-s.get('start'),
                    strand: -s.get('strand'),
                    type: s.get('type'),
                    subfeatures: array.map(s.get('subfeatures'), function(ss) {
                        return flip(ss)
                    })
                }
            });
        }
        var featCallback = function( feature ) {
            return origFeatCallback(rev ? flip(feature) : feature);
        };

        this.inherited(arguments, [query, featCallback, finishCallback, errorCallback] );
    }

});
});

