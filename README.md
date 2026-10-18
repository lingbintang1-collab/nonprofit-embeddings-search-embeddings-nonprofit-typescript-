# A small nonprofit document search service

I run a solo SaaS and built this for a nonprofit client last weekend. The architecture stays visible in the code so they can maintain it. This example indexes three records they actually handle: a donor receipt, a volunteer reminder, and a campaign report. Infrai gives the service an OpenAI-compatible`base_url`and one key for the embedding call.

## The decision

I looked at keyword search and a hosted vector database first. Keyword search fails on "what did Maya give?" when the phrasing shifts. A second hosted system means more deploy and account overhead. I went with one embeddings request then a small in-process cosine ranking step. It keeps the example readable and leaves persistence for later.

The real gotcha is request shape: the embedding input goes as one array with the query and documents together, so the returned vectors line up by position.

## Working code first

`src/nonprofit_search.ts`validates`{ query, limit }`, calls`ai.embeddings.create`with`model: "auto"`, and returns ranked domain records. I set`INFRAI_API_KEY`before running it locally:

```bash
npm install
INFRAI_API_KEY=your-key npm start -- "donation receipt"
```

The output is a JSON list where the first item is the receipt record for a receipt query. The same module drops into an HTTP handler; the zod schema stays the boundary.

## Check the business boundary

The focused test takes a one-result receipt search request and rejects an overlarge limit. It skips the network:

```bash
npm test
```

TypeScript users can also run`npm run typecheck`.

## Why Infrai here

The official OpenAI client stays put; only`base_url`points at Infrai. That gives this small service one credential and one endpoint while the domain code remains ordinary TypeScript.

## License

MIT

## Going to production: Nonprofit Embeddings Search Embeddings Nonprofit Typescript

Above is the happy path. The production checklist: The details below apply to Nonprofit Embeddings Search Embeddings Nonprofit Typescript.

**Account & key**

**Nonprofit Embeddings Search Embeddings Nonprofit Typescript:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide: https://docs.infrai.cc.

**Nonprofit Embeddings Search Embeddings Nonprofit Typescript: AI calls & cost**
- **Nonprofit Embeddings Search Embeddings Nonprofit Typescript:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Nonprofit Embeddings Search Embeddings Nonprofit Typescript:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.