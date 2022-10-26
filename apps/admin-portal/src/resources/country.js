import {
  SimpleForm,
  TextInput,
  Edit,
  DateInput,
  ArrayInput,
  NumberInput,
  SimpleFormIterator,
  Create,
  SelectInput,
  ReferenceInput,
  required,
} from "react-admin";
import { url } from "../constants";
import { request, gql } from "graphql-request";

/**
 * Mappings
 */
export const countryMappings = {
  delete: async (params) => {
    const { id } = params;

    const query = gql`
      mutation DeleteLocation($deleteLocationId: String!) {
        deleteLocation(id: $deleteLocationId)
      }
    `;

    const result = await request(url, query, {
      deleteLocationId: id,
    });

    return { data: result.deleteLocation };
  },

  create: async (params) => {
    const {
      data: { countryName, cities },
    } = params;
    const citiesArray = cities.map((cityObj) => cityObj.name);
    const query = gql`
      mutation CreateLocation($cities: [String!]!, $countryName: String!) {
        createLocation(cities: $cities, countryName: $countryName) {
          id
          countryName
          cities {
            name
            id
          }
        }
      }
    `;

    const result = await request(url, query, {
      cities: citiesArray,
      countryName,
    });
    return { data: result.createLocation };
  },
  update: async (params) => {
    const {
      data: { countryName, cities },
      id,
    } = params;

    const cityArray = cities.filter(
      (city) => !city.hasOwnProperty("id")
    );
    const cityNamesToAdd = cityArray.map((city) => city.name);
    const diff = params.previousData.cities.filter((object1) => {
      return !params.data.cities.some((object2) => {
        return object1.id === object2.id;
      });
    });
    const cityIdsToRemove = diff.map((city) => city.id);

    const query = gql`
      mutation UpdateLocation(
        $id: String!
        $countryName: String!
        $cityIdsToRemove: [String!]!
        $cityNamesToAdd: [String!]!
      ) {
        updateLocation(
          id: $id
          countryName: $countryName
          cityIdsToRemove: $cityIdsToRemove
          cityNamesToAdd: $cityNamesToAdd
        ) {
          id
          countryName
          cities {
            name
            id
          }
        }
      }
    `;

    const result = await request(url, query, {
      id,
      countryName,
      cityIdsToRemove,
      cityNamesToAdd,
    });
    return { data: result.updateLocation };
  },
  getList: async (params) => {
    const countries = await request(
      url,
      gql`
        query GetAllLocations {
          getAllLocations {
            countryName
            id
            cities {
              name
              id
            }
          }
        }
      `
    );
    return {
      data: countries.getAllLocations,
      total: countries.getAllLocations.length,
    };
  },
  getOne: async (params) => {
    const countries = await request(
      url,
      gql`
        query GetALocation($id: String!) {
          getALocation(id: $id) {
            countryName
            id
            cities {
              name
              id
            }
          }
        }
      `,
      { id: params.id }
    );
    return {
      data: countries.getALocation,
      total: countries.getALocation.length,
    };
  },
};

/**
 * Create
 */

export const CountryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="countryName" validate={[required()]} ></TextInput>
      <ArrayInput source="cities">
        <SimpleFormIterator inline>
          <TextInput source="name" helperText={false} validate={[required()]}/>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);
