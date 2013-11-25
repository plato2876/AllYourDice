/*
* Modified by Seth Johnson (c) 2013.
*
* Original Copyright (c) 2011 Google Inc.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not
* use this file except in compliance with the License. You may obtain a copy of
* the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
* WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
* License for the specific language governing permissions and limitations under
* the License.
*/
var serverPath = '//allyourdice.appspot.com/';

function rollDice() {
	var user = gapi.hangout.getLocalParticipant();
	var displayName = user.person.displayName;

	var modifier = $('#mod').val() ? parseInt($('#mod').val()) : 0;

	if (isNaN(modifier))
	{
		modifier = 0;
	}

	var memo = $('#memo').val();

	$('.die').each(function()
	{
		var numDice = parseInt($(this).val());

		if (isNaN(numDice) || numDice < 1)
		{
			return true;
		}

		var die = parseInt($(this).attr('data-size'));

		if (isNaN(die))
		{
			return true;
		}

		console.log("For "+numDice+" dice of size "+die+"...");

		var rolls = [];
		
		for(var i = 0; i < numDice; i++)
		{
			rolls.push(Math.ceil(Math.random() * die));
		}

		roll = rolls.reduce(function(a, b) { return a + b; });
		roll += modifier;

		rollStr = '(' + rolls.join(',') + ')';
		modifierStr = '';

		if (modifier != 0)
		{
			modifierStr = modifier < 0 ? modifier : '+' + modifier;
			rollStr += ' ' + modifierStr;
		}

		var result = '<b>' + displayName + '</b><br />' 
			+ (memo ? ('<i>' + memo + '</i> ') : '') 
			+ numDice + 'd' + die
			+ rollStr + ': <b>' + roll + '</b>';

		var value = 0;
		var count = gapi.hangout.data.getState()['count'];
		if (count) {
			value = parseInt(count);
		}

		gapi.hangout.data.submitDelta({'roll': result, 'count': '' + (value + 1) });
	});
}

function updateStateUi(state) {
	$("#rolls").prepend('<p>' + state['roll'] + '</p>');
}

// A function to be run at app initialization time which registers our callbacks
function init() {
	console.log('Init app.');

	var apiReady = function(eventObj) {
		if (eventObj.isApiReady) {
			console.log('API is ready');

			gapi.hangout.data.onStateChanged.add(function(eventObj) {
				updateStateUi(eventObj.state);
			});

			gapi.hangout.onApiReady.remove(apiReady);
		}
	};

	// This application is pretty simple, but use this special api ready state
	// event if you would like to any more complex app setup.
	gapi.hangout.onApiReady.add(apiReady);
}

gadgets.util.registerOnLoadHandler(init);
