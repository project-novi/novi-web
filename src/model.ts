export interface IRawPartialNoviObject {
  id: string;
  tags: Record<string, string | null>;

  inserted?: number;
}

export interface IRawNoviObject extends IRawPartialNoviObject {
  created: string;
  updated: string;
  creator: string | null;
}
