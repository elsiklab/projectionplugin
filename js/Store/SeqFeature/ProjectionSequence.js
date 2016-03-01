define( [
            'dojo/_base/declare',
            'dojo/_base/lang',
            'dojo/promise/all',
            'dojo/Deferred',
            'JBrowse/Store/SeqFeature/SequenceChunks',
            'JBrowse/Util'
        ],
        function(
            declare,
            lang,
            all,
            Deferred,
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
        var projection = this.browser.config.projectionStruct || [];
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
            var seq = '';
            while( seq.length < query.end-query.start )
                seq += ' ';

            var def1 = new Deferred();
            var def2= new Deferred();
            function replaceAt( str, offset, replacement ) {
                var rOffset = 0;
                if( offset < 0 ) {
                    rOffset = -offset;
                    offset = 0;
                }

                var length = Math.min( str.length - offset, replacement.length - rOffset );

                return str.substr( 0, offset ) + replacement.substr( rOffset, length ) + str.substr( offset + length );
            }
            this.inherited(arguments, [{ref:s0.name,start:query.start,end:s0.length},
                function(seqret) {
                    seq = replaceAt( seq, 0, seqret );
                    def1.resolve();
                },
                errorCallback
            ]);
            this.inherited(arguments, [{ref:s1.name,start:0,end:query.end-s0.length},
                function(seqret) {
                    seq = replaceAt( seq, s0.length-query.start, seqret );
                    def2.resolve();
                },
                errorCallback
            ]);
            all([def1.promise,def2.promise]).then(function() {
                seqCallback(seq);
            });
        }
    }
});
});
