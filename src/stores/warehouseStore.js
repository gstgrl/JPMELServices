import { defineStore } from "pinia";
import { useOrders } from "@/services/supabaseFunctions/orders";
import { useClients } from "@/services/supabaseFunctions/clients";
import { useToastStore } from "./toastStore";

export const useWareHouseStore = defineStore("wareHouse", {
  state: () => ({
    ordersDischarged: [],
    provinces: [],
    cities: [],
    citiesByProvince: {},
    filteredOrders: [],

    ordersSelected: [],
    ordersChecked: {}
  }),
  actions: {
    async fetchOrders(palletID=null, orders=null) {
        const toastStore = useToastStore()
        let ordersArray

        if(palletID) {
            const {data: fetchData, error: fetchError} = await useOrders().getOrders(3, palletID)
            if(fetchError)  {
                toastStore.show('Error during fetch action', 'danger')
                throw new Error(`Error during fetch action: ${fetchError.message}`)
            }

            ordersArray = fetchData
        }

        if(orders) {
            ordersArray = orders
        }

        for(let order of ordersArray) {
            const {data: receiverData, error: receiverError} = await useClients().getClient(order.receiver_id)
            if(receiverError)  {
                toastStore.show('Error during fetch receiver data action', 'danger')
                throw new Error(`Error during fetch receiver data action: ${receiverError.message}`)
            }

            let singleOrder = {
                barcode: order.barcode,
                addressInfo: receiverData.addressInfo,
                package_number: order.package_number,
                delivery_status: 'warehouse'
            }

            if(!this.checkAlreadyIn(order.barcode)) {
                this.ordersDischarged.push(singleOrder)
                this.createFilters(receiverData.addressInfo.province, receiverData.addressInfo.city)
            }
        }
    },

    filterOrder(filters) {
        if(!filters.province && !filters.city) {
            this.filteredOrders = this.ordersDischarged
        } else {
            this.filteredOrders = this.ordersDischarged.filter(order => {
                return (
                    (!filters.province || order.addressInfo.province === filters.province) &&
                    (!filters.city || order.addressInfo.city === filters.city) 
                )
            })
        }
    },

    cityBelongsToProvince(city, province) {
        return this.citiesByProvince[province]?.includes(city);
    },
    
    checkAlreadyIn(barcode) {
        return this.ordersDischarged.some(item => item.barcode === barcode)
    },

    createFilters(province, city) {
        if(!(province in this.citiesByProvince)) {
            this.citiesByProvince[province] = [city]
        }

        if(!this.citiesByProvince[province].includes(city)) {
            this.citiesByProvince[province].push(city);
        }

        this.checkProvince(province)
        this.checkCity(city)
    },

    checkProvince(province) {
        const result = this.provinces.some(item => item === province)

        if(!result) {
            this.provinces.push(province)
        }
    },

    checkCity(city) {
        const result = this.cities.some(item => item === city)

        if(!result) {
            this.cities.push(city)
        }
    },


    //Methods used for manage delivery preparation
    addOrder(order) {
        this.ordersSelected.push(order)
    },

    removeOrder(barcode) {
        this.ordersSelected = this.ordersSelected.filter(order => order.barcode !== barcode)
    },


    //Methods used for manage variables of this pinia
    resetPinia() {
        this.ordersChecked = {}
        this.ordersDischarged = []
        this.ordersSelected = []
        this.provinces = []
        this.cities = []
        this.filteredOrders = []
        this.citiesByProvince = {}
    },
  },
  persist: true
});
