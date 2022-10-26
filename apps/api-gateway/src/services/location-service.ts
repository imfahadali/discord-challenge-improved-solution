import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { LocationEntity, CityEntity } from "../entities";

import { Service, Inject } from "typedi";
import { dataSource } from "../data-source";
import { falsyToInvalidId, whereIdIs } from "../shared/utils";

export const LocationRepository = dataSource
  .getRepository(LocationEntity)
  .extend({});

export const CityRepository = dataSource.getRepository(CityEntity).extend({});

@Service()
export class LocationService {
  constructor(
    @Inject("LocationRepository")
    private locationRepository: typeof LocationRepository,
    @Inject("CityRepository")
    private cityRepository: typeof CityRepository
  ) {}

  private _relations = ["cities"];

  private async _findById(id: string): Promise<LocationEntity> {
    const location = await this.locationRepository.findOne({
      ...whereIdIs(id),
      relations: this._relations,
    });

    if (!location) {
      throw new Error("Location not found");
    }

    return location;
  }

  public async delete(id: string): Promise<ResultAsync<string, null>> {
    try {
      const location = await this._findById(id);
      if (!location) {
        throw new Error("Location not found");
      }
      await this.locationRepository.remove(location);
      return okAsync(id);
    } catch (error) {
      console.log("LocationService.delete", error);
      return errAsync(null);
    }
  }
  public async create(
    countryName: string,
    cities?: string[]
  ): Promise<ResultAsync<LocationEntity, null>> {
    const existingLocation = await this.locationRepository.findOne({
      where: { countryName },
      relations: this._relations,
    });

    try {
      const country = existingLocation
        ? existingLocation
        : new LocationEntity();
      country.countryName = countryName;
      country.cities = [];


      cities?.forEach((cityName) => {
        const city = new CityEntity();
        city.name = cityName;

        country.cities.push(city);
      });

      const saved = await this.locationRepository.save(country);
      const refreshed = await this._findById(saved.id);
      return okAsync(refreshed);
    } catch (error) {
      console.log("LocationService.create", error);
      return errAsync(null);
    }
  }

  public async update(
    id: string,
    countryName: string,
    {
      cityIdsToRemove = [],
      cityNamesToAdd = [],
    }: {
      cityNamesToAdd?: string[];
      cityIdsToRemove?: string[];
    }
  ): Promise<ResultAsync<LocationEntity, null>> {
    try {
      const location = await this._findById(id);
      if (!location) {
        throw new Error("Location not found");
      }
      location.countryName = countryName
      cityNamesToAdd.forEach((cityName) => {
        const city = new CityEntity();
        city.name = cityName;

        location.cities.push(city);
      });

      cityIdsToRemove.forEach((cityId) => {
        location.cities = location.cities.filter(
          (city) => !cityIdsToRemove.includes(city.id)
        );
      });

      const saved = await this.locationRepository.save(location);
      const refreshed = await this._findById(saved.id);
      return okAsync(refreshed);
    } catch (e) {
      console.log("LocationService.update", e);
      return errAsync(null);
    }
  }

  public async findAll(): Promise<ResultAsync<LocationEntity[], null>> {
    try {
      const locations = await this.locationRepository.find({
        relations: this._relations,
      });
      return okAsync(locations);
    } catch (error) {
      console.log("LocationService.findAll", error);
      return errAsync(null);
    }
  }
  public async findOne(
    locationID: string
  ): Promise<ResultAsync<LocationEntity, null>> {
    try {
      const location = await this.locationRepository.findOne({
        relations: this._relations,
        where: { id: locationID },
      });

      return okAsync(location);
    } catch (error) {
      console.log("LocationService.findAll", error);
      return errAsync(null);
    }
  }
  public async getAllCities(): Promise<ResultAsync<CityEntity[], null>> {
    try {
      const cities = await this.cityRepository.find({
        relations: ["location"],
      });
      return okAsync(cities);
    } catch (error) {
      console.log("LocationService.findAll", error);
      return errAsync(null);
    }
  }
}
