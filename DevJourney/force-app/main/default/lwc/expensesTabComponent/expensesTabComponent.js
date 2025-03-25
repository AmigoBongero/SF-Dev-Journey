import { LightningElement } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { sortArrayOfObjectsByField } from 'c/utilityComponent';
import { showToast } from 'c/utilityComponent';

import CreateAndEditExpenseModal from 'c/createAndEditExpenseModal';
import AdvancedSearchModal from 'c/advancedSearchModal';
import LightningConfirm from 'lightning/confirm';

import getExpenses from '@salesforce/apex/AccountsComponentController.getExpenses';
import searchExpenses from '@salesforce/apex/AccountsComponentController.searchExpenses';

import EXPENSE_NAME from '@salesforce/schema/Expense__c.Name';
import EXPENSE_STATUS from '@salesforce/schema/Expense__c.Status__c';
import EXPENSE_DESCRIPTION from '@salesforce/schema/Expense__c.Description__c';
import EXPENSE_AMOUNT from '@salesforce/schema/Expense__c.Amount__c';
import EXPENSE_CHECK_DATE from '@salesforce/schema/Expense__c.Check_Date__c';

const EXPENSES_COLUMNS = [
    { label: 'Name', fieldName: EXPENSE_NAME.fieldApiName, sortable: true },
    { label: 'Status', fieldName: EXPENSE_STATUS.fieldApiName, sortable: true },
    { label: 'Description', fieldName: EXPENSE_DESCRIPTION.fieldApiName, sortable: true },
    { label: 'Amount', fieldName: EXPENSE_AMOUNT.fieldApiName, sortable: true },
    { label: 'Check Date', fieldName: EXPENSE_CHECK_DATE.fieldApiName, sortable: true },
];

export default class ExpensesTabComponent extends LightningElement {

    // Table Variables.
    expensesData = [];
    expensesFullData = [];
    expensesFilteredData = [];
    selectedExpenseIds = [];
    expensesRecordCount = 20;
    sortDirection = 'asc';
    sortedBy = '';

    // Search Variables.
    nameSearchValue = '';
    statusSearchValue = '';
    createdDateSearchValue = '';
    amountSearchValue = '';
    dueDateSearchValue = '';
    descriptionSearchValue = '';

    // Boolean Variables.
    isLoading = false;
    isNoResult = false;

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
    handleClearSearch() {
        this.refs.searchExpense.value = '';
        this.nameSearchValue = '';
        this.statusSearchValue = '';
        this.createdDateSearchValue = '';
        this.amountSearchValue = '';
        this.dueDateSearchValue = '';
        this.descriptionSearchValue = '';
        this.expensesFilteredData = [];
        this.loadExpenses();
    }

    async handleAdvancedSearchClick() {
        try {
            const modalResponse = await AdvancedSearchModal.open({
                size: 'small',
                label: 'Advanced Search',
                statusSearchValue: this.statusSearchValue,
                createdDateSearchValue: this.createdDateSearchValue,
                amountSearchValue: this.amountSearchValue,
                dueDateSearchValue: this.dueDateSearchValue,
                descriptionSearchValue: this.descriptionSearchValue
            });
            if (modalResponse) {
                const advancedSearchCriteria = JSON.parse(modalResponse);
                this.statusSearchValue = advancedSearchCriteria.status;
                this.createdDateSearchValue = advancedSearchCriteria.createdDate;
                this.amountSearchValue = advancedSearchCriteria.amount;
                this.dueDateSearchValue = advancedSearchCriteria.dueDate;
                this.descriptionSearchValue = advancedSearchCriteria.description;
                this.doSearch();
            }
        } catch (error) {
            showToast(
                this,
                'Error occurred while opening advanced search',
                'Error' + error.message,
                'error'
            );
        }
    }

