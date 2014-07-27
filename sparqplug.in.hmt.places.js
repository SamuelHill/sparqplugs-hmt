sparqplug.in.hmtplaces = {type:"in","title":"Places","description":"Browse and search places.","icon":"&#xf002;","css":"sparqplug.in.hmt.places.css"};

sparqplug.in.hmtplaces.load = function () {
	console.log("Load HMT Places");
	var places = $(document).query('SELECT ?place ?label WHERE { <urn:cite:hmt:place> cts:possesses ?place . ?place rdf:label ?label . }', {"source":"http://localhost:3030/names/"});
	places.sort(function(a, b){
		if(a.label.value < b.label.value) return -1;
		if(a.label.value > b.label.value) return 1;
		return 0;})
	console.log(places);

	var places_list = $("<div/>",{
		id:'hmt-places-list',
		'class':'hmt-places-column'});

	var places_search = $('<input/>',{
		type:'text',
		id:'hmt-places-searchbar',
		placeholder:'Search places'
	}).keyup(sparqplug.in.hmtplaces.searchPlaces);

	places_list.append(places_search);

	var properties = $("<div/>",{
		id:'hmt-places-properties',
		'class': 'hmt-places-column'}).hide();

	$.each(places,function (index,value) {
		urn = value.place.value;
		urn_components = urn.split('.');
		placeNum = urn_components[urn_components.length-1];
		label = value.label.value;
		li = $('<li/>', {id: 'place-'+placeNum, text: label}).data('urn',urn).click(function () {
			sparqplug.in.hmtplaces.selectedPlace($(this).data('urn'));
		});
		$(places_list).append(li);
	});

	$("#sparqplug-in-hmt-places").append(places_list);
	$("#sparqplug-in-hmt-places").append(properties);
}

sparqplug.in.hmtplaces.error = function (error) { alert('There was an Error!'); }

sparqplug.in.hmtplaces.updateUI = function () { console.log("updateUI in.hmt.places"); }

sparqplug.in.hmtplaces.selectedPlace = function (place_URN) {
	$("#hmt-places-properties").show();
	console.log('Selected Name: '+place_URN);

	urn_components = place_URN.split('.');
	placeNum = urn_components[urn_components.length-1];

	$('#hmt-places-list').children().removeClass('selected');
	$('#place-'+placeNum).addClass('selected');

	var desc = $(document).query('SELECT ?description WHERE { <'+place_URN+'> citedata:description ?description . }', {"source":"http://localhost:3030/names/"});
	var prop = $(document).query('SELECT ?object WHERE { <'+place_URN+'> cts:containedBy ?object . }', {"source":"http://localhost:3030/names/"});
	prop = prop.sort(function(a, b){
		if(a.object.value < b.object.value) return -1;
		if(a.object.value > b.object.value) return 1;
		return 0;})

	$("#hmt-places-properties").children().remove();

	$.each(desc,function (index,value) {
		desc_text = value.description.value;
		li = $('<li/>', {style: 'font-weight: bold;', text: desc_text});
		$("#hmt-places-properties").append(li);
	});

	li = $('<li/>', {style: 'font-style: italic;', text: place_URN});
	$("#hmt-places-properties").append(li);

	$.each(prop,function (index,value) {
		prop_text = value.object.value;
		li = $('<li/>', {text: prop_text});
		$("#hmt-places-properties").append(li);
	});
}

sparqplug.in.hmtplaces.searchPlaces = function () {
	var searchTerm = $('#hmt-places-searchbar').val();
	$('#hmt-places-list > li').each(function (index, element) {
		console.log(element);
	 	li_searchable_text = element.innerHTML;
		if (li_searchable_text.indexOf(searchTerm) == -1) $(element).hide();
		else $(element).show();
	});
}

plugins['sparqplug-in-hmt-places'] = sparqplug.in.hmtplaces;