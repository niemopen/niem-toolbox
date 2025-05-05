import { Component } from "./Component";
import { Entity, type EntityTypeCode } from "./Entity";
import { Type } from "./Type";
import { Version } from "./Version";

export type PropertyBaseCategory = "object" | "data" | "abstract" | "attribute" | "value";

export type PropertyDataPattern = "text" | "number" | "id" | "date" | "value";

export type PropertyObjectPattern = "object" | "association" | "adapter" | "augmentation";

export type PropertyPattern = PropertyDataPattern | PropertyObjectPattern;


export class Property extends Component {

  override "@type": EntityTypeCode = "Property";
  override category?: APIPropertyCategory = undefined;
  alias?: string;
  keywords?: string;
  exampleContent?: string;
  usageInfo?: string;
  type?: APITypeRef;
  group?: APIPropertyRef;

  static readonly PROPERTY_DATA_REPRESENTATION_TERMS = ["Amount", "BinaryObject", "Graphic", "Picture", "Sound", "Video", "Code", "DateTime", "Date", "Time", "Duration", "ID", "URI", "Indicator", "Measure", "Numeric", "Value", "Rate", "Percent", "Quantity", "Text", "Name", "List"];

  override get badgeColor(): ColorType {
    return Property.badgeColor(this.category);
  }

  override get badgeLabel(): PropertyBaseCategory | undefined {
    return Property.badgeLabel(this.category, this.type?.category);
  }

  override get badgeVariant(): ColorVariantType {
    return Property.badgeVariant(this.category);
  }

  override get icon() {
    return icons.property;
  }

  override get infoItems() {
    let items = super.infoItems;

    let trailingItems = items.slice(2);
    items = items.slice(0, 2);

    let typeParams = this.params;
    typeParams.qname = this.type?.qname || "";

    Entity.addInfoItem(items, "Type", this.type?.qname, "route", Type.toolboxRoute(typeParams));

    Entity.addInfoItem(items, "Category", this.badgeLabel, undefined, undefined, Property.badgeColor(this.category), Property.badgeVariant(this.category));

    Entity.addInfoItem(items, "Group", this.group?.qname);

    Entity.addInfoItem(items, "Alias", this.alias);
    Entity.addInfoItem(items, "Keywords", this.keywords);
    Entity.addInfoItem(items, "Example content", this.exampleContent);
    Entity.addInfoItem(items, "Usage info", this.usageInfo);

    return [...items, ...trailingItems];
  }

  override get page() {
    return AppItems.property;
  }

  override get tabsItems(): ToolboxTabsItem[] {
    return [
      {
        icon: icons.childProperty,
        label: "Contents",
        slot: "contents",
        count: this.contentsCount
      },
      {
        icon: icons.checklist,
        label: "Usages",
        slot: "usages",
        count: this.usagesCount
      }
    ];
  }

  static override apiRoute(params: APINamespaceParams | APIComponentParams) {
    let route = Version.apiRoute(params);
    if ("qname" in params) {
      route += `/properties/${ params.qname }`;
    }
    else {
      route += `/namespaces/${ params.prefix }/properties`;
    }
    return route;
  }

  static override badgeColor(category: APIPropertyCategory | undefined): ColorType {
    if (category == "attribute") return "warning";
    return category == "abstract_element" ? "neutral" : "primary";
  }

  static override badgeVariant(category: APIPropertyCategory | undefined): ColorVariantType {
    let label = Property.badgeLabel(category);
    return label == "object" ? "solid" : "subtle";
  }

  static override init() {
    return new Property();
  }

  static badgeLabel(category: APIPropertyCategory | undefined, typeCategory?: APITypeCategory): PropertyBaseCategory | undefined {
    switch (category) {
      case "abstract_element": return "abstract";

      case "attribute": return "attribute";

      case "element":
        if (!typeCategory) return undefined;

        return typeCategory == "complex_object" ? "object" : "value";
    }
  }

}
