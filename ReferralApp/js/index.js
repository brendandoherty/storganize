// Model
var model = {
	system: {
		system_codes: ['testCode1', 'testCode2', 'testCode3']
	},
	users: {
		user_name: undefined,
		user_discountCodes: []
	},
	referrers: {
		loggedIn: false,
		name: undefined,
		discount_codes: []
	}
};


// View
var formTemplate;
var profileTemplate;
var refTemplate;

function compileTemplates(){
	var formTemplateSource = $('#form-template').html();
  	formTemplate = Handlebars.compile(formTemplateSource);

  	var profileTemplateSource = $('#profile-template').html();
  	profileTemplate = Handlebars.compile(profileTemplateSource);

  	var refTemplateSource = $('#ref-template').html();
  	refTemplate = Handlebars.compile(refTemplateSource);
};


function renderUserForm() {
	var formHtml = formTemplate(model);
  	$('#formContainer').html(formHtml);
};

function renderProfile() {
	var profileHtml = profileTemplate(model)
	$('#profileContainer').html(profileHtml);
}

function renderRefForm() {
	var refHtml = refTemplate(model)
	$('#refFormContainer').html(refHtml);
}

// Controller

function setup() {
	compileTemplates();
	// Temporarily removed renderUserForm(); for testing
	renderRefForm();
	renderProfile();

	// Event Listeners for REF FORM
	$('#refFormContainer').on('click', '#register', handleRegister);
  	$('#refFormContainer').on('click', '#login', handleLogin);
	firebase.auth().onAuthStateChanged(handleAuthStateChange);


	// Event Listeners for USER FORM

	$('#formContainer').on('click', '#submitForm', handleSubmit)
};


	// Form Controllers for REF FORM

function handleAuthStateChange() {
  var user = firebase.auth().currentUser;

  if (user) {
    model.referrers.loggedIn = true;
    model.referrers.name = user;
  } else {
    model.referrers.loggedIn = false;
    model.referrers.name = undefined;
  }

  renderRefForm();
  renderProfile();
};

function handleRegister() {
  var email = $('input[id="email"]').val();
  var password = $('input[id="password"]').val();

  firebase.auth().createUserWithEmailAndPassword(email, password);
}

function handleLogin() {
  var email = $('input[id="email"]').val();
  var password = $('input[id="password"]').val();

  firebase.auth().signInWithEmailAndPassword(email, password);

}


	// Form Controllers for USER FORM

function handleSubmit() {
  var userName = $('input[id="first_name"]').val();
  var userCode = $('input[id="discount_code"]').val();
  $('input[id="first_name"]').val('');

  // Using ECMA 6 feature, "includes", below. Not compatible with IE 
	if (model.system.system_codes.includes(userCode)) {
		document.getElementById("code_status").innerHTML = 'Discount code accepted!';
		
		firebase.database().ref('users').push({
    		user_name: userName,
    		user_discountCodes: userCode
  		})
	} else {
		document.getElementById("code_status").innerHTML = 'Sorry! That is not a valid discount code.';

		firebase.database().ref('users').push({
    		user_name: userName,
    		user_discountCodes: 'no discount codes'
  		})
	}
};

$(document).ready(setup);