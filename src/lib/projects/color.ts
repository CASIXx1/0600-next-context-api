export function getProjectDisplayColor(value: string) {
  if (value.toLowerCase() === "#00008c60") {
    return "rgba(0, 0, 140, 0.6)";
  }

  return value;
}
