sparqplug.in.hmtnames = {type:"in","title":"Names","description":"Browse and search names.","icon":"&#xf002;","css":"sparqplug.in.hmt.names.css"};

sparqplug.in.hmtnames.load = function () {
	console.log("Load HMT Names");
	var names = $(document).query('SELECT ?pers ?label WHERE { <urn:cite:hmt:pers> cts:possesses ?pers . ?pers rdf:label ?label .}', {"source":"http://localhost:3030/names/"});
	names.sort(function(a, b){
		if(a.label.value < b.label.value) return -1;
		if(a.label.value > b.label.value) return 1;
		return 0;})
	console.log(names);

	var names_list = $("<div/>",{
		id:'hmt-names-list',
		'class':'hmt-names-column'});

	var names_search = $('<input/>',{
		type:'text',
		id:'hmt-names-searchbar',
		placeholder:'Search Names'
	}).keyup(sparqplug.in.hmtnames.searchNames);

	names_list.append(names_search);

	var properties = $("<div/>",{
		id:'hmt-names-properties',
		'class': 'hmt-names-column'}).hide();

	$.each(names,function (index,value) {
		urn = value.pers.value;
		urn_components = urn.split('.');
		persNum = urn_components[urn_components.length-1];
		label = value.label.value;
		li = $('<li/>', {id: 'name-'+persNum, text: label}).data('urn',urn).click(function () {
			sparqplug.in.hmtnames.selectedName($(this).data('urn'));
		});
		$(names_list).append(li);
	});

	$("#sparqplug-in-hmt-names").append(names_list);
	$("#sparqplug-in-hmt-names").append(properties);
}

sparqplug.in.hmtnames.error = function (error) { alert('There was an Error!'); }

sparqplug.in.hmtnames.updateUI = function () { console.log("updateUI in.hmt.names"); }

sparqplug.in.hmtnames.selectedName = function (name_URN) {
	$("#hmt-names-properties").show();
	console.log('Selected Name: '+name_URN);

	urn_components = name_URN.split('.');
	persNum = urn_components[urn_components.length-1];

	$('#hmt-names-list').children().removeClass('selected');
	$('#name-'+persNum).addClass('selected');

	var desc = $(document).query('SELECT ?description WHERE { <'+name_URN+'> citedata:description ?description . }', {"source":"http://localhost:3030/names/"});
	var prop = $(document).query('SELECT ?object WHERE { <'+name_URN+'> cts:containedBy ?object . }', {"source":"http://localhost:3030/names/"});
	prop = prop.sort(function(a, b){
		if(a.object.value < b.object.value) return -1;
		if(a.object.value > b.object.value) return 1;
		return 0;})

	$("#hmt-names-properties").children().remove();

	$.each(desc,function (index,value) {
		desc_text = value.description.value;
		li = $('<li/>', {style: 'font-weight: bold;', text: desc_text});
		$("#hmt-names-properties").append(li);
	});

	li = $('<li/>', {style: 'font-style: italic;', text: name_URN});
	$("#hmt-names-properties").append(li);

	$.each(prop,function (index,value) {
		prop_text = value.object.value;
		li = $('<li/>', {text: prop_text});
		$("#hmt-names-properties").append(li);
	});
}

sparqplug.in.hmtnames.searchNames = function () {
	var searchTerm = $('#hmt-names-searchbar').val();
	$('#hmt-names-list > li').each(function (index, element) {
		console.log(element);
	 	li_searchable_text = element.innerHTML;
		if (li_searchable_text.indexOf(searchTerm) == -1) $(element).hide();
		else $(element).show();
	});
}

plugins['sparqplug-in-hmt-names'] = sparqplug.in.hmtnames;