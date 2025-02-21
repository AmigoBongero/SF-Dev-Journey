import LightningModal from "lightning/modal";

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';

import CONTACT_OBJECT from '@salesforce/schema/Contact';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';

export default class ModalNewContact extends LightningModal {

    contactName = null;
    contactPhone = null;
    contactEmail = null;

    /*
     * @description     Handlers. 
     */
    handleCancel() {
        this.closeModal();
    }

    handleFieldChange(event) {
        const field = event.target.name;
        if (field === 'contactName') {
            this.contactName = event.target.value;
        } else if (field === 'contactPhone') {
            this.contactPhone = event.target.value;
        } else if (field === 'contactEmail') {
            this.contactEmail = event.target.value;
        }
    }

    handleSave() {
        this.submitRecordForm();
    }

    handleSaveNew() {
        this.submitRecordForm();
        this.clearFormFields();
    }

    async submitRecordForm() {
        const fields = {};
        fields[CONTACT_NAME_FIELD.fieldApiName] = this.contactName;
        fields[CONTACT_PHONE_FIELD.fieldApiName] = this.contactPhone;
        fields[CONTACT_EMAIL_FIELD.fieldApiName] = this.contactEmail;

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
            this.close('update');
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
        this.contactName = '';
        this.contactPhone = '';
        this.contactEmail = '';
    }

    closeModal() {
        this.close();
    }
}