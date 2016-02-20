define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'dojo/_base/array',
           'JBrowse/Store/SeqFeature/BAM',
           'JBrowse/Model/SimpleFeature'
       ],
       function(
           declare,
           lang,
           array,
           BAM,
           SimpleFeature
       ) {
return declare( BAM,
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
            var ret = new SimpleFeature({
                id: s.get('id'),
                data: lang.mixin(lang.clone(s.data), {
                    start: len-s.get('end'),
                    end: len-s.get('start'),
                    strand: -s.get('strand')
                })
            });
            return ret;
            
        }
        var featCallback = function( feature ) {
            return origFeatCallback(rev ? flip(feature) : feature);
        };

        this.inherited(arguments, [query, featCallback, finishCallback, errorCallback] );
    }

});
});

