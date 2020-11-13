import React, { useEffect, useState } from "react";
import { FormControl, MenuItem, Select, Card } from "@material-ui/core";
import InfoBox from "./components/InfoBox";
import "./App.css";
import Map from "./components/Map";
import CardContent from "@material-ui/core/CardContent";
import Table from "./components/Table";
import { PrettyPrintStat, sortData } from "./util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);

          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, [country]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        const worldwideLat = 34.80746;
        const worldwideLong = -40.4796;
        setMapCenter(
          country === "worldwide"
            ? [data.countryInfo.lat, data.countryInfo.long]
            : [worldwideLat, worldwideLong]
        );
        setMapZoom(4);
      });
  };

  return (
    <div className='app'>
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19 TRACKER</h1>
          <FormControl>
            <Select
              className='app__selectCountry'
              variant='outlined'
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={`${country.name}`} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>
          <InfoBox
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title='Coronavirus Cases'
            cases={PrettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
            isRed
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title='Recovered'
            cases={PrettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.recovered}
          />
          <InfoBox
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title='Deaths'
            cases={PrettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
            isRed
          />
        </div>
        <Map
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
          countries={mapCountries}
        />
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by country</h3>
          <Table countries={tableData} />
          <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
          <LineGraph className='app__graph' casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
