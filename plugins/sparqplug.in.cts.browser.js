sparqplug.in.ctsbrowser = {type:"in","title":"CTS Browser","description":"Browse and search collections and their properties.","icon":"&#xf002;","css":"sparqplug.in.cts.browser.css"};

sparqplug.in.ctsbrowser.load = function () {
	console.log("load cts browser");
	var collections = $("<div/>",{
		id:'cts-browser-collections',
		'class': 'plugin-column'
	});
	
	var search_collections = $('<input/>',{
		type:'text',
		id:'cts-browser-collections-searchbar',
		placeholder:'Search Collections, Editions, Translations, Works and Text Groups'
	}).keyup(sparqplug.in.ctsbrowser.searchCollections);
	
	var types = environment.config[environment.currentDataset].cts.types;
	
	var collections_list = $('<ul/>');
	
	collections_list.append(search_collections);
	
	$.each(types, function (type_name, type_object) {
		
		var li_header = $('<div/>',{
			class: 'cts-browser-header',
			text: type_name
		});
		
		$(collections).append(li_header);
		
		var collections_results = environment.silentQuery('SELECT ?subject ?label WHERE { ?subject  rdf:type '+type_object+' . ?subject rdf:label ?label }');	
		
		var collection = $('<li />');
		collection.append(li_header);
		var collection_list = $('<ul/>');
		
		$.each(collections_results,function (index,value) {
			urn = value.subject.value;
			label = value.label.value;
		
			li = $('<li/>',{
				id: 'collection-'+urn,
				html: "<span class='cts-browser-label'>"+label+"</span> <span class='cts-browser-urn urn'>"+urn+'</span>'
			}).data('urn',urn)
			
			if (type_object == 'cite:CiteCollection') {
				li.click(function () {
					sparqplug.in.ctsbrowser.selectedCollection($(this).data('urn'));
				});
			} else if (type_object == 'cts:Edition' || type_object == 'cts:Translation') {
				li.click(function () {
					sparqplug.in.ctsbrowser.selectedEdition($(this).data('urn'));
				});
			} else if (type_object == 'cts:Work') {
				li.click(function () {
					sparqplug.in.ctsbrowser.selectedWork($(this).data('urn'));
				});
			}
			
			collection_list.append(li);
		
		});
		
		collection.append(collection_list);
		collections_list.append(collection);
	});
	
	collections.append(collections_list);
		
	var properties = $("<div/>",{
		id:'cts-browser-properties',
		'class': 'plugin-column'
	});
	
	var search = $("<div/>",{
		id:'cts-browser-search',
		'class': 'plugin-column'
	}).append("<div id='cts-browser-search-header'></div>").append("<input type='text' id='cts-browser-simple-search' placeholder='Simple Search' />")
		.append("<input type='text' id='cts-browser-regex-search' placeholder='Regex Search' />").hide();
		
	var search_submit = $("<div/>",{
		id:'cts-browser-search-submit',
		text:'Submit'
	}).click(sparqplug.in.ctsbrowser.submitSearch);
	
	search.append(search_submit);
	
	$("#sparqplug-in-cts-browser").append(collections);
	$("#sparqplug-in-cts-browser").append(properties);
	$("#sparqplug-in-cts-browser").append(search);
	
	collections.stickySectionHeaders({
	  stickyClass     : 'sticky',
	  headlineSelector: '.cts-browser-header'
	});
        
}

sparqplug.in.ctsbrowser.error = function (error) {
	alert('There was an Error!');
}

sparqplug.in.ctsbrowser.updateUI = function () {
	console.log("updateUI in.cts.browser");
	//$('#sp-in-text-textarea').val(environment.latestQuery);
}

//Plugin Specific

sparqplug.in.ctsbrowser.selectedCollection = function (collection_URN) {
		$('#cts-browser-properties').show();
		
	$('#cts-browser-collections').children().removeClass('selected');
	$(('#collection-'+collection_URN)).addClass('selected');
	
	var properties = $(document).query('SELECT ?object ?label ?type WHERE { <'+collection_URN+'> cite:collProperty ?object . ?object cite:propLabel ?label . ?object cite:propType ?type }');
	
	$('#cts-browser-properties').children().remove();
	$('#cts-browser-search').hide();
	$.each(properties,function (index,value) {
		uri = value.object.value;
		label = value.label.value;
		type = value.type.value;
		
		uri_components = uri.split('/');
		property_name = uri_components[uri_components.length-1];
		li = $('<li/>',{
			id: 'property-'+property_name,
			class: 'type-'+type,
			text: label
		}).data('uri',uri);
		
		if (type == "string" || type == "markdown") {
			// Searchable
			li.click(function () {
						sparqplug.in.ctsbrowser.selectedProperty($(this).data('uri'));
					}).addClass('property-searchable');
					
		}
			
		$('#cts-browser-properties').append(li);
	});
}

