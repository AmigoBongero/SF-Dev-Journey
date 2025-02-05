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

    get accountColumnsGetter() {
        return ACCOUNT_COLUMNS;
    }
    myAccountsData = [];
    recentlyViewedAccountsData = [];

    connectedCallback() {
        this.loadMyAccounts();
        this.loadRecentlyViewedAccounts();
    }

    loadMyAccounts() {
        getMyAccounts()
            .then(result => {
                this.myAccountsData = result;
            })
            .catch(error => {
                const showError = new ShowToastEvent({
                    title: 'Error occurred while loading accounts',
                    message: `Error: ${error.message}`,
                    variant: 'error'
                })
                this.dispatchEvent(showError);
                console.error(error);
            });
    }

    loadRecentlyViewedAccounts() {
        getRecentlyViewedAccounts()
            .then(result => {
                this.recentlyViewedAccountsData = result;
            })
            .catch(error => {
                const showError = new ShowToastEvent({
                    title: 'Error occurred while loading accounts',
                    message: `Error: ${error.message}`,
                    variant: 'error'
                })
                this.dispatchEvent(showError);
                console.error(error);
            });
    }

}