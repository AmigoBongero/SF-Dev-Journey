import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import LightningModal from 'lightning/modal';

import ACCOUNT_OBJECT_API_NAME from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_TYPE_FIELD from '@salesforce/schema/Account.Type';
import ACCOUNT_PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACCOUNT_WEBSITE_FIELD from '@salesforce/schema/Account.Website';

const ACCOUNT_FIELDS = [
    ACCOUNT_NAME_FIELD,
    ACCOUNT_PHONE_FIELD,
    ACCOUNT_TYPE_FIELD,
    ACCOUNT_WEBSITE_FIELD
]

export default class NewAccountModal extends LightningModal {

    // Validating Variables.
    isModalLoading = false;
    isSaveAndNew = false;

    /*
     * @description     Getters.
     */
    get fieldNamesGetter() {
        return ACCOUNT_FIELDS;
    }

    get accountObjectApiNameGetter() {
        return ACCOUNT_OBJECT_API_NAME.objectApiName;
    }

    /*
     * @description     Callbacks.
     */
    connectedCallback() {
        this.isModalLoading = true;
    }

    /*
     * @description     Handlers. 
     */
    handleLoad() {
        this.isModalLoading = false;
    }

    handleSuccess() {
        this.isModalLoading = false;
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'New record created successfully',
                variant: 'success'
            })
        );
        this.close((this.isSaveAndNew) ? 'saveAndNew' : 'save');
    }

    handleSave(event) {
        this.isSaveAndNew = event.target.name !== 'Save';
        if (!this.isInputValid()) {
            this.toastInfoMessages();
            return;
        }
        this.refs.recordEditForm.submit();
    }

    handleCancel() {
        this.close();
    }

    /*
     * @description     Reusable Code.
     */
    isInputValid() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('lightning-input-field');
        inputFields.forEach(inputField => {
            if (!inputField.reportValidity()) {
                isValid = false;
            }
        });
        return isValid;
    }

    toastInfoMessages() {
        this.dispatchEvent(new ShowToastEvent({
            title: "There is field validation error!",
            message: "Check the fields values",
            variant: "info"
        }));
    }

}