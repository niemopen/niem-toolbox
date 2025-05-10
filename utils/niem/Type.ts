import type { Reactive } from "vue";
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
      return Icons.datatype;
    }
    return Icons.class;
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

  override get tabsItems(): Reactive<ToolboxTabsItem[]> {
    return reactive([
      {
        icon: Icons.subproperty,
        label: "Contents",
        slot: "contents",
        count: this.contentsCount
      },
      {
        icon: Icons.checklist,
        label: "Usages",
        slot: "usages",
        count: this.usagesCount
      }
    ]);
  }

  static override apiRoute(params: APIVersionParams | APINamespaceParams | APIComponentParams) {
    let route = Version.apiRoute(params);
    if ("qname" in params) {
      // Type route
      route += `/types/${params.qname}`;
    }
    else if ("prefix" in params) {
      // Namespace types route
      route += `/namespaces/${params.prefix}/types`;
    }
    else {
      // Version types route
      route += "/types";
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

  static override fromAPI(apiData: APIType) {
    return Object.assign(new Type(), apiData) as Type;
  }

  static override fromAPIList(apiData: APIType[]) {
    return apiData.map(apiType => Type.fromAPI(apiType));
  }

  static override init() {
    return new Type();
  }

}
