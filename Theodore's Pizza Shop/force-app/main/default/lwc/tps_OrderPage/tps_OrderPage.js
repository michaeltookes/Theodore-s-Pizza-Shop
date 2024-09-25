import { LightningElement, track, wire } from 'lwc';
import createPizzaOrder from '@salesforce/apex/tps_PizzaOrderController.createPizzaOrder';
import submitPizzas from '@salesforce/apex/tps_PizzaOrderController.submitPizzas';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import PIZZA_OBJECT from '@salesforce/schema/tps_Pizza__c';
import CRUST_FIELD from '@salesforce/schema/tps_Pizza__c.tps_Crust__c';
import SAUCE_FIELD from '@salesforce/schema/tps_Pizza__c.tps_Sauce__c';
import SIZE_FIELD from '@salesforce/schema/tps_Pizza__c.tps_Size__c';
import TOPPING_FIELD from '@salesforce/schema/tps_Pizza__c.tps_Topping__c';

export default class Tps_OrderPage extends LightningElement {

   @track pizzaRecordTypeId;
   @track crustOptions = [];
   @track sauceOptions = [];
   @track sizeOptions = [];
   @track toppingOptions = [];
   @track isLoading = true;
   error;
   
    @wire (getObjectInfo, { objectApiName: PIZZA_OBJECT })
    handleObjectInfo ({ error, data }) {
        if (data) {
            this.pizzaRecordTypeId = data.defaultRecordTypeId;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.pizzaRecordTypeId = undefined;
        }
    }

    @wire (getPicklistValues, { recordTypeId: '$pizzaRecordTypeId', fieldApiName: '$fieldApiName' })
    wiredPicklistValues({ error, data }) {
        if (data) {
            this.setPicklistOptions(this.fieldApiName, data.values);
            this.isLoading = false;
        } else if (error) {
            this.error = error;
        }
    }

    get fieldApiName() {

        if (!this.crustOptions.length) {
            return CRUST_FIELD;
        } else if (!this.sauceOptions.length) {
            return SAUCE_FIELD;
        } else if (!this.sizeOptions.length) {
            return SIZE_FIELD;
        } else if (!this.toppingOptions.length) {
            return TOPPING_FIELD;
        }
        return null;
    }

    setPicklistOptions(field, values) {
        
        switch(field) {
            case CRUST_FIELD:
                this.crustOptions = values;
                break;
            case SAUCE_FIELD:
                this.sauceOptions = values;
                break;
            case SIZE_FIELD:
                this.sizeOptions = values;
                break;
            case TOPPING_FIELD:
                this.toppingOptions = values;
                break;
            default:
                break;    
        }

    }
   
    @track pizzaOrderId;
    pizzaOrderCreated = false;

    connectedCallback() {
        
        createPizzaOrder()
        .then(result => {
            this.pizzaOrderId = result;
            this.pizzaOrderCreated = true;
        })
        .catch(error => {
            console.error('Error creating Pizza Order: ', error);
        });

    }

   @track itemList = [
        {
            id: 0,
            inputSize: '',
            inputCrust: '',
            inputSauce: '',
            inputTopping: '',
            sizePrice: 0,
            crustPrice: 0,
            saucePrice: 0,
            toppingPrice: 0,
            result: 0
        }
    ];

    keyIndex = 0;

    addRow() {
       
        ++this.keyIndex;
        var newItem = [{ 
            id: this.keyIndex,
            inputSize: '',
            inputCrust: '',
            inputSauce: '',
            inputTopping: '',
            sizePrice: 0,
            crustPrice: 0,
            saucePrice: 0,
            toppingPrice: 0,
            result: 0
        }];
        
        this.itemList = this.itemList.concat(newItem);

    }
    
    handleInputChange(event) {
        
        const fieldName = event.target.name;
        const value = event.target.value;
        const sectionIndex = event.target.dataset.section;

        let item = { ...this.itemList[sectionIndex] };

        if (fieldName === 'tps_Size__c') {
            item.sizePrice = this.calculateSizePrice(value);
            item.inputSize = value;
            console.log('Size: ' + value);
        } else if (fieldName === 'tps_Crust__c') {
            item.crustPrice = this.calculateCrustPrice(value);
            item.inputCrust = value;
            console.log('Crust: ' + value);
        } else if (fieldName === 'tps_Sauce__c') {
            item.saucePrice = this.calculateSaucePrice(value);
            item.inputSauce = value;
            console.log('Sauce: ' + value);
        } else if (fieldName === 'tps_Topping__c') {
            item.toppingPrice = this.calculateToppingPrice(value);
            item.inputTopping = value;
            console.log('Topping: ' + value);
        }

        item.result = item.sizePrice + item.crustPrice + item.saucePrice + item.toppingPrice;

        this.itemList = [
            ...this.itemList.slice(0, sectionIndex),
            item,
            ...this.itemList.slice(sectionIndex + 1)
        ];

    }

    get orderSubTotal() {
        return this.itemList.reduce((total, item) => total + item.result, 0);
    }

    calculateSizePrice(size) {
        
        let price = 0;

        if (size === 'Extra Large') {
            price += 12;
        } else if (size === 'Medium' || size === 'Large') {
            price += 10;
        } else if (size === 'Small') {
            price += 8;
        } else {
            price = 0;
        }
        return price;
    }

    calculateCrustPrice(crust) {
        
        let price = 0;

        if (crust === 'Thin') {
            price += 1;
        } else if (crust === 'Stuffed') {
            price += 3;
        } else {
            price += 2;
        }
        return price;

    }

    calculateSaucePrice(sauce) {
        
        let price = 0;

        if (sauce === 'Alfredo') {
            price += 2;
        } else if (sauce === 'Marinara') {
            price += 1;
        } else {
            price += 0;
        }
        return price;
    
    }

    calculateToppingPrice(topping) {
        
        let price = 0;

        if (topping === 'Pepperoni') {
            price += 3;
        } else if (topping === 'Sausage') {
            price += 4;
        } else {
            price += 2;
        }
        return price;
    
    }

    handleSubmit() {

        let pizzaList = this.itemList.map(item=> {
            return {
                tps_Size__c: item.inputSize,
                tps_Crust__c: item.inputCrust,
                tps_Sauce__c: item.inputSauce,
                tps_Topping__c: item.inputTopping,
                tps_Price__c: item.result
            };
        });

        submitPizzas({ pizzaOrderId: this.pizzaOrderId, pizzaList: pizzaList })
            .then(() => {
                console.log('Pizzas submitted successfully.');
            })
            .catch (error => {
                console.error('Error submitting pizzas.', error);
            });

    }

}