sparqplug.in.ctsbrowser.searchCollections = function () {
	var searchTerm = $('#cts-browser-collections-searchbar').val();
	
	$('#cts-browser-collections > ul > li > ul > li').each(function (index, element) {
		console.log(element);
	 	var spans = $(element).children();
		var li_searchable_text = spans[0].innerHTML;
		if (li_searchable_text.indexOf(searchTerm) == -1) {
			$(element).hide();
		} else {
			$(element).show();
		}
	});
}
/*
sparqplug.in.ctsbrowser.selectedURN = function (root_URN) {
		
	$('#cts-browser-collections').children().removeClass('selected');
	$('#collection-'+root_URN).addClass('selected');
	
	var properties = $(document).query('SELECT distinct ?verb WHERE { <'+root_URN+'> ?verb ?subject .}');
	
	$('#cts-browser-properties').children().remove();
	$('#cts-browser-search').hide();
	$.each(properties,function (index,value) {
		verb = value.verb.value;
		
		verb_components = verb.split('/');
		verb_name = verb_components[verb_components.length-1];
		li = $('<li/>',{
			id: 'verb-'+verb_name,
			text: verb_name
		}).data('verb',verb);
		
		// Searchable
		li.click(sparqplug.in.ctsbrowser.selectedVerb);
		
		

		$('#cts-browser-properties').append(li);
	});
	
	$('#cts-browser-properties').data('urn', root_URN);
}

sparqplug.in.ctsbrowser.selectedVerb = function () {
	var verb = $(this).data('verb');
	var urn = $('#cts-browser-properties').data('urn');
	
	var properties = $(document).query('SELECT distinct ?verb WHERE { <'+urn+'> <'+verb+'> ?subject . ?subject ?verb ?object }');
	
	$('#cts-browser-properties').children().remove();
	$('#cts-browser-search').hide();
	$.each(properties,function (index,value) {
		verb = value.verb.value;
		
		verb_components = verb.split('/');
		verb_name = verb_components[verb_components.length-1];
		li = $('<li/>',{
			id: 'verb-'+verb_name,
			text: verb_name
		}).data('verb',verb);
		
		// Searchable
		li.click(sparqplug.in.ctsbrowser.selectedVerb);
		
		

		$('#cts-browser-properties').append(li);
	});
	
	$('#cts-browser-properties').data('urn', root_URN);
	
	/*var properties = $(document).query('SELECT ?o WHERE { <'+urn+'> ?verb ?o.}');
	
	$('#cts-browser-properties').children().remove();
	$('#cts-browser-search').hide();
	$.each(properties,function (index,value) {
		urn = value.o.value;
		
		li = $('<li/>',{
			text: urn
		}).data('urn',urn);
		
		// Searchable
		li.click(function () {
				sparqplug.in.ctsbrowser.selectedURN($(this).data('urn'));
			});
			
			if (false) {
				//Searchable
				li.addClass('property-searchable');
			}

		$('#cts-browser-properties').append(li);
	});
	
	$('#cts-browser-properties').data('urn');
	*/
//}

sparqplug.in.ctsbrowser.selectedProperty = function (property_URI) {
	$('#cts-browser-search').data('search_type','property_URI');
	$('#cts-browser-search-header').html('Searching Property: '+property_URI);
	
	console.log('Selected Property: '+property_URI);
	
	uri_components = property_URI.split('/');
	property_name = uri_components[uri_components.length-1];
	
	$('#cts-browser-properties').children().removeClass('selected');
	$('#property-'+property_name).addClass('selected');
	
	$('#cts-browser-search').show();
	
	$('#cts-browser-search').data('property_URI',property_URI);
	
	var query = "SELECT ?object ?subject WHERE { ?subject <"+property_URI+"> ?object . } LIMIT 1000";
	environment.performQuery(query);
}

