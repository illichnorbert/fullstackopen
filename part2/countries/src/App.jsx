import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
const [countries, setCountries] = useState([])
// alle Länder vom Server 

const [filter, setFilter] = useState('')
// was der Nutzer tippt

useEffect(() => {
  axios
    .get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      setCountries(response.data)
    })
}, []) // countries hat jetzt 250 Länder

const handleFilterChange = (event) => {
  setFilter(event.target.value)
}   //beu jedem Tastendruck wird in filter gespeichert was der Nutzer getippt hat

const filteredCountries = countries.filter(country =>
  country.name.common.toLowerCase().includes(filter.toLowerCase())
)  //ich gehe countries durch und filtere nach Ländern die filter enthalten. filter kann zB 'swi' sein.
// include ist eine Methode die auf den davor enstehenden String angewendet wird

const renderCountries = () => {
    if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredCountries.length > 1) {
    return (
      <ul>
        {filteredCountries.map(country =>
          <li key={country.name.common}>{country.name.common}</li>
        )}
      </ul>
    )
  } //gehe jedes einzelne country in filteredCountries durch (mit map) gebe den common name zurück

  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    //einziges Element aus Array. Ich  gebe spezifische Informationen zurück.
    // languages = { fra: "French", gsw: "Swiss German" }
   //  greife auf die Object.values zu() → ["French", "Swiss German"]. Mit map gehe ich jeden einzelnen Object.value durch unf gebe ihn aus
    return (
      <div>
        <h1>{country.name.common}</h1>

        <p>Capital {country.capital[0]}</p>

        <p>Area {country.area}</p>

        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map(lang =>
            <li key={lang}>{lang}</li>
          )}
        </ul>

        <img src={country.flags.png} alt={country.name.common} width={200} />
      </div>
    )
}
}

//Bei Tastendruck aktualisiert sich durch handleFilterChange filter da setFilter aufgerufen wird
return (
  <div>
    find countries
    <input value={filter} onChange={handleFilterChange} />
        
    {renderCountries()}

  </div>
)
}


export default App