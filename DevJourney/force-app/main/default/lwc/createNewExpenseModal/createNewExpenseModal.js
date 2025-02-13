import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import LightningModal from 'lightning/modal';

export default class CreateNewExpenseModal extends LightningModal {

    saveAndNew = false;

    /*
     * @description     Handlers.
     */
    handleSuccess() {
        const toastEvent = new ShowToastEvent({
            title: 'New expense has been successfully created',
            message: '',
            variant: 'success'
        });
        this.dispatchEvent(toastEvent);

        if (!this.saveAndNew) {
            this.close('update');
        } else {
            this.close('saveAndNew');
            this.saveAndNew = false;
        }
    }

    handleSave() {
        this.saveAndNew = false;
        this.template.querySelector('lightning-record-edit-form').submit();
    }

    handleSaveAndNew() {
        this.saveAndNew = true;
        this.template.querySelector('lightning-record-edit-form').submit();
    }

    handleCancel() {
        this.close('update');
    }

}