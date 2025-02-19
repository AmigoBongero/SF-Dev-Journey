import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import CreateAndEditExpenseModal from 'c/createAndEditExpenseModal';
import DeleteExpenseModal from 'c/deleteExpenseModal';

import getExpenses from '@salesforce/apex/AccountsComponentController.getExpenses';

const EXPENSES_COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Description', fieldName: 'Description__c' },
    { label: 'Amount', fieldName: 'Amount__c' },
    { label: 'Check Date', fieldName: 'Check_Date__c' },
];

export default class ExpensesTabComponent extends LightningElement {

    // Table data Variables.
    expensesData = [];
    selectedExpenseId = [];

    // Other Variables,
    isLoading;

    /*
     * @description     Getters.
     */
    get expensesColumnsGetter() {
        return EXPENSES_COLUMNS;
    }

    /*
     * @description     Callbacks.
     */
    connectedCallback() {
        this.loadExpenses();
    }

    /*
     * @description     Handlers.
     */
    handleRowSelection(event) {
        this.selectedExpenseId = event.detail.selectedRows.map(row => row.Id);
    }

    async handleNewClick() {
        try {
            const modalResponse = await CreateAndEditExpenseModal.open({
                size: 'small',
                label: 'Create new expense',
                isLoading: true
            });
            if (modalResponse === 'update') {
                this.toastNewExpenseMessage();
                this.loadExpenses();
            } else if (modalResponse === 'saveAndNew') {
                this.toastNewExpenseMessage();
                await this.loadExpenses();
                await this.handleNewClick();
            }
        } catch (error) {
            this.toastErrorMessage();
        }
    }

    async handleEditClick() {
        try {
            if (this.selectedExpenseId.length > 0) {
                const modalResponse = await CreateAndEditExpenseModal.open({
                    size: 'small',
                    label: 'Edit expense',
                    selectedExpense: this.selectedExpenseId[0],
                    isLoading: true
                });
                if (modalResponse === 'update') {
                    this.toastEditExpenseMessage();
                    this.loadExpenses();
                } else if (modalResponse === 'saveAndNew') {
                    this.toastEditExpenseMessage();
                    await this.loadExpenses();
                    await this.handleNewClick();
                }
            } else {
                this.toastIsNotSelectedMessage();
            }
        } catch (error) {
            this.toastErrorMessage(error);
        }
    }

    async handleDeleteClick() {
        try {
            if (this.selectedExpenseId.length > 0) {
                const modalResponse = await DeleteExpenseModal.open({
                    size: 'small',
                    selectedExpense: this.selectedExpenseId[0]
                });
                if (modalResponse === 'update') {
                    this.loadExpenses();
                }
            } else {
                this.toastIsNotSelectedMessage();
            }
        } catch (error) {
            this.toastErrorMessage(error);
        }
    }

    /*
     * @description     Reusable Code.
     */
    loadExpenses() {
        this.isLoading = true;
        getExpenses()
            .then(result => {
                this.expensesData = result;
                this.selectedExpenseId = [];
                this.isLoading = false;
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error occurred while loading expenses',
                    message: `Error: ${error.message}`,
                    variant: 'error'
                }));
                this.isLoading = false;
            });
    }

    toastIsNotSelectedMessage() {
        this.dispatchEvent(new ShowToastEvent({
            title: 'The record is not selected!',
            message: 'Please select a record.',
            variant: 'info'
        }));
    }

    toastErrorMessage(error) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error occurred',
            message: 'Error: ' + error.message,
            variant: 'error'
        }));
    }

    toastNewExpenseMessage() {
        this.dispatchEvent(new ShowToastEvent({
            title: 'New expanse has been successfully created',
            message: '',
            variant: 'success'
        }));
    }

    toastEditExpenseMessage() {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Expanse has been successfully updated',
            message: '',
            variant: 'success'
        }));
    }

}