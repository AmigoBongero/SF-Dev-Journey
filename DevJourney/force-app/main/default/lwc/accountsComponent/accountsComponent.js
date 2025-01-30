import { LightningElement} from 'lwc';
import getMyAccounts from "@salesforce/apex/AccountController.getMyAccounts";
import getRecentlyViewedAccounts from "@salesforce/apex/AccountController.getRecentlyViewedAccounts";
export default class AccountsComponent extends LightningElement {
    columns = [
        {label: 'Name', fieldName: 'Name'},
        {label: 'Industry', fieldName: 'Industry'},
        {label: 'Phone', fieldName: 'Phone'}
    ];
    myAccountsData = [];
    recentlyViewedAccountsData = [];

    connectedCallback() {
        this.fetchMyAccounts();
        this.fetchRecentlyViewedAccounts();
    }

    fetchMyAccounts() {
        getMyAccounts()
            .then(result => {
                this.myAccountsData = result;
            })
            .catch(error => {
                console.error(error);
            });
    }

    fetchRecentlyViewedAccounts() {
        getRecentlyViewedAccounts()
            .then(result => {
                this.recentlyViewedAccountsData = result;
            })
            .catch(error => {
                console.error(error);
            });
    }
}