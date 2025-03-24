import { track, api } from 'lwc';

import LightningModal from 'lightning/modal';

import getCaseParties from '@salesforce/apex/AccountsComponentController.getCaseParties';

import CASE_PARTY_NAME from '@salesforce/schema/Case_Party__c.Name';
import CASE_PARTY_PHONE from '@salesforce/schema/Case_Party__c.Phone__c';
import CASE_PARTY_COMMENTS from '@salesforce/schema/Case_Party__c.Comments__c';

const CASE_PARTY_COLUMNS = [
    { label: 'Case Party Name', fieldName: CASE_PARTY_NAME.fieldApiName },
    { label: 'Phone', fieldName: CASE_PARTY_PHONE.fieldApiName },
    { label: 'Comments', fieldName: CASE_PARTY_COMMENTS.fieldApiName }
];

export default class AddCasePartyModal extends LightningModal {

    // Table data Variables.
    @track casePartiesData = [];
    _chosenCaseParties = [];
    selectedCaseParty = null;
    newCaseParties = [];

    // Other Variables.
    @track isAddButtonDisabled = true;
    isSearchLoading = false;
    messageResult = false;
    searchCaseParty = '';

    /*
     * @description     Getters.
     */
    @api
    set chosenCasePartiesGetSet(value) {
        this._chosenCaseParties = Array.from(value);
    }
    get chosenCasePartiesGetSet() {
        return this._chosenCaseParties;
    }

    get casePartiesColumnsGetter() {
        return CASE_PARTY_COLUMNS;
    }
    
    /*
    * @description     Handlers.
    */
    handleSearchKeyChange(event) {
        this.searchCaseParty = event.target.value;
    }

    handleEnter(event) {
        if (event.keyCode === 13) {
            this.handleSearch();
        }
    }

    handleSearch() {
        this.isSearchLoading = true;
        getCaseParties({ searchKey: this.searchCaseParty })
            .then(result => {
                this.casePartiesData = result.filter(party => 
                    !this._chosenCaseParties.some(chosen => chosen.Id === party.Id)
                );
                this.messageResult = this.casePartiesData.length === 0 && this.searchCaseParty !== '';
                this.isSearchLoading = false;
            })
            .catch(error => {
                this.error = error;
                this.casePartiesData = [];
                this.isSearchLoading = false;
            });
    }

    handleRowSelection(event) {
        this.selectedCaseParty = event.detail.selectedRows[0];
        this.isAddButtonDisabled = false;
    }

    handleAddCaseParty() {
        if (this.selectedCaseParty) {
            this._chosenCaseParties.push(this.selectedCaseParty);
            this.handleSearch();
            const datatable = this.template.querySelector('lightning-datatable');
            if (datatable) {
                datatable.selectedRows = [];
            }
            this.selectedCaseParty = [];
            this.isAddButtonDisabled = !this.isAddButtonDisabled;
        }
    }
    
    handleClose() {
        this.close(this.chosenCasePartiesGetSet);
    }

}