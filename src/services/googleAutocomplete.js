// googleAutocomplete.js
export function initializeGoogleAutocomplete(inputElement, onAddressSelected) {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    console.error('Google Maps JavaScript API non è caricata.')
    return
  }

  const autocomplete = new google.maps.places.Autocomplete(inputElement, {
    types: ['address'],
    // Opzionale: componentRestrictions: { country: 'it' }
  })

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace()
    if (!place.address_components) {
      console.warn('Nessun indirizzo valido selezionato.')
      onAddressSelected(null)
      return
    }

    let city = ''
    let province = ''
    let postalCode = ''
    let country = ''

    place.address_components.forEach(component => {
      const types = component.types

      if (types.includes('locality')) {
        city = component.long_name
      } else if (types.includes('administrative_area_level_1')) {
        province = component.long_name
      } else if (types.includes('postal_code')) {
        postalCode = component.long_name
      } else if (types.includes('country')) {
        country = component.long_name
      }
    })

    onAddressSelected({ city, province, postalCode, country })
  })
}
