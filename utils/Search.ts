import type { Property } from "./niem/Property";
import type { Type } from "./niem/Type";
import { Pagination } from "./Pagination";

export type SearchOptions = {
  niemVersionNumber?: string,
  token?: string[],
  substring?: string[],
  prefix?: string[],
  namespaceCategory?: string[],
}

export type SearchPropertiesOptions = SearchOptions & {
  type?: string[],
  isAbstract?: boolean,
  isElement?: boolean
}

export type SearchTypesOptions = SearchOptions & {
}

export type ScopeType = "Properties" | "Types";

export type SortType = "score_name" | "score_qname" | "rank_qname" | "rank_name" | "qname" | "name";

// TODO-API: Limit searches to specific stewards, models, and versions

export class Search {

  static route(scope: ScopeType, options: SearchPropertiesOptions | SearchTypesOptions,
      sort: SortType, pageNumber: number): string {

    // Convert options into query parameters
    let queryString = Search.optionsQueryString(options);

    // Skip if no search criteria given
    if (queryString == "") {
      return "";
    }

    let route = "";

    if (scope == "Properties") {
      route += API.routes.search_properties;
    }
    else {
      route += API.routes.search_types;
    }

    route += `${queryString}&sortOrder=${sort}&page=${pageNumber}`;
    return route;

  }

  static async properties(route: string): Promise<Paginated<Property>> {
    if (route == "") return Pagination.emptyProperties();

    try {
      let response = await fetch(route);

      if (response.ok && response.status == 200) {
        let paginatedAPIProperties = await response.json() as Paginated<APIProperty>;
        return Pagination.processAPIProperties(paginatedAPIProperties);
      }
    }
    catch(error) {
      console.error(route, error);
    }

    return Pagination.emptyProperties();
  }

  static async types(route: string): Promise<Paginated<Type>> {
    if (route == "") return Pagination.emptyTypes();

    let response = await fetch(route);

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