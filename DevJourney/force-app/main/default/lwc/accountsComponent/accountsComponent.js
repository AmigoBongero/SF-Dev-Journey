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
    myAccountsSortedBy = '';

    // Recently Viewed Accounts Table Variables.
    recentlyViewedAccountsData = [];
    recentlyViewedAccountsFullData = [];
    recentlyViewedAccountRecordCount = 20;
    recentlyViewedAccountsSortDirection = 'asc';
    recentlyViewedAccountsSortedBy = '';

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
        this.loadMyAccounts();
        this.loadRecentlyViewedAccounts();
    }

    /*
     * @description     Handlers.
     */
    handleMyAccountsSort(event) {
        this.myAccountsSortedBy = event.detail.fieldName;
        this.myAccountsSortDirection = event.detail.sortDirection;
        this.myAccountsFullData = this.sortData(this.myAccountsFullData, this.myAccountsSortedBy, this.myAccountsSortDirection);
        this.myAccountsData = this.myAccountsFullData.slice(0, this.myAccountsRecordCount);
    }

    handleRecentlyViewedAccountsSort(event) {
        this.recentlyViewedAccountsSortedBy = event.detail.fieldName;
        this.recentlyViewedAccountsSortDirection = event.detail.sortDirection;
        this.recentlyViewedAccountsFullData = this.sortData(this.recentlyViewedAccountsFullData, this.recentlyViewedAccountsSortedBy, this.recentlyViewedAccountsSortDirection);
        this.recentlyViewedAccountsData = this.recentlyViewedAccountsFullData.slice(0, this.recentlyViewedAccountRecordCount);
    }

    handleLoadMoreMyAccounts() {
        if (this.myAccountsData.length < this.myAccountsFullData.length) {
            this.myAccountsRecordCount += 20;
            this.myAccountsData = this.myAccountsFullData.slice(0, this.myAccountsRecordCount);
        }
    }

    handleLoadMoreRecentlyViewedAccounts() {
        if (this.recentlyViewedAccountsData.length < this.recentlyViewedAccountsFullData.length) {
            this.recentlyViewedAccountRecordCount += 20;
            this.recentlyViewedAccountsData = this.recentlyViewedAccountsFullData.slice(0, this.recentlyViewedAccountRecordCount);
        }
    }

    /*
     * @description     Reusable code.
     */
    sortData(data, fieldName, direction) {
        let sortedData = [...data];
        let getFieldValue = (record) => {
            return record[fieldName] ? record[fieldName].toString().toLowerCase() : '';
        };
        let isReverse = direction === 'asc' ? 1 : -1;

        sortedData.sort((x, y) => {
            let xValue = getFieldValue(x);
            let yValue = getFieldValue(y);

            if ((xValue === '' && yValue !== '') || (xValue === null && yValue !== null)) {
                return 1;
            } else if ((xValue !== '' && yValue === '') || (xValue !== null && yValue === null)) {
                return -1;
            } else if ((xValue === '' && yValue === '') || (xValue === null && yValue === null)) {
                return 0;
            } else {
                return isReverse * ((xValue > yValue) - (yValue > xValue));
            }
        });
        return sortedData;
    }

    loadMyAccounts() {
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
    }

    loadRecentlyViewedAccounts() {
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

    toastErrorMessage(error) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error occurred while loading accounts',
            message: `Error: ${error.message}`,
            variant: 'error'
        }));
    }

}