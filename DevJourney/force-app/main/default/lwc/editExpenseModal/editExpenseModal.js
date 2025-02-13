import { api } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import LightningModal from 'lightning/modal';

export default class EditExpenseModal extends LightningModal {

    /*
     * @description     API Variables.
     */
    @api selectedExpense;
    @api isLoading;

    /*
     * @description     Variables.
     */
    fields = {};

    /*
     * @description     Handlers.
     */
    handleLoad() {
        this.isLoading = false;
    }

    handleFieldChange(event) {
        this.fields[event.target.fieldName] = event.target.value;
    }

    handleSuccess() {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Expense has been successfully edited',
            message: '',
            variant: 'success'
        }));
    }

    async handleSave() {
        const recordInput = {
            fields: {
                Id: this.selectedExpense,
                ...this.fields
            }
        }
        await updateRecord(recordInput).then(() => {
            this.handleSuccess();
        })
        this.close('update');
    }

    handleCancel() {
        this.close('update');
    }

}