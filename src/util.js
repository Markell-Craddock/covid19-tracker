import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";

const casesTypeColors = {
  recovered: {
    rgb: "rgb(125, 215, 29)",
    multiplier: 1200,
  },
  cases: {
    rgb: "rgb(204, 16, 52)",
    multiplier: 800,
  },
  deaths: {
    rgb: "rgb(251, 68, 67)",
    multiplier: 2000,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const PrettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      key={`${country.country}`}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].rgb}
      fillColor={casesTypeColors[casesType].rgb}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className='info-container'>
          <div
            className='info-flag'
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className='info-name'>{country.country}</div>
          <div className='info-confirmed'>
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className='info-recovered'>
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className='info-deaths'>
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
