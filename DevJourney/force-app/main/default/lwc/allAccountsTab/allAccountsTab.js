import { LightningElement, track, wire } from 'lwc';
import getAccountList from "@salesforce/apex/AccountController.getAccountList";

export default class AllAccountsTab extends LightningElement {
    @track items = [];
    @track error;
    @track selectedRecord = null;
    columns = [
        { label: 'Field', fieldName: 'label' },
        { label: 'Value', fieldName: 'value' }
    ];

    @wire(getAccountList)
    wiredAccounts({ error, data }) {
        if (data && Array.isArray(data)) {
            this.items = data.map(account => ({
                label: account.Name,
                name: account.Id,
                accountData: account,
                items: (account.Contacts || []).map(contact => ({
                    label: contact.Name,
                    name: contact.Id,
                    contactData: contact,
                    parentAccount: account
                }))
            }));
            this.error = undefined;
        } else {
            this.items = [];
            this.error = error ? error.body.message : 'Unknown error';
        }
    }

    handleSelect(event) {
        const selectedName = event.detail.name;
        let found = false;

        for (let acc of this.items) {
            if (acc.name === selectedName) {
                this.selectedRecord = {
                    accountName: acc.accountData.Name,
                    type: acc.accountData.Type,
                    phone: acc.accountData.Phone,
                    website: acc.accountData.Website
                };
                found = true;
                break;
            }
            for (let contact of acc.items) {
                if (contact.name === selectedName) {
                    this.selectedRecord = {
                        accountName: contact.parentAccount.Name,
                        type: contact.parentAccount.Type,
                        phone: contact.parentAccount.Phone,
                        website: contact.parentAccount.Website,
                        contactName: contact.contactData.Name,
                        contactPhone: contact.contactData.Phone,
                        contactEmail: contact.contactData.Email
                    };
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }
}