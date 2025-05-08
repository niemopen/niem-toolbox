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

  const childPropertyStorage: RemovableRef<Subproperty[]> = useStorage(key("child-properties"), [], localStorage, {...storageOptions, serializer: Subproperty.serializeEntityList(Subproperty.init)});


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
   * Get all stewards.
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

  /**
   * Get all models from the given steward, or all models from all stewards if
   * no steward is given.
   */
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

  async function propertiesFromVersion(version: Version, offset=0): Promise<Paginated<Property>> {
    let pageable = Pagination.pageable(offset);
    return Data.properties(version.params, pageable);
  }

  async function propertiesFromNamespace(namespace: Namespace, offset=0):
      Promise<Paginated<Property>> {
    if (!namespace.prefix) return Pagination.emptyProperties();
    let pageable = Pagination.pageable(offset);
    return Data.properties(namespace.params, pageable);
  }

  async function typesFromVersion(version: Version, offset=0): Promise<Paginated<Type>> {
    let pageable = Pagination.pageable(offset);
    return Data.types(version.params, pageable);
  }

  async function typesFromNamespace(namespace: Namespace, offset=0): Promise<Paginated<Type>> {
    let pageable = Pagination.pageable(offset);
    return Data.types(namespace.params, pageable);
  }

  async function childPropertiesOfType(type: Type): Promise<Subproperty[]> {
    if (type.contentsLoaded) {
      let results = childPropertyStorage.value.filter(childProperty => childProperty.type?.route == type.route);
      processHits(results);
      return results.sort(Subproperty.sort);
    }

    console.log("PULLING CHILD PROPERTIES OF ", type.qname);
    let results = await Data.subpropertiesOfType(type.params);
    childPropertyStorage.value.push(...results);
    type.contentsLoaded = true;
    return results || [];
  }

  async function childPropertiesWithProperty(property: Property): Promise<Subproperty[]> {
    let results = await Data.subpropertiesWithProperty(property.params);
    return results || [];
  }


  /**
   * Get the steward with the given fields from storage or from the API.
   */
  async function steward(params: APIStewardParams): Promise<Steward|null> {
    // Attempt to load from store
    let result = stewardStorage.value.find(steward => steward.stewardKey == params.stewardKey);
    processHit(result);

    if (!result) {
      // Attempt to pull from API
      return Data.steward(params);
    }

    return result ?? null;
  }

  /**
   * Get the model with the given fields from storage or from the API.
   */
  async function model(params: APIModelParams): Promise<Model|null> {
    // Attempt to load from store
    let modelID = Model.idFromParams(Model, params);
    let result = modelStorage.value.find(model => model.id == modelID);
    processHit(result);

    if (!result) {
      // Attempt to load from API
      return Data.model(params);
    }

    return result ?? null;
  }

  /**
   * Get the version with the given fields from the API.
   */
  async function version(params: APIVersionParams): Promise<Version|null> {
    return Data.version(params);
  }

  /**
   * Get the namespace with the given fields.
   */
  async function namespace(params: APINamespaceParams): Promise<Namespace|null> {
    return Data.namespace(params);
  }

  /**
   * Get the property with the given fields.
   */
  async function property(arg: APIComponentParams | string): Promise<Property|null> {
    return Data.property(arg);
  }

  /**
   * Get the type with the given fields.
   */
  async function type(arg: APIComponentParams | string): Promise<Type|null> {
    return Data.type(arg);
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
   * Get augmentation properties for the type with the given fields.
   */
  async function augmentations(type: Type): Promise<Property[]> {
    if (type.isSimpleContent) {
      return [];
    }

    let augmentationParams = type.params;
    augmentationParams.qname = type.params.qname?.slice(0, -4) + "AugmentationPoint";

    try {
      let augmentationProperty = await Data.property(augmentationParams);
      return augmentationProperty ? substitutions(augmentationProperty.params) : [];
    }
    catch (error) {
      return [];
    }

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
    substitutions,

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

