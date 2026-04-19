// Proxies window.claude.complete(...) -> /api/chat (Cloudflare Pages Function)
window.claude = {
  async complete({ messages, system, model, max_tokens }) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages, system, model, max_tokens }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`chat failed ${res.status}: ${detail}`);
    }
    const data = await res.json();
    return data.text || "";
  },
};
