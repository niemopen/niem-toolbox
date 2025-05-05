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
  offset?: number,
  limit?: number
}

export type SearchTypesOptions = {
  niemVersionNumber?: string,
  token?: string[],
  substring?: string[],
  prefix?: string[],
  offset?: number,
  limit?: number
}

// TODO-API: Limit searches to specific stewards, models, and versions

export class Search {

  static async properties(options: SearchPropertiesOptions) {
    let queryString = Search.optionsQueryString(options);
    if (queryString == "") return [];

    let response = await fetch(API.routes.search_properties + queryString);

    if (response.ok) {
      let apiProperties = await response.json() as APIProperty[];
      let properties = apiProperties.map(apiProperty => Property.fromAPI(new Property(), apiProperty));
      return properties;
    }

    return [];
  }

  static async types(options: SearchTypesOptions) {
    let queryString = Search.optionsQueryString(options);
    if (queryString == "") return [];

    let response = await fetch(API.routes.search_types + queryString);

    if (response.ok) {
      let apiTypes = await response.json() as APIType[];
      let types = apiTypes.map(apiType => Type.fromAPI(new Type(), apiType));
      return types;
    }

    return [];
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