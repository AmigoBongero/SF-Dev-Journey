import { LightningElement, track, wire } from 'lwc';
import getAccountList from "@salesforce/apex/AccountController.getAccountList";
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_TYPE_FIELD from '@salesforce/schema/Account.Type';
import ACCOUNT_PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACCOUNT_WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';
export default class AllAccountsTab extends LightningElement {
    @track treeData = [];
    error = null;
    isVisible = false;
    records = null;
    fieldsAccount = [ACCOUNT_NAME_FIELD, ACCOUNT_TYPE_FIELD, ACCOUNT_PHONE_FIELD, ACCOUNT_WEBSITE_FIELD];
    fieldsContact = [CONTACT_NAME_FIELD, CONTACT_PHONE_FIELD, CONTACT_EMAIL_FIELD];

    handleSelect(event) {
        this.isVisible = true;

        if (event.detail.name.AccountId != null) {
            this.records = [
                {
                    Id: event.detail.name.AccountId,
                    fields: this.fieldsAccount,
                    objectApiName: 'Account',
                    title: 'Account Info'
                },
                {
                    Id: event.detail.name.Id,
                    fields: this.fieldsContact,
                    objectApiName: 'Contact',
                    title: 'Contact Info'
                }
            ];
        }
        else {
            this.records = [
                {
                    Id: event.detail.name.Id,
                    fields: this.fieldsAccount,
                    objectApiName: 'Account',
                    title: 'Account Info'
                }];
        }
    }

    @wire(getAccountList)
    wiredAccounts({ error, data }) {
        if (data && Array.isArray(data)) {
            this.treeData = data.map(account => ({
                label: account.Name,
                name: account,
                accountData: account,
                items: (account.Contacts || []).map(contact => ({
                    label: contact.Name,
                    name: contact,
                    contactData: contact,
                    parentAccount: account
                }))
            }));
            this.error = undefined;
        } else {
            this.treeData = [];
            this.error = error ? error.body.message : 'Unknown error';
        }
    }
}