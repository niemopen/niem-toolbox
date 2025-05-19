import { useStorage, type RemovableRef, type UseStorageOptions } from "@vueuse/core";
import { Steward } from "../utils/niem/Steward";
import { Model } from "../utils/niem/Model";
import { Config } from "../utils/Config";
import { Type } from "../utils/niem/Type";
import { Property } from "../utils/niem/Property";
import { Subproperty } from "../utils/niem/Subproperty";
import { Namespace } from "../utils/niem/Namespace";
import { Version } from "~/utils/niem/Version";
import type { Entity } from "~/utils/niem/Entity";
import type { Facet } from "~/utils/niem/Facet";

/**
 * Prefix keys in local storage with "niem-toolbox-".
 */
function key(id: string) {
  return "niem-toolbox-" + id;
}

const storageOptions: UseStorageOptions<any> = {
  mergeDefaults: true
}

// Set stewards for default initialization and $reset
const user = new Steward("User", "Username", "Person");

// Set models for default initialization and $reset
// TODO-API: Move highlights subset model to database
const sandboxModelObject = new Model(user, "Sandbox Model", "message");
// const favoritesModelObject = new Model(user, "Favorites", "other");
// const highlightsModelObject = new Model(user, "Highlights", "other");

const sandboxVersion = new Version(sandboxModelObject, "1.0", "5.2");
// const favoritesVersion = new Version(favoritesModelObject, "5.2", "5.2");
// const highlightsVersion = new Version(highlightsModelObject, "5.2", "5.2");

// TODO: Cannot call top-level await.  Convert to async function
// const niemModelObject = await Data.model(Model.NIEMModelParams);
// const niemVersionObjects = await Data.versions(Model.NIEMModelParams);

