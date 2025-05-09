import { Subproperty } from "./niem/Subproperty";
import { Model } from "./niem/Model";
import { Namespace } from "./niem/Namespace";
import { Property } from "./niem/Property";
import { Steward } from "./niem/Steward";
import { Type } from "./niem/Type";
import { Version } from "./niem/Version";
import { Pagination } from "./Pagination";

export class Data {

  /**
   * Get all stewards from the API.
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
   * Get a steward with the given fields from the API, or null if not found.
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
   * Get all models from the API for the steward with the given fields.
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
   * Get a model with the given fields from the API, or null if not found.
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
   * Get all versions from the API for the model with the given fields.
   */
  static async versions(modelParams: APIModelParams): Promise<Version[]> {
    let response = await fetch(Version.apiRoute(modelParams));
    if (response.ok) {
      let apiVersions = await response.json() as APIVersion[];
      return Version.fromAPIList(apiVersions).sort(Version.sort);
    }
    return [];
  }

  /**
   * Get a version with the given fields from the API, or null if not found.
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
   * Get all namespaces from the API for the version with the given fields.
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
   * Get a namespace with the given fields from the API, or null if not found.
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
   * Get all properties from the API for the version or namespace with the given fields.
   */
  static async properties(params: APIVersionParams | APINamespaceParams,
      pageable: Pageable): Promise<Paginated<Property>> {

    if (!pageable.sort) {
      pageable.sort = "prefix" in params ? ["name"] : Pagination.sortByRankQName();
    }

    let route = Pagination.route(Property.apiRoute(params), pageable);
    let response = await fetch(route);

    if (response.ok) {
      let paginatedAPIResults = await response.json() as Paginated<APIProperty>;
      return Pagination.processAPIProperties(paginatedAPIResults);
    }
    return Pagination.emptyProperties();

  }

  /**
   * Get a property with the given fields from the API, or null if not found.
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
   * Get all types from the API for the version or namespace with the given fields.
   */
  static async types(params: APIVersionParams | APINamespaceParams,
      pageable: Pageable): Promise<Paginated<Type>> {

    if (!pageable.sort) {
      pageable.sort = "prefix" in params ? ["name"] : Pagination.sortByRankQName();
    }

    let route = Pagination.route(Type.apiRoute(params), pageable);
    let response = await fetch(route);

    if (response.ok) {
      let paginatedAPIResults = await response.json() as Paginated<APIType>;
      return Pagination.processAPITypes(paginatedAPIResults);
    }
    return Pagination.emptyTypes();

  }

  /**
   * Get a type with the given fields from the API, or null if not found.
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
   * Get all subproperties from the API for the version or namespace with the given fields.
   */
  static async subproperties(params: APIVersionParams | APINamespaceParams,
      pageable: Pageable): Promise<Paginated<Subproperty>> {

    let route = Pagination.route(Subproperty.apiRoute(params) + "/subproperties", pageable);
    let response = await fetch(route);

    if (response.ok) {
      let paginatedAPIResults = await response.json() as Paginated<APISubproperty>;
      return Pagination.processAPISubproperties(paginatedAPIResults);
    }
    return Pagination.emptySubproperties();

  }

  /**
   * Get all subproperties from the API of the type with the given fields.
   */
  static async subpropertiesOfType(typeParams: APIComponentParams): Promise<Subproperty[]> {

    let params: APISubpropertyParams = {
      ...typeParams,
      typeQName: typeParams.qname
    }

    let response = await fetch(Subproperty.apiRoute(params));
    if (response.ok) {
      let apiSubproperties = await response.json() as APISubproperty[];
      return Subproperty.fromAPIList(apiSubproperties);
    }
    return [];
  }

  /**
   * Get all subproperties from the API that include the property with the given fields.
   */
  static async subpropertiesWithProperty(propertyParams: APIComponentParams):
      Promise<Subproperty[]> {
    let params: APISubpropertyParams = {
      ...propertyParams,
      propertyQName: propertyParams.qname
    }

    let response = await fetch(Subproperty.apiRoute(params));
    if (response.ok) {
      let apiSubproperties = await response.json() as APISubproperty[];
      return Subproperty.fromAPIList(apiSubproperties);
    }
    return [];
  }

  /**
   * Get a subproperty from the API with the given fields, or null if not found.
   */
  static async subproperty(subpropertyParams: APISubpropertyParams):
      Promise<Subproperty | null> {
    let response = await fetch(Subproperty.apiRoute(subpropertyParams));
    if (response.ok) {
      let apiSubproperty = await response.json() as APISubproperty;
      return Subproperty.fromAPI(apiSubproperty);
    }
    return null;
  }

  /**
   * Get all immediate substitutions from the API for the property with the given fields.
   */
  static async substitutions(propertyParams: APIComponentParams): Promise<Property[]> {
    let response = await fetch(Property.apiRoute(propertyParams) + "/substitutions");
    if (response.ok) {
      let apiSubstitutions = await response.json() as APIProperty[];
      return Property.fromAPIList(apiSubstitutions);
    }
    return [];
  }

  /**
   * Get the type inheritance or restriction chain from the API for the type with the given fields.
   */
  static async bases(typeParams: APIComponentParams): Promise<Type[]> {
    let response = await fetch(Type.apiRoute(typeParams) + "/bases");
    if (response.ok) {
      let apiTypes = await response.json() as APIType[];
      return Type.fromAPIList(apiTypes);
    }
    return [];
  }

}