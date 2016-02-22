# projectionplugin

A JBrowse plugin for re-mapping coordinates "on the fly"

Currently performs a reverse complement projection


## Options

* reverseComplement - A boolean to specify reverse complementing. This can also be toggled via a menu option that is added when you load the plugin
* storeClass - The projections depend on the data types, currently allows
  * ProjectionPlugin/Store/SeqFeature/ProjectionSequence
  * ProjectionPlugin/Store/SeqFeature/ProjectionNCList
  * ProjectionPlugin/Store/SeqFeature/ProjectionBigWig
  * ProjectionPlugin/Store/SeqFeature/ProjectionBAM



## Example configuration


      {
         "storeClass" : "ProjectionPlugin/Store/SeqFeature/ProjectionSequence",
         "chunkSize" : 20000,
         "urlTemplate" : "seq/{refseq_dirpath}/{refseq}-",
         "label" : "DNA",
         "type" : "SequenceTrack",
         "category" : "Reference sequence",
         "key" : "Reference sequence"
      },
      {
         "style" : {
            "className" : "feature"
         },
         "storeClass" : "ProjectionPlugin/Store/SeqFeature/ProjectionNCList",
         "trackType" : null,
         "urlTemplate" : "tracks/Genes/{refseq}/trackData.json",
         "compress" : 0,
         "type" : "FeatureTrack",
         "label" : "Genes"
      },
      {
          "storeClass":"ProjectionPlugin/Store/SeqFeature/ProjectionBigWig",
          "autoscale": "local",
          "label": "Forager.bw",
          "type": "JBrowse/View/Track/Wiggle/XYPlot",
          "urlTemplate": "Forager.bw"
      },
      {
          "storeClass":"ProjectionPlugin/Store/SeqFeature/ProjectionBAM",
          "label": "Forager.bam",
          "type": "JBrowse/View/Track/Alignments2",
          "overridePlugins": true, // WA-specific flag to enable canvasfeatures alignments
          "urlTemplate": "Forager.bam"
      }

## Screenshots

![](img/forward.png)
![](img/reverse.png)




