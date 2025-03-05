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
    myAccountsFullData = [];
    myAccountsRecordCount = 20;
    recentlyViewedAccountsData = [];
    recentlyViewedAccountsFullData = [];
    recentlyViewedAccountRecordCount = 20;

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