import { api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import LightningModal from 'lightning/modal';

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

    // API Variables
    @api isLoadingModal = false;

    // Other Variables
    isSaveAndNew = false;

    /*
     * @description     Getters.
     */
    get fieldNamesGetter() {
        return ACCOUNT_FIELDS;
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
        console.log(this.isSaveAndNew);
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