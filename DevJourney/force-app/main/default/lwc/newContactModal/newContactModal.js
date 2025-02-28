import { api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import LightningModal from 'lightning/modal';

import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import CONTACT_ACCOUNT_ID from '@salesforce/schema/Contact.AccountId';

export default class NewContactModal extends LightningModal {

    // API Variables
    @api isLoadingModal;
    @api recordId;

    // Other Variables
    isSaveAndNew = false;

    /*
        * @description     Getters.
        */
    get fieldNamesGetter() {
        return [
            { fieldName: CONTACT_ACCOUNT_ID.fieldApiName, value: this.recordId },
            { fieldName: CONTACT_PHONE_FIELD.fieldApiName },
            { fieldName: CONTACT_NAME_FIELD.fieldApiName },
            { fieldName: CONTACT_EMAIL_FIELD.fieldApiName },
            { fieldName: CONTACT_LAST_NAME_FIELD.fieldApiName }            
        ];
    }

    /*
    * @description     Handlers. 
    */
    handleLoad() {
        this.isLoadingModal = false;
    }

    handleSuccess() {
        this.isLoadingModal = false;
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
        this.template.querySelector('lightning-record-edit-form').submit();
    }

    handleSaveAndNew() {
        this.isSaveAndNew = true;
        this.template.querySelector('lightning-record-edit-form').submit();
    }

    handleCancel() {
        this.close();
    }

}