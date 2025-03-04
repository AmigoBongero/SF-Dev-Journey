import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { deleteRecord } from 'lightning/uiRecordApi';

import CreateAndEditExpenseModal from 'c/createAndEditExpenseModal';
import LightningConfirm from "lightning/confirm";

import getExpenses from '@salesforce/apex/AccountsComponentController.getExpenses';

import EXPENSE_NAME from '@salesforce/schema/Expense__c.Name';
import EXPENSE_STATUS from '@salesforce/schema/Expense__c.Status__c';
import EXPENSE_DESCRIPTION from '@salesforce/schema/Expense__c.Description__c';
import EXPENSE_AMOUNT from '@salesforce/schema/Expense__c.Amount__c';
import EXPENSE_CHECK_DATE from '@salesforce/schema/Expense__c.Check_Date__c';

const EXPENSES_COLUMNS = [
    { label: 'Name', fieldName: EXPENSE_NAME.fieldApiName },
    { label: 'Status', fieldName: EXPENSE_STATUS.fieldApiName },
    { label: 'Description', fieldName: EXPENSE_DESCRIPTION.fieldApiName },
    { label: 'Amount', fieldName: EXPENSE_AMOUNT.fieldApiName },
    { label: 'Check Date', fieldName: EXPENSE_CHECK_DATE.fieldApiName },
];

export default class ExpensesTabComponent extends LightningElement {

    // Table Variables.
    expensesData = [];
    selectedExpenseIds = [];
    expensesFullData = [];
    expensesRecordCount = 20;

    // Other Variables,
    isLoading = false;

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
    handleLoadMoreExpenses() {
        if (this.expensesData.length < this.expensesFullData.length) {
            this.expensesRecordCount += 20;
            this.expensesData = this.expensesFullData.slice(0, this.expensesRecordCount);
        }
    }

    handleRowSelection(event) {
        this.selectedExpenseIds = event.detail.selectedRows.map(row => row.Id);
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
                this.loadExpenses();
                await this.handleNewClick();
            }
        } catch (error) {
            this.toastErrorMessage();
        }
    }

    async handleEditClick() {
        try {
            if (this.selectedExpenseIds.length > 0) {
                const modalResponse = await CreateAndEditExpenseModal.open({
                    size: 'small',
                    label: 'Edit expense',
                    recordId: this.selectedExpenseIds[0],
                    isLoading: true
                });
                if (modalResponse === 'update') {
                    this.toastEditExpenseMessage();
                    this.loadExpenses();
                } else if (modalResponse === 'saveAndNew') {
                    this.toastEditExpenseMessage();
                    this.loadExpenses();
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
            if (this.selectedExpenseIds.length > 0) {
                const modalResponse = await LightningConfirm.open({
                    message: "Are you sure you want to delete this expense?",
                    label: "Delete an expense",
                    theme: "warning"
                });
                if (modalResponse) {
                    this.isLoading = true;
                    try {
                        await deleteRecord(this.selectedExpenseIds[0]);
                        this.loadExpenses();
                        this.dispatchEvent(new ShowToastEvent({
                            title: 'Record has been successfully deleted',
                            message: '',
                            variant: 'success'
                        }));
                    } catch (error) {
                        this.toastErrorMessage(error);
                    } finally {
                        this.isLoading = false;
                    }
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
                this.expensesFullData = result;
                this.expensesData = this.expensesFullData.slice(0, this.expensesRecordCount);
                this.selectedExpenseIds = [];
            }).catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error occurred while loading expenses',
                    message: `Error: ${error.message}`,
                    variant: 'error'
                }));
            }).finally(() => {
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