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

export default class CreateNewExpenseModal extends LightningModal {

    // API Variables
    @api selectedExpense;
    @api isLoading;

    // Other Variables.
    saveAndNew = false;
    fieldsToUpdate = {};

    /*
     * @description     Getters.
     */
    get expenseName() {
        return EXPENSE_NAME;
    }

    get expensePayee() {
        return EXPENSE_PAYEE;
    }

    get expenseStatus() {
        return EXPENSE_STATUS;
    }

    get expenseDescription() {
        return EXPENSE_DESCRIPTION;
    }

    get expenseAmount() {
        return EXPENSE_AMOUNT;
    }

    get expenseCheckDate() {
        return EXPENSE_CHECK_DATE;
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
        if (!this.saveAndNew) {
            this.close('update');
        } else {
            this.close('saveAndNew');
            this.saveAndNew = false;
        }
    }

    handleSave() {
        this.saveAndNew = false;
        if (this.selectedExpense && this.selectedExpense.length > 0) {
            this.updateRecordForm();
        } else {
            this.submitRecordForm();
        }
    }

    handleSaveAndNew() {
        this.saveAndNew = true;
        if (this.selectedExpense && this.selectedExpense.length > 0) {
            this.updateRecordForm();
        } else {
            this.submitRecordForm();
        }
    }

    handleCancel() {
        this.close('');
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

    submitRecordForm() {
        let isValid = this.isInputValid();
        if (isValid) {
            this.isLoading = true;
            this.refs.recordEditForm.submit();
        } else {
            this.isLoading = false;
            this.toastFieldValidationMessage();
        }
    }

    updateRecordForm() {
        let isValid = this.isInputValid();
        if (isValid) {
            this.isLoading = true;
            const recordInput = {
                fields: {
                    Id: this.selectedExpense,
                    ...this.fieldsToUpdate
                }
            };
            updateRecord(recordInput)
                .then(() => {
                    this.handleSuccess();
                })
                .catch(error => {
                    this.dispatchEvent(new ShowToastEvent({
                        title: "Error occurred while updating record",
                        message: "Error: " + error,
                        variant: "error"
                    }));
                });
        } else {
            this.isLoading = false;
            this.toastFieldValidationMessage();
        }
      }

    toastFieldValidationMessage() {
        this.dispatchEvent(new ShowToastEvent({
            title: "There is field validation error!",
            message: "Check the fields values",
            variant: "info"
        }));
    }

}