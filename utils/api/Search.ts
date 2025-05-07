import { Property } from "./niem/Property";
import { Type } from "./niem/Type";

export type SearchPropertiesOptions = {
  niemVersionNumber?: string,
  token?: string[],
  substring?: string[],
  prefix?: string[],
  type?: string[],
  isAbstract?: boolean,
  isElement?: boolean,
  page?: number,
  limit?: number
}

export type SearchTypesOptions = {
  niemVersionNumber?: string,
  token?: string[],
  substring?: string[],
  prefix?: string[],
  page?: number,
  limit?: number
}

// TODO-API: Limit searches to specific stewards, models, and versions

export class Search {

  static async properties(options: SearchPropertiesOptions): Promise<Paginated<Property>> {
    let queryString = Search.optionsQueryString(options);
    if (queryString == "") return Data.emptyPaginatedProperty();

    let response = await fetch(API.routes.search_properties + queryString);

    if (response.ok) {
      let paginatedAPIProperties = await response.json() as Paginated<APIProperty>;
      return Data.processPaginatedAPIProperties(paginatedAPIProperties);
    }

    return Data.emptyPaginatedProperty();
  }

  static async types(options: SearchTypesOptions): Promise<Paginated<Type>> {
    let queryString = Search.optionsQueryString(options);
    if (queryString == "") return Data.emptyPaginatedType();

    let response = await fetch(API.routes.search_types + queryString);

    if (response.ok) {
      let paginatedAPITypes = await response.json() as Paginated<APIType>;
      return Data.processPaginatedAPITypes(paginatedAPITypes);
    }

    return Data.emptyPaginatedType();
  }

  private static optionsQueryString(options: {[x: string] : string | boolean | number | string[]}) {
    let queryString = "";
    for (let [key, value] of Object.entries(options)) {
      if (queryString != "") queryString += "&";
      queryString += key + "=";
      queryString += Array.isArray(value) ? value.join(",") : value;
    }
    if (queryString != "") queryString = "?" + queryString;
    return queryString;
  }

}