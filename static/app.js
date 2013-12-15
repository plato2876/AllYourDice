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
var dom = {
	rollDie: '.DieLabel',
	die: '.die',
	mod: '#mod',
	memo: '#memo',
	rolls: '#rolls',
	savedRolls: '#SavedRolls',
	savedRoll: '.SavedRoll',
	rollSave: '.RollMemo'
};

function rollDice(rollInfo) {
	var die = rollInfo.dieSize;
	var numDice = rollInfo.numDice;
	var modifier = rollInfo.modifier;
	var memo = rollInfo.memo;

	var user = gapi.hangout.getLocalParticipant();
	var displayName = user.person.displayName;

	var memoStr = memo 
		? ('<a ' 
			+ getRollAttrs(rollInfo) 
			+ ' class="RollMemo" href="#" title="Save">' + memo + '</a>') 
		: '';

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
		+ memoStr + ' ' + numDice + 'd' + die
		+ rollStr + ': <b>' + roll + '</b></span>';

	induceUpdate({'roll': result});
}

function getRollAttrs(rollInfo)
{
	var die = rollInfo.dieSize;
	var numDice = rollInfo.numDice;
	var modifier = rollInfo.modifier;
	var memo = rollInfo.memo;

	return 'data-numDice="' + numDice + '"'
		+ ' data-size="' + die + '"'
		+ ' data-modifier="' + modifier + '"'
		+ ' data-memo="' + memo + '"';
}

function extractRollInfo($rollSpan)
{
	var numDice = parseInt($rollSpan.attr('data-numDice'));

	// If nothing entered early exit
	if (isNaN(numDice))
	{
		return undefined;
	}

	var dieSize = parseInt($rollSpan.attr('data-size'));

	// Decline to roll zero dice
	if (isNaN(dieSize) || numDice < 1)
	{
		return undefined;
	}

	var modifier = parseInt($rollSpan.attr('data-modifier'));

	if (isNaN(modifier))
	{
		modifier = 0;
	}

	var memo = $rollSpan.attr('data-memo');

	return {
		numDice: numDice,
		dieSize: dieSize,
		modifier: modifier,
		memo: memo
	};
}

function induceUpdate(obj) {
	var updateCountVal = 0;
	var updateCount = gapi.hangout.data.getState()['updateCount'];

	if (updateCount)
	{
		updateCountVal = parseInt(updateCount);
	}

	obj.updateCount = '' + (updateCountVal + 1);

	gapi.hangout.data.submitDelta(obj);
}

function updateStateUi(state) {
	$(dom.rolls).prepend('<p>' + state['roll'] + '</p>');
}

function attachUiHandlers() {
	$(dom.rollDie).click(function() {
		var $dieInput = $(this).siblings(dom.die);
		var numDice = parseInt($dieInput.val());

		// If nothing entered early exit
		if (isNaN(numDice))
		{
			return;
		}

		var dieSize = parseInt($dieInput.attr('data-size'));

		// Decline to roll zero dice
		if (isNaN(dieSize) || numDice < 1)
		{
			return;
		}

		var modifier = $(dom.mod).val() ? parseInt($(dom.mod).val()) : 0;

		if (isNaN(modifier))
		{
			modifier = 0;
		}

		var memo = $(dom.memo).val();

		rollDice({
			dieSize: dieSize, 
			numDice: numDice, 
			modifier: modifier, 
			memo: memo
		});
	});

	$(dom.savedRolls).on('click', dom.savedRoll, {}, function() {
		var roll = extractRollInfo($(this));

		if (typeof roll == 'undefined')
		{
			return;
		}

		rollDice(roll);
	});

	$(dom.rolls).on('click', dom.rollSave, {}, function() {
		var roll= extractRollInfo($(this));

		if (typeof roll== 'undefined')
		{
			return;
		}

		$(dom.savedRolls + ' .SavedRoll[data-memo="' + roll.memo + '"]').parent('p').remove();

		var savedRoll = '<a class="SavedRoll" href="#" title="Roll" ' 
			+ getRollAttrs(roll) + '>'
			+ roll.memo 
			+ '</a>: '
			+ roll.numDice + 'd' + roll.dieSize 
			+ (roll.modifier > 0 ? ('+' + roll.modifier) : '');

		$(dom.savedRolls).prepend('<p>' 
			+ savedRoll 
			+ '<a class="SavedRollDelete" href="#" title="Delete" onClick="$(this).parent(\'p\').remove();">X</a>'
			+ '</p>');
	});
}

// A function to be run at app initialization time which registers our callbacks
function init() {
	console.log('Init app.');

	var apiReady = function(eventObj) {
		if (eventObj.isApiReady) {
			console.log('API is ready');

			attachUiHandlers();

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
