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
    handleFieldChange(event) {
        const fieldName =  event.target.name ?? event.target.fieldName;
        const fieldValue = event.target.value;

        switch (fieldName) {
            case EXPENSE_STATUS.fieldApiName:
                this.statusSearchValue = fieldValue;
                break;
            case 'CreatedDate':
                this.createdDateSearchValue = fieldValue;
                break;
            case EXPENSE_AMOUNT.fieldApiName:
                this.amountSearchValue = fieldValue;
                break;
            case EXPENSE_CHECK_DATE.fieldApiName:
                this.dueDateSearchValue = fieldValue;
                break;
            case EXPENSE_DESCRIPTION.fieldApiName:
                this.descriptionSearchValue = fieldValue;
                break;
            default:
                break;
        }
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