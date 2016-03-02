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

    getFeatures: function( query, origFeatCallback, finishCallback, errorCallback ) {
        var thisB = this;
        var startBase = query.start;
        var endBase = query.end;
        var len = this.refSeq.length;
        var projection = this.browser.config.foldStruct;
        var sub = projection.subfeats;

        var gaps=[];
        var gapsum=0;
        for(var i=0; i<sub.length-1;i++) {
            var gap = sub[i+1].start-sub[i].end;
            gaps.push({start: sub[i].end, end: sub[i+1].start, length: gap});
            gapsum+=gap;
        }

        var fold = function(s) {
            var offsetstart = projection.start-1000;
            var offsetend = projection.start-1000;
            if(s.get('start')<gaps[0].end&&s.get('end')>gaps[gaps.length - 1].end) {
                console.log('here',s.get('type'));
                offsetend = offsetstart+gapsum;
            }
            else {
                console.log('here2',s.get('type'));
                for(var i=0; i<gaps.length;i++) {
                    if(s.get('start')>gaps[i].start && s.get('end')<gaps[i].end) {
                        return null;
                    }
                    else if(s.get('end')<gaps[i].start) {
                        break;
                    }
                    else {
                        offsetstart += gaps[i].length;
                        offsetend += gaps[i].length;
                    }
                }
            }
            var notnull = function(f) { return f!=null; }
            return new SimpleFeature({
                id: s.get('id'),
                data: {
                    start: s.get('start') - offsetstart,
                    end: s.get('end') - offsetend,
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

