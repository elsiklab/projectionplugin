define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'JBrowse/Store/SeqFeature/SequenceChunks',
    'JBrowse/Util'
],
function(
    declare,
    lang,
    Sequence,
    Util
) {
    return declare(Sequence, {
        getReferenceSequence: function(query, seqCallback, errorCallback) {
            var rev = this.config.reverseComplement || this.browser.config.reverseComplement;
            var origstart = query.start;
            var q = dojo.clone(query);
            if (rev) {
                var start = Math.max(this.refSeq.length - query.end, 0);
                var end = Math.min(this.refSeq.length - query.start, this.refSeq.length);
                q.start = start;
                q.end = end;
            }
            var newSeqCallback = function(sequence) {
                var ret = rev ? Util.revcom(sequence) : sequence;
                var len = ret.length - ret.trim().length;
                if (len && origstart > 1) {
                    ret = ret.trim() + new Array(len).join(' ');
                }
                seqCallback(ret);
            };
            this.inherited(arguments, [q, newSeqCallback, errorCallback]);
        }
    });
});


