// Model

var model = {
	name: undefined,
	referral_codes: []
};

// View
var formTemplate;

function compileTemplate(){
	var formTemplateSource = $('#form-template').html();
  	formTemplate = Handlebars.compile(formTemplateSource);
}

function renderForm() {
	var formHtml = formTemplate(model);
  	$('#formContainer').html(formHtml);
}

// Controller

function setup() {
	compileTemplate();
	renderForm();

	// Event Listeners

	$('#formContainer').on('click', '#submitForm', handleSubmit)

}


	// Form Controllers
function handleSubmit() {
  var name = $('input[id="first_name"]').val();
  $('input[id="first_name"]').val('');
  firebase.database().ref('model').push({
    name: name,
  });
};

$(document).ready(setup);