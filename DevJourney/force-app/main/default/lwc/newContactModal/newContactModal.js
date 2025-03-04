import { api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import LightningModal from 'lightning/modal';

import CONTACT_OBJECT_API_NAME from '@salesforce/schema/Contact';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import CONTACT_ACCOUNT_ID from '@salesforce/schema/Contact.AccountId';

export default class NewContactModal extends LightningModal {

    // API Variables
    @api isModalLoading;
    @api chosenAccountId;

    // Other Variables
    isSaveAndNew = false;

    /*
     * @description     Getters.
     */
    get fieldNamesGetter() {
        return [
            { fieldName: CONTACT_ACCOUNT_ID.fieldApiName, value: this.chosenAccountId },
            { fieldName: CONTACT_PHONE_FIELD.fieldApiName },
            { fieldName: CONTACT_NAME_FIELD.fieldApiName },
            { fieldName: CONTACT_EMAIL_FIELD.fieldApiName },
            { fieldName: CONTACT_LAST_NAME_FIELD.fieldApiName }            
        ];
    }

    get contactObjectApiNameGetter() {
        return CONTACT_OBJECT_API_NAME.objectApiName;
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

    handleSave() {
        this.isSaveAndNew = false;

        if(!this.isInputValid()) {
            this.toastInfoMessages();
            return;
        }

        this.refs.recordEditForm.submit();
    }

    handleSaveAndNew() {
        this.isSaveAndNew = true;

        if(!this.isInputValid()) {
            this.toastInfoMessages();
            return;
        }
        
        this.refs.recordEditForm.submit();
    }

    handleCancel() {
        this.close();
    }

    handleCancel() {
        this.close();
    }

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