sparqplug-hmt
=============

[SPARQL Environment](https://github.com/wcatron/SPARQL-Environment) config and plugins for the Homer Multitext project

## Plugins

### General

1. sparqplug-in-text
1. sparqplug-out-json
1. sparqplug-out-table

These plugins are part of the base set of plugins for the SPARQL Environment and will already be included in the plugin folder.

### Specific

1. sparqplug-out-citekit
1. sparqplug-in-cts-browser
1. sparqplug-in-hmt-names
1. sparqplug-in-hmt-places

The Citekit output plugin uses the jquery.citekit.js that comes with the SPARQL Environment.

The CTS-Browser input plugin is under development.

The HMT-names and HMT-places are beta plugins, the data they are accessing is a subset of the Homer Multitext project that has not yet been published. The data they query instead is coming from the [hmt-authlists](https://github.com/homermultitext/hmt-authlists/tree/master/data) repo. To make the data accessable for SPARQL, we have created an all.ttl file with all of the information about the people and places in the hmt-authlists as well as adding some suplimental material about where some of the names and places occur in the scholia.
You can run this .ttl file using [jena-fuseki](http://jena.apache.org/documentation/serving_data/index.html). To do so, [download](http://jena.apache.org/download/index.cgi) jena-fuseki, `cd` to where you are going to keep the jena-fuseki folder, then run:

	./fuseki-server --file=/PATH/TO/sparqplugs-hmt/plugNamePlaceData/all.ttl /names
