const DEFAULT_FORMANT_API_URL = "https://api.formant.io";

interface IHasString {
  get(key: string): string | null;
  has(key: string): boolean;
}

export function whichFormantApiUrl(global: any, urlParams: IHasString) {
  if (urlParams.get("formant_stage")) {
    return "https://api-stage.formant.io";
  }

  if (urlParams.get("formant_dev")) {
    return "https://api-dev.formant.io";
  }

  if (urlParams.get("formant_local")) {
    return "https://api.formant.local";
  }

  if (urlParams.get("formant_url")) {
    const customUrl = urlParams.get("formant_url");
    if (customUrl !== null) {
      try {
        return new URL(customUrl).origin;
      } catch {
        console.warn(
          `Ignoring malformed \`formant_url\` url parameter: ${customUrl}`
        );
      }
    }
  }

  if (
    typeof global !== "undefined" &&
    "FORMANT_API_URL" in global &&
    typeof global.FORMANT_API_URL === "string"
  ) {
    return global.FORMANT_API_URL;
  }

  return DEFAULT_FORMANT_API_URL;
}