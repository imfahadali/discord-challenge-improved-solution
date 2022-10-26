import {
  ArrayField,
  ChipField,
  Datagrid,
  List,
  SingleFieldList,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  required,
} from "react-admin";

export const LocationList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="countryName" />
      <TextField source="id" />
      <ArrayField source="cities">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <DeleteButton basePath="/countryName"></DeleteButton>
      <EditButton basePath="/countryName" resource="country"></EditButton>
    </Datagrid>
  </List>
);


export const LocationEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="countryName" validate={[required()]} />
      <TextInput source="id" disabled/> 
      <ArrayInput source="cities">
        <SimpleFormIterator>
          <TextInput source="name" validate={[required()]}/>
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);
