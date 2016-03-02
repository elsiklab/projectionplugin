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
        var projection = this.browser.config.projectionStruct||[];
        var name = ( projection[0]||{} ).name || this.browser.refSeq.name;
        return ( this._deferred.root || this.getDataRoot( name ) )
           .then( function( data ) { successCallback( data.stats ); },
                  errorCallback
                );
    },


    getFeatures: function( query, origFeatCallback, finishCallback, errorCallback ) {
        var thisB = this;
        var startBase = query.start;
        var endBase = query.end;
        var len = this.refSeq.length;
        var projection = this.browser.config.foldStruct;
        var sub = projection.subfeats;

        var gaps=[];
        var offsetgaps=[];
        var counter=0;
        for(var i=0; i<sub.length-1;i++) {
            var gap = sub[i+1].start-sub[i].end;
            gaps.push({start: sub[i].end, end: sub[i+1].start, length: gap});
            offsetgaps.push(counter);
            counter+=gap;
        }

        var fold = function(s) {
            var offset = projection.start-1000;
            for(var i=0; i<gaps.length;i++) {
                if(s.get('start')>gaps[i].start && s.get('end')<gaps[i].end) {
                    return null;
                }
                else if(s.get('end')<gaps[i].start) {
                    break;
                }
                else {
                    offset += gaps[i].length;
                }
            }
            var notnull = function(f) { return f!=null; }
            return new SimpleFeature({
                id: s.get('id'),
                data: {
                    start: s.get('start') - offset,
                    end: s.get('end') - offset,
                    name: s.get('name'),
                    id: s.get('id'),
                    type: s.get('type'),
                    description: s.get('description'),
                    strand: s.get('strand'),
                    subfeatures: array.map(s.get('subfeatures'), fold).filter(notnull)
                }
            });
        }
        var featCallback = function( feature ) {
            var ret = feature;
            if(projection) ret = fold(feature);
            if(!ret) return;
            else return origFeatCallback(ret);
        };

        var q = {
            ref: query.ref, start: projection.start, end: projection.end
        };
        this.inherited(arguments, [q, featCallback, finishCallback, errorCallback] );
    }
});
});

