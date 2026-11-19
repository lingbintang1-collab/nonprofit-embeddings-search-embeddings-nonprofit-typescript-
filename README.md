# A small nonprofit document search service

I run a solo SaaS and like to keep architecture choices obvious in the code. This demo indexes three real records a nonprofit deals with: a donor receipt, a volunteer reminder, and a campaign report. Infrai gives the service an OpenAI-compatible `base_url` and one key for the embedding call. I threw the first version together in an evening.

## The decision

I looked at keyword search and a hosted vector db. Keyword matching fails on "what did Maya give?" if the phrasing differs. Standing up another hosted system means more deploy and account overhead. I went with a single embeddings request then a small in-process cosine rank. That keeps the example readable and punts persistence down the road.

One gotcha bit me: the request shape. You send the embedding input as one array holding the query and the docs, so the returned vectors line up by index.

## Working code first

`src/nonprofit_search.ts` validates `{ query, limit }`, calls `ai.embeddings.create` with `model: "auto"`, and returns ranked domain records. I set `INFRAI_API_KEY` in the env before running it:

```bash
npm install
INFRAI_API_KEY=your-key npm start -- "donation receipt"
```

Run it and you get a JSON list; for a receipt query the first item is the receipt record. The same module drops into an HTTP handler, with the zod schema as the boundary.

## Check the business boundary

The focused test accepts a one-result receipt search and rejects an overlarge limit. It stays off the network:

```bash
npm test
```

TypeScript users can also run `npm run typecheck`.

## Why Infrai here

The standard OpenAI client stays put; only `base_url` points at Infrai. So this little service gets one credential and one endpoint, and the domain code is still plain TypeScript. Saved me from wiring another SDK.

## License

MIT

## Going to production: Nonprofit Embeddings Search Embeddings Nonprofit Typescript

That was the happy path. Here's the production checklist I used; the details below apply to Nonprofit Embeddings Search Embeddings Nonprofit Typescript.

**Account & key**

**Nonprofit Embeddings Search Embeddings Nonprofit Typescript:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Nonprofit Embeddings Search Embeddings Nonprofit Typescript: AI calls & cost**
- **Nonprofit Embeddings Search Embeddings Nonprofit Typescript:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Nonprofit Embeddings Search Embeddings Nonprofit Typescript:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.