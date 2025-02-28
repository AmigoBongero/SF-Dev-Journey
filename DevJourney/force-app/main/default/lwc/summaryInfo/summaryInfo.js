import { LightningElement, api } from 'lwc';  

export default class SummaryInfo extends LightningElement {

    // Summary info variables.
    isLoading = false;
    records = [];

    /*
     * @description     API Getters/Setters.
     */
    @api 
    get recordsGetSet() {
        return this.records;
    }
    set recordsGetSet(value) {
        this.isLoading = true;
        this.records = value;
    } 

    /*
     * @description     Handler.
     */ 
    handleOnLoad() { 
        this.isLoading = false; 
    } 

}