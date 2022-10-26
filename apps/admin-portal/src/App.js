import { Admin, ListGuesser, Resource, EditGuesser } from "react-admin";
import { LocationList, LocationEdit } from "./components/LocationList";
import dataProvider from "./data-provider";
import { CountryCreate } from "./resources/country";

function App() {
  return (
    <div className="App">
      <Admin dataProvider={dataProvider}>
        <Resource name="country" list={LocationList} create={CountryCreate} edit={LocationEdit}/>;
      </Admin>
    </div>
  );
}

export default App;
