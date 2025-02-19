import { api } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import LightningModal from 'lightning/modal';

export default class DeleteExpenseModal extends LightningModal {

    @api selectedExpense;

    /*
     * @description     Handlers.
     */
    handleCancel() {
        this.close();
    }

    async handleDelete() {
        try {
            await deleteRecord(this.selectedExpense);
            this.close('update');
            this.dispatchEvent(new ShowToastEvent({
                title: 'Expense has been successfully deleted',
                message: '',
                variant: 'success'
            }));
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error occurred while deleting record',
                message: 'Error: ' + error,
                variant: 'error'
            }));
        }
    }

}