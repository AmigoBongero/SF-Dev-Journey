import LightningModal from 'lightning/modal';

import { api } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import CONTACT_OBJECT from '@salesforce/schema/Contact';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LAST_NAME_FIELD from '@salesforce/schema/Contact.LastName';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
import CONTACT_ACCOUNT_ID from '@salesforce/schema/Contact.AccountId';

export default class ModalNewContact extends LightningModal {

    // API Variables.
    @api recordId = null;

    // Fields Variables.
    contactFirstName = null;
    contactPhone = null;
    contactEmail = null;
    contactLastName = null;

    // Other Variables.
    isSaveAndNew = false;
    

    /*
     * @description     Handlers. 
     */
    handleCancel() {
        this.close();
    }

    handleFieldChange(event) {
        const field = event.target.name;
        if (field === 'contactFirstName') {
            this.contactFirstName = event.target.value;
        } else if (field === 'contactPhone') {
            this.contactPhone = event.target.value;
        } else if (field === 'contactEmail') {
            this.contactEmail = event.target.value;
        } else if (field === 'contactLastName') {
            this.contactLastName = event.target.value;
        }
    }

    handleSave() {
        this.isSaveAndNew = false;
        this.submitRecordForm();
    }

    handleSaveNew() {
        this.isSaveAndNew = true;
        this.submitRecordForm();
        this.clearFormFields();
    }

    /*
     * @description     Reusable code.
     */
    async submitRecordForm() {
        const fields = {};
        fields[CONTACT_NAME_FIELD.fieldApiName] = this.contactFirstName;
        fields[CONTACT_LAST_NAME_FIELD.fieldApiName] = this.contactLastName;
        fields[CONTACT_PHONE_FIELD.fieldApiName] = this.contactPhone;
        fields[CONTACT_EMAIL_FIELD.fieldApiName] = this.contactEmail;
        fields[CONTACT_ACCOUNT_ID.fieldApiName] = this.recordId;

        const recordInput = { apiName: CONTACT_OBJECT.objectApiName, fields };

        try {
            const contact = await createRecord(recordInput);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact created successfully',
                    variant: 'success'
                })
            );
            this.close((this.isSaveAndNew) ? 'saveAndNew' : 'update');
            
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }

    clearFormFields() {
        this.contactLastName = '';
        this.contactFirstName = '';
        this.contactPhone = '';
        this.contactEmail = '';
    }

}