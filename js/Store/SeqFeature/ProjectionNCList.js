define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'dojo/_base/array',
           'JBrowse/Store/SeqFeature/NCList'
       ],
       function(
           declare,
           lang,
           array,
           NCList
       ) {
return declare( NCList,
{
    _getFeatures: function( data, query,  origFeatCallback, finishCallback, errorCallback ) {
        var thisB = this;
        var rev = this.config.reverseComplement||this.browser.config.reverseComplement;
        var startBase  = query.start;
        var endBase    = query.end;
        if(rev) {
            query.start = Math.max(this.refSeq.length - endBase, 0);
            query.end = Math.min(this.refSeq.length - startBase, this.refSeq.length);
        }
        

        var featCallback = function( feature, path ) {
            if( rev ) {
                var s = feature.get('start');
                var e = feature.get('end');
                feature.set('end', thisB.refSeq.length - s);
                feature.set('start', thisB.refSeq.length - e);
                feature.set('strand', -feature.get('strand'));
                array.forEach(feature.get('subfeatures'), function(subfeat) {
                    var ss = subfeat.get('start');
                    var se = subfeat.get('end');
                    subfeat.set('end', thisB.refSeq.length-ss);
                    subfeat.set('start', thisB.refSeq.length-se);
                    subfeat.set('strand', -subfeat.get('strand'));
                    array.forEach(subfeat.get('subfeatures'), function(subsubfeat) {
                        var sss = subsubfeat.get('start');
                        var sse = subsubfeat.get('end');
                        subsubfeat.set('end', thisB.refSeq.length-sss);
                        subsubfeat.set('start', thisB.refSeq.length-sse);
                        subsubfeat.set('strand', -subsubfeat.get('strand'));
                    });
                });
            }
            return origFeatCallback( feature );
        };
        this.inherited(arguments, [data, query, featCallback, finishCallback, errorCallback] );
    },

    _decorate_feature: function( accessors, feature, id, parent ) {
        feature.set = accessors.set;
        this.inherited(arguments);
    }
});
});

