import type { BreadcrumbItem } from "@nuxt/ui";
import { Entity } from "./Entity";
import { Version } from "./Version";
import { Namespace } from "./Namespace";

export abstract class Component extends Entity {

  override category?: APIPropertyCategory | APITypeCategory = undefined;

  prefix?: string;
  qname?: string;
  name?: string;
  definition?: string;
  terms?: string[];
  isOriginal?: boolean;
  isDeprecated?: boolean;

  steward?: APIStewardRef;
  model?: APIModelRef;
  version?: APIVersionRef;
  namespace?: APINamespaceRef;

  contentsCount?: number;
  contentsLoaded?: boolean;

  usagesCount?: number;
  usagesLoaded?: boolean;

  override get badgeColor(): ColorType {
    return "neutral";
  }

  override get documentation() {
    return this.definition;
  }

  override get label() {
    return this.qname || "undefined";
  }

  override get params() {
    return super.params as APIComponentParams;
  }

  static override breadcrumbs(params: APIComponentParams): BreadcrumbItem[] {
    params.prefix = params.qname.split(":")[0];
    params.name = params.qname.split(":")[1];

    let breadcrumbs = Namespace.breadcrumbs(params as APINamespaceParams).slice(0, -1);
    breadcrumbs.push(...[
      {
        to: Namespace.toolboxRoute(params as APINamespaceParams),
        label: params.prefix
      },
      {
        label: params.name
      }
    ]);
    return breadcrumbs;
  }

  static override id(versionID: string, qname: string) {
    return `${versionID}/${qname}`;
  }

  override get infoItems(): InfoItem[] {
    let items: InfoItem[] = [];

    Entity.addInfoItem(items, "QName", this.qname);
    Entity.addInfoItem(items, "Definition", this.definition);
    Entity.addInfoItem(items, "Terms", this.terms?.join(", "));

    if (this.isDeprecated) {
      Entity.addInfoItem(items, "Deprecated?", this.isDeprecated + "");
    }

    return items;
  }

  static override params(component: APIProperty | APIType | string): APIComponentParams {
    if (typeof component == "string") {
      let [stewardKey, modelKey, versionNumber, qname] = component.split("/");
      return {
        stewardKey,
        modelKey,
        versionNumber,
        qname
      }
    }
    return {
      stewardKey: component.steward.stewardKey,
      modelKey: component.model.modelKey,
      versionNumber: component.version.versionNumber,
      qname: component.qname
    }
  }

  static override sort(a: Component, b: Component): number {
    if (!a.qname || !b.qname) return 0;
    return a.qname.localeCompare(b.qname);
  }

  static override toolboxRoute(params: APIComponentParams) {
    return Version.toolboxRoute(params) + "/" + params.qname;
  }

  static terms(qname: string) {
    return qname

      // Replace dashes and underscores with spaces
      .replaceAll("_", " ")
      .replaceAll("-", " ")

      // Add a space after any non-digit that precedes a digit
      .replace(/(\D+)(\d+)/g, "$1 $2")

      // Add a space before an upper case letter following a lower case letter
      .replace(/([a-z]+)([A-Z]+)/g, " ")

      .split(" ");
  }

}
