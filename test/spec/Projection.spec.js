require([
            'dojo/_base/declare',
            'dojo/_base/array',
            'JBrowse/Browser',
            'JBrowse/Model/XHRBlob',
            'JBrowse/Store/SeqFeature/BAM',
            'ProjectionPlugin/Store/SeqFeature/ProjectionBAM',
        ], function(
            declare,
            array,
            Browser,
            XHRBlob,
            ProjectionBAM
        ) {



describe( '1==1', function() {
              it('math', function() {
                  expect(1==1).toBeTruthy();
              });
});


describe( 'test offset', function() {

           
           var features = [];
           var done;
           beforeEach(function(done) {
               var p = new ProjectionBAM({
                   browser: new Browser({ unitTestMode: true }),
                   bam: new XHRBlob( 'data/FM.01.new.sorted.chr11.bam' ),
                   bai: new XHRBlob( 'data/FM.01.new.sorted.chr11.bam.bai' ),
                   refSeq: { name: 'GK000011.2', start: 0, end: 100000000, length: 10000000 }
               });
               p.getFeatures(
                   { ref: 'GK000011.2', start: 1, end: 50000 },
                   function(f) { console.log(f);features.push(f); },
                   function() { done(); },
                   function(e) { console.error(e); }
               );
           });
           it('get feats', function() {

               console.log(features);
               expect( features.length ).toEqual( 197 );
           });

});


});

