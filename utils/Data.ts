import { ChildProperty } from "./niem/ChildProperty";
import { Model } from "./niem/Model";
import { Namespace } from "./niem/Namespace";
import { Property } from "./niem/Property";
import { Steward } from "./niem/Steward";
import { Type } from "./niem/Type";
import { Version } from "./niem/Version";

export class Data {

  static async stewards() {
    let response = await fetch(Steward.apiRoute());
    if (response.ok) {
      let apiStewards = await response.json() as APISteward[];
      let stewards = apiStewards.map(apiSteward => Steward.fromAPI(new Steward(), apiSteward));
      return stewards.sort(Steward.sort);
    }
    return [];
  }

  static async steward(stewardParams: APIStewardParams) {
    let response = await fetch(Steward.apiRoute(stewardParams));
    if (response.ok) {
      let apiSteward = await response.json() as APISteward;
      return Steward.fromAPI(new Steward(), apiSteward);
    }
  }

  static async models(params?: APIStewardParams) {
    if (!params) {
      params = { stewardKey: "*" };
    }
    let response = await fetch(Model.apiRoute(params));
    if (response.ok) {
      let apiModels = await response.json() as APIModel[];
      let models = apiModels.map(apiModel => Model.fromAPI(new Model(), apiModel));
      return models.sort(Model.sort);
    }
    return [];
  }

  static async model(modelParams: APIModelParams) {
    let response = await fetch(Model.apiRoute(modelParams));
    if (response.ok) {
      let apiModel = await response.json() as APIModel;
      return Model.fromAPI(new Model(), apiModel);
    }
  }

  static async versions(modelParams: APIModelParams) {
    let response = await fetch(Version.apiRoute(modelParams));
    if (response.ok) {
      let apiVersions = await response.json() as APIVersion[];
      let versions = apiVersions.map(apiVersion => Version.fromAPI(new Version(), apiVersion));
      versions.forEach(version => version.category = Version.category(version));
      return versions.sort(Version.sort);
    }
    return [];
  }

  static async version(versionParams: APIVersionParams) {
    let response = await fetch(Version.apiRoute(versionParams));
    if (response.ok) {
      let apiVersion = await response.json() as APIVersion;
      let version = Version.fromAPI(new Version(), apiVersion);
      version.category = Version.category(version);
      return version;
    }
  }

  static async namespaces(versionParams: APIVersionParams) {
    let response = await fetch(Namespace.apiRoute(versionParams));
    if (response.ok) {
      let apiNamespaces = await response.json() as APINamespace[];
      let namespaces = apiNamespaces.map(apiNamespace => Namespace.fromAPI(new Namespace(), apiNamespace));
      return namespaces.sort(Namespace.sort);
    }
    return [];
  }

  static async namespace(namespaceParams: APINamespaceParams) {
    let response = await fetch(Namespace.apiRoute(namespaceParams));
    if (response.ok) {
      let apiNamespace = await response.json() as APINamespace;
      return Namespace.fromAPI(new Namespace(), apiNamespace);
    }
  }

  static async properties(params: APINamespaceParams) {
    let response = await fetch(Property.apiRoute(params));
    if (response.ok) {
      let apiProperties = await response.json() as APIProperty[];
      let properties = apiProperties.map(apiProperty => Property.fromAPI(new Property(), apiProperty));
      return properties.sort(Property.sort);
    }
    return [];
  }

  static async property(args: APIComponentParams | string) {
    let route = typeof args == "string" ? args : Property.apiRoute(args);
    let response = await fetch(route);
    if (response.ok) {
      let apiProperty = await response.json() as APIProperty;
      return Property.fromAPI(new Property(), apiProperty);
    }
  }

  static async types(namespaceParams: APINamespaceParams) {
    let response = await fetch(Type.apiRoute(namespaceParams));
    if (response.ok) {
      let apiTypes = await response.json() as APIType[];
      let types = apiTypes.map(apiType => Type.fromAPI(new Type(), apiType));
      return types.sort(Type.sort);
    }
    return [];
  }

  static async type(args: APIComponentParams | string) {
    let route = typeof args == "string" ? args : Type.apiRoute(args);
    let response = await fetch(route);
    if (response.ok) {
      let apiType = await response.json() as APIType;
      return Type.fromAPI(new Type(), apiType);
    }
  }

  static async childPropertiesOfType(typeParams: APIComponentParams) {

    let params: APIChildPropertyParams = {
      ...typeParams,
      typeQName: typeParams.qname
    }

    let response = await fetch(ChildProperty.apiRoute(params));
    if (response.ok) {
      let apiChildProperties = await response.json() as APIChildProperty[];
      let childProperties = apiChildProperties.map(apiChildProperty => ChildProperty.fromAPI(new ChildProperty(), apiChildProperty));
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

}