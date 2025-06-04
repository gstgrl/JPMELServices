// src/stores/orderStore.js
import { defineStore } from 'pinia';

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    currentOrder: {
        receiver:{
            name: '',
            surname: '',
            email: '',
            phone: '',
            addressInfo: {
                address: '',
                city: '',
                province: '',
                zipCode: ''
            }
        },
        sender:{
            name: '',
            surname: '',
            email: '',
            phone: '',
            addressInfo: {
                address: '',
                city: '',
                province: '',
                zipCode: ''
            }
        },
        barcode: '',
        package_number: 1,
        sender_id: '',
        receiver_id: '',
        addToPallet: false
    },
    triggerAction: false
  }),

  actions: {
    addNewInfo(client = null, type = null, barcode = null) {
        if(client && type) {
            this.currentOrder[type].name = client.name
            this.currentOrder[type].surname = client.surname
            this.currentOrder[type].email = client.email
            this.currentOrder[type].phone = client.phone
            this.currentOrder[type].addressInfo.address = client.addressInfo.address
            this.currentOrder[type].addressInfo.city = client.addressInfo.city
            this.currentOrder[type].addressInfo.province = client.addressInfo.province
            this.currentOrder[type].addressInfo.zipCode = client.addressInfo.zipCode

            if(type == 'sender') {
                this.currentOrder.sender_id = client.id
            } else {
                this.currentOrder.receiver_id = client.id
            }
        }

        if(barcode) {this.currentOrder.barcode = barcode}
    },

    deleteInfo(type) {
        this.currentOrder[type].name = ''
        this.currentOrder[type].surname = ''
        this.currentOrder[type].email = ''
        this.currentOrder[type].phone = ''
        this.currentOrder[type].addressInfo.address = ''
        this.currentOrder[type].addressInfo.city = ''
        this.currentOrder[type].addressInfo.province = ''
        this.currentOrder[type].addressInfo.zipCode = '' 
    },

    resetOrder() {
        for(let key in this.currentOrder.receiver) {
            if(key != 'addressInfo') {
                this.currentOrder.receiver[key] = ''
            }
        }

        for(let key in this.currentOrder.sender) {
            if(key != 'addressInfo') {
                this.currentOrder.sender[key] = ''
            }
        }

        this.currentOrder.receiver.addressInfo.address = ''
        this.currentOrder.receiver.addressInfo.city = ''
        this.currentOrder.receiver.addressInfo.province = ''
        this.currentOrder.receiver.addressInfo.zipCode = ''

        this.currentOrder.sender.addressInfo.address = ''
        this.currentOrder.sender.addressInfo.city = ''
        this.currentOrder.sender.addressInfo.province = ''
        this.currentOrder.sender.addressInfo.zipCode = ''

        this.currentOrder.barcode = ''
        this.currentOrder.package_number = 1
        this.currentOrder.receiver_id = ''
        this.currentOrder.sender_id = ''

        this.currentOrder.addToPallet = false
    },

    resetTrigger() {
        this.triggerAction = false
    },

    setAddress(type, address, city, province, zipCode) {
        this.currentOrder[type].addressInfo.address = address
        this.currentOrder[type].addressInfo.city = city
        this.currentOrder[type].addressInfo.province = province
        this.currentOrder[type].addressInfo.zipCode = zipCode
    }
  }
});
