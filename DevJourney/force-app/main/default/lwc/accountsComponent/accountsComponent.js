import { LightningElement, wire } from 'lwc';
import getMyAccounts from "@salesforce/apex/myAccountsController.getMyAccounts"
export default class AccountsComponent extends LightningElement {
    columns = [
        {label: 'Name', fieldName: 'Name'},
        {label: 'Industry', fieldName: 'Industry'},
        {label: 'Phone', fieldName: 'Phone'}
    ];
    data = [];
    @wire(getMyAccounts)
    accounts ({data,error}){
        if (data) {
            this.data = data;
        } else if (error) {
            console.error(error);
        }
    }
}