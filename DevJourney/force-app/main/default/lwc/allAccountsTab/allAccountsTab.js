import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getAccountsWithRelatedContacts from "@salesforce/apex/AccountsComponentController.getAccountsWithRelatedContacts";

import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_TYPE_FIELD from '@salesforce/schema/Account.Type';
import ACCOUNT_PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACCOUNT_WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';

//Record-view-form constants
const ACCOUNT_OBJECT_API_NAME = 'Account';
const CONTACT_OBJECT_API_NAME = 'Contact';
const TITLE_FOR_ACCOUNT = 'Account Info';
const TITLE_FOR_CONTACT = 'Contact Info';
const FIELDS_ACCOUNT = [ACCOUNT_NAME_FIELD, ACCOUNT_TYPE_FIELD, ACCOUNT_PHONE_FIELD, ACCOUNT_WEBSITE_FIELD];
const FIELDS_CONTACT = [CONTACT_NAME_FIELD, CONTACT_PHONE_FIELD, CONTACT_EMAIL_FIELD];

export default class AllAccountsTab extends LightningElement {

    //Tree data variables
    @track treeData = [];
    error = null;
    isVisible = false;

    //Record-view-form fields	
    records = null;
    
    /*
     * @description     Wire function. 
     */
    @wire(getAccountsWithRelatedContacts)
    wiredAccounts({ error, data }) {
        if (data && Array.isArray(data)) {
            this.treeData = data.map(account => ({
                label: account.Name,
                name: account,
                items: (account.Contacts || []).map(contact => ({
                    label: contact.Name,
                    name: contact
                }))
            }));
            this.error = undefined;
        } else if (error) {
            this.treeData = [];
            const showError = new ShowToastEvent({
                title: 'Error occurred while loading data',
                message: `Error: ${error.message}`,
                variant: 'error'
            });
            this.dispatchEvent(showError);
        }
    }

    /*
     * @description     Handler.
     */
    handleSelect(event) {
        this.isVisible = true;

        if (event.detail.name.AccountId != null) {
            this.records = [
                {
                    Id: event.detail.name.AccountId,
                    fields: FIELDS_ACCOUNT,
                    objectApiName: ACCOUNT_OBJECT_API_NAME,
                    title: TITLE_FOR_ACCOUNT
                },
                {
                    Id: event.detail.name.Id,
                    fields: FIELDS_CONTACT,
                    objectApiName: CONTACT_OBJECT_API_NAME,
                    title: TITLE_FOR_CONTACT
                }
            ];
        } else {
            this.records = [
                {
                    Id: event.detail.name.Id,
                    fields: FIELDS_ACCOUNT,
                    objectApiName: ACCOUNT_OBJECT_API_NAME,
                    title: TITLE_FOR_ACCOUNT
                }];
        }
    }

}