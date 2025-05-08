import { Property } from "./niem/Property";
import { Subproperty } from "./niem/Subproperty";
import { Type } from "./niem/Type";
import { API } from "./API";

export class Pagination {

  /**
   * Get the query variables for the given pageable object.
   */
  static queryVariables(pageable: Pageable): String {
    let criteria: String[] = [];
    if (pageable.page) criteria.push("page=" + pageable.page);
    if (pageable.number) criteria.push("number=" + pageable.number);
    if (pageable.sort) criteria.push("sort=" + pageable.sort);
    return criteria.join("&");
  }

  /**
   * Get the route with the query string for the given pageable object,
   * or route with no query string if the pageable object is empty.
   */
  static route(route: string, pageable: Pageable): string {
    let queryVariables = Pagination.queryVariables(pageable);
    if (queryVariables == "") {
      return route;
    }
    return `${route}?${queryVariables}`;
  }

  /**
   * Get a Pageable object that converts the given offset (number of records) into
   * the next page number.
   */
  static pageable(offset: number, sort?: string): Pageable {
    return {
      page: Math.trunc(offset / API.PAGINATION_LIMIT),
      sort,
      number: API.PAGINATION_LIMIT };
  }

  /**
   * Returns an empty paginated object.
   */
  static emptyEntities<T>(): Paginated<T> {
    return {
      content: [],
      totalPages: 0,
      totalElements: 0,
      last: false,
      numberOfElements: 0,
      size: 0,
      number: 0,
      sort: {
        sorted: false,
        unsorted: false,
        empty: true
      },
      first: true,
      empty: true
    }
  }

  /**
   * Returns an empty paginated object for properties.
   */
  static emptyProperties(): Paginated<Property> {
    return Pagination.emptyEntities<Property>();
  }

  /**
   * Returns an empty paginated object for types.
   */
  static emptyTypes(): Paginated<Type> {
    return Pagination.emptyEntities<Type>();
  }

  /**
   * Returns an empty paginated object for subproperties.
   */
  static emptySubproperties(): Paginated<Subproperty> {
    return Pagination.emptyEntities<Subproperty>();
  }

  /**
   * Copies the pagination related fields.  Changes the value and type of the
   * content array to the new values.
   */
  private static processAPIContent<T, U>(paginatedData: Paginated<T>, content: U[]):
      Paginated<U> {

    // Copy over all fields from the paginated data except for the original content array
    const { content: oldContent, ...copy } = paginatedData;

    // Create a new paginated object with the new content array type and data
    const newResults: Paginated<U> = {
      content: content,
      ...copy
    };

    return newResults;

  }

  /**
   * Transform paginated API properties to paginated Toolbox properties.
   */
  static processAPIProperties(paginatedAPIProperties: Paginated<APIProperty>):
      Paginated<Property> {
    let content = Property.fromAPIList(paginatedAPIProperties.content);
    return Pagination.processAPIContent(paginatedAPIProperties, content);
  }

  /**
   * Transform paginated API types to paginated Toolbox types.
   */
  static processAPITypes(paginatedAPITypes: Paginated<APIType>): Paginated<Type> {
    let content = Type.fromAPIList(paginatedAPITypes.content);
    return Pagination.processAPIContent(paginatedAPITypes, content);
  }

  /**
   * Transform paginated API subproperties to paginated Toolbox subproperties.
   */
  static processAPISubproperties(paginatedAPISubproperties: Paginated<APISubproperty>):
      Paginated<Subproperty> {
    let content = Subproperty.fromAPIList(paginatedAPISubproperties.content);
    return Pagination.processAPIContent(paginatedAPISubproperties, content);
  }

}
