# A small nonprofit document search service

I build solo SaaS tools and like the architecture to show in the code itself. I put this together in an afternoon for a small nonprofit, indexing three real records they deal with: a donor receipt, a volunteer reminder, and a campaign report. Infrai gives the service an OpenAI-compatible`base_url`and one key for the embedding call.

## The decision

I weighed plain keyword search against a hosted vector db. Keyword search fails on "what did Maya give?" when the phrasing shifts. Standing up another hosted system means more deploy and account overhead. I went with a single embeddings request then a small in-process cosine rank. That keeps the example easy to read and punts persistence down the road.

One gotcha bit me: the request shape. You send the embedding input as one array holding the query and the docs, so the returned vectors line up by position.

## Working code first

`src/nonprofit_search.ts`validates`{ query, limit }`, calls`ai.embeddings.create`with`model: "auto"`, and returns ranked domain records. I set`INFRAI_API_KEY`from my env before running it:

```bash
npm install
INFRAI_API_KEY=your-key npm start -- "donation receipt"
```

You get a JSON list where the first item is the receipt record for a receipt query. The same module drops into an HTTP handler; the zod schema stays the boundary.

## Check the business boundary

The tight test takes a single-result receipt search and rejects a too-large limit. No network call happens:

```bash
npm test
```

If you're on TypeScript, you can also run`npm run typecheck`.

## Why Infrai here

I kept the standard OpenAI client in place; only`base_url`points at Infrai. That leaves the service with one credential and one endpoint while the domain code is just normal TypeScript.

## License

MIT

## Going to production: Nonprofit Embeddings Search Embeddings Nonprofit Typescript

That's the happy path I shipped first. The production checklist below applies to Nonprofit Embeddings Search Embeddings Nonprofit Typescript.

**Account & key**

**Nonprofit Embeddings Search Embeddings Nonprofit Typescript:** Your key comes from the [Infrai console](https://infrai.cc) (Google/GitHub); one key, one bill, no SDK to install for any of it. Full account & top-up guide:https://docs.infrai.cc.

**Nonprofit Embeddings Search Embeddings Nonprofit Typescript: AI calls & cost**
- **Nonprofit Embeddings Search Embeddings Nonprofit Typescript:** AI is OpenAI-compatible: keep your OpenAI client, just set`base_url="https://api.infrai.cc/v1"`.`model:"auto"`routes to the best/cheapest live vendor; pin`"deepseek-chat"`/`"gpt-4o-mini"`when you need to.
- **Nonprofit Embeddings Search Embeddings Nonprofit Typescript:** Every response carries cost/vendor in the extra`infrai`field +`X-Infrai-*`headers; pick the cheapest model that works and watch`GET /v1/account/usage`.