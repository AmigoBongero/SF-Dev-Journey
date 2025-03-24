import { LightningElement } from 'lwc';

import getCaseParties from '@salesforce/apex/AccountsComponentController.getCaseParties';

export default class SummaryTab extends LightningElement {

    // Variables.
    selectedCaseParty = '';
    options = [];

    /*
     * @description     Callbacks.
     */
    connectedCallback() {
        this.loadCaseParties();
    }

    /*
     * @description     Handlers.
     */
    handleChange(event) {
        this.selectedCaseParty = event.target.value;
        this.dispatchEvent(new CustomEvent('select', {
            detail: {
                selectedCasePartyId: this.selectedCaseParty
            }
        }));
    }

    /*
     * @description     Reusable Code.
     */
    loadCaseParties() {
        getCaseParties()
            .then(result => {
                this.options = result;
            })
    }

}