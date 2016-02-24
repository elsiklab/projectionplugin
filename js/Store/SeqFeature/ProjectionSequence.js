define( [
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

return declare( Sequence,
{
    getReferenceSequence: function( query, seqCallback, errorCallback ) {
        // pad with spaces at the beginning of the string if necessary
        var rev = this.config.reverseComplement||this.browser.config.reverseComplement;
        var origstart = query.start;
        var q = dojo.clone(query);
        var projection = this.browser.config.projectionStruct;
        var s0,s1;
        if( projection ) {
            s0 = projection[0];
            s1 = projection[1];
        }
        if(rev) {
            var start = Math.max(this.refSeq.length - query.end,0);
            var end = Math.min(this.refSeq.length - query.start,this.refSeq.length);
            q.start = start;
            q.end = end;
        }
        var newSeqCallback = function( sequence ) {
            var ret = rev ? Util.revcom( sequence ) : sequence
            var len = ret.length - ret.trim().length;
            // handle corner cases with padding the ref seqs with spaces at ends of chromosomes
            // not fully passing tests yet
            if(len && origstart>1) {
                ret = ret.trim() + new Array(len).join(" ");
            }
            seqCallback(ret);
        }

        if(projection&&query.start>s0.length) {
            this.inherited(arguments, [{ref:s1.name,start:query.start-s0.length,end:query.end-s0.length}, seqCallback, errorCallback] );
        }
        else if(projection&&query.end<s0.length) {
            this.inherited(arguments, [{ref:s0.name,start:query.start,end:query.end}, seqCallback, errorCallback] );
        }
        else if(projection&&query.start<s0.length&&query.end>s0.length) {
            var k = 0;
            var ret = '';
            var f = function(sequence) {
               ret += sequence;
               if(++k==2) seqCallback(ret);
            }
            //check order returned
            this.inherited(arguments, [{ref:s0.name,start:query.start,end:s0.length}, f, errorCallback] );
            this.inherited(arguments, [{ref:s1.name,start:0,end:query.end-s0.length}, f, errorCallback] );
        }
    }
});
});
