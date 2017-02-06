// Model

var model = {
	name: undefined,
	referral_codes: []
};

// View




// Controller


	// Event Listeners

function setup() {
	document.getElementById('formContainer').addEventListener('click', 'submitForm', handleSubmit)
}


	// Form Controllers

function handleSubmit() {
	var name = document.getElementById('first_name').value();
	firebase.database().ref('model').push({
		name: model.name
	})
}

$(document).ready(setup);