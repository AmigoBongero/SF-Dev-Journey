import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import createNewExpenseModal from 'c/createNewExpenseModal';
import editExpenseModal from 'c/editExpenseModal';
import deleteExpenseModal from 'c/deleteExpenseModal';

import getExpenses from '@salesforce/apex/AccountsComponentController.getExpenses';

const EXPENSES_COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Description', fieldName: 'Description__c' },
    { label: 'Amount', fieldName: 'Amount__c' },
    { label: 'Check Date', fieldName: 'Check_Date__c' },
];

export default class ExpensesTabComponent extends LightningElement {

    /*
     * @description     Getters.
     */
    get expensesColumnsGetter() {
        return EXPENSES_COLUMNS;
    }

    /*
     * @description     Variables.
     */
    expensesData = [];
    selectedExpense = [];

    /*
     * @description     Handlers.
     */
    handleRowSelection(event) {
        this.selectedExpense = event.detail.selectedRows.map(row => row.Id);
    }

    async handleNewClick() {
        try {
            const result = await createNewExpenseModal.open({
                size: 'small',
                description: 'Create new expense',
            });
            if (result === 'update') {
                this.loadExpenses();
            } else if (result === 'saveAndNew') {
                await this.loadExpenses();
                setTimeout(() => {
                    this.handleNewClick();
                }, 800)
            }
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error occurred',
                message: 'Error: ' + error.message,
                variant: 'error'
            }));
        }
    }

    async handleEditClick() {
        try {
            if (this.selectedExpense.length > 0) {
                const result = await editExpenseModal.open({
                    size: 'small',
                    description: 'Edit expense',
                    selectedExpense: this.selectedExpense[0],
                    isLoading: true
                });
                if (result === 'update') {
                    this.loadExpenses();
                }
            } else {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'The record is not selected!',
                    message: 'Please select a record.',
                    variant: 'info'
                }));
            }
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error occurred',
                message: 'Error: ' + error.message,
                variant: 'error'
            }));
        }
    }

    async handleDeleteClick() {
        try {
            if (this.selectedExpense.length > 0) {
                const result = await deleteExpenseModal.open({
                    size: 'small',
                    description: 'Delete expense',
                    selectedExpense: this.selectedExpense[0]
                });
                if (result === 'update') {
                    this.loadExpenses();
                }
            } else {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'The record is not selected!',
                    message: 'Please select a record.',
                    variant: 'info'
                }));
            }
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error occurred',
                message: 'Error: ' + error.message,
                variant: 'error'
            }));
        }
    }

    /*
     * @description     Reusable Code.
     */
    connectedCallback() {
        this.loadExpenses();
    }

    loadExpenses() {
        getExpenses()
            .then(result => {
                this.expensesData = result;
                this.selectedExpense = [];
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error occurred while loading expenses',
                    message: `Error: ${error.message}`,
                    variant: 'error'
                }));
            })
    }

}