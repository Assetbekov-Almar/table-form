const $testForm = $('#test-form'),
      testFormCheckboxes = $testForm.find('.form-check-input'),
      testFormState = $testForm.find('#test-form-state')

function getDataFromCheckboxes() {
	let arrayOfObjects = []
	testFormCheckboxes.each(function() {
		if ($(this).is(':checked')) {
			arrayOfObjects.push({ id: $(this).val(), name: $(this).attr('name') })
		}
	})
	return arrayOfObjects
}

function getStateSection() {
	let stateClass = testFormState.find(':selected').attr('class'),
	    stateSection
	if (stateClass.length > 0) stateSection = $('.modal-section'+'.'+stateClass)
	else throw new Error('Class is not defined')
	return stateSection
}

function setAndDisplayData(arrayOfObjects, section) {
	const sectionModal = section.find('.data-and-state-modal'),
	      sectionForm = sectionModal.find('.data-and-state-form'),
	      sectionDataIds = sectionForm.find('.data-ids'),
	      sectionDataList = sectionForm.find('.data-list')
	let inputsSelectedIdsHtml = '',
	    inputsListHtml = ''

	sectionDataIds[0].innerHTML = ''
	sectionDataList[0].innerHTML = ''

	arrayOfObjects.forEach(object => {
		inputsSelectedIdsHtml += '<input type="text" class="d-none" name="ids[]" value="' + object.id + '"/>'
		inputsListHtml += '<li>ID' + object.id + ', ' + object.name + '</li>'
	})

	sectionDataIds[0].innerHTML = inputsSelectedIdsHtml
	sectionDataList[0].innerHTML = inputsListHtml

	section.removeClass('d-none')
	sectionModal.modal('show')
}

$('.data-and-state-modal').on('hide.bs.modal', function(event) {
	const modalSection = $(this).closest('.modal-section'),
	      modalForm = $(this).find('.data-and-state-form'),
	      modalFormInputs = modalForm.find('.additional-input')
	let isInputValuesDefault = true

	modalFormInputs.each(function () {
		if ($(this).val()) isInputValuesDefault = false
	})

	if (!isInputValuesDefault &&
		confirm("Вы точно хотите закрыть данное окно? В случае закрытия введённые данные будут потеряны.")
	) {
		setAndDisplayData([], modalSection)
		modalForm[0].reset()
		$testForm[0].reset()
	}
	else if (isInputValuesDefault) {
		setAndDisplayData([], modalSection)
		$testForm[0].reset()
	}
	else {
		event.preventDefault()
	}
})

$testForm.on('submit', function(event) {
	event.preventDefault()
	event.stopPropagation()
	if (
		testFormCheckboxes.filter(':checked').length < 1 ||
		testFormState.find(':selected').val().trim().length < 1
	) {
		alert("Сделайте выбор во всех полях, пожалуйста.")
	} else {
		setAndDisplayData(getDataFromCheckboxes(), getStateSection())
	}
})
