let googleMapsScriptLoaded = false
let googleMapsLoadingPromise = null

export function loadGoogleMaps(apiKey, libraries = ['places'], language = 'it') {
  if (googleMapsScriptLoaded) {
    return Promise.resolve(window.google)
  }

  if (googleMapsLoadingPromise) {
    return googleMapsLoadingPromise
  }

  googleMapsLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&language=${language}`
    script.async = true
    script.defer = true

    script.onload = () => {
      googleMapsScriptLoaded = true
      resolve(window.google)
    }

    script.onerror = () => {
      reject(new Error('Errore durante il caricamento di Google Maps API'))
    }

    document.head.appendChild(script)
  })

  return googleMapsLoadingPromise
}
