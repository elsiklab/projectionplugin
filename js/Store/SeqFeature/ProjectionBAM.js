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
    function overlap(min1, max1, min2, max2) {
        return Math.max(0, Math.min(max1, max2) - Math.max(min1, min2));
    }
    return declare(BAM, {
        constructor: function(args) {
            this.projection = args.projectionStruct || this.browser.config.projectionStruct;
        },

        getFeatures: function(query, origFeatCallback, finishCallback, errorCallback) {
            var thisB = this;

            var shift = function(s) {
                var offset = 0;
                thisB.projection.forEach(function(p) {
                    if (overlap(s.get('start'), s.get('end'), p.start, p.end)) {
                        offset += p.offset;
                    }
                });
                if (s.get('multi_segment_template')) {
                    var ret = s.get('next_segment_position').split(':');
                    var nextStart = ret[1];
                    var nextOffset = 0;
                    thisB.projection.forEach(function(p) {
                        if (overlap(nextStart, nextStart + 100, p.start, p.end)) {
                            nextOffset += p.offset;
                        }
                    });
                    nextStart += nextOffset;
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
            };
            var featCallback = function(feature) {
                var ret = feature;
                if (thisB.projection) ret = shift(feature);
                return origFeatCallback(ret);
            };

            var ret = this.translate(query);
            console.log(ret);

            if (lang.isArray(ret)) {
                var def1 = new Deferred();
                var def2 = new Deferred();
                var supermethod = this.getInherited(arguments);
                var callback = function() {
                    def1.resolve();
                    supermethod.apply(thisB, [ret[1], featCallback, function() { def2.resolve(); }, errorCallback]);
                };
                supermethod.apply(this, [ret[0], featCallback, callback, errorCallback]);
                all([def1.promise, def2.promise]).then(finishCallback);
            } else {
                this.inherited(arguments, [ret, featCallback, finishCallback, errorCallback]);
            }
        },

        translate: function(query) {
            var offset = 0;
            var currseq;
            var nextseq;
            var cross = false;
            var newstart = 0;

            array.some(this.projection, function(p, i) {
                offset += p.offset + (p.end - p.start);
                currseq = p.name;
                nextseq = (this.projection[i + 1] || {}).name || '';
                newstart = p.offset;
                if (query.end >= offset && query.start <= offset) {
                    newstart = (this.projection[i + 1] || {}).offset;
                    return true;
                } else {
                    return false;
                }
            }, this);
            if (query.start < offset && offset < query.end) {
                cross = true;
            }
            var len = query.end - query.start;
            var sub = offset - query.start;

            console.log(offset, newstart);

            return cross ? [{ ref: currseq, start: query.start, end: offset - 1 }, { ref: nextseq, start: newstart, end: newstart + len - sub }] :
           { ref: currseq, start: query.start, end: query.end };
        }
    });
});