export const useToolboxStore = defineStore("niem-toolbox", () => {

  const config: RemovableRef<typeof Config> = useStorage(key("config"), { ...Config }, localStorage, storageOptions);

  // Session storage for entities that can change or be added to over time

  const stewardStorage: RemovableRef<Steward[]> = useStorage(key("stewards"), [] as Steward[], sessionStorage, { ...storageOptions, serializer: Steward.serializeEntityList(Steward.init) });

  const modelStorage: RemovableRef<Model[]> = useStorage(key("models"), [] as Model[], sessionStorage, {...storageOptions, serializer: Model.serializeEntityList(Model.init)});

  const versionStorage: RemovableRef<Version[]> = useStorage(key("versions"), [sandboxVersion], sessionStorage, {...storageOptions, serializer: Version.serializeEntityList(Version.init)});

  // const versionStorage: RemovableRef<Version[]> = useStorage(key("versions"), [sandboxVersion, favoritesVersion, highlightsVersion], sessionStorage, {...storageOptions, serializer: Version.serializeEntityList(Version.init)});

  // TODO: Depends on top-level await.
  // const niemModel: RemovableRef<Model> = useStorage(key("niem-model"), niemModelObject, sessionStorage, storageOptions);

  // const niemVersions: RemovableRef<Version[]> = useStorage(key("niem-versions"), niemVersionObjects, sessionStorage, storageOptions);


  // Local storage for published entities that do not change

  const namespaceStorage: RemovableRef<Namespace[]> = useStorage(key("namespaces"), [], sessionStorage, {...storageOptions, serializer: Namespace.serializeEntityList(Namespace.init)});

  const propertyStorage: RemovableRef<Property[]> = useStorage(key("properties"), [], sessionStorage, {...storageOptions, serializer: Property.serializeEntityList(Property.init)});

  const typeStorage: RemovableRef<Type[]> = useStorage(key("types"), [], sessionStorage, {...storageOptions, serializer: Type.serializeEntityList(Type.init)});

  const subpropertyStorage: RemovableRef<Subproperty[]> = useStorage(key("subproperties"), [], sessionStorage, {...storageOptions, serializer: Subproperty.serializeEntityList(Subproperty.init)});


  const userSteward: RemovableRef<Steward> = useStorage(key("user"), user, localStorage, storageOptions);

  // const favorites: RemovableRef<Model> = useStorage(key("favorites"), favoritesModelObject, localStorage, {...storageOptions, serializer: Model.serializer});

  // const highlights: RemovableRef<Model> = useStorage(key("highlights"), highlightsModelObject, localStorage, storageOptions);

  const sandbox: RemovableRef<Model> = useStorage(key("sandbox"), sandboxModelObject, localStorage, storageOptions);

  // const propertyHistory: RemovableRef<Property[]> = useStorage(key("history"), [], localStorage, storageOptions);

  const routeHistory: RemovableRef<string> = useStorage(key("routes"), [], localStorage, storageOptions);


  //
  // Actions
  //

  function resetSessionStorage() {
    stewardStorage.value = [];
    modelStorage.value = [];
    versionStorage.value = [];
    namespaceStorage.value = [];
    propertyStorage.value = [];
    typeStorage.value = [];
    subpropertyStorage.value = [];
  }

  function resetLocalStorage() {
    config.value = { ...Config };

  }

  function $reset() {
    resetSessionStorage();
    resetLocalStorage();
  }

  /**
   * Get all stewards.
   */
  async function stewards(): Promise<Steward[]> {
    // Return stewards from storage if available
    let stewards = stewardStorage.value;
    if (stewards.length > 0) {
      return stewards;
    }

    // Pull stewards from the API and save to storage
    stewards = await Data.stewards();
    return addStorageItems(stewardStorage, stewards, false, Steward.sort);
  }

  /**
   * Get all models from the given steward, or all models from all stewards if no steward is given.
   */
  async function models(steward?: Steward): Promise<Model[]> {
    if (steward) {
      // Return steward models from storage if available
      let models = modelStorage.value.filter(model => model.steward?.route == steward.route);
      if (models.length > 0) {
        return models.sort(Model.sort);
      }

      // Pull models from the API and save to storage
      models = await Data.models(steward.params);
      return addStorageItems(modelStorage, models, false, Model.sort);
    }
    else if (modelStorage.value.length == 0) {
      // Pull all models from all stewards from the API
      let models = await Data.models();
      return addStorageItems(modelStorage, models, false, Model.sort);
    }
    else {
      // Return all models from all stewards in storage
      return modelStorage.value.sort(Model.sort);
    }
  }

  /**
   * Get all versions from the given model.
   */
  async function versions(model: Model): Promise<Version[]> {
    // Return model versions from storage if available
    let versions = versionStorage.value.filter(version => version.model?.route == model.route);
    if (versions.length > 0) {
      return versions.sort(Version.sort);
    }

    // Pull model versions from the API and save to storage
    versions = await Data.versions(model.params);
    return addStorageItems(versionStorage, versions, false, Version.sort);
  }

  /**
   * Get all versions from the NIEM reference model.
   */
  async function niemVersions(): Promise<Version[]> {
    let model = await Data.model({stewardKey: "niem", modelKey: "model"});

    if (!model) {
      return [];
    }

    // Return model versions from storage if available
    let versions = versionStorage.value.filter(version => version.model?.route == model.route);
    if (versions.length > 0) {
      return versions.sort(Version.sort);
    }

    // Pull model versions from the API and save to storage
    versions = await Data.versions(model.params);
    return addStorageItems(versionStorage, versions, false, Version.sort);
  }

  /**
   * Get all namespaces from the given version.
   */
  async function namespaces(version: Version): Promise<Namespace[]> {
    // Return version namespaces from storage if available
    let namespaces = namespaceStorage.value.filter(namespace => namespace.version?.route == version.route);
    if (namespaces.length > 0) {
      return namespaces.sort(Namespace.sort);
    }

    // Pull version namespaces from the API and save to storage
    namespaces = await Data.namespaces(version.params);
    return addStorageItems(namespaceStorage, namespaces, false, Namespace.sort);
  }

  /**
   * Get a page of properties from the given version.
   */
  async function propertiesFromVersion(version: Version, offset=0): Promise<Paginated<Property>> {
    let pageable = Pagination.pageable(offset);
    return Data.properties(version.params, pageable);
  }

  /**
   * Get a page of properties from the given namespace.
   */
  async function propertiesFromNamespace(namespace: Namespace, offset=0):
      Promise<Paginated<Property>> {
    let pageable = Pagination.pageable(offset);
    return Data.properties(namespace.params, pageable);
  }

  /**
   * Get a page of types from the given version.
   */
  async function typesFromVersion(version: Version, offset=0): Promise<Paginated<Type>> {
    let pageable = Pagination.pageable(offset);
    return Data.types(version.params, pageable);
  }

  /**
   * Get a page of types from the given namespace.
   */
  async function typesFromNamespace(namespace: Namespace, offset=0): Promise<Paginated<Type>> {
    let pageable = Pagination.pageable(offset);
    return Data.types(namespace.params, pageable);
  }

  /**
   * Get all subproperties of the given type.
   */
  async function subproperties(type: Type): Promise<Subproperty[]> {
    let subproperties = subpropertyStorage.value.filter(subproperty => subproperty.type?.route == type.route);
    if (subproperties.length > 0) {
      return subproperties.sort(Subproperty.sort);
    }

    subproperties = await Data.subpropertiesOfType(type.params);
    return addStorageItems(subpropertyStorage, subproperties, false, Subproperty.sort);
  }

  /**
   * Get all subproperties that include the given property.
   */
  async function subpropertiesWithProperty(property: Property): Promise<Subproperty[]> {
    let results = await Data.subpropertiesWithProperty(property.params);
    return results;
  }

  /**
   * Get a page of facets from the given version.
   */
  async function facetsFromVersion(version: Version, offset=0): Promise<Paginated<Facet>> {
    let pageable = Pagination.pageable(offset);
    return Data.facets(version.params, pageable);
  }

  /**
   * Get a page of facets from the given version.
   */
  async function facetsFromNamespace(namespace: Namespace, offset=0): Promise<Paginated<Facet>> {
    let pageable = Pagination.pageable(offset);
    return Data.facets(namespace.params, pageable);
  }

  /**
   * Get a page of facets from the given type.
   */
  async function facetsFromType(type: Type, offset=0): Promise<Paginated<Facet>> {
    let pageable = Pagination.pageable(offset);
    return Data.facets(type.params, pageable);
  }

  /**
   * Get the steward with the given fields.
   */
  async function steward(params: APIStewardParams): Promise<Steward | undefined> {
    // Load from storage if available
    let steward = stewardStorage.value.find(steward => steward.stewardKey == params.stewardKey);

    if (steward) {
      processHit(steward);
      return steward;
    }

    // Pull from the API
    steward = await Data.steward(params);
    return addStorageItem(stewardStorage, steward);
  }

  /**
   * Get the model with the given fields.
   */
  async function model(params: APIModelParams): Promise<Model | undefined> {
    // Load from storage if available
    let modelID = Model.idFromParams(Model, params);
    let model = modelStorage.value.find(model => model.id == modelID);

    if (model) {
      processHit(model);
      return model;
    }

    // Pull from the API
    model = await Data.model(params);
    return addStorageItem(modelStorage, model);
  }

  /**
   * Get the version with the given fields.
   */
  async function version(params: APIVersionParams): Promise<Version|undefined> {
    // Load from storage if available
    let versionID = Version.idFromParams(Version, params);
    let version = versionStorage.value.find(version => version.id == versionID);

    if (version) {
      processHit(version);
      return version;
    }

    // Pull from the API
    version = await Data.version(params);
    return addStorageItem(versionStorage, version);
  }

  /**
   * Get the namespace with the given fields.
   */
  async function namespace(params: APINamespaceParams): Promise<Namespace | undefined> {
    // Load from storage if available
    let namespaceID = Namespace.idFromParams(Namespace, params);
    let namespace = namespaceStorage.value.find(namespace => namespace.id == namespaceID);

    if (namespace) {
      processHit(namespace);
      return namespace;
    }

    // Pull from the API
    namespace = await Data.namespace(params);
    return addStorageItem(namespaceStorage, namespace);
  }

  /**
   * Get the property with the given fields.
   *
   * @param arg = Property params or API route string
   */
  async function property(arg: APIComponentParams | string): Promise<Property | undefined> {
    // Load from storage if available
    let apiRoute = typeof arg == "string" ? arg : Property.apiRoute(arg);
    let property = propertyStorage.value.find(property => property.apiRoute == apiRoute);

    if (property) {
      processHit(property);
      return property;
    }

    // Pull from the API
    property = await Data.property(arg);
    return addStorageItem(propertyStorage, property);
  }

  /**
   * Get the type with the given fields.
   *
   * @param arg = Type params or API route string
   */
  async function type(arg: APIComponentParams | string): Promise<Type | undefined> {
    // Load from storage if available
    let apiRoute = typeof arg == "string" ? arg : Type.apiRoute(arg);
    let type = typeStorage.value.find(type => type.apiRoute == apiRoute);

    if (type) {
      processHit(type);
      return type;
    }

    // Pull from the API
    type = await Data.type(arg);
    return addStorageItem(typeStorage, type);
  }

  /**
   * Get the type inheritance or restriction chain for the type with the given fields.
   */
  async function bases(typeParams: APIComponentParams): Promise<Type[]> {
    return Data.bases(typeParams);
  }

  /**
   * Get a list of properties substitutable for the given property.
   */
  async function substitutions(arg: APIComponentParams): Promise<Property[]> {
    return Data.substitutions(arg);
  }

  /**
   * Get a list of substitution group heads (chain) for the given property.
   */
  async function groups(arg: APIComponentParams): Promise<Property[]> {
    return Data.groups(arg);
  }

  /**
   * Get a list of immediate children for the given type.
   */
  async function children(arg: APIComponentParams): Promise<Type[]> {
    let children = await Data.children(arg);
    return children.sort(Type.sort);
  }

  /**
   * Get a list of property usages of the given type.
   */
  async function usages(arg: APIComponentParams, offset = 0): Promise<Paginated<Property>> {
    let pageable = Pagination.pageable(offset);
    return Data.usages(arg, pageable);
  }

  /**
   * Get augmentation properties for the type with the given fields.
   */
  async function augmentations(type: Type): Promise<Property[]> {
    if (type.isSimpleContent || type.pattern == "augmentation") {
      return [];
    }

    try {
      return Data.augmentations(type.params);
    }
    catch (error) {
      return [];
    }

  }

  /**
   * Get the number of facets for the given type.
   */
  async function countFacets(type: Type): Promise<number> {
    if (type.isSimpleContent && !type.isSimple && type.base) {
      let baseType = await Data.type(type.base.route);
      if (baseType) {
        return Data.countFacets(baseType.params);
      }
    }
    return Data.countFacets(type.params);
  }

  /**
   * Get the number of immediate children for the given type.
   */
  async function countSubproperties(type: Type): Promise<number> {
    return Data.countSubproperties(type.params);
  }


  // TODO: Depends on top-level await.
  // const niemVersion = computed<Version>(() => {
  //   return niemVersions.value.find(version => version.versionNumber == config.value.selectedNIEMVersionNumber) as Version;
  // });



  return {
    config,

    resetLocalStorage,
    resetSessionStorage,
    $reset,

    stewards,
    steward,

    models,
    model,

    versions,
    version,

    namespaces,
    namespace,

    propertiesFromVersion,
    propertiesFromNamespace,
    property,

    typesFromVersion,
    typesFromNamespace,
    type,

    subproperties,
    subpropertiesWithProperty,

    facetsFromVersion,
    facetsFromNamespace,
    facetsFromType,

    bases,
    children,
    augmentations,
    usages,

    substitutions,
    groups,

    niemVersions,

    countFacets,
    countSubproperties,

    userSteward,
    // highlights,
    // favorites,
    sandbox,
    // propertyHistory,
    routeHistory,

    // TODO: Depends on top-level await.
    // niemModel,
    // niemVersions,
    // niemVersion

  }

});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useToolboxStore, import.meta.hot));
}

