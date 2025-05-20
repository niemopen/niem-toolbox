import type { Property } from "./niem/Property";
import type { Type } from "./niem/Type";
import { Pagination } from "./Pagination";

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

  static route(options: SearchPropertiesOptions | SearchTypesOptions): string {
    let queryString = Search.optionsQueryString(options);
    if (queryString == "") return "";

    return API.routes.search_properties + queryString
  }

  static async properties(options: SearchPropertiesOptions): Promise<Paginated<Property>> {
    let route = Search.route(options);
    if (route == "") return Pagination.emptyProperties();

    try {
      let response = await fetch(route);

      if (response.ok) {
        let paginatedAPIProperties = await response.json() as Paginated<APIProperty>;
        return Pagination.processAPIProperties(paginatedAPIProperties);
      }
    }
    catch(error) {
      console.error(route, error);
    }

    return Pagination.emptyProperties();
  }

  static async types(options: SearchTypesOptions): Promise<Paginated<Type>> {
    let queryString = Search.optionsQueryString(options);
    if (queryString == "") return Pagination.emptyTypes();

    let response = await fetch(API.routes.search_types + queryString);

    if (response.ok) {
      let paginatedAPITypes = await response.json() as Paginated<APIType>;
      return Pagination.processAPITypes(paginatedAPITypes);
    }

    return Pagination.emptyTypes();
  }

  private static optionsQueryString(options: {[x: string] : string | boolean | number | string[]}) {
    let queryString = "";
    for (let [key, value] of Object.entries(options)) {
      // Skip empty arrays
      if (Array.isArray(value) && value.length == 0) {
        continue;
      }

      if (queryString != "") queryString += "&";

      queryString += key + "=";
      queryString += Array.isArray(value) ? value.join(",") : value;
    }
    if (queryString != "") queryString = "?" + queryString;
    return queryString;
  }

}