import LightningModal from "lightning/modal";

export default class AdvancedSearchModal extends LightningModal {

    searchValue = '';


    handleCancel() {
        this.close();
    }

    handleSearch(event) {
      this.searchValue = event.target.value;
    }

}