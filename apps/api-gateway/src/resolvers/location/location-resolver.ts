import { Context, UserInputError } from "apollo-server-core";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  FieldResolver,
  Root,
} from "type-graphql";
import { Service } from "typedi";
import { BaseEntity } from "typeorm";
import { dataSource } from "../../data-source";
import { CityEntity, LocationEntity } from "../../entities";
import { LocationService } from "../../services/location-service";
import { falsyToInvalidId, whereIdIs } from "../../shared/utils";

@Service()
@Resolver((resolverOf) => LocationEntity)
export default class LocationResolver {
  constructor(private readonly locationService: LocationService) {}

  @Query(() => [LocationEntity])
  async getAllLocations(): Promise<LocationEntity[]> {
    const locationsResult = await this.locationService.findAll();
    if (locationsResult.isOk()) {
      return locationsResult.value;
    }

    throw new Error("LocationResolver.getAllLocations");
  }
  @Query(() => LocationEntity)
  async getALocation(@Arg("id") id: string): Promise<LocationEntity> {
    const locationResult = await this.locationService.findOne(id);
    if (locationResult.isOk()) {
      return locationResult.value;
    }

    throw new Error("LocationResolver.getAllLocations");
  }

  @Query(() => [CityEntity])
  async getAllCities(): Promise<CityEntity[]> {
    const locationsResult = await this.locationService.getAllCities();

    if (locationsResult.isOk()) {
      return locationsResult.value;
    }

    throw new Error("LocationResolver.getAllCities");
  }

  @Mutation(() => String)
  async deleteLocation(@Arg("id") id: string): Promise<string> {
    const deleteResult = await this.locationService.delete(id);

    if (deleteResult.isOk()) {
      return deleteResult.value;
    }

    throw new Error("LocationResolver.deleteLocation");
  }

  @Mutation(() => LocationEntity)
  async createLocation(
    @Arg("countryName") countryName: string,
    @Arg("cities", () => [String]) cities?: string[]
  ) {
    const createResult = await this.locationService.create(countryName, cities);

    if (createResult.isOk()) {
      return createResult.value;
    }

    throw new Error("LocationResolver.create");
  }

  @Mutation(() => LocationEntity)
  async updateLocation(
    @Arg("id") id: string,
    @Arg("countryName") countryName: string,
    @Arg("cityIdsToRemove", () => [String!]!) cityIdsToRemove: string[],
    @Arg("cityNamesToAdd", () => [String!]!) cityNamesToAdd: string[]
  ) {
    const createResult = await this.locationService.update(id,countryName, {
      cityNamesToAdd,
      cityIdsToRemove,
    });
    if (createResult.isOk()) {
      return createResult.value;
    }
    throw new Error("LocationResolver.create");
  }

  // @Mutation(() => LocationEntity)
  // async createCity(
  //   @Arg("locationId") locationId: string,
  //   @Arg("cityName") cityName: string
  // ) {
  //   const result = await this.locationService.update(locationId, {
  //     cityNamesToAdd: [cityName],
  //   });

  //   if (result.isOk()) {
  //     return result.value;
  //   }

  //   throw new Error("LocationResolver.createCity");
  // }
}
