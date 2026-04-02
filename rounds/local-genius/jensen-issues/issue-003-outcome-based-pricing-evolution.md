## Idea: Plan the Pricing Evolution to Outcome-Based Model Before Month 12

**Spotted during**: Board Review #001 — Jensen Huang (2026-04-01)

**The insight**:

The $29/month entry price is the right tactical decision for the 90-day Austin launch. It removes price as an objection. It puts LocalGenius in the consideration set for restaurant owners who have already been burned by expensive tools that didn't deliver. I support it for the launch phase.

It is the wrong long-term pricing model.

Here is the problem: $29/month is what Maria pays for Wix. Wix gives her a website that she has to manage herself. LocalGenius gives her a website, social media, review management, SEO optimization, and a weekly intelligence report — and does all of it automatically. The value delivered is not in the same category. But the price anchors her expectations in the same category.

More importantly: LocalGenius will eventually have the attribution data to prove exactly how much revenue it generated for Maria. The market-fit document targets a "lead attribution" feature — "You got 7 calls from Google this week, 3 mentioned your website" — as a key retention driver. When that feature is live and Maria can see that LocalGenius generated $3,000 in traceable revenue last month, she is not thinking about her $29 subscription. She is thinking about what it would cost to replace the results.

At that moment, you are undercharging by a factor of 10. And more dangerously, you have trained her to think of you as a $29/month tool, which makes any price increase feel like betrayal rather than fair value exchange.

**The comparable precedents**:

- Toast moved from flat SaaS fees to a model that includes payment processing revenue and a percentage of online ordering revenue. Their revenue per restaurant location grew 3-4x without changing the number of restaurants.
- Housecall Pro added a "Instapay" feature that earns a percentage of jobs booked through the platform. Jobs booked through LocalGenius-generated leads are a natural analog.
- Yext's "Listings" product started as a flat subscription and evolved toward charging based on the number of listing locations and the traffic those listings generated.

None of these companies raised prices. They added pricing dimensions that captured a fraction of the value they created.

**The right pricing architecture for LocalGenius at scale**:

| Tier | Current Model | Evolved Model (Target: Month 9-12) |
|------|--------------|-------------------------------------|
| Base | $29/month flat | $29/month base + $0.50 per attributable lead (call, booking, direction click) after first 10 leads |
| Pro | $79/month flat | $79/month base + $0.25 per attributable lead (lower per-lead rate, higher base) |
| Enterprise / Franchise | Not yet priced | Per-location base fee + revenue sharing on measurable outcomes |

This model does three things:
1. Keeps the entry price low for acquisition (Maria still sees $29/month when she signs up)
2. Creates a natural upgrade path that is initiated by the owner's own success, not by a sales call
3. Aligns LocalGenius's revenue with LocalGenius's value — if the product does not generate leads, it does not earn the variable component

**Suggested action**:

Do not implement outcome-based pricing in month one. Do the following:

1. In months 1-3: collect attribution data religiously. Build the lead tracking infrastructure (the tracking phone number, the booking integration, the call attribution) as a primary product feature, not an analytics afterthought. Every attributable outcome should be logged with timestamp, source, and estimated revenue value.

2. In months 4-6: analyze the attribution data. What is the average attributable lead count per restaurant per month? What is the average value of those leads? This determines whether the $0.50/lead model creates a compelling upsell or a frightening overage.

3. In month 9: model the pricing evolution. What would the average user's bill be under the new model? What is the distribution — what does the bottom quartile pay, what does the top quartile pay? Is the model defensible in a customer conversation?

4. In month 12: begin testing the outcome-based pricing with new customer signups only. Existing customers stay on flat pricing with an opt-in path to the new model (framed as the chance to "only pay for results").

**Risk**:

Outcome-based pricing requires attribution accuracy. If Maria sees a charge for a lead that did not actually result from LocalGenius's work, she churns and tells every restaurant owner she knows. The attribution model must be conservative — only claim credit for outcomes where the causal chain is clear. Under-claiming attribution and under-charging is safer than over-claiming and triggering a trust failure.

**Priority**: Medium

**Labels**: `board-idea`, `jensen-review`, `strategic`, `pricing`, `monetization`
