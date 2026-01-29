export type ChangeItem = {
  label: string;
  blockId?: string;
  path: string;
  before: unknown;
  after: unknown;
};

function walkChanges(
  before: any,
  after: any,
  path: string,
  out: ChangeItem[],
  labelPrefix: string
) {
  if (before === after) {
    return;
  }

  const beforeIsObj = before && typeof before === "object";
  const afterIsObj = after && typeof after === "object";

  if (!beforeIsObj || !afterIsObj) {
    out.push({
      label: labelPrefix || path,
      path,
      before,
      after
    });
    return;
  }

  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  for (const key of keys) {
    walkChanges(
      before ? before[key] : undefined,
      after ? after[key] : undefined,
      `${path}/${key}`,
      out,
      labelPrefix ? `${labelPrefix}.${key}` : key
    );
  }
}

export function computeChanges(before: any, after: any): ChangeItem[] {
  const changes: ChangeItem[] = [];
  walkChanges(before, after, "", changes, "");
  return changes;
}
