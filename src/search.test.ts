import assert from "node:assert/strict";
import { SearchRequest } from "./nonprofit_search.js";

const parsed = SearchRequest.parse({ query: "receipt for donor", limit: 1 });
assert.equal(parsed.limit, 1);
assert.throws(() => SearchRequest.parse({ query: "x", limit: 20 }));
console.log("search boundary test passed");
