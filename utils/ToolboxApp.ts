import type { Entity } from "./niem/Entity";

export class ToolboxApp {

  static slugify(value: string) {
    // TODO: Match how API performs slugify
    return value.trim().toLowerCase().replaceAll(" ", "-");
  }

  static extension(filename: string | undefined) {
    // Special cases
    if (!filename) return undefined;

    // Default
    return filename?.split(".")?.pop();
  }

  /**
   * Returns a string of args joined by the given separator, with undefined, null,
   * and empty values removed.
   */
  static join(separator: string, ...args: any[]) {
    let values: string[] = args.filter(arg => arg != null && arg != undefined && arg != "");
    return values.join(separator);
  }

  static readonly PAGE_PANEL_NAMES = ["user", "developer", "preferences"];

  static labelCount(entities: Entity[] | undefined) {
    return entities ? ` (${ entities.length })` : "";
  }

  static readonly TYPE_PREFIXES = ["xs", "xsd", "niem-xs", "niem-xsd"];

}
