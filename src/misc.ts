export const RATINGS = [
  { value: 'g', name: '普通' },
  { value: 's', name: '敏感' },
  { value: 'q', name: '软色情' },
  { value: 'e', name: '露骨' }
];
export const RATING_MAP = RATINGS.reduce(
  (map, r) => ((map[r.value] = r.name), map),
  {} as Record<string, string>
);
