import { LightningElement, api } from 'lwc';
import ModalNewAccount from "c/modalNewAccount";  
import ModalNewContact from "c/modalNewContact";

export default class SummaryInfo extends LightningElement {

    //Summary info variables
    isLoading = false;
    records = [];
    
    //API variable
    @api 
    set recordsGetSet(value) {
        if((JSON.stringify(this.records) != JSON.stringify(value))
            && (this.records.length <= value.length)) {
           this.isLoading = true;
        } 
        this.records = value;
    } 
    get recordsGetSet() {
        return this.records;
    } 

    /*
     * @description     Handler.
     */ 
    handleOnLoad() { 
        this.isLoading = false; 
    } 

    async showModalNewAccount() {
        try {
            const result = await ModalNewAccount.open({
                size:'small'
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
        const result = await ModalNewContact.open({
            size:'small'
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
    }

}