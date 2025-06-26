import QRCode from 'qrcode'; // Importa la libreria qrcode
import { supabase } from './supabase';
import { usePallets } from './supabaseFunctions/pallets';
import { useToastStore } from '@/stores/toastStore';


export function generateNumericBarcode() {
    const timestamp = Date.now().toString().slice(-8); // Prendi solo gli ultimi 8 numeri del timestamp
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // Genera un numero random a 4 cifre
    return `99${timestamp}${randomDigits}`; // Esempio: 991530482374
}

export async function generateQrCode(palletID) {
    const toastStore = useToastStore()
    
    try {
        const dataUrl = await QRCode.toDataURL(palletID, { width: 200 })

        const blob = await (await fetch(dataUrl)).blob()
        const now = new Date()
        const timestamp = now.toISOString().replace(/[:.]/g, "-")
        const fileName = `pallet-${timestamp}.png`

        downloadImage(dataUrl, fileName)

        // Upload su Supabase Storage
        const { data, error: uploadError } = await supabase.storage
            .from('palletqrcodes')  // <-- Cambia con il tuo bucket
            .upload(fileName, blob, {
            contentType: 'image/png', 
            upsert: true
        })
        if(uploadError)  {
            toastStore.show('Error during uploading img', 'danger')
            throw new Error(`Error during uploading img: ${uploadError.message}`)
        }

        const { data: publicUrlData } = supabase.storage.from('palletqrcodes').getPublicUrl(fileName)
        if(!publicUrlData) {
            toastStore.show('Error during fetching public url', 'danger')
            throw new Error(`Error during fetching public url`)
        }

        const qrCodeImg = publicUrlData.publicUrl
        
        const {data: palletData, error: palletError} = await usePallets().updatePallet(palletID, {qrCodeImage: qrCodeImg})
        if(palletError)  {
            toastStore.show('Error during pallet closure action', 'danger')
            throw new Error(`Error during pallet closure action: ${palletError.message}`)
        }
        

        toastStore.show('QrCode img saved and geenrated', 'success')
        
    } catch (error) {
        console.error('Error during pallet closure action:', error);
        toastStore.show('Error during pallet closure action', 'danger')
        return;
    }
}


// 📦 Salva localmente l'immagine
function downloadImage(dataUrl, fileName) {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = fileName
    link.click()
}
