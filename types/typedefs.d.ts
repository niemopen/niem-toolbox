import type { AccordionItem, BreadcrumbItem, LinkProps, SelectItem, TabsItem } from "@nuxt/ui";
import type { Subproperty } from "~/utils/niem/Subproperty";
import type { InfoItem } from "~/utils/niem/Entity";
import type { Type } from "~/utils/niem/Type";

declare global {

  type IconKeyType = keyof typeof icons;
  type IconType = typeof icons[IconKeyType];

  type AppLinkType = LinkProps & {
    // TODO: Unresolved link value types
    value?: "brand" | "home" | ToolType | SiteSettingsType | ReferenceType,
    label?: string,
    description?: string,
    icon?: IconType,
    labelClasses?: string
  }

  type DemoFileItemType = SelectItem & {
    from?: FromType,
    path?: string
  }

  type ColorType = "success" | "error" | "warning" | "info" | "neutral" | "primary" | "secondary";

  type ColorVariantType = "solid" | "outline" | "soft" | "subtle";

  type HistoryState = {
    back: string,
    current: string,
    forward: string | null,
    position: number,
    replaced: boolean,
    scroll: boolean
  }

  type InfoItemFormat = "link" | "email" | "route";

  type InfoItem = {
    field: string,
    value: string,
    format?: InfoItemFormat,
    link?: string,
    badgeColor?: ColorType,
    badgeVariant?: ColorVariantType
  }

  type ContentsAsType = "page" | "list-item" | "tree";

  type ToolboxTabsItem = TabsItem & {
    count?: number,
    more?: boolean
  }

  type ContentsCategory = "children" | "inherited" | "augmentation" | "substitutions" | "value" | "list" | "union";

  type ContentsItem = AccordionItem & {
    type: Type,
    subproperties: Subproperty[],
    category: ContentsCategory,
    path: APIComponentRef[]
  }

}

export {}
