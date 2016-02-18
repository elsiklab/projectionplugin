# projectionplugin

A JBrowse plugin for re-mapping coordinates "on the fly"

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
