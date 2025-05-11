import type { BreadcrumbItem } from "@nuxt/ui";
import type { Serializer } from "@vueuse/core";
import type { Reactive } from "vue";

export type EntityTypeCode = "Steward" | "Model" | "Version" | "Namespace" | "Property" | "Type" | "ChildPropertyAssociation" | "Facet" | "LocalTerm";

export abstract class Entity {

  /**
   * ID of item, unique across models and versions.
   */
  "@id"?: string;

  "@type"?: EntityTypeCode;

  category?: any;

  localIdentifier?: string;

  route?: string;

  title?: string;

  /**
   * Edit mode of the item.
   *
   * - locked:   Reference item from the API or published local item that
   *             cannot be modified.
   * - subset:   Reference item from the API or published local item that
   *             can have subset operations applied.
   * - unlocked: Unpublished local item that can be modified.
   */
  editMode: "locked" | "subset" | "unlocked" = "locked";

  /**
   * True if the item should be expanded in the user interface; false
   * if it should be collapsed.
   */
  expand = false;

  /**
   * Number of times this item has been pulled from local storage.
   */
  hits = 0;

  /**
   * True to disable opening the entity as an accordion item; false
   * to allow it to be opened.
   */
  disabled = false;

  highlight: ColorType | undefined;

  private get childConstructor() {
    return this.constructor as typeof Entity;
  }

  public get apiRoute() {
    return this.childConstructor.apiRoute(this.params);
  }

  public get badgeVariant(): ColorVariantType | undefined {
    return "subtle";
  }

  public get breadcrumbs() {
    return this.childConstructor.breadcrumbs(this.params);
  }

  /**
   * Getter for `@id`
   */
  public get id() {
    return this["@id"];
  }

  public get labelQualifier(): string | undefined {
    return undefined;
  }

  public get params() {
    return this.childConstructor.params(this.toAPI());
  }

  public get to() {
    return this.childConstructor.toolboxRoute(this.params);
  }

  public get toolboxRoute(): string {
    return this.childConstructor.toolboxRoute(this.params);
  }

  abstract get badgeLabel(): string | undefined;

  abstract get badgeColor(): ColorType | undefined;

  abstract get documentation() : string | undefined;

  abstract get icon(): IconType;

  abstract get infoItems(): InfoItem[];

  abstract get label(): string;

  abstract get page(): AppLinkType;

  abstract get tabsItems(): Reactive<ToolboxTabsItem[]>;

  protected static addInfoItem(infoItems: InfoItem[], field: string, value: string | undefined, format?: InfoItemFormat, link?: string, badgeColor?: ColorType, badgeVariant?: ColorVariantType) {
    if (value) {
      infoItems.push({ field, value, format, link, badgeColor, badgeVariant });
    }
  }

  toAPI<T extends APIEntity>() {
    return Object.assign({} as T, this);
  }

  static badgeColor(arg: any): ColorType {
    return "neutral";
  }

  static badgeVariant(arg: any): ColorVariantType {
    return "subtle";
  }

  /**
   * Convert JSON for an entity from the API into an object for this application.
   */
  static fromAPI(apiData: APIEntity) {
    throw new Error("Method not implemented");
  }

  /**
   * Convert JSON for a list of entities from the API into a list of objects for this application.
   */
  static fromAPIList(apiData: APIEntity[]) {
    throw new Error("Method not implemented");
  }

  static apiRoute(params: any): string {
    throw new Error("Method not implemented");
  }

  static breadcrumbs(params: any): BreadcrumbItem[] {
    throw new Error("Method not implemented");
  }

  static id(...args: any[]): string {
    throw new Error("Method not implemented");
  }

  static idFromParams(EntityClass: typeof Entity, params: any) {
    return EntityClass.toolboxRoute(params).replace("/browse/", "");
  }

  static init(): Entity {
    throw new Error("Method not implemented");
  }

  /**
   * @param apiEntity - API Entity or Entity ID
   */
  static params(apiEntity: APIEntity | string): Object {
    throw new Error("Method not implemented");
  }

  static serializeEntity<T extends Entity>(initializer: () => T): Serializer<T> {
    return {
      read: (raw: string) => Object.assign(initializer(), raw),
      write: (value: T) => JSON.stringify(value)
    }
  }

  static serializeEntityList<T extends Entity>(initializer: () => T): Serializer<T[]> {
    return {
      read: (raw: string) => {
        let objects = JSON.parse(raw) as T[];
        return objects.map(object => Object.assign(initializer(), object));
      },
      write: (value: T[]) => JSON.stringify(value)
    }
  }

  static toolboxRoute(params: any): string {
    throw new Error("Method not implemented");
  }

  static toRef(entity: Entity): Object {
    throw new Error("Method not implemented");
  }

  static toAPI(): APIEntity {
    throw new Error("Method not implemented");
  }

  static fromCMF() {
    throw new Error("Method not implemented");
  }

  static toCMF() {
    throw new Error("Method not implemented");
  }

  static sort(a: Entity, b:Entity): number {
    throw new Error("Method not implemented");
  }

}
