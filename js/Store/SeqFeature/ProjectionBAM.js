define([
           'dojo/_base/declare',
           'dojo/_base/lang',
           'dojo/_base/array',
           'dojo/promise/all',
           'dojo/Deferred', 
           'JBrowse/Store/SeqFeature/BAM',
           'JBrowse/Model/SimpleFeature'
       ],
       function(
           declare,
           lang,
           array,
           all,
           Deferred,
           BAM,
           SimpleFeature
       ) {
return declare( BAM,
{
    getFeatures: function( query, origFeatCallback, finishCallback, errorCallback ) {
        var thisB = this;
        var startBase = query.start;
        var endBase = query.end;
        var len = this.refSeq.length;
        var projection = this.browser.config.projectionStruct;

        var position_offset = 0;
        var projection_offset = 0;
        var currseq;
        var nextseq;
        var cross = false;
        var next_adder = 0;
        for(var i = 0; i < projection.length-1; i++) {
            var len = projection[i].end - projection[i].start;
            currseq = projection[i].name;
            var nextseq = projection[i+1].name;
            if (position_offset + len > query.end) {
                break;
            }
            else if(currseq != nextseq) {
                console.log('currseq',currseq,nextseq)
                position_offset += 10000+len;
                projection_offset += 0;
            }
            else {
                console.log('currseq adding gap',currseq,nextseq)
                position_offset += 10000;
                projection_offset += 0;
            }
        }
        if(query.start < position_offset && position_offset < query.end) {
            nextseq = currseq;
            currseq = (projection[i-1]||{}).name || currseq;
            cross = true;
        }
        console.log(nextseq, currseq, position_offset, projection_offset);
        function overlap(min1, max1, min2, max2) {
            return Math.max(0, Math.min(max1, max2) - Math.max(min1, min2))
        }


        var shift = function(s) {
            var offset = 0;
            var seq = s.get('seq_id');
            for(var i=0; i<projection.length;i++) {
                if(overlap(s.get('start'),s.get('end'),projection[i].start,projection[i].end)) {
                    offset+=projection.offset;
                }
            }
            return new SimpleFeature({
                id: s.get('id'),
                data: lang.mixin(lang.clone(s.data), {
                    start: s.get('start') + offset,
                    end: s.get('end') + offset,
                    strand: s.get('strand'),
                    seq_id: s.get('seq_id'),
                    multi_segment_template: s.get('multi_segment_template'),
                    multi_segment_next_segment_unmapped: s.get('multi_segment_next_segment_unmapped'),
                    next_seq_id: s.get('next_seq_id'),
                    multi_segment_all_correctly_aligned: s.get('multi_segment_all_correctly_aligned'),
                    multi_segment_first: s.get('multi_segment_first'),
                    next_segment_position: s.get('next_segment_position')
                })
            });
        }
        var featCallback = function( feature ) {
            var ret = feature;
            if(projection) ret = shift(feature);
            return origFeatCallback(ret);
        };

        if(!cross) {
            console.log('start',position_offset, projection_offset, query.start + position_offset + projection_offset);
            console.log('end', position_offset, projection_offset, query.end + position_offset + projection_offset);
            var q = {ref: currseq, start: query.start + position_offset + projection_offset, end: query.end + position_offset + projection_offset};
            this.inherited(arguments, [q, featCallback, finishCallback, errorCallback] );
        }
        else {
            var def1 = new Deferred();
            var def2 = new Deferred();
            var query1 = { ref: currseq, start: query.start, end: position_offset-1+projection_offset };
            var query2 = { ref: nextseq, start: 0, end: query.end - position_offset+projection_offset };
            var supermethod = this.getInherited(arguments);
            var callback = function() {
                def1.resolve();
                supermethod.apply(thisB, [query2, featCallback, function() { def2.resolve(); }, errorCallback] );
            }
            supermethod.apply(this, [query1, featCallback, callback, errorCallback] );
            all([def1.promise,def2.promise]).then(finishCallback);
        }
    }


});
});

