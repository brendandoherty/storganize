// Model

var model = {
	name: undefined,
	referral_codes: ['testCode1', 'testCode2', 'testCode3']
};

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
	$('#formContainer').on('click', '#submitForm', checkCode)

};


	// Form Controllers
function handleSubmit() {
  var name = $('input[id="first_name"]').val();
  $('input[id="first_name"]').val('');
  firebase.database().ref('model').push({
    name: name,
  });
};

function checkCode() {
	var userCode = $('input[id="discount_code"]').val();

	if (model.referral_codes.includes(userCode)) {
		document.getElementById("code_status").innerHTML = 'Discount code accepted!'
	} else {
		document.getElementById("code_status").innerHTML = 'Sorry! That is not a valid discount code.'
	}
};

$(document).ready(setup);