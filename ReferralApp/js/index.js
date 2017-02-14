// Model
var model = {
	system: {
		system_codes: []
	},
	users: {
		user_name: undefined,
		user_discountCodes: []
	},
	referrers: {
		loggedIn: false,
		email: undefined,
		name: undefined,
		discount_code: undefined
	}
};


// View
var formTemplate;
var refTemplate;

function compileTemplates(){
	var formTemplateSource = $('#form-template').html();
  	formTemplate = Handlebars.compile(formTemplateSource);

  	var refTemplateSource = $('#ref-template').html();
  	refTemplate = Handlebars.compile(refTemplateSource);
};


function renderUserForm() {
	var formHtml = formTemplate(model);
  	$('#formContainer').html(formHtml);
};

function renderRefForm() {
	var refHtml = refTemplate(model.referrers)
	$('#refFormContainer').html(refHtml);
}

// Controller

function setup() {
	compileTemplates();
	// Temporarily removed renderRefForm(); for testing
	renderUserForm();
	renderRefForm();


	// Event Listeners for REF FORM
	$('#refFormContainer').on('click', '#register', handleRegister);
  	$('#refFormContainer').on('click', '#login', handleLogin);
  	$('#refFormContainer').on('click', '#signOut', handleSignout);
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
};

function handleSignout() {
  firebase.auth().signOut()
}

function handleRegister() {
  var firstName = $('input[id="ref_firstName"]').val();
  var lastName = $('input[id="ref_lastName"]').val();
  var email = $('input[id="email"]').val();
  var password = $('input[id="password"]').val();

  firebase.auth().createUserWithEmailAndPassword(email, password);

  var fullName = firstName + ' ' + lastName
  var refCode = 'stor' + Math.floor((Math.random() * 9999) + 1000)

  firebase.database().ref('referrers').push({
    		email: email,
    		name: fullName,
    		discount_code: refCode
  })
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
	if (model.system.system_codes.includes(userCode) && model.referrers.discount_code.includes(userCode)) {
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

// On page load, pull all the latest discount codes down from the database

function pullCodes() {

firebase.database().ref("/referrers/").on("value", function(snapshot) {
		 
		 var parentKey = (snapshot.val());

      for (var prop in parentKey) {
      	model.system.system_codes.push(
      		parentKey[prop].discount_code
      )
      	console.log(model.system.system_codes)
		}
	})
};

$(document).ready(setup);