import type { BreadcrumbItem, TabsItem } from "@nuxt/ui";
import { Entity, type EntityTypeCode } from "./Entity";
import { Version } from "./Version";
import { Type } from "./Type";
import { Namespace } from "./Namespace";
import { Property } from "./Property";
import type { Reactive } from "vue";

export class Facet extends Entity {

  override "@type": EntityTypeCode = "Facet";

  type?: APITypeRef;

  override category?: APIFacetCategory = undefined;
  value?: string;
  definition?: string;

  namespace?: APINamespaceRef;
  version?: APIVersionRef;
  model?: APIModelRef;
  steward?: APIStewardRef;

  override get badgeLabel() {
    return this.category;
  }

  override get badgeColor(): ColorType {
    return this.category == "enumeration" ? "neutral" : "primary";
  }

  override get badgeVariant(): ColorVariantType {
    return "subtle";
  }

  override get documentation() {
    return this.definition;
  }

  override get icon() {
    return Icons.facet;
  }

  override get infoItems(): InfoItem[] {
    let items: InfoItem[] = [];
    let params = this.params;

    let typeParams: APIComponentParams = {
      ...params,
      qname: this.type?.qname || ""
    }

    Entity.addInfoItem(items, "Type", this.type?.qname, "route", Type.toolboxRoute(typeParams));

    Entity.addInfoItem(items, "Category", this.category, undefined, undefined, this.badgeColor, this.badgeVariant);
    Entity.addInfoItem(items, "Value", this.value);
    Entity.addInfoItem(items, "Definition", this.definition);

    return items;
  }

  override get label() {
    return this.type?.qname || "";
  }

  override get page() {
    return AppItems.facet;
  }

  override get params() {
    return {
      ...this.type,
      category: this.category,
      route: this.route
     } as APIFacetParams
  }

  override get tabsItems(): Reactive<ToolboxTabsItem[]> {
    return reactive([ ]);
  }

  static override apiRoute(params: APIVersionParams | APINamespaceParams | APIComponentParams) {
    let route = Version.apiRoute(params);

    if ("prefix" in params) {
      route += `/namespaces/${ params.prefix }`;
    }
    else if ("qname" in params) {
      route += `/types/${ params.qname }`;
    }

    return route + "/facets";
  }

  static override breadcrumbs(params: APIFacetParams): BreadcrumbItem[] {
    let breadcrumbs = Namespace.breadcrumbs({...params, prefix: "tmp"}).slice(0, -1);
    breadcrumbs.push(...[
      {
        to: Type.toolboxRoute({...params, qname: params.qname || ""}),
        label: params.qname
      },
      {
        label: params.value
      }
    ])
    return breadcrumbs;
  }

  static override fromAPI(apiData: APIFacet) {
    return Object.assign(new Facet(), apiData) as Facet;
  }

  static override fromAPIList(apiData: APIFacet[]) {
    return apiData.map(apiFacet => Facet.fromAPI(apiFacet));
  }

  static override id(typeID: string, propertyQName: string) {
    return `${typeID}/${propertyQName}`;
  }

  static override init() {
    return new Facet();
  }

  static override params(facet: APIFacet | string): APIFacetParams {
    if (typeof facet == "string") {
      let [stewardKey, modelKey, versionNumber, qname, category, value] = facet.split("/");
      return {
        stewardKey, modelKey, versionNumber, qname, category, value
      }
    }
    return {
      stewardKey: facet.steward?.stewardKey || "",
      modelKey: facet.model?.modelKey || "",
      versionNumber: facet.version?.versionNumber || "",
      qname: facet.type?.qname,
      category: facet.category,
      value: facet.value
    }
  }

  static override sort(a: Facet, b: Facet): number {
    if (!a.id || !b.id) return 0;
    return a.id?.localeCompare(b.id);
  }

  static override toolboxRoute(params: APIFacetParams) {
    if ("qname" in params && "category" in params && "value" in params) {
      return Version.toolboxRoute(params)
      + "/" + params.qname
      + "/" + params.category
      + "/" + params.value;
    }
    return "";
  }

}