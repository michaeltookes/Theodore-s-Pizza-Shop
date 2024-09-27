import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import lookupByEmail from '@salesforce/apex/tps_CustomerFinder.lookupByEmail';

export default class Tps_EnterEmail extends LightningElement {

    @track email = '';
    @track customer;
    @track error;
    @track noContactFoundMessage = 'No Contact found for this email address. Please try again or create an Account.';

    handleInputChange(event) {
        this.email = event.target.value;
    }

    handleCancel() {

        this.email = '';
        this.customer = '';
        this.error = undefined;
        console.log('Component state reset to initial values.');

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

    handleConfirmDetails() {

        const contactId = this.customer[0].Id;

        const contactConfirmedEvent = new CustomEvent('contactconfirmed', {
            detail: { contactId: contactId }
        });

        window.dispatchEvent(contactConfirmedEvent);
        console.log('Contact ID sent via event: ', contactId);

        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Contact Details Confirmed!',
                variant: 'success',
            })
        );

        this.resetComponentState();

    }

    resetComponentState() {

        this.email = '';
        this.customer = '';
        this.error = undefined;
        console.log('Component state reset to initial values.');

    }

}