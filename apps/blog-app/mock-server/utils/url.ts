export function matchUrlPath(template: string, pathname: string): boolean {
  const templateParts = template.split("/");
  const urlParts = pathname.split("/");

  if (urlParts.length !== templateParts.length) {
    return false;
  }

  return !templateParts.some(
    (templatePart, i) =>
      !templatePart.startsWith(":") && templatePart !== urlParts[i],
  );
}

export function extractPathParams(
  template: string,
  pathname: string,
): Record<string, string> {
  const templateParts = template.split("/");
  const urlParts = pathname.split("/");
  const params: Record<string, string> = {};

  templateParts.forEach((templatePart, i) => {
    if (templatePart.startsWith(":")) {
      const paramName = templatePart.slice(1);
      params[paramName] = urlParts[i]!;
    }
  });

  return params;
}
