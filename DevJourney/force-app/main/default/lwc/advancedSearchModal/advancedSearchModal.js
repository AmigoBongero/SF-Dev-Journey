import { api } from 'lwc';

import LightningModal from 'lightning/modal';

import EXPENSE_OBJECT from '@salesforce/schema/Expense__c';
import EXPENSE_STATUS from '@salesforce/schema/Expense__c.Status__c';
import EXPENSE_DESCRIPTION from '@salesforce/schema/Expense__c.Description__c';
import EXPENSE_AMOUNT from '@salesforce/schema/Expense__c.Amount__c';
import EXPENSE_CHECK_DATE from '@salesforce/schema/Expense__c.Check_Date__c';

export default class AdvancedSearchModal extends LightningModal {

    // Search Variables.
    @api statusSearchValue = '';
    @api createdDateSearchValue = '';
    @api amountSearchValue = '';
    @api dueDateSearchValue = '';
    @api descriptionSearchValue = '';

    // Boolean Variables.
    isLoading = true;

    /*
     * @description     Getters.
     */
    get expenseStatusGetter() {
        return EXPENSE_STATUS;
    }

    get expenseAmountGetter() {
        return EXPENSE_AMOUNT;
    }

    get expenseDueDateGetter() {
        return EXPENSE_CHECK_DATE;
    }

    get expenseDescriptionGetter() {
        return EXPENSE_DESCRIPTION;
    }

    get expenseObjectGetter() {
        return EXPENSE_OBJECT.objectApiName;
    }

    /*
     * @description     Handlers.
     */
    handleStatusFieldChange(event) {
        this.statusSearchValue = event.target.value;
    }

    handleCreatedDateFieldChange(event) {
        this.createdDateSearchValue = event.target.value;
    }

    handleAmountFieldChange(event) {
        this.amountSearchValue = event.target.value;
    }

    handleDueDateFieldChange(event) {
        this.dueDateSearchValue = event.target.value;
    }

    handleDescriptionFieldChange(event) {
        this.descriptionSearchValue = event.target.value;
    }

    handleSearchClick() {
        this.close({
            status: this.statusSearchValue,
            createdDate: this.createdDateSearchValue,
            amount: this.amountSearchValue,
            dueDate: this.dueDateSearchValue,
            description: this.descriptionSearchValue
        });
    }

    handleLoad() {
        this.isLoading = false;
    }

    handleCancelClick() {
        this.close();
    }

}