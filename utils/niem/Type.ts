import { Component } from "./Component";
import { Entity, type EntityTypeCode } from "./Entity";
import { Version } from "./Version";

export type TypeBaseCategory = "class" | "value" | "datatype";

export type ClassPattern = "class" | "association" | "augmentation" | "adapter";

export type DatatypePattern = "atomic" | "list" | "union";

export type TypePattern = ClassPattern | DatatypePattern | "literal object";

export class Type extends Component {

  override "@type": EntityTypeCode = "Type";
  override category?: APITypeCategory = undefined;
  derivation?: APITypeDerivation;
  pattern?: APITypePattern;
  isSimple?: boolean;
  isComplexContent?: boolean;
  isSimpleContent?: boolean;
  base?: APITypeRef | null;

  override get badgeColor(): ColorType {
    return Type.badgeColor(this.category);
  }

  override get badgeLabel(): TypeBaseCategory | undefined {
    return Type.badgeLabel(this.category);
  }

  override get badgeVariant(): ColorVariantType {
    return Type.badgeVariant(this.category);
  }

  override get icon() {
    if (this.category == "complex_value" || this.category == "simple_value") {
      return icons.datatype;
    }
    return icons.class;
  }

  override get infoItems() {
    let items = super.infoItems;

    let trailingItems = items.slice(2);
    items = items.slice(0, 2);

    if (this.base?.qname) {
      let baseParams = this.params;
      baseParams.qname = this.base.qname;
      Entity.addInfoItem(items, "Base", this.base?.qname, "route", Type.toolboxRoute(baseParams));
    }

    Entity.addInfoItem(items, "Category", this.badgeLabel, undefined, undefined, this.badgeColor, this.badgeVariant);

    Entity.addInfoItem(items, "Derivation", this.derivation);
    Entity.addInfoItem(items, "Pattern", this.pattern);

    return [...items, ...trailingItems];
  }

  override get page() {
    return AppItems.type;
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
      route += `/types/${params.qname}`;
    }
    else {
      route += `/namespaces/${params.prefix}/types`;
    }
    return route;
  }

  static override badgeColor(category: APITypeCategory): ColorType {
    return category == "simple_value" ? "neutral" : "primary";
  }

  static override badgeVariant(category: APITypeCategory): ColorVariantType {
    return category == "complex_object" ? "solid" : "subtle";
  }

  static badgeLabel(category: APITypeCategory): TypeBaseCategory | undefined {
    switch (category) {
      case "complex_object": return "class";
      case "complex_value": return "value";
      case "simple_value": return "datatype";
    }
  }

  static override init() {
    return new Type();
  }

}
