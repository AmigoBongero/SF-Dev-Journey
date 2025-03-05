import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import NewAccountModal from "c/newAccountModal"; 
import NewContactModal from "c/newContactModal";

import getAccountsWithRelatedContacts from "@salesforce/apex/AccountsComponentController.getAccountsWithRelatedContacts";

import ACCOUNT_OBJECT_API_NAME from '@salesforce/schema/Account';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import ACCOUNT_TYPE_FIELD from '@salesforce/schema/Account.Type';
import ACCOUNT_PHONE_FIELD from '@salesforce/schema/Account.Phone';
import ACCOUNT_WEBSITE_FIELD from '@salesforce/schema/Account.Website';
import CONTACT_OBJECT_API_NAME from '@salesforce/schema/Contact';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';
import CONTACT_PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import CONTACT_EMAIL_FIELD from '@salesforce/schema/Contact.Email';

//Record-view-form constants
const TITLE_FOR_ACCOUNT = 'Account Info';
const TITLE_FOR_CONTACT = 'Contact Info';
const FIELDS_ACCOUNT = [ACCOUNT_NAME_FIELD, ACCOUNT_TYPE_FIELD, ACCOUNT_PHONE_FIELD, ACCOUNT_WEBSITE_FIELD];
const FIELDS_CONTACT = [CONTACT_NAME_FIELD, CONTACT_PHONE_FIELD, CONTACT_EMAIL_FIELD];

export default class AllAccountsTab extends LightningElement {

    //Tree data variables
    @track treeData = [];
    isComponentAndButtonVisible = false;
    isTreeDataLoading = true;

    //Record-view-form fields	
    records = null;
    wiredAccountsData = [];
    chosenAccountId = null;

    /*
     * @description     Getters.
     */
    get accountObjectApiNameGetter() {
        return ACCOUNT_OBJECT_API_NAME.objectApiName;
    }

    get contactObjectApiNameGetter() {
        return CONTACT_OBJECT_API_NAME.objectApiName;
    }

    /*
     * @description     Wire function. 
     */
    @wire(getAccountsWithRelatedContacts)
    populateTreeData(wiredData) {
        const { error, data } = wiredData;
        this.wiredAccountsData = wiredData;

        if (data && Array.isArray(data)) {
            this.treeData = data.map(account => ({
                label: account.Name,
                name: account,
                items: (account.Contacts || []).map(contact => ({
                    label: contact.Name,
                    name: contact
                }))
            }));
            this.isTreeDataLoading = false;
        } else if (error) {
            this.treeData = [];
            const showError = new ShowToastEvent({
                title: 'Error occurred while loading data',
                message: `Error: ${error.message}`,
                variant: 'error'
            });
            this.dispatchEvent(showError);
            this.isTreeDataLoading = false;
        }
    }
    
    /*
     * @description     Handler.
     */
    handleSelect(event) {
        this.isComponentAndButtonVisible = true;

        if (event.detail.name.AccountId != null) {
            this.records = [
                {
                    Id: event.detail.name.AccountId,
                    fields: FIELDS_ACCOUNT,
                    objectApiName: ACCOUNT_OBJECT_API_NAME.objectApiName,
                    title: TITLE_FOR_ACCOUNT
                },
                {
                    Id: event.detail.name.Id,
                    fields: FIELDS_CONTACT,
                    objectApiName: CONTACT_OBJECT_API_NAME.objectApiName,
                    title: TITLE_FOR_CONTACT
                }
            ];
        } else {
            this.records = [
                {
                    Id: event.detail.name.Id,
                    fields: FIELDS_ACCOUNT,
                    objectApiName: ACCOUNT_OBJECT_API_NAME.objectApiName,
                    title: TITLE_FOR_ACCOUNT
                }];
        }      
        this.chosenAccountId = event.detail.name.AccountId ?? event.detail.name.Id; 
    }

    handleButtonClick(event) {
        this.showNewRecordModal(event.target.name);
    }

    /*
     * @description     Reusable Code.
     */
    async showNewRecordModal(objectApiName) {
        try {
            const modalClass = objectApiName === ACCOUNT_OBJECT_API_NAME.objectApiName ? NewAccountModal : NewContactModal; 
            const result = await modalClass.open({
                size: 'small',
                chosenAccountId: this.chosenAccountId
            }); 
            if (result === 'save') {
                this.refreshTreeData();
            } else if (result === 'saveAndNew') {
                this.refreshTreeData();
                this.showNewRecordModal(objectApiName);
            }
        } catch (error) {
            this.toastErrorMessage();
        }
    }

    refreshTreeData() {
        this.isTreeDataLoading = true;
        refreshApex(this.wiredAccountsData)
            .catch (error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: `Error: ${error.message}`,
                        variant: 'error'
                }));
            }).finally (() => {
                this.isTreeDataLoading = false;
            })
    }

    toastErrorMessage(error) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error occurred',
            message: 'Error: ' + error.message,
            variant: 'error'
        }));
    }

}