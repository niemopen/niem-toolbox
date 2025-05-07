import { ChildProperty } from "../niem/ChildProperty";
import { Model } from "../niem/Model";
import { Namespace } from "../niem/Namespace";
import { Property } from "../niem/Property";
import { Steward } from "../niem/Steward";
import { Type } from "../niem/Type";
import { Version } from "../niem/Version";

export class Data {

  /**
   * Return all stewards from the API.
   */
  static async stewards(): Promise<Steward[]> {
    let response = await fetch(Steward.apiRoute());
    if (response.ok) {
      let apiStewards = await response.json() as APISteward[];
      return Steward.fromAPIList(apiStewards);
    }
    return [];
  }

  /**
   * Return a steward with the given fields from the API, or null if not found.
   */
  static async steward(stewardParams: APIStewardParams): Promise<Steward | null> {
    let response = await fetch(Steward.apiRoute(stewardParams));
    if (response.ok) {
      let apiSteward = await response.json() as APISteward;
      return Steward.fromAPI(apiSteward);
    }
    return null;
  }

  /**
   * Return all models from the API for the steward with the given fields.
   *
   * Omit the parameters to return all models from all stewards.
   */
  static async models(params?: APIStewardParams): Promise<Model[]> {
    if (!params) {
      params = { stewardKey: "*" };
    }
    let response = await fetch(Model.apiRoute(params));
    if (response.ok) {
      let apiModels = await response.json() as APIModel[];
      return Model.fromAPIList(apiModels);
    }
    return [];
  }

  /**
   * Return a model with the given fields from the API, or null if not found.
   */
  static async model(modelParams: APIModelParams): Promise<Model | null> {
    let response = await fetch(Model.apiRoute(modelParams));
    if (response.ok) {
      let apiModel = await response.json() as APIModel;
      return Model.fromAPI(apiModel);
    }
    return null;
  }

  /**
   * Return all versions from the API for the model with the given fields.
   */
  static async versions(modelParams: APIModelParams): Promise<Version[]> {
    let response = await fetch(Version.apiRoute(modelParams));
    if (response.ok) {
      let apiVersions = await response.json() as APIVersion[];
      return Version.fromAPIList(apiVersions);
    }
    return [];
  }

  /**
   * Return a version with the given fields from the API, or null if not found.
   */
  static async version(versionParams: APIVersionParams): Promise<Version | null> {
    let response = await fetch(Version.apiRoute(versionParams));
    if (response.ok) {
      let apiVersion = await response.json() as APIVersion;
      return Version.fromAPI(apiVersion);
    }
    return null;
  }

  /**
   * Return all namespaces from the API for the version with the given fields.
   */
  static async namespaces(versionParams: APIVersionParams): Promise<Namespace[]> {
    let response = await fetch(Namespace.apiRoute(versionParams));
    if (response.ok) {
      let apiNamespaces = await response.json() as APINamespace[];
      return Namespace.fromAPIList(apiNamespaces);
    }
    return [];
  }

  /**
   * Return a namespace with the given fields from the API, or null if not found.
   */
  static async namespace(namespaceParams: APINamespaceParams): Promise<Namespace | null> {
    let response = await fetch(Namespace.apiRoute(namespaceParams));
    if (response.ok) {
      let apiNamespace = await response.json() as APINamespace;
      return Namespace.fromAPI(apiNamespace);
    }
    return null;
  }

  /**
   * Return all properties from the API for the version or namespace with the given fields.
   */
  static async propertiesAsPaginated(params: APIVersionParams | APINamespaceParams):
      Promise<Paginated<Property>> {
    let response = await fetch(Property.apiRoute(params));
    if (response.ok) {
      let paginatedAPIResults = await response.json() as Paginated<APIProperty>;
      return Data.processPaginatedAPIProperties(paginatedAPIResults);
    }
    return Data.emptyPaginatedProperty();
  }

  /**
   * Return a property with the given fields from the API, or null if not found.
   *
   * @args - Property fields OR API property route.
   */
  static async property(args: APIComponentParams | string): Promise<Property | null> {
    let route = typeof args == "string" ? args : Property.apiRoute(args);
    let response = await fetch(route);
    if (response.ok) {
      let apiProperty = await response.json() as APIProperty;
      return Property.fromAPI(apiProperty);
    }
    return null;
  }

