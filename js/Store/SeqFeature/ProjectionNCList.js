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
        var len = this.refSeq.length;

        if(rev) {
            query.start = Math.max(len - endBase, 0);
            query.end = Math.min(len - startBase, len);
        }
        

        var featCallback = function( feature, path ) {
            var flip = function(f) {
                var s = f.get('start'), e = f.get('end');
                f.set('end', len - s);
                f.set('start', len - e);
                f.set('strand', -f.get('strand'));
                if(f.get('subfeatures')) array.forEach(f.get('subfeatures'), flip);
            }
            if( rev ) flip(feature);
            
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

