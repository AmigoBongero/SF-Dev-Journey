import { api } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import LightningModal from 'lightning/modal';

import EXPENSE_NAME from '@salesforce/schema/Expense__c.Name';
import EXPENSE_PAYEE from '@salesforce/schema/Expense__c.Payee__c';
import EXPENSE_STATUS from '@salesforce/schema/Expense__c.Status__c';
import EXPENSE_DESCRIPTION from '@salesforce/schema/Expense__c.Description__c';
import EXPENSE_AMOUNT from '@salesforce/schema/Expense__c.Amount__c';
import EXPENSE_CHECK_DATE from '@salesforce/schema/Expense__c.Check_Date__c';

const EXPENSE_FIELDS = [
    EXPENSE_NAME,
    EXPENSE_PAYEE,
    EXPENSE_STATUS,
    EXPENSE_DESCRIPTION,
    EXPENSE_AMOUNT,
    EXPENSE_CHECK_DATE
];

export default class CreateNewExpenseModal extends LightningModal {

    // API Variables
    @api recordId;
    @api isLoading;

    // Other Variables.
    isSaveAndNew = false;
    fieldsToUpdate = {};

    /*
     * @description     Getters.
     */
    get expenseFieldsGetter() {
        return EXPENSE_FIELDS;
    }

    /*
     * @description     Handlers.
     */
    handleLoad() {
        this.isLoading = false;
    }

    handleFieldChange(event) {
        this.fieldsToUpdate[event.target.fieldName] = event.target.value;
    }

    handleSuccess() {
        this.isLoading = false;
        this.close((this.isSaveAndNew) ? 'saveAndNew' : 'update');
    }

    handleSave() {
        this.isSaveAndNew = false;
        this.submitOrUpdateRecordForm();
    }

    handleSaveAndNew() {
        this.isSaveAndNew = true;
        this.submitOrUpdateRecordForm();
    }

    handleCancel() {
        this.close();
    }

    /*
     * @description     Reusable code.
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

    submitOrUpdateRecordForm() {
        if (this.isInputValid()) {
            this.isLoading = true;
            if (this.recordId && this.recordId.length > 0) {
                const recordInput = {
                    fields: {
                        Id: this.recordId,
                        ...this.fieldsToUpdate
                    }
                };
                updateRecord(recordInput)
                    .then(() => {
                        this.handleSuccess();
                    }).catch(error => {
                        this.isLoading = false;
                        this.dispatchEvent(new ShowToastEvent({
                            title: "Error occurred while updating record",
                            message: "Error: " + error,
                            variant: "error"
                        }));
                    });
            } else {
                this.refs.recordEditForm.submit();
            }
        } else {
            this.isLoading = false;
            this.dispatchEvent(new ShowToastEvent({
                title: "There is field validation error!",
                message: "Check the fields values",
                variant: "info"
            }));
        }
    }

}