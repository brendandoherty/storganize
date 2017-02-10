// Model
var model = {
	system: {
		system_codes: ['testCode1', 'testCode2', 'testCode3']
	},
	user: {
		name: undefined,
		user_discountCodes: []
	}
};

var system = {
	referral_codes: ['testCode1', 'testCode2', 'testCode3']
}

var user = {
	name: undefined,
	discount_codes: []
}

// View
var formTemplate;

function compileTemplate(){
	var formTemplateSource = $('#form-template').html();
  	formTemplate = Handlebars.compile(formTemplateSource);
};

function renderForm() {
	var formHtml = formTemplate(model);
  	$('#formContainer').html(formHtml);
};

// Controller

function setup() {
	compileTemplate();
	renderForm();

	// Event Listeners

	$('#formContainer').on('click', '#submitForm', handleSubmit)
};


	// Form Controllers
function handleSubmit() {
  var userName = $('input[id="first_name"]').val();
  var userCode = $('input[id="discount_code"]').val();
  $('input[id="first_name"]').val('');

  // Using ECMA 6 feature, "includes", below. Need to ensure this is supported by all browsers
	if (model.system.system_codes.includes(userCode)) {
		document.getElementById("code_status").innerHTML = 'Discount code accepted!';
		
		firebase.database().ref('user').push({
    		name: userName,
    		user_discountCodes: userCode
  		})
	} else {
		document.getElementById("code_status").innerHTML = 'Sorry! That is not a valid discount code.';

		firebase.database().ref('user').push({
    		name: userName,
  		})
	}
};

$(document).ready(setup);