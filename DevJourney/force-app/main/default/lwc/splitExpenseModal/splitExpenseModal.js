import { api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import AddCasePartyModal from 'c/addCasePartyModal';
import LightningModal from 'lightning/modal';

import upsertExpenses from '@salesforce/apex/AccountsComponentController.upsertExpenses';

import CASE_PARTY_NAME from '@salesforce/schema/Case_Party__c.Name';
import CASE_PARTY_EMAIL from '@salesforce/schema/Case_Party__c.Email__c';
import EXPENSE_ID from '@salesforce/schema/Expense__c.Id';
import EXPENSE_NAME from '@salesforce/schema/Expense__c.Name';
import EXPENSE_CHECK_DATE from '@salesforce/schema/Expense__c.Check_Date__c';
import EXPENSE_AMOUNT from '@salesforce/schema/Expense__c.Amount__c';
import EXPENSE_PAYEE from '@salesforce/schema/Expense__c.Payee__c';
import EXPENSE_DESCRIPTION from '@salesforce/schema/Expense__c.Description__c';
import EXPENSE_STATUS from '@salesforce/schema/Expense__c.Status__c';

const SPLIT_COLUMNS = [
    { label: 'Case Party Name', fieldName: CASE_PARTY_NAME.fieldApiName },
    { label: 'Email', fieldName: CASE_PARTY_EMAIL.fieldApiName },
    { label: 'Amount to split', fieldName: EXPENSE_AMOUNT.fieldApiName, editable: true }
];

const FIELDS = [
    EXPENSE_NAME,
    EXPENSE_CHECK_DATE,
    EXPENSE_DESCRIPTION,
    EXPENSE_STATUS,
    EXPENSE_AMOUNT
]

export default class SplitExpenseModal extends LightningModal {

    // API Variables
    @api recordId;

    // Boolean Variables.
    @track isRemoveButtonDisabled = true;
    @track isSplitButtonDisabled = true;
    isModalLoading = false;
    isNullAmount = false;
    isFieldsCorrect = false;
    
    // Other Variables.
    @track casePartiesData = [];
    @track draftValues = [];
    @track messageResult = false;
    currentExpense = null;
    expenseAmountLeft = null;
    expenseAmountClass = null;
    selectedCaseParty = [];
    totalEditedAmount = 0;

    /*
     * @description     Getters.
     */
    get splitColumnsGetter() {
        return SPLIT_COLUMNS;
    }

    /*
     * @description     Wire function. 
     */

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    expenseHandler({ error, data }) {
        if(data) {
            this.currentExpense = data;
            this.expenseAmountLeft = data.fields[EXPENSE_AMOUNT.fieldApiName].value;
        } else if (error) {
            this.toastErrorMessage(error);
        }
        this.isModalLoading = false;
    }

    /*
     * @description     Callbacks.
     */
    connectedCallback() {
        this.isModalLoading = true;
        this.messageResult = true;
    }

    /*
     * @description     Handlers.
     */
    async handleAddCaseParty() {
        try {
            const result = await AddCasePartyModal.open({
                size: 'medium',
                chosenCasePartiesGetSet: this.casePartiesData
            });
            this.casePartiesData = result;
            this.messageResult = this.casePartiesData.length === 0 && this.searchCaseParty !== '';
        } catch (error) {
            this.toastErrorMessage();
        }
    }

    handleRowSelection(event) {
        this.selectedCaseParty = event.detail.selectedRows.map(row => row.Id) || [];    
        this.isRemoveButtonDisabled = this.selectedCaseParty.length === 0;
    }

    handleRemove() {
        const rowIndex = this.casePartiesData.findIndex(value => { return value.Id === this.selectedCaseParty[0] });
        this.expenseAmountLeft += parseFloat(this.selectedCaseParty[0][EXPENSE_AMOUNT.fieldApiName] || 0);

        this.casePartiesData = [...this.casePartiesData.slice(0, rowIndex), ...this.casePartiesData.slice(rowIndex + 1)];

        const datatable = this.template.querySelector('lightning-datatable');
        if (datatable) {
            datatable.selectedRows = [];
        }
        this.isRemoveButtonDisabled = !this.isRemoveButtonDisabled;
    }

    handleCancel() {
        this.close();
    }

    handleCellChange(event) {
        const newDrafts = event.detail.draftValues;
        this.draftValues = [...this.draftValues];
        newDrafts.forEach((newDraft) => {
            const existingIndex = this.draftValues.findIndex(d => d.id === newDraft.id);
            if (existingIndex > -1) {
                this.draftValues[existingIndex] = { ...this.draftValues[existingIndex], ...newDraft };
            } else {
                this.draftValues.push(newDraft);
            }
        });

        this.isNullAmount = false;
        this.isFieldsCorrect = true;
        this.totalEditedAmount = this.draftValues.reduce((total, draft) => {
            const amount = parseFloat(draft[EXPENSE_AMOUNT.fieldApiName] || 0);
            if (amount === 0 || amount === null ) {
                this.isNullAmount = true;
                this.isFieldsCorrect = false;
            }
            return total + amount;
        }, 0);

        const currentExpenseAmount = parseFloat(this.currentExpense?.fields?.[EXPENSE_AMOUNT.fieldApiName]?.value || 0);
        this.expenseAmountLeft = currentExpenseAmount - this.totalEditedAmount;
        this.expenseAmountClass = this.expenseAmountLeft <= 0 ? 'red-text' : '';
        this.toggleButtonState();
    }

    handleSplit() {
        let recordsToUpsert = [];
        const expenseFields = this.currentExpense?.fields;
        try {
            this.casePartiesData.forEach(async (caseParty, index) => {
                let fields = {};
                fields[EXPENSE_AMOUNT.fieldApiName] = this.draftValues[index][EXPENSE_AMOUNT.fieldApiName]; 
                fields[EXPENSE_PAYEE.fieldApiName] = caseParty.Id;
                fields[EXPENSE_NAME.fieldApiName] = expenseFields?.[EXPENSE_NAME.fieldApiName]?.value;
                fields[EXPENSE_CHECK_DATE.fieldApiName] = expenseFields?.[EXPENSE_CHECK_DATE.fieldApiName]?.value;
                fields[EXPENSE_DESCRIPTION.fieldApiName] = expenseFields?.[EXPENSE_DESCRIPTION.fieldApiName]?.value;
                fields[EXPENSE_STATUS.fieldApiName] = expenseFields?.[EXPENSE_STATUS.fieldApiName]?.value;
                recordsToUpsert.push({ ...fields });
            });
            let fields = {};
            fields[EXPENSE_ID.fieldApiName] = this.recordId;
            fields[EXPENSE_AMOUNT.fieldApiName] = this.expenseAmountLeft;
            recordsToUpsert.push({ ...fields });
        } catch(error) {
            this.toastErrorMessage(error);
        }
        upsertExpenses({ records: recordsToUpsert })
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Expense have been successfully split',
                    message: '',
                    variant: 'success'
                }));
                this.close();
            })
            .catch((error) => {
                this.toastErrorMessage(error);
                console.error(error);
            });
    }

    /*
    * @description     Reusable Code.
    */
    toggleButtonState() {
        if (this.draftValues.length === this.casePartiesData.length &&
            this.isFieldsCorrect && !this.isNullAmount) {
            this.isSplitButtonDisabled = false;
        } else {
            this.isSplitButtonDisabled = true;
        }
    }

    toastErrorMessage(error) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error occurred',
            message: 'Error: ' + error?.message,
            variant: 'error'
        }));
    }

}