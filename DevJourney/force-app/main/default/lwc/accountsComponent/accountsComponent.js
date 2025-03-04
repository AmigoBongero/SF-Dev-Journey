import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getMyAccounts from '@salesforce/apex/AccountsComponentController.getMyAccounts';
import getRecentlyViewedAccounts from '@salesforce/apex/AccountsComponentController.getRecentlyViewedAccounts';

import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_INDUSTRY from '@salesforce/schema/Account.Industry';
import ACCOUNT_PHONE from '@salesforce/schema/Account.Phone';

const ACCOUNT_COLUMNS = [
    { label: 'Name', fieldName: ACCOUNT_NAME.fieldApiName, sortable: true },
    { label: 'Industry', fieldName: ACCOUNT_INDUSTRY.fieldApiName, sortable: true },
    { label: 'Phone', fieldName: ACCOUNT_PHONE.fieldApiName, sortable: true }
];

export default class AccountsComponent extends LightningElement {

    // My Accounts Table Variables.
    myAccountsData = [];
    myAccountsFullData = [];
    myAccountsRecordCount = 20;
    myAccountsSortDirection = 'asc';
    myAccountsSortedBy;

    // Recently Viewed Accounts Table Variables.
    recentlyViewedAccountsData = [];
    recentlyViewedAccountsFullData = [];
    recentlyViewedAccountRecordCount = 20;
    recentlyViewedAccountsSortDirection = 'asc';
    recentlyViewedAccountsSortedBy;

    // Boolean variables.
    isMyAccountsLoading = false;
    isRecentlyViewedAccountsLoading = false;

    /*
     * @description     Getters.
     */
    get accountColumnsGetter() {
        return ACCOUNT_COLUMNS;
    }

    /*
     * @description     Callbacks.
     */
    connectedCallback() {
        this.loadAccounts('myAccounts');
        this.loadAccounts('recentlyViewedAccounts');
    }

    /*
     * @description     Handlers.
     */
    handleMyAccountsSort(event) {
        this.myAccountsSortedBy = event.detail.fieldName;
        this.myAccountsSortDirection = event.detail.sortDirection;
        this.myAccountsData = this.sortData(this.myAccountsData, this.myAccountsSortedBy, this.myAccountsSortDirection);
    }

    handleRecentlyViewedAccountsSort(event) {
        this.recentlyViewedAccountsSortedBy = event.detail.fieldName;
        this.recentlyViewedAccountsSortDirection = event.detail.sortDirection;
        this.recentlyViewedAccountsData = this.sortData(this.recentlyViewedAccountsData, this.recentlyViewedAccountsSortedBy, this.recentlyViewedAccountsSortDirection);
    }

    handleLoadMoreAccounts() {
        if (this.myAccountsData.length < this.myAccountsFullData.length) {
            this.myAccountsRecordCount += 20;
            this.myAccountsData = this.myAccountsFullData.slice(0, this.myAccountsRecordCount);
        } else if (this.recentlyViewedAccountsData.length < this.recentlyViewedAccountsFullData.length) {
            this.recentlyViewedAccountRecordCount += 20;
            this.recentlyViewedAccountsData = this.recentlyViewedAccountsFullData.slice(0, this.recentlyViewedAccountRecordCount);
        }
    }

    /*
     * @description     Reusable code.
     */
    sortData(data, field, direction) {
        let fieldName = field;
        let dataToSort = [...data];

        let keyValue = (a) => {
            return a[fieldName];
        };

        let isReverse = direction === 'asc' ? 1: -1;

        dataToSort.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : '';
            y = keyValue(y) ? keyValue(y) : '';
            return isReverse * ((x > y) - (y > x));
        });
        return dataToSort;
    }

    loadAccounts(type) {
        if (type === 'myAccounts') {
            this.isMyAccountsLoading = true;
            getMyAccounts()
                .then(result => {
                    this.myAccountsFullData = result;
                    this.myAccountsRecordCount = 20;
                    this.myAccountsData = this.myAccountsFullData.slice(0, this.myAccountsRecordCount);
                }).catch(error => {
                    this.toastErrorMessage(error);
                }).finally(() => {
                    this.isMyAccountsLoading = false;
                });
        } else if (type === 'recentlyViewedAccounts') {
            this.isRecentlyViewedAccountsLoading = true;
            getRecentlyViewedAccounts()
                .then(result => {
                    this.recentlyViewedAccountsFullData = result;
                    this.recentlyViewedAccountRecordCount = 20;
                    this.recentlyViewedAccountsData = this.recentlyViewedAccountsFullData.slice(0, this.recentlyViewedAccountRecordCount);
                }).catch(error => {
                    this.toastErrorMessage(error);
                }).finally(() => {
                    this.isRecentlyViewedAccountsLoading = false;
                });
        }
    }

    toastErrorMessage(error) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error occurred while loading accounts',
            message: `Error: ${error.message}`,
            variant: 'error'
        }));
    }

}