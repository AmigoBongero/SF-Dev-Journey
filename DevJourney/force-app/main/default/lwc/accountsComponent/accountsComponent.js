import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getMyAccounts from '@salesforce/apex/AccountsComponentController.getMyAccounts';
import getRecentlyViewedAccounts from '@salesforce/apex/AccountsComponentController.getRecentlyViewedAccounts';

const ACCOUNT_COLUMNS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Industry', fieldName: 'Industry' },
    { label: 'Phone', fieldName: 'Phone' }
];

export default class AccountsComponent extends LightningElement {

    // Datatable variables.
    myAccountsData = [];
    myAccountsDataItems = [];
    myAccountsRecordCount = 20;
    recentlyViewedAccountsData = [];
    recentlyViewedAccountsDataItems = [];
    recentlyViewedAccountRecordCount = 20;

    // Other variables
    isLoading = false;

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
    handleLoadMoreMyAccounts(event) {
        if (this.myAccountsData.length < this.myAccountsDataItems.length) {
            this.myAccountsRecordCount += 20;
            this.myAccountsData = this.myAccountsDataItems.slice(0, this.myAccountsRecordCount);
        }
    }

    handleLoadMoreRecentlyViewedAccounts(event) {
        if (this.recentlyViewedAccountsData.length < this.recentlyViewedAccountsDataItems.length) {
            this.recentlyViewedAccountRecordCount += 20;
            this.recentlyViewedAccountsData = this.recentlyViewedAccountsDataItems.slice(0, this.recentlyViewedAccountRecordCount);
        }
    }

    /*
     * @description     Reusable code.
     */
    loadMyAccounts() {
        this.isLoading = true;
        getMyAccounts()
            .then(result => {
                this.myAccountsDataItems = result;
                this.myAccountsData = this.myAccountsDataItems.slice(0, this.myAccountsRecordCount);
            }).catch(error => {
                this.toastErrorMessage(error);
            }).finally(() => {
                this.isLoading = false;
            });
    }

    loadRecentlyViewedAccounts() {
        this.isLoading = true;
        getRecentlyViewedAccounts()
            .then(result => {
                this.recentlyViewedAccountsDataItems = result;
                this.recentlyViewedAccountsData = this.recentlyViewedAccountsDataItems.slice(0, this.recentlyViewedAccountRecordCount);
            }).catch(error => {
                this.toastErrorMessage(error);
            }).finally(() => {
                this.isLoading = false;
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