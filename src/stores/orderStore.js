// src/stores/orderStore.js
import { defineStore } from 'pinia';
import { db } from "@/services/firebase";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";

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
    },
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
        
    }
  },
});
