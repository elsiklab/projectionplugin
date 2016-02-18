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
        if(rev) {
            var start = Math.max(this.refSeq.length - query.end,0);
            var end = Math.min(this.refSeq.length - query.start,this.refSeq.length);
            query.start = start;
            query.end = end;
        }
        var newSeqCallback = function( sequence ) {
              var ret = rev ? Util.revcom( sequence ) : sequence
              var len = ret.length - ret.trim().length;
              // handle corner cases with padding the ref seqs with spaces at ends of chromosomes
              // not fully passing tests yet
              if(len && origstart>1) {
                  ret = ret.trim() + new Array(len).join(" ");
              }

              seqCallback( ret )
        }


        this.inherited( arguments, [query, newSeqCallback, errorCallback] );
    }
});
});
