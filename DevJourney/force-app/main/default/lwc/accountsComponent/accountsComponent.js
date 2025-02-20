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
    recentlyViewedAccountsData = [];
    rowLimit = 20;
    rowOffSet = 0;

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
        const { target } = event;
        target.isLoading = true;
        this.rowOffSet = this.rowOffSet + this.rowLimit;
        this.loadMyAccounts()
            .then(() => {
            target.isLoading = false;
        })
    }

    handleLoadMoreRecentlyViewedAccounts(event) {
        const { target } = event;
        target.isLoading = true;
        this.rowOffSet = this.rowOffSet + this.rowLimit;
        this.loadRecentlyViewedAccounts()
            .then(() => {
                target.isLoading = false;
            })
    }

    /*
     * @description     Reusable code.
     */
    loadMyAccounts() {
        return getMyAccounts({limitSize: this.rowLimit, offset: this.rowOffSet})
            .then(result => {
                this.myAccountsData = [...this.myAccountsData, ...result];
                if (result.length === 0) {
                    this.refs.myAccountsTable.enableInfiniteLoading = false;
                }
            }).catch(error => {
                this.toastErrorMessage(error);
            });
    }

    loadRecentlyViewedAccounts() {
        return getRecentlyViewedAccounts({limitSize: this.rowLimit, offset: this.rowOffSet})
            .then(result => {
                this.recentlyViewedAccountsData = [...this.recentlyViewedAccountsData, ...result];
                if (result.length === 0) {
                    this.refs.recentlyViewedAccountsTable.enableInfiniteLoading = false;
                }
            }).catch(error => {
                this.toastErrorMessage(error);
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