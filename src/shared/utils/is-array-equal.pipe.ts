// utils/compare.ts
export const areArraysEqualById = <T extends { id?: string | undefined }>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) return false;
  const aIds = a.map(item => item.id).sort();
  const bIds = b.map(item => item.id).sort();
  return aIds.every((id, i) => id === bIds[i]);
};
