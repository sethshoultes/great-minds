# Board Review #13 — Jensen Huang
**Date:** 2026-03-31
**Reviewer:** Jensen Huang, Board Member

---

## Status Check

Sites consolidated. Demo businesses live. Stripe running in test mode. Honesty pass done. 258 src files. The product is coherent and getting real.

Inference logging from #12 is now being worked on. Good.

---

## One Recommendation: Instrument the AI Calls You Already Have Infrastructure For

`src/lib/telemetry.ts` is fully wired — OpenTelemetry tracer, `recordDuration`, `startSpan`, OTLP exporter for production. It is sitting there, unused, while every `generate()`, `generateSocialPost()`, and `generateReviewResponse()` call in `content/generate/route.ts` runs naked. No span. No duration. No model attribute.

You built the instrument panel. You just never plugged in the gauges.

This is one afternoon of work: wrap each AI service call with `startSpan('ai.inference', { model, type })`, call `recordDuration` on exit, set `SpanStatusCode.ERROR` on failure. Four callsites in one route. Repeat for `seo/audit`, `campaigns/suggested`, wherever else `generate()` appears.

At NVIDIA we say: the GPU is only as useful as the telemetry that tells you whether it's being used. Same principle. You have 258 files and Stripe charging $29/$79/mo. The moment a slow model call starts blocking checkout writes, you will want that data. You don't have to build the dashboard today — just emit the spans. The data will be there when you need it.

---

## Fixes Acknowledged

- Jensen #8: Inference logging — in progress. Ship it.

---

*Jensen Huang — Board Review #13 of 13*
