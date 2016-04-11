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
        var rev = this.browser.config.reverseComplement;
        var startBase  = query.start;
        var endBase    = query.end;
        var len = this.refSeq.length;

        if(rev) {
            query.start = len - endBase
            query.end = len - startBase
        }

        var flip = function(s,p) {
            var f = new SimpleFeature({
                id: s.get('id'),
                parent: p,
                data: {
                    start: len-s.get('end'),
                    end: len-s.get('start'),
                    strand: -s.get('strand'),
                    name: s.get('name'),
                    id: s.get('id'),
                    type: s.get('type'),
                    description: s.get('description'),
                }
            });
            f.data.subfeatures = array.map(s.get('subfeatures'), function(elt) { return flip(elt,f); })
            return f;
        }
        var featCallback = function( feature ) {
            return origFeatCallback(rev ? flip(feature) : feature);
        };

        this.inherited(arguments, [query, featCallback, finishCallback, errorCallback] );
    }

});
});