sparqplug.in.ctsbrowser.submitSearch = function () {
	var simple_search = $('#cts-browser-simple-search').val();
	var regex = $('#cts-browser-regex-search').val();
	
	if ($('#cts-browser-search').data('search_type') == 'property_URI') {
		var property_URI = $('#cts-browser-search').data('property_URI');
		//var urn = $('#cts-browser-search').data('search_urn');
		
		if (property_URI && property_URI != "") {
			if (simple_search != "") {
				sparqplug.in.ctsbrowser.searchPropertyForRegex(property_URI,'^'+simple_search);
			} else {
				sparqplug.in.ctsbrowser.searchPropertyForRegex(property_URI,regex);
			}
		}
	} else if ($('#cts-browser-search').data('search_type') == 'hasTextContents') {
		var urn = $('#cts-browser-search').data('search_urn');

		if (simple_search != "") {
			sparqplug.in.ctsbrowser.searchTextContentsForRegex(urn,'^'+simple_search);
		} else {
			sparqplug.in.ctsbrowser.searchTextContentsForRegex(urn,regex);
		}
	} else if ($('#cts-browser-search').data('search_type') == 'hasTextContents-work') {
		var urn = $('#cts-browser-search').data('search_urn');
		
		if (simple_search != "") {
			sparqplug.in.ctsbrowser.searchWorkTextContentsForRegex(urn,'^'+simple_search);
		} else {
			sparqplug.in.ctsbrowser.searchWorkTextContentsForRegex(urn,regex);
		}
	}
}

sparqplug.in.ctsbrowser.selectedEdition = function (urn) {
	$('#cts-browser-search').data('search_type','hasTextContents');
	$('#cts-browser-search').data('search_urn',urn);
	
	$('#cts-browser-search-header').html('Searching URN: '+urn);
	$('#cts-browser-search').show();
	$('#cts-browser-properties').hide();
}

sparqplug.in.ctsbrowser.selectedWork = function (urn) {
	$('#cts-browser-search').data('search_type','hasTextContents-work');
	$('#cts-browser-search').data('search_urn',urn);
	
	$('#cts-browser-search-header').html('Searching URN: '+urn);
	$('#cts-browser-search').show();
	$('#cts-browser-properties').hide();
}

sparqplug.in.ctsbrowser.searchPropertyForRegex = function (property_URI,regex) { //Collections
	var query = "SELECT ?subject ?value WHERE { ?subject <"+property_URI+"> ?value . FILTER regex( ?value ,'"+regex+"','i' ) }";
	environment.performQuery(query);
}

sparqplug.in.ctsbrowser.searchTextContentsForRegex = function (root_URN, regex) { //Editions and Translations
	var query = "SELECT ?subject ?object WHERE {\n  ?subject cts:belongsTo <"+root_URN+"> . \n  ?subject cts:hasTextContent ?object .\n  FILTER regex( ?object ,'"+regex+"','i' ) \n}"
	environment.performQuery(query);
}
sparqplug.in.ctsbrowser.searchWorkTextContentsForRegex = function (root_URN, regex) { //Works
	var query = "SELECT ?subject ?object WHERE {\n  <"+root_URN+"> cts:possesses  ?edition .\n  ?subject cts:belongsTo ?edition .\n  ?subject cts:hasTextContent ?object .\n  FILTER regex( ?object ,'"+regex+"','i' )\n}"
	environment.performQuery(query);
}

plugins['sparqplug-in-cts-browser'] = sparqplug.in.ctsbrowser;


/* jQuery plugin for sticky headers */

/*!
 * Sticky Section Headers
 *
 * Copyright (c) 2013 Florian Plank (http://www.polarblau.com/)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * USAGE:
 *
 * $('#container').stickySectionHeaders({
 *   stickyClass      : 'sticky',
 *   headlineSelector : 'strong'
 * });
 *
 */

(function($){
  $.fn.stickySectionHeaders = function(options) {

    var settings = $.extend({
      stickyClass     : 'sticky',
      headlineSelector: 'strong'
    }, options);

    return $(this).each(function() {
      var $this = $(this);
      $(this).find('ul:first').bind('scroll.sticky', function(e) {
        $(this).find('> li').each(function() {
          var $this      = $(this),
              top        = $this.position().top,
              height     = $this.outerHeight(),
              $head      = $this.find(settings.headlineSelector),
              headHeight = $head.outerHeight();

          if (top < 0) {
            $this.addClass(settings.stickyClass).css('paddingTop', headHeight);
            $head.css({
              'top'  : (height + top < headHeight) ? (headHeight - (top + height)) * -1 : '',
              'width': $this.outerWidth() - $head.cssSum('paddingLeft', 'paddingRight')
            });
          } else {
            $this.removeClass(settings.stickyClass).css('paddingTop', '');
          }
        });
      });
    });
  };

  /* A little helper to calculate the sum of different
   * CSS properties
   *
   * EXAMPLE:
   * $('#my-div').cssSum('paddingLeft', 'paddingRight');
   */
  $.fn.cssSum = function() {
    var $self = $(this), sum = 0;
    $(arguments).each(function(i, e) {
      sum += parseInt($self.css(e) || 0, 10);
    });
    return sum;
  };

})(jQuery);
