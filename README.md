# projectionplugin

A JBrowse plugin for re-mapping coordinates "on the fly"

Currently performs a reverse complement projection


## Options

* reverseComplement - A boolean to specify reverse complementing. This can also be toggled via a menu option that is added when you load the plugin



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
      }

## Screenshots

![](img/forward.png)
![](img/reverse.png)
