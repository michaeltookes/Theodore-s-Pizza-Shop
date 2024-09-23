import { LightningElement, track } from 'lwc';

export default class Tps_OrderPage extends LightningElement {

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

        let item = this.itemList[sectionIndex];

        if (fieldName === 'tps_Size__c') {
            item.sizePrice = this.calculateSizePrice(value);
        } else if (fieldName === 'tps_Crust__c') {
            item.crustPrice = this.calculateCrustPrice(value);
        } else if (fieldName === 'tps_Sauce__c') {
            item.saucePrice = this.calculateSaucePrice(value);
        } else if (fieldName === 'tps_Topping__c') {
            item.toppingPrice = this.calculateToppingPrice(value);
        }

        item.result = item.sizePrice + item.crustPrice + item.saucePrice + item.toppingPrice;

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

}