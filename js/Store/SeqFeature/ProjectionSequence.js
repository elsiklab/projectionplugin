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
        var thisB = this;
        var origstart = query.start;
        var q = dojo.clone(query);
        var projection = this.browser.config.projectionStruct || [];
        
        var offset = 0;
        var currseq;
        var nextseq;
        var cross = false;
        for(var i = 0; i < projection.length; i++) {
            currseq = projection[i].name;
            if(offset+projection[i].length > query.end) {
                break;
            }
            offset += projection[i].length;
        }
        if(query.start < offset && offset < query.end) {
            nextseq = currseq;
            currseq = (projection[i-1]||{}).name||currseq;
            cross = true;
        }

        if(!cross) {
            var q = {ref: currseq, start: query.start - offset, end: query.end - offset};
            this.inherited(arguments, [q, featCallback, finishCallback, errorCallback] );
        }
        else {
            var seq = '';
            while( seq.length < query.end-query.start )
                seq += ' ';

            var def1 = new Deferred();
            var def2= new Deferred();
            var q1 = { ref: currseq, start: query.start, end: offset-1 };
            var q2 = { ref: nextseq, start: 0, end: query.end - offset };
            var callback1 = function(s) { seq = thisB._replaceAt(seq, 0, s); def1.resolve(); }
            var callback2 = function(s) { seq = thisB._replaceAt(seq, s0.length-query.start, s); def2.resolve(); }

            this.inherited(arguments, [q1,callback1,errorCallback]);
            this.inherited(arguments, [q2,callback2,errorCallback]);
            all([def1.promise,def2.promise]).then(function() {seqCallback(seq)});    
        }
    },

    _replaceAt: function( str, offset, replacement ) {
        var rOffset = 0;
        if( offset < 0 ) {
            rOffset = -offset;
            offset = 0;
        }

        var length = Math.min( str.length - offset, replacement.length - rOffset );

        return str.substr( 0, offset ) + replacement.substr( rOffset, length ) + str.substr( offset + length );
    }
        
});
});