function processHit<T extends Entity>(entity: T | undefined) {
  if (entity) entity.hits++;
  return entity;
}

function processHits<T extends Entity>(entities: T[] | undefined) {
  if (entities) {
    entities.forEach(entity => entity.hits++);
  }
  return entities;
}

function processResponse(storeEntities: RemovableRef<Entity[]>, entity: Entity | undefined) {
  if (entity) {
    storeEntities.value.push(entity);
  }
}

function processResponses(storeEntities: RemovableRef<Entity[]>, entities: Entity[] | undefined) {
  if (entities) {
    storeEntities.value.push(...entities);
  }
}

/**
 * Tries to add the give item to the storage array and returns the now reactive item.
 *
 * Logs an error if storage is full and returns the non-reactive item.
 *
 * @param checkDuplicates - If true, checks storage for item with the same route before adding.
 */
function addStorageItem<T extends Entity>(storage: RemovableRef<T[]>, item: T | undefined,
    checkDuplicates=false): T | undefined {

  if (!item) {
    return;
  }

  try {
    if (checkDuplicates) {
      let result = storage.value.find(storageItem => storageItem.route == item.route);
      if (result) {
        return result;
      }
    }
    storage.value.push(item);
  }
  catch (error) {
    console.log("Storage full");
    return item;
  }
  return storage.value.find(storageItem => storageItem.route == item.route) || item;

}

/**
 * Tries to add the given items or items to the storage array and returns the now reactive items.
 *
 * Logs an error if storage is full and returns the non-reactive items.
 *
 * @param checkDuplicates - If true, checks storage for item with the same route before adding.
 */
function addStorageItems<T extends Entity>(storage: RemovableRef<T[]>, items: T[],
    checkDuplicates=false, sortFunction?: (a: T, b: T) => number): T[] {

  try {
    if (checkDuplicates) {
      for (let item of items) {
        if (!storage.value.find(storageItem => storageItem.route == item.route)) {
          storage.value.push(item);
        }
      }
    }
    else {
      storage.value.push(...items);
    }
  }
  catch (error) {
    console.log("Storage full");
    return items;
  }

  let itemRoutes = items.map(item => item.route);
  let results = storage.value.filter(storageItem => itemRoutes.includes(storageItem.route));

  if (sortFunction) {
    results = results.sort(sortFunction);
  }

  return results;

}
