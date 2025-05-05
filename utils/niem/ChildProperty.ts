import type { BreadcrumbItem, TabsItem } from "@nuxt/ui";
import { Entity, type EntityTypeCode } from "./Entity";
import { Version } from "./Version";
import { Type } from "./Type";
import { Namespace } from "./Namespace";
import { Property } from "./Property";

export class ChildProperty extends Entity {

  override "@type": EntityTypeCode = "ChildProperty";

  type?: APITypeRef;
  property?: APIPropertyRef;

  min?: string;
  max?: string;
  sequence?: number;
  definition?: string;

  namespace?: APINamespaceRef;
  version?: APIVersionRef;
  model?: APIModelRef;
  steward?: APIStewardRef;

  contentsCount?: number;

  override get badgeLabel() {
    if (this.property?.category == "attribute") {
      let usage = this.min == "0" ? "optional" : "required";
      return `attribute | ${ usage }`
    }
    return `${ this.min || "?" } : ${ this.max || "?" }`
  }

  override get badgeColor(): ColorType {
    return this.property?.category == "attribute" ? "neutral" : "primary";
  }

  override get badgeVariant(): ColorVariantType {
    if (!this.min) return "subtle";
    return this.min >= "1" ? "solid" : "subtle";
  }

  override get documentation() {
    return this.definition;
  }

  override get icon() {
    return icons.childProperty;
  }

  override get infoItems(): InfoItem[] {
    let items: InfoItem[] = [];
    let params = this.params;

    let typeParams: APIComponentParams = {
      ...params,
      qname: this.type?.qname || ""
    }
    let propertyParams: APIComponentParams = {
      ...params,
      qname: this.property?.qname || ""
    }

    Entity.addInfoItem(items, "Type", this.type?.qname, "route", Type.toolboxRoute(typeParams));

    Entity.addInfoItem(items, "Property", this.property?.qname, "route", Property.toolboxRoute(propertyParams));

    Entity.addInfoItem(items, "Property definition", this.property?.definition);

    Entity.addInfoItem(items, "Property category", Property.badgeLabel(this.property?.category, this.type?.category), undefined, undefined, Property.badgeColor(this.property?.category), Property.badgeVariant(this.property?.category));

    Entity.addInfoItem(items, "Min", this.min);
    Entity.addInfoItem(items, "Max", this.max);
    Entity.addInfoItem(items, "Definition", this.definition);

    return items;
  }

  override get label() {
    return this.property?.qname || "";
  }

  override get page() {
    return AppItems.childProperty;
  }

  override get params() {
    return super.params as APIChildPropertyParams
  }

  override get tabsItems(): ToolboxTabsItem[] {
    return [
      {
        icon: icons.childProperty,
        label: "Contents",
        slot: "contents",
        count: this.contentsCount
      }
    ];
  }

  static override apiRoute(params: APIChildPropertyParams) {
    let route = Version.apiRoute(params);

    if ("prefix" in params) {
      route += `/namespaces/${ params.prefix }/subproperties`;
    }
    else if ("propertyQName" in params && "typeQName" in params) {
      route += `/types/${ params.typeQName}/subproperties/${ params.propertyQName }`;
    }
    else if ("propertyQName" in params) {
      route += `/properties/${ params.propertyQName }/subproperties`;
    }
    else if ("typeQName" in params) {
      route += `/types/${ params.typeQName }/subproperties`;
    }

    return route;
  }

  static override breadcrumbs(params: APIChildPropertyParams): BreadcrumbItem[] {
    let breadcrumbs = Namespace.breadcrumbs({...params, prefix: "tmp"}).slice(0, -1);
    breadcrumbs.push(...[
      {
        to: Type.toolboxRoute({...params, qname: params.typeQName || ""}),
        label: params.typeQName
      },
      {
        label: params.propertyQName
      }
    ])
    return breadcrumbs;
  }

  static override id(typeID: string, propertyQName: string) {
    return `${typeID}/${propertyQName}`;
  }

  static override init() {
    return new ChildProperty();
  }

  static override params(childProperty: APIChildProperty | string): APIChildPropertyParams {
    if (typeof childProperty == "string") {
      let [stewardKey, modelKey, versionNumber, typeQName, propertyQName] = childProperty.split("/");
      return {
        stewardKey, modelKey, versionNumber, typeQName, propertyQName
      }
    }
    return {
      stewardKey: childProperty.steward?.stewardKey || "",
      modelKey: childProperty.model?.modelKey || "",
      versionNumber: childProperty.version?.versionNumber || "",
      typeQName: childProperty.type?.qname,
      propertyQName: childProperty.property?.qname
    }
  }

  static override sort(a: ChildProperty, b: ChildProperty): number {
    if (!a.sequence || !b.sequence) return 0;
    return a.sequence - b.sequence;
  }

  static override toolboxRoute(params: APIChildPropertyParams) {
    if ("typeQName" in params && "propertyQName" in params) {
      return Version.toolboxRoute(params)
      + "/" + params.typeQName
      + "/" + params.propertyQName;
    }
    return "";
  }

}