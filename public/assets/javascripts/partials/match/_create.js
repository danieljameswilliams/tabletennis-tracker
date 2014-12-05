var App = App || {};

App.SignUp = (function() {
  'use strict';

  var dom = {},
      selectors = {
        facebookLoginBtn : 'facebook-create-btn'
      };

  function initialize() {
    _setupDOM();
    _addEventListeners();
  }

  function _setupDOM() {
    dom.$submit = $('.js-create-btn');
    dom.$form = $('.js-match-create-form');
  }

  function _addEventListeners() {
    dom.$signupSubmit.on('click', _onSubmitClicked );
  }

  function _onSubmitClicked() {
    event.preventDefault();

    // 1. Find the users in the database and store them.
    // 2. Create a match, with the user relation.
    // 3. Prefill the input-fields in "pending.handlebars".
    // 4. Change the view to "pending.handlebars".
  }

  ////////////////
  // Public API //
  ////////////////

  return {
    initialize: initialize
  };

})();
