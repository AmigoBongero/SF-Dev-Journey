import LightningModal from 'lightning/modal';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';

import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_TYPE_FIELD from '@salesforce/schema/Account.Type';
import ACCOUNT_PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACCOUNT_WEBSITE_FIELD from '@salesforce/schema/Account.Website';

export default class ModalNewAccount extends LightningModal {

    accountName = null;
    accountType = 'none';
    accountPhone = null;
    accountWebsite = null;
    isSaveAndNew = false;

    /*
     * @description     Getters.
     */
    get options() {
        return [
            { label: '--None--', value: 'none' },
            { label: 'Prospect', value: 'prospect' },
            { label: 'Customer - Direct', value: 'customerDirect' },
            { label: 'Customer - Channel', value: 'customerChannel' },
            { label: 'Channel Partner / Reseller', value: 'channelPartnerReseller' },
            { label: 'Installation Partner', value: 'installationPartner' },
            { label: 'Technology Partner', value: 'technologyPartner' },
            { label: 'Other', value: 'other' }
        ];
    }

    /*
     * @description     Handlers. 
     */
    handleCancel() {
        this.closeModal();
    }

    handleFieldChange(event) {
        const field = event.target.name;
        if (field === 'accountName') {
            this.accountName = event.target.value;
        } else if (field === 'accountPhone') {
            this.accountPhone = event.target.value;
        } else if (field === 'accountWebsite') {
            this.accountWebsite = event.target.value;
        } else if (field === 'accountType') {
            this.accountType = event.target.value;
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
     * @description     Other methods. 
     */
    async submitRecordForm() {
        const fields = {};
        fields[ACCOUNT_NAME_FIELD.fieldApiName] = this.accountName;
        fields[ACCOUNT_TYPE_FIELD.fieldApiName] = this.accountType;
        fields[ACCOUNT_PHONE_FIELD.fieldApiName] = this.accountPhone;
        fields[ACCOUNT_WEBSITE_FIELD.fieldApiName] = this.accountWebsite;

        const recordInput = { apiName: ACCOUNT_OBJECT.objectApiName, fields };

        try {
            const account = await createRecord(recordInput);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Account created successfully',
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
        this.accountName = '';
        this.accountPhone = '';
        this.accountWebsite = '';
        this.accountType = 'none';
    }

    closeModal() {
        this.close();
    }

}