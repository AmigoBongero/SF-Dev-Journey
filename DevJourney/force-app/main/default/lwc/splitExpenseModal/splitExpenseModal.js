import LightningModal from 'lightning/modal';

import CASE_PARTY_NAME from '@salesforce/schema/Case_Party__c.Name';
import CASE_PARTY_EMAIL from '@salesforce/schema/Case_Party__c.Email__c';
import EXPENSE_AMOUNT from '@salesforce/schema/Expense__c.Amount__c';

const SPLIT_COLUMNS = [
    { label: 'Case Party Name', fieldName: CASE_PARTY_NAME.fieldApiName },
    { label: 'Email', fieldName: CASE_PARTY_EMAIL.fieldApiName },
    { label: 'Amount to split', fieldName: EXPENSE_AMOUNT.fieldApiName }
];
export default class SplitExpenseModal extends LightningModal {

    // Table data Variables.
    expensesData = [];
    selectedExpenseIds = [];

    // Other Variables,
    isLoading = false;

    /*
     * @description     Getters.
     */
    get expensesColumnsGetter() {
        return SPLIT_COLUMNS;
    }

}