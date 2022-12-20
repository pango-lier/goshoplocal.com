export const enumToFormatSelectOptions = (_enum: any) => {
  let map: { value: string | number; label: string }[] = [];
  for (var n in _enum) {
    map.push({ value: _enum[n], label: n });
  }
  return map;
};

export const enumToFormatSelected = (_enum: any, value: any) => {
  for (var n in _enum) {
    if (n === value) return { value: _enum[n], label: n };
  }
  return undefined;
};
