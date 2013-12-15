<!DOCTYPE html>
<!-- The hangout API JavaScript. Always include this first -->
<script src="//hangoutsapi.talkgadget.google.com/hangouts/api/hangout.js?v=1.4"></script>

<!-- Jquery, yo -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

<?php $contentPath = "//allyourdice.appspot.com/static" ?>

<!-- The JavaScript for this app. This must always be a full URL not a
     relative path.
     Tip: You can load it from a local web server such as
     http://localhost/app.js for faster single user development -->
<script src="<?php echo $contentPath ?>/app.js"></script>

<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
  }

  section {
    padding-left: 10px;
  }

  label {
    display: inline-block;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  label > * {
    display: inline-block;
    vertical-align: middle;
  }

  .DieLabel {
    cursor: pointer;
  }

  .SavedRollDelete {
    float: right;
    margin-right: 10px;
  }
</style>

<h3>Your Dice: Roll Them</h3>
<section>
  <form>
    <label><img class="DieLabel" src="<?php echo $contentPath ?>/icons/32x32-d20.png" title="d20" /> <input type="number" id="d20" class="die" data-size="20" max="99" min="1" size="2" value="1"/></label>
    <label><img class="DieLabel" src="<?php echo $contentPath ?>/icons/32x32-d12.png" title="d12" /> <input type="number" id="d12" class="die" data-size="12" max="99" min="1" size="2" value="1"/></label>
    <label><img class="DieLabel" src="<?php echo $contentPath ?>/icons/32x32-d10.png" title="d10" /> <input type="number" id="d10" class="die" data-size="10" max="99" min="1" size="2" value="1"/></label>
    <br />
    <label><img class="DieLabel" src="<?php echo $contentPath ?>/icons/32x32-d8.png" title="d8" /> <input type="number" id="d8" class="die" data-size="8" max="99" min="1" size="2" value="1"/></label>
    <label><img class="DieLabel" src="<?php echo $contentPath ?>/icons/32x32-d6.png" title="d6" /> <input type="number" id="d6" class="die" data-size="6" max="99" min="1" size="2" value="1"/></label>
    <label><img class="DieLabel" src="<?php echo $contentPath ?>/icons/32x32-d4.png" title="d4" /> <input type="number" id="d4" class="die" data-size="4" max="99" min="1" size="2" value="1"/></label>
    <br />
    <label>Modifier: <input id="mod" type="number" max="999" min="-999" size="3" /></label>
    <label>Memo: <input id="memo" type="text" /></label>
  </form>
  <p>Saved:</p>
  <div id="SavedRolls"></div>
  <p>Rolls:</p>
  <div id="rolls"></div>
</section>
<div style="clear: both;"></div>
