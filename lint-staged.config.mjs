const biome = "biome check --write";

function notMcpConfig(f) {
  return !f.endsWith("/.mcp.json") && !f.endsWith("/.cursor/mcp.json");
}

/** @satisfies {import("lint-staged").Configuration} */
export default {
  "*.{ts,tsx,js,jsx,mts,cts,json,jsonc,css,md}": (files) => {
    const list = files.filter(notMcpConfig);
    return list.length ? [`${biome} ${list.join(" ")}`] : [];
  },
  "*.{ts,tsx,js,jsx,mts,cts}": "oxlint --config .oxlintrc.json",
};
