import { useStorage, type UseStorageOptions } from "@vueuse/core";
import type { RemovableRef } from "@vueuse/core/index.cjs";
import { Model } from "~/utils/niem/Model";
import { Namespace } from "~/utils/niem/Namespace";
import { Property } from "~/utils/niem/Property";
import { Steward } from "~/utils/niem/Steward";
import { Type } from "~/utils/niem/Type";
import { Version } from "~/utils/niem/Version";
import { Config } from "~/utils/Config";
import type { Entity } from "~/utils/niem/Entity";
import { ChildProperty } from "~/utils/niem/ChildProperty";

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
const favoritesModelObject = new Model(user, "Favorites", "other");
const highlightsModelObject = new Model(user, "Highlights", "other");

const sandboxVersion = new Version(sandboxModelObject, "1.0", "5.2");
const favoritesVersion = new Version(favoritesModelObject, "5.2", "5.2");
const highlightsVersion = new Version(highlightsModelObject, "5.2", "5.2");

// TODO: Cannot call top-level await.  Convert to async function
// const niemModelObject = await Data.model(Model.NIEMModelParams);
// const niemVersionObjects = await Data.versions(Model.NIEMModelParams);

export const useToolboxStore = defineStore("niem-toolbox", () => {

  const config: RemovableRef<typeof Config> = useStorage(key("config"), { ...Config }, localStorage, storageOptions);

  // Session storage for entities that can change or be added to over time

  const stewardStorage: RemovableRef<Steward[]> = useStorage(key("stewards"), [] as Steward[], sessionStorage, { ...storageOptions, serializer: Steward.serializeEntityList(Steward.init) });

  const modelStorage: RemovableRef<Model[]> = useStorage(key("models"), [] as Model[], sessionStorage, {...storageOptions, serializer: Model.serializeEntityList(Model.init)});

  const versionStorage: RemovableRef<Version[]> = useStorage(key("versions"), [sandboxVersion, favoritesVersion, highlightsVersion], sessionStorage, {...storageOptions, serializer: Version.serializeEntityList(Version.init)});

  // TODO: Depends on top-level await.
  // const niemModel: RemovableRef<Model> = useStorage(key("niem-model"), niemModelObject, sessionStorage, storageOptions);

  // const niemVersions: RemovableRef<Version[]> = useStorage(key("niem-versions"), niemVersionObjects, sessionStorage, storageOptions);


  // Local storage for published entities that do not change

  const namespaceStorage: RemovableRef<Namespace[]> = useStorage(key("namespaces"), [], localStorage, {...storageOptions, serializer: Namespace.serializeEntityList(Namespace.init)});

  const propertyStorage: RemovableRef<Property[]> = useStorage(key("properties"), [], localStorage, {...storageOptions, serializer: Property.serializeEntityList(Property.init)});

  const typeStorage: RemovableRef<Type[]> = useStorage(key("types"), [], localStorage, {...storageOptions, serializer: Type.serializeEntityList(Type.init)});

  const childPropertyStorage: RemovableRef<ChildProperty[]> = useStorage(key("child-properties"), [], localStorage, {...storageOptions, serializer: ChildProperty.serializeEntityList(ChildProperty.init)});


  const userSteward: RemovableRef<Steward> = useStorage(key("user"), user, localStorage, storageOptions);

  const favorites: RemovableRef<Model> = useStorage(key("favorites"), favoritesModelObject, localStorage, {...storageOptions, serializer: Model.serializer});

  const highlights: RemovableRef<Model> = useStorage(key("highlights"), highlightsModelObject, localStorage, storageOptions);

  const sandbox: RemovableRef<Model> = useStorage(key("sandbox"), sandboxModelObject, localStorage, storageOptions);

  const propertyHistory: RemovableRef<Property[]> = useStorage(key("history"), [], localStorage, storageOptions);

  const routeHistory: RemovableRef<string> = useStorage(key("routes"), [], localStorage, storageOptions);


  //
  // Actions
  //

  function resetSessionStorage() {
    stewardStorage.value = [];
    modelStorage.value = [];
    versionStorage.value = [];
  }

  function resetLocalStorage() {
    config.value = { ...Config };

    namespaceStorage.value = [];
    propertyStorage.value = [];
    typeStorage.value = [];
  }

  function $reset() {
    resetSessionStorage();
    resetLocalStorage();
  }

  /**
   * Get stewards from session storage, or load from the API.
   */
  async function stewards(): Promise<Steward[]> {
    if (stewardStorage.value.length == 0) {
      stewardStorage.value = await Data.stewards();
    }
    else {
      processHits(stewardStorage.value);
    }
    return stewardStorage.value;
  }

  async function models(steward?: Steward): Promise<Model[]> {
    if (steward && steward.modelsLoaded) {
      // Get all models from given steward in storage
      return modelStorage.value.filter(model => model.steward?.route == steward.route);
    }
    else if (steward) {
      // Get all models from given steward from API
      return await Data.models(steward.params);
    }
    else if (modelStorage.value.length > 0) {
      // All models have already been loaded into storage
      processHits(modelStorage.value);
      return modelStorage.value;
    }
    else {
      // Get all models from API
      modelStorage.value = await Data.models();

      // Mark steward models as loaded
      for (let steward of stewardStorage.value) {
        steward.modelsLoaded = true;
      }
      return modelStorage.value;
    }
  }

  async function versions(model: Model): Promise<Version[]> {
    // if (model.versionsLoaded) {
    //   let results = versionStorage.value.filter(version => version.model?.route == model.apiRoute);
    //   processHits(results);
    //   return results;
    // }

    let results = await Data.versions(model.params);
    // versionStorage.value.push(...results);
    // model.versionsLoaded = true;
    return results;
  }

  async function namespaces(version: Version): Promise<Namespace[]> {
    if (version.namespacesLoaded) {
      let results = namespaceStorage.value.filter(namespace => namespace.version?.route == version.route);
      processHits(results);
      return results;
    }

    let results = await Data.namespaces(version.params);
    // namespaceStorage.value.push(...results);
    // version.namespacesLoaded = true;
    return results;
  }

  async function propertiesFromVersion(version: Version, offset=0): Promise<Property[]> {
    if (version.propertiesLoaded) {
      let results = propertyStorage.value.filter(property => property.version?.route == version.route);
      processHits(results);
      return results;
    }

    let options: SearchPropertiesOptions = {
      niemVersionNumber: version.niemVersionNumber,
      offset
    }

    let results = await Search.properties(options);
    // propertyStorage.value.push(...results);

    // if (results.length < API.PAGINATION_LIMIT) {
    //   version.propertiesLoaded = true;

    //   // Cascade loaded boolean to namespaces in version
    //   let namespaces = namespaceStorage.value.filter(namespace => namespace.version?.route == version.route);
    //   for (let namespace of namespaces) {
    //     namespace.propertiesLoaded = true;
    //   }
    // }
    return results;
  }

  async function propertiesFromNamespace(namespace: Namespace, offset=0): Promise<Property[]> {
    if (namespace.propertiesLoaded) {
      let results = propertyStorage.value.filter(property => property.namespace?.route == namespace.route);
      processHits(results);
      return results;
    }

    if (!namespace.prefix) return [];

    let namespaceVersion = await version(namespace.params);
    let options: SearchPropertiesOptions = {
      niemVersionNumber: namespaceVersion?.niemVersionNumber,
      prefix: [namespace.prefix],
      offset
    }

    let results = await Search.properties(options);
    // propertyStorage.value.push(...results);
    // namespace.propertiesLoaded = true;
    return results;
  }

  async function typesFromVersion(version: Version, offset=0): Promise<Type[]> {
    if (version.typesLoaded) {
      let results = typeStorage.value.filter(type => type.version?.route == version.route);
      processHits(results);
      return results;
    }

    let options: SearchTypesOptions = {
      niemVersionNumber: version.niemVersionNumber,
      offset
    }

    let results = await Search.types(options);
    // typeStorage.value.push(...results);

    // if (results.length < API.PAGINATION_LIMIT) {
    //   version.typesLoaded = true;

    //   // Cascade loaded boolean to namespaces in version
    //   let namespaces = namespaceStorage.value.filter(namespace => namespace.version?.route == version.route);
    //   for (let namespace of namespaces) {
    //     namespace.typesLoaded = true;
    //   }
    // }
    return results;
  }

  async function typesFromNamespace(namespace: Namespace, offset=0): Promise<Type[]> {
    if (namespace.typesLoaded) {
      let results = typeStorage.value.filter(type => type.namespace?.route == namespace.route);
      processHits(results);
      return results;
    }

    if (!namespace.prefix) return [];

    let namespaceVersion = await version(namespace.params);
    let options: SearchTypesOptions = {
      niemVersionNumber: namespaceVersion?.niemVersionNumber,
      prefix: [namespace.prefix],
      offset
    }

    let results = await Search.types(options);
    // typeStorage.value.push(...results);
    // namespace.typesLoaded = true;
    return results;
  }

  async function childPropertiesOfType(type: Type): Promise<ChildProperty[]> {
    if (type.contentsLoaded) {
      let results = childPropertyStorage.value.filter(childProperty => childProperty.type?.route == type.route);
      processHits(results);
      return results.sort(ChildProperty.sort);
    }

    console.log("PULLING CHILD PROPERTIES OF ", type.qname);
    let results = await Data.childPropertiesOfType(type.params);
    childPropertyStorage.value.push(...results);
    type.contentsLoaded = true;
    return results || [];
  }

  async function childPropertiesWithProperty(property: Property): Promise<ChildProperty[]> {
    let results = await Data.childPropertiesWithProperty(property.params);
    return results || [];
  }


  /**
   * Get steward from session storage or from the API.
   */
  async function steward(params: APIStewardParams): Promise<Steward|void> {
    // Attempt to load from store
    let result = stewardStorage.value.find(steward => steward.stewardKey == params.stewardKey);
    processHit(result);

    if (!result) {
      // Attempt to pull from API
      result = await Data.steward(params);
    }

    return result;
  }

  async function model(params: APIModelParams): Promise<Model|undefined> {
    // Attempt to load from store
    let modelID = Model.idFromParams(Model, params);
    let result = modelStorage.value.find(model => model.id == modelID);
    processHit(result);

    if (!result) {
      // Attempt to load from API
      result = await Data.model(params);
    }

    return result;
  }

  async function version(params: APIVersionParams): Promise<Version|undefined> {
    // Attempt to load from store
    let versionID = Version.idFromParams(Version, params);
    let result = versionStorage.value.find(version => version.id == versionID);
    processHit(result);

    if (!result) {
      result = await Data.version(params);
    }

    return result;
  }

  async function namespace(params: APINamespaceParams): Promise<Namespace|undefined> {
    // Attempt to load from store
    let namespaceID = Namespace.idFromParams(Namespace, params);
    let result = namespaceStorage.value.find(namespace => namespace.id == namespaceID);
    processHit(result);

    if (!result) {
      result = await Data.namespace(params);
      if (result) namespaceStorage.value.push(result);
    }

    return result;
  }

  async function property(arg: APIComponentParams | string): Promise<Property|undefined> {
    let result: Property | undefined;

    if (typeof arg == "object") {
      // Attempt to load from store
      let propertyID = Property.idFromParams(Property, arg);
      result = propertyStorage.value.find(property => property.id == propertyID);
      processHit(result);
    }

    if (!result) {
      result = await Data.property(arg);
      if (result) propertyStorage.value.push(result);
    }

    return result;
  }

  async function type(arg: APIComponentParams | string): Promise<Type|undefined> {
    let result: Type | undefined;

    if (typeof arg == "object") {
      // Attempt to load from store
      let typeID = Type.idFromParams(Type, arg);
      result = typeStorage.value.find(type => type.id == typeID);
      processHit(result);
    }

    if (!result) {
      result = await Data.type(arg);
      if (result) typeStorage.value.push(result);
    }

    return result;
  }

  async function bases(type: Type): Promise<Type[]> {
    let bases: Type[] = [];
    let currentType: Type | undefined = type;

    while (currentType && currentType.base) {
      let base = await Data.type(currentType.base.route);
      if (base) bases.push(base);
      currentType = base;
    }

    return bases;
  }

  async function augmentations(type: Type): Promise<Property[]> {
    if (!type.name || !type.name.endsWith("Type") || type.category != "complex_object") return [];

    let augmentationName = type.name.slice(0, -4) + "Augmentation";

    let augmentations = await Search.properties({
      niemVersionNumber: type.version?.niemVersionNumber,
      type: [ augmentationName + "Type" ]
    })

    // TODO-API: Search augmentations returns too many results
    return augmentations.filter(augmentation => augmentation.name == augmentationName);
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

    childPropertiesOfType,
    childPropertiesWithProperty,

    bases,
    augmentations,

    userSteward,
    highlights,
    favorites,
    sandbox,
    propertyHistory,
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

