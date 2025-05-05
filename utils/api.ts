import type { SelectMenuItem } from "@nuxt/ui";
import FileSaver from "file-saver";

export type APIMediaType = "json" | "xml" | "csv";

type ItemType = SelectMenuItem & {
  value: APIMediaType;
}

type StateType = { [key: string]: any };

export class API {

  static readonly routes = {
    baseUrl: Config.baseURL,
    transform: Config.baseURL + "transforms/models",
    migrate: Config.baseURL + "migration/cmf",
    validate_xsd: Config.baseURL + "validation/schemas/xml",
    validate_ndr: Config.baseURL + "validation/schemas/ndr",
    validate_cmf: Config.baseURL + "validation/cmf/xml",
    validate_xml: Config.baseURL + "validation/instances/xml",
    validate_xml_catalog: Config.baseURL + "validation/xml-catalog",
    validate_message_catalog: Config.baseURL + "validation/message-catalog",
    search_properties: Config.baseURL + "search/properties",
    search_types: Config.baseURL + "search/types"
  }

  static readonly PAGINATION_LIMIT = 100;

  /**
   * Pre: Loads the form body from the given state and updates results to pending.
   * Request: Sends a post request to the given route.
   * Post: Updates results with basic status information about the response
   * (can be overwritten) and the elapsed time of the request.
   */
  static async post(route: string, state: StateType, results: APITypes.Results, loadSuccessMessage = true) {
    // Pre-request: Load body and set start time
    let body = ToolboxForm.formBody(state);
    API.updateResultsRequestSent(results);

    // Add media type to route if present in the state object
    let updatedRoute = route;
    if (state.mediaType) {
      updatedRoute += API.mediaTypeQueryString(state.mediaType);
    }

    // Request
    let response = await fetch(updatedRoute, {
      body,
      method: "post"
    });

    // Log basic information about the response
    if (loadSuccessMessage && response.ok) {
      // Success message
      results.status = "success";
      results.error = undefined;
      results.title = "";
    }
    else if (!response.ok) {
      // Error message
      results.status = "error";
      results.error = await response.json() || await response.text();
      results.title = `ERROR ${results.error?.status}: ${results.error?.error}`;
      results.message = results.error?.message.replaceAll(";", "\n\n") || "";
      console.error("Request failed");
    }

    // Log runtime and request status
    results.time = API.computeTimeInSeconds(results.start as number);
    results.request = "returned";

    return response;

  }

  private static downloadFile(blob: Blob, filename: string) {
    FileSaver.saveAs(blob, filename);
  }

  static async downloadFileResults(response: Response, results: APITypes.Results) {
    if (!response.ok) return;

    if (!results.filename) {
      // Set the filename from the response header
      const header = response.headers.get("Content-Disposition");
      results.filename = header?.split("=")[1] || "results";
    }

    const data = await response.blob();
    API.downloadFile(data, results.filename);
    results.message = `Downloaded ${results.filename}`;
  }

  static async downloadReportResults(mediaType: APIMediaType, response: Response, results: APITypes.Results) {
    let blob: Blob;

    if (!results.filename) {
      // Default in case filename has not already been set
      results.filename = "validation-report." + mediaType ;
    }

    if (mediaType == "json") {
      results.report = await response.json() as APITypes.Report;
      const text = JSON.stringify(results.report, null, 2);
      blob = new Blob([text], { type: "application/json" });
    }
    else if (mediaType == "csv") {
      const text = await response.text();
      blob = new Blob([text], { type: "text/csv" });
      // TODO: Load CSV report
    }
    else {
      console.warn("Media type not supported.  Could not save file.");
      return;
    }

    results.status = API.reportColor(results.report);
    results.message = `Downloaded ${results.filename}.`;

    API.downloadFile(blob, results.filename);

  }

  /**
   * @param start - Send earlier recorded value from Date.now()
   */
  private static computeTimeInSeconds(start: number) {
    let end = Date.now();
    return ((end - start) / 1000).toFixed(2);
  }

  private static readonly allMediaTypeItems: ItemType[] = [
    {
      value: "json",
      label: "JSON",
      icon: icons.json
    },
    {
      value: "csv",
      label: "CSV",
      icon: icons.csv
    },
    {
      value: "xml",
      label: "XML",
      icon: icons.xml
    }
  ]

  static readonly reportMediaTypes = API.allMediaTypeItems.filter(item => ["json", "csv"].includes(item.value));

  static readonly dataMediaTypes = API.allMediaTypeItems.filter(item => ["json", "xml"].includes(item.value));

  static mediaTypeIcon(value: APIMediaType | undefined) {
    return API.allMediaTypeItems.find(item => item.value == value)?.icon;
  }

  /**
   * Returns "?mediaType=" and the given value if not "json" (default).
   */
  static mediaTypeQueryString(mediaType: APIMediaType | undefined) {
    return mediaType == "json" || mediaType == undefined ? "" : `?mediaType=${mediaType}`;
  }

  static statusColor(status: APITypes.ResultSeverityCode | APITypes.ResultStatusCode) {
    switch (status) {
      case "error": return "error";
      case "warning": return "warning";
      case 'passed': return "success";
      case "info": return "info";
    }
  }

  static statusIcon(status: APITypes.ResultSeverityCode | APITypes.ResultStatusCode) {
    switch (status) {
      case "error": return icons.error;
      case "warning": return icons.warning;
      case "passed": return icons.success;
      case "info": return icons.info;
    }
  }

  /**
   * Returns success, warning, error color classes based on whether or not
   * the report contains errors or warnings. Informational items are not included.
   */
  static reportColor(report: APITypes.Report | undefined) {
    if (!report) return "info";
    if (report.errors) return "error";
    if (report.warnings) return "warning";
    return "success";
  }

  /**
   * Returns an overall status label based on whether or not the report contains
   * errors or warnings.
   */
  static reportStatus(report: APITypes.Report | undefined) {
    if (!report) return undefined;
    if (report.errors) return "errors";
    if (report.warnings) return "warnings";
    return "passed";
  }

  /**
   * Returns an overall status label based on whether any of the results in any
   * of the given tests has errors or warnings.
   */
  static testsStatus(tests: APITypes.Test[]): APITypes.ResultStatusCode {
    let results = tests.flatMap(test => test.results);
    let statuses = results.map(result => result.status);
    if (statuses.includes("error")) return "error";
    if (statuses.includes("warning")) return "warning";
    return "passed";
  }

  /**
   * Returns an overall status label based on whether any of the given results
   * has errors or warnings.
   */
  static resultsStatus(results: APITypes.TestResult[]): APITypes.ResultStatusCode {
    let statuses = results.map(result => result.status);
    if (statuses.includes("error")) return "error";
    if (statuses.includes("warning")) return "warning";
    return "passed";
  }

  /**
   * Initializes a new set of reactive results as request unsent and status undefined.
   */
  static initResults(): APITypes.Results {
    return reactive({
      request: "unsent",
      status: "pending"
    });
  }

  static updateResultsRequestSent(results: APITypes.Results) {
    results.start = Date.now();
    results.request = "pending";
    results.status = "pending";
    results.message = "Request sent...";
  }

}