  /**
   * Return all types from the API for the version or namespace with the given fields.
   */
  static async typesAsPaginated(params: APIVersionParams | APINamespaceParams):
      Promise<Paginated<Type>> {
    let response = await fetch(Type.apiRoute(params));
    if (response.ok) {
      let paginatedAPIResults = await response.json() as Paginated<APIType>;
      return Data.processPaginatedAPITypes(paginatedAPIResults);
    }
    return Data.emptyPaginatedType();
  }

  /**
   * Return a type with the given fields from the API, or null if not found.
   *
   * @args - Type fields OR API type route.
   */
  static async type(args: APIComponentParams | string): Promise<Type | null> {
    let route = typeof args == "string" ? args : Type.apiRoute(args);
    let response = await fetch(route);
    if (response.ok) {
      let apiType = await response.json() as APIType;
      return Type.fromAPI(apiType);
    }
    return null;
  }

  /**
   * Return all child properties from the API of the type with the given fields.
   */
  static async childPropertiesOfType(typeParams: APIComponentParams) {

    let params: APIChildPropertyParams = {
      ...typeParams,
      typeQName: typeParams.qname
    }

    let response = await fetch(ChildProperty.apiRoute(params));
    if (response.ok) {
      let apiChildProperties = await response.json() as APIChildProperty[];
      let childProperties = apiChildProperties.map(apiChildProperty => ChildProperty.fromAPI(apiChildProperty));
      return childProperties.sort(ChildProperty.sort);
    }
    return [];
  }

  static async childPropertiesWithProperty(propertyParams: APIComponentParams) {
    let params: APIChildPropertyParams = {
      ...propertyParams,
      propertyQName: propertyParams.qname
    }

    let response = await fetch(ChildProperty.apiRoute(params));
    if (response.ok) {
      let apiChildProperties = await response.json() as APIChildProperty[];
      let childProperties = apiChildProperties.map(apiChildProperty => ChildProperty.fromAPI(new ChildProperty(), apiChildProperty));
      return childProperties;
    }
    return [];
  }

  static async childProperty(childPropertyParams: APIChildPropertyParams) {
    let response = await fetch(ChildProperty.apiRoute(childPropertyParams));
    if (response.ok) {
      let apiChildProperty = await response.json() as APIChildProperty;
      return ChildProperty.fromAPI(new ChildProperty(), apiChildProperty);
    }
  }

  static async substitutions(propertyParams: APIComponentParams) {
    let response = await fetch(Property.apiRoute(propertyParams) + "/substitutions");
    if (response.ok) {
      let apiSubstitutions = await response.json() as APIProperty[];
      return apiSubstitutions.map(apiSubstitutions)
    }
    return [];
  }

  static emptyPaginatedObject<T>(): Paginated<T> {
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

  static emptyPaginatedProperty(): Paginated<Property> {
    return Data.emptyPaginatedObject<Property>();
  }

  static emptyPaginatedType(): Paginated<Type> {
    return Data.emptyPaginatedObject<Type>();
  }

  /**
   * Copies the pagination related fields.  Changes the value and type of the
   * content array to the new values.
   */
  private static transformPaginatedContent<T, U>(paginatedData: Paginated<T>, content: U[]): Paginated<U> {

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
  private static processPaginatedAPIProperties(paginatedAPIProperties: Paginated<APIProperty>) {
    let content = paginatedAPIProperties.content.map(apiProperty => {
      return Property.fromAPI(apiProperty);
    });

    return Data.transformPaginatedContent<APIProperty, Property>(paginatedAPIProperties, content);
  }

  /**
   * Transform paginated API types to paginated Toolbox types.
   */
  static processPaginatedAPITypes(paginatedAPITypes: Paginated<APIType>) {
    let content = paginatedAPITypes.content.map(apiType => {
      return Type.fromAPI(apiType);
    });

    return Data.transformPaginatedContent<APIType, Type>(paginatedAPITypes, content);
  }

}