    handleSearch(event) {
        this.nameSearchValue = event.target.value.toLowerCase();
        this.expensesRecordCount = 20;
        this.doSearch();
    }

    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        if (this.nameSearchValue || this.statusSearchValue || this.createdDateSearchValue
            || this.amountSearchValue || this.dueDateSearchValue || this.descriptionSearchValue || this.expensesFilteredData.length > 0) {
            this.expensesFilteredData = sortArrayOfObjectsByField(this.expensesFilteredData, this.sortedBy, this.sortDirection);
            this.expensesData = this.expensesFilteredData.slice(0, this.expensesRecordCount);
        } else {
            this.expensesFullData = sortArrayOfObjectsByField(this.expensesFullData, this.sortedBy, this.sortDirection);
            this.expensesData = this.expensesFullData.slice(0, this.expensesRecordCount);
        }
    }

    handleLoadMoreExpenses() {
        if (this.nameSearchValue || this.statusSearchValue || this.createdDateSearchValue
            || this.amountSearchValue || this.dueDateSearchValue || this.descriptionSearchValue || this.expensesFilteredData.length > 0) {
            if (this.expensesData.length < this.expensesFilteredData.length) {
                this.expensesRecordCount += 20;
                this.expensesData = this.expensesFilteredData.slice(0, this.expensesRecordCount);
            }
        } else if (this.expensesData.length < this.expensesFullData.length) {
            this.expensesRecordCount += 20;
            this.expensesData = this.expensesFullData.slice(0, this.expensesRecordCount);
        }
        if (this.sortedBy) {
            this.expensesData = sortArrayOfObjectsByField(this.expensesData, this.sortedBy, this.sortDirection);
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
                showToast(
                    this,
                    'New expense has been successfully created!',
                    '',
                    'success'
                );
                this.loadExpenses();
            } else if (modalResponse === 'saveAndNew') {
                showToast(
                    this,
                    'New expense has been successfully created!',
                    '',
                    'success'
                );
                this.loadExpenses();
                await this.handleNewClick();
            }
        } catch (error) {
            showToast(
                this,
                'Error occurred while opening new expense window',
                'Error: ' + error.message,

            );
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
                    showToast(
                        this,
                        'Record has been successfully edited!',
                        '',
                        'success'
                    );
                    this.loadExpenses();
                } else if (modalResponse === 'saveAndNew') {
                    showToast(
                        this,
                        'Record has been successfully edited!',
                        '',
                        'success'
                    );
                    this.loadExpenses();
                    await this.handleNewClick();
                }
            } else {
                showToast(
                    this,
                    'Record is not selected!',
                    'Please select a record',
                    'info'
                );
            }
        } catch (error) {
            showToast(
                this,
                'Error occurred while opening edit record window',
                'Error: ' + error,
                'error'
            );
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
                        showToast(
                            this,
                            'Record has been successfully deleted',
                            '',
                            'success'
                        );
                    } catch (error) {
                        showToast(
                            this,
                            'Error occurred while deleting record',
                            'Error: ' + error.message,
                            'error'
                        );
                    } finally {
                        this.isLoading = false;
                    }
                }
            } else {
                showToast(
                    this,
                    'Record is not selected!',
                    'Please select a record',
                    'info'
                );
            }
        } catch (error) {
            showToast(
                this,
                'Error occurred while opening delete confirm window',
                'Error: ' + error.message,
                'error'
            );
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
                this.expensesRecordCount = 20;
                this.selectedExpenseIds = [];
                this.doSearch();
            }).catch(error => {
                showToast(
                    this,
                    'Error occurred while loading expenses',
                    'Error: ' + error.message,
                    'error'
                );
            }).finally(() => {
                this.isLoading = false;
            });
    }

    doSearch() {
        if (this.nameSearchValue || this.statusSearchValue || this.createdDateSearchValue
            || this.amountSearchValue || this.dueDateSearchValue || this.descriptionSearchValue) {
            this.isLoading = true;
            searchExpenses({
                name: this.nameSearchValue,
                status: this.statusSearchValue,
                createdDate: this.createdDateSearchValue,
                amount: this.amountSearchValue,
                dueDate: this.dueDateSearchValue,
                description: this.descriptionSearchValue
            }).then(result => {
                this.expensesFilteredData = result;
                if (this.sortedBy) {
                    this.expensesFilteredData = sortArrayOfObjectsByField(this.expensesFilteredData, this.sortedBy, this.sortDirection);
                }
                this.expensesData = this.expensesFilteredData.slice(0, this.expensesRecordCount);
                if (this.expensesFilteredData.length === 0) {
                    this.isNoResult = true;
                }
                }).catch(error => {
                    showToast(
                        this,
                        'Error occurred while searching expenses',
                        'Error: ' + error.message,
                        'error'
                    );
                }).finally(() => {
                    this.isLoading = false;
                });
        } else {
            this.isNoResult = false;
            this.expensesData = this.expensesFullData.slice(0, this.expensesRecordCount);
            this.expensesFilteredData = [];
            if (this.sortedBy) {
                this.expensesData = sortArrayOfObjectsByField(this.expensesData, this.sortedBy, this.sortDirection);
            }
        }
    }

}