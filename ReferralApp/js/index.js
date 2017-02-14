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
		name: undefined,
		email: undefined,
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
	renderUserForm();
	renderRefForm();
	pullCodes();

	// Event Listeners for REF FORM
	$('#refFormContainer').on('click', '#register', handleRegister);
  	$('#refFormContainer').on('click', '#login', handleLogin);
  	$('#refFormContainer').on('click', '#signOut', handleSignout);
	firebase.auth().onAuthStateChanged(handleAuthStateChange);


	// Event Listeners for USER FORM

	$('#formContainer').on('click', '#submitForm', referralCheck)
};

// On page load, pull all the latest discount codes down from the database and store the in the system_codes array

function pullCodes() {
	firebase.database().ref("/referrers/").on("value", function(snapshot) {
		var parentKey = (snapshot.val());

	    for (var prop in parentKey) {
	      	model.system.system_codes.push(
	      		parentKey[prop].discount_code)
			}
		})
};

// Check the referrer's details on FB to see if there have been any successful referrals and update profile
function referralCheck() {

	var ref = firebase.database().ref("/referrers");
	ref.orderByChild("discount_code").equalTo("stor4659").on("value", function(snapshot) {
		var parentKey = (snapshot.val());

		for (var prop in parentKey) {
			var x = parentKey[prop].discount_code
			var y = parentKey[prop].email
		}
		if (x) {
			console.log('Found code match for user, ' + y + ' with code, ' + x)
	} else (console.log('FAIL'))
});



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
    		name: fullName,
    		email: email,
    		discount_code: refCode
  })
}


function handleLogin() {
  var email = $('input[id="email"]').val();
  var password = $('input[id="password"]').val();

  firebase.auth().signInWithEmailAndPassword(email, password);
  pullCodes();

  //input referralCheck(); function to pull referrer name and code down to local object, then check if there have been any successful referrals and update profile
}



	// Form Controllers for USER FORM

function handleSubmit() {
  var userName = $('input[id="first_name"]').val();
  var userCode = $('input[id="discount_code"]').val();
  $('input[id="first_name"]').val('');
  $('input[id="discount_code"]').val('');
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