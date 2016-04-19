require([
            'dojo/_base/declare',
            'dojo/_base/array',
            'JBrowse/Browser',
            'JBrowse/Model/XHRBlob',
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
           var p = new ProjectionBAM({
               browser: new Browser({ unitTestMode: true }),
               bam: new XHRBlob( 'data/FM.01.new.sorted.chr11.bam' ),
               bai: new XHRBlob( 'data/FM.01.new.sorted.chr11.bam.bai' ),
               refSeq: { name: 'GK000011.2', start: 0, end: 100000000, length: 10000000 },
               projectionStruct: [
                   {
                       "start":0,
                       "end":100000,
                       "name": "GK000011.2",
                       "offset": 0
                   },
                   {
                       "start":100000,
                       "end": 200000,
                       "name": "GK000011.2",
                       "offset": 10000
                   }
               ]
           });
           beforeEach(function(done) {
               

               done();

               
//               p.getFeatures(
//                   { ref: 'GK000011.2', start: 1, end: 50000 },
//                   function(f) { console.log(f);features.push(f); },
//                   function() { done(); },
//                   function(e) { console.error(e); }
//               );
           });

           it('verify', function() {
               var ret = p.translate({ ref: 'GK000011.2', start: 1, end: 50000 });
               expect(ret == { ref: 'GK000011.2', start: 1, end: 50000 }).toBeTruthy();
               console.log(ret);
               var ret = p.translate({ ref: 'GK000011.2', start: 90000, end: 110000 });
               console.log(ret);
               expect(ret == [{ ref: 'GK000011.2', start: 99000, end: 100000 }, { ref: 'GK000011.2', start: 100000, end: 110000 }]).toBeTruthy();
           });


           xit('get feats', function() {

               console.log(features);
               expect( features.length ).toEqual( 197 );
           });

});


});

