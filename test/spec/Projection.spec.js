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
                       "offset": 100000
                   }
               ]
           });


           it('verify', function() {

               var ret = p.translate({ ref: 'GK000011.2', start: 1, end: 50000 });
               console.log('r1',ret,{ ref: 'GK000011.2', start: 1, end: 50000 });
               expect(ret).toEqual({ ref: 'GK000011.2', start: 1, end: 50000 });

               var ret = p.translate({ ref: 'GK000011.2', start: 90000, end: 110000 });
               console.log('r2',ret);
               expect(ret[0]).toEqual({ ref: 'GK000011.2', start: 90000, end: 99999 });
               expect(ret[1]).toEqual({ ref: 'GK000011.2', start: 100000, end: 110000 });
           });

});

describe( 'test shrink', function() {

           
           var features = [];
           var done;
           var p = new ProjectionBAM({
               browser: new Browser({ unitTestMode: true }),
               bam: new XHRBlob( 'data/FM.01.new.sorted.chr11.bam' ),
               bai: new XHRBlob( 'data/FM.01.new.sorted.chr11.bam.bai' ),
               refSeq: { name: 'GK000011.2', start: 0, end: 100000000, length: 10000000 },
               projectionStruct: [
                   {
                       "start": 0,
                       "end": 100000,
                       "name": "GK000011.2",
                       "offset": 0
                   },
                   {
                       "start": 300000,
                       "end": 100000000,
                       "name": "GK000011.2",
                       "offset": 300000 
                   }
               ]
           });
           it('verify shrink', function() {

               var ret = p.translate({ ref: 'GK000011.2', start: 1, end: 50000 });
               expect(ret).toEqual({ ref: 'GK000011.2', start: 1, end: 50000 });

               var ret = p.translate({ ref: 'GK000011.2', start: 90000, end: 110000 });
               expect(ret[0]).toEqual({ ref: 'GK000011.2', start: 90000, end: 99999 });
               expect(ret[1]).toEqual({ ref: 'GK000011.2', start: 300000, end: 310000 });
           });


});



});

