import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"iddaa-mcp","description":"","frontmatter":{"layout":"home","title":"iddaa-mcp","tagline":"Instant Match Intelligence for MCP workflows","hero":{"name":"iddaa-mcp","text":"Instant Match Intelligence","tagline":"Real-time iddaa sportsbook data for LLM and AI workflows.","actions":[{"theme":"brand","text":"Get Started","link":"/guide/getting-started"},{"theme":"alt","text":"GitHub","link":"https://github.com/borakilicoglu/iddaa-mcp"}]},"features":[{"title":"Ready-to-use Tools","details":"get_competitions, get_events, get_detailed_events, and get_highlighted_events."},{"title":"Multiple Transports","details":"Run with stdio (default), streamable HTTP, or deprecated SSE."},{"title":"Built for MCP Clients","details":"Works with Cursor and other MCP-compatible clients."}]},"headers":[],"relativePath":"index.md","filePath":"index.md"}');
const _sfc_main = { name: "index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
