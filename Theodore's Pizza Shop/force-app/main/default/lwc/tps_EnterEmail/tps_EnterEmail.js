import { LightningElement, track } from 'lwc';
import lookupByEmail from '@salesforce/apex/tps_CustomerFinder.lookupByEmail';

export default class Tps_EnterEmail extends LightningElement {

    @track email = '';
    @track customer;
    @track error;
    @track noContactFoundMessage = 'No Contact found for this email address. Please try again or create an Account.';

    handleInputChange(event) {
        this.email = event.target.value;
    }

    handleSearch() {
        
        if(!this.email) {
            this.error = 'Please enter a valid email address.';
            this.customer = undefined;
            return;
        }
        
        lookupByEmail({ email: this.email})
            .then(result => {
                if (result && result.length > 0) {
                    this.customer = result;
                    this.error = undefined;
                } else {
                    this.customer = undefined;
                    this.error = this.noContactFoundMessage;
                }
            })
            .catch(error => {
                this.error = error.message;
                this.customer = undefined;
            });
    }

}