import { LightningElement, api } from 'lwc';
import ModalNewAccount from "c/modalNewAccount";  
import ModalNewContact from "c/modalNewContact";

export default class SummaryInfo extends LightningElement {

    // API variable.
    @api recordId = null;

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
        if((JSON.stringify(this.records) != JSON.stringify(value))
            && (this.records.length <= value.length)) {
           this.isLoading = true;
        } 
        this.records = value;
    } 

    /*
     * @description     Handler.
     */ 
    handleOnLoad() { 
        this.isLoading = false; 
    } 

    /*
     * @description     Reusable code. 
     */
    async showModalNewAccount() {
        try {
            const result = await ModalNewAccount.open({
                size:'small',
                recordId: this.recordId
            }); 
            if(result === 'update') {
                const event = new CustomEvent('accountcreated');
                this.dispatchEvent(event);
            }
            else if (result === 'saveAndNew') {
                const event = new CustomEvent('accountcreated');
                this.dispatchEvent(event);
                this.showModalNewAccount();
            }
        } catch (error) {
            this.toastErrorMessage();
        }
    }
    
    async showModalNewContact() {
        try{
            const result = await ModalNewContact.open({
                size:'small',
                recordId: this.recordId
            });
            if(result === 'update') {
                const event = new CustomEvent('contactcreated');
                this.dispatchEvent(event);
            }
            else if (result === 'saveAndNew') {
                const event = new CustomEvent('contactcreated');
                this.dispatchEvent(event);
                this.showModalNewContact();
            }
            this.result = result;
        } catch (error) {
            this.toastErrorMessage();
        }
    }

}