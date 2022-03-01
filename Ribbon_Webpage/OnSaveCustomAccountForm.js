var App = App || {};
App.Pana1 = App.Pana1 || {};
App.Pana1.AccountCustomForm = (() => {
	"use strict";
	const
		entity = {
			account: {
				entityName: "account",
				parentId: "accountid",
				moneyField: "app_money",
				lookupField: "app_lookup",
				primaryName: "name",
				dateField: "app_date",
				multiOptionField: "app_multioptionset"
			},
			contact: {
				entityName: "contact",
				parentId: "contactid",
			}
		},
		value = {
			customAccountFormName: "app_customAccountFormWebpage",
			htmlContactIdField: "contactId",
			htmlLookUpNameField: "txt_lookup_name",
			htmlItem1: "item1",
			htmlItem2: "item2",
			htmlNameField: "name",
			htmlMoneyField: "money",
			htmlDateField: "date",
			formId: "accountForm",
			lookUpValidateErrorField: "customeLookUpValidate",
			multiSelectErrorField: "multiSelectValidate",
			hide: "none",
			unhide: "block",
			changeEvent: "change",
			formValidation: ".needs-validation",
			formValidated: "was-validated",
			submitForm: "submit"

		};

	const openWeb = () => {

		parent.Xrm.Navigation.openWebResource(value.customAccountFormName);
	};

	const lookUpCall = () => {

		let lookupOptions = {};
		lookupOptions.allowMultiSelect = false;
		lookupOptions.defaultEntityType = entity.contact.entityName;
		lookupOptions.entityTypes = [entity.contact.entityName];
		parent.Xrm.Utility.lookupObjects(lookupOptions).then(
			(result) => {
				if (result != undefined && result.length > 0) {
					const selectedItem = result[0];
					let contactId = selectedItem.id;
					contactId = contactId.replace("{", "").replace("}", "");
					document.getElementById(value.htmlContactIdField).value = contactId;
					document.getElementById(value.htmlLookUpNameField).value = selectedItem.name;
					document.getElementById(value.lookUpValidateErrorField).style.display = value.hide;
				}
			},
			(error) => { console.log(error); });

	};

	const createAccount = () => {
		event.preventDefault();
		let selected = [];
		if (document.getElementById(value.htmlItem1).checked) {
			selected.push(document.getElementById(value.htmlItem1).value);
		}
		if (document.getElementById(value.htmlItem2).checked) {
			selected.push(document.getElementById(value.htmlItem2).value);
		}
		//selected = selected.map(i => Number(i));
		/*if (selected.length === 0 || !document.getElementById(value.htmlNameField).value.trim()
			|| !document.getElementById(value.htmlDateField).value || !document.getElementById(value.htmlMoneyField).value.trim()
			|| !document.getElementById(value.htmlContactIdField).value) {		

			return false;
		}*/

		const contactsData = `/${entity.contact.entityName}s(${document.getElementById(value.htmlContactIdField).value})`;
		const data =
		{
			"name": document.getElementById(value.htmlNameField).value,
			"app_date": new Date(document.getElementById(value.htmlDateField).value),
			"app_multioptionset": String(selected),
			"app_money": parseFloat(document.getElementById(value.htmlMoneyField).value),
			"app_lookup@odata.bind": contactsData,

		};

		const accountCreateId = App.Helper.CreateRecord(entity.account.entityName, data);

		accountCreateId.then((result) => {

			const entityFormOptions = {
				"entityName": entity.account.entityName,
				"entityId": result.id
			};

			// Open the form.
			Xrm.Navigation.openForm(entityFormOptions).then(
				(success) => {
					console.log(success);
				},
				(error) => {
					console.log(error);
				});
		});


	};


	const bootstrapValidation = () => {
		if (!document.getElementById(value.htmlContactIdField).value)
			document.getElementById(value.lookUpValidateErrorField).style.display = value.unhide;

		else
			document.getElementById(value.lookUpValidateErrorField).style.display = value.hide;

		let selected = [];
		if (document.getElementById(value.htmlItem1).checked) {
			selected.push(document.getElementById(value.htmlItem1).value);
		}
		if (document.getElementById(value.htmlItem2).checked) {
			selected.push(document.getElementById(value.htmlItem2).value);
		}

		if (!selected.length) {
			document.getElementById(value.multiSelectErrorField).style.display = value.unhide;
			document.getElementById(value.htmlItem1).addEventListener(value.changeEvent, e => {

				if (e.target.checked) {
					document.getElementById(value.multiSelectErrorField).style.display = value.hide;
				} else {
					if (!document.getElementById(value.htmlItem2).checked)
						document.getElementById(value.multiSelectErrorField).style.display = value.unhide;
				}

			});

			document.getElementById(value.htmlItem2).addEventListener(value.changeEvent, e => {

				if (e.target.checked) {
					document.getElementById(value.multiSelectErrorField).style.display = value.hide;
				} else {
					if (!document.getElementById(value.htmlItem1).checked)
						document.getElementById(value.multiSelectErrorField).style.display = value.unhide;
				}

			});
		}
		else
			document.getElementById(value.multiSelectErrorField).style.display = value.hide;
		// Fetch all the forms we want to apply custom Bootstrap validation styles to

		const forms = document.querySelectorAll(value.formValidation);

		// Loop over them and prevent submission
		Array.prototype.slice.call(forms)
			.forEach((form) => {
				form.addEventListener(value.submitForm, (event) => {
					if (!form.checkValidity()) {
						event.preventDefault();
						event.stopPropagation();
					}

					form.classList.add(value.formValidated);
				}, false);
			});
	};

	return {
		OpenWeb: openWeb,

		LookUpCall: lookUpCall,

		CreateAccount: createAccount,

		BootstrapValidation: bootstrapValidation

	};
})();

