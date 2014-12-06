var App = App || {};

// 1. Find the users in the database and store them.
// 2. Create a match, with the user relation.
// 3. Change the view to 'pending.handlebars'.
// 4. Prefill the input-fields in 'pending.handlebars'.
App.SignUp = (function() {
  'use strict';

  var dom = {},
      selectors = {
        facebookLoginBtn : 'facebook-create-btn',
        inputChallenger : '.js-challenger-input',
        inputChallenged : '.js-challenged-input'
      };

  function initialize() {
    _setupDOM();
    _addEventListeners();
  }

  function _setupDOM() {
    dom.$submit = $('.js-create-btn');
    dom.$form = $('.js-match-create-form');
    dom.$updateForm = $('.js-match-update-form');

    dom.$inputChallenger = $( selectors.inputChallenger );
    dom.$inputChallenged = $( selectors.inputChallenged );

    dom.$inputChallengerID = $('.js-challenger-id');
    dom.$inputChallengedID = $('.js-challenged-id');
  }

  function _addEventListeners() {
    dom.$form.on( 'submit', _onFormSubmit );

    dom.$inputChallenger.on( 'blur', _onInputBlur );
    dom.$inputChallenged.on( 'blur', _onInputBlur );
  }

  function _onFormSubmit() {
    event.preventDefault();

    var challenger = dom.$inputChallenger.val();
    var challenged = dom.$inputChallenged.val();

    var Match = Parse.Object.extend('Match');
    var match = new Match();

    match.set( 'challenger', { '__type' : 'Pointer', 'className' : '_User', 'objectId' : challenger } );
    match.set( 'challenged', { '__type' : 'Pointer', 'className' : '_User', 'objectId' : challenged } );
    match.set( 'finished', false );

    match.save(null, {
      success: function( match ) {
        console.log( match.id );
        $( selectors.inputChallenger, dom.$updateForm ).val( challenger );
        $( selectors.inputChallenged, dom.$updateForm ).val( challenged );
      },
      error: function( match, error ) {
        App.Parse.loginError( error.message );
        alert('Der skete en fejl, supporten er underrettet.');
      }
    });
  }

  function _onInputBlur () {
    var $this = $(this);
    var query = new Parse.Query( Parse.User );
    var userID = $this.attr('data-userid-field');

    query.equalTo( 'username', $this.val() );
    query.first({
      success: function( duellant ) {
        if( duellant !== undefined ) {
          $( '#' + userID ).val( duellant.id );
          $this.removeClass('user-not-found');
          $this.after( duellant.id );
        }
        else {
          $this.addClass('user-not-found');
        }
      }
    });
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize
  };

})();
