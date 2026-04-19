export async function onRequestPost({ request, env }) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: "ANTHROPIC_API_KEY not configured" }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  const { messages, system, model, max_tokens } = body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return json({ error: "messages required" }, 400);
  }

  const payload = {
    model: model || "claude-sonnet-4-5",
    max_tokens: Math.min(Math.max(max_tokens || 1024, 64), 4096),
    messages,
  };
  if (system) payload.system = system;

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return json({ error: "upstream", status: upstream.status, detail: text }, 502);
  }

  const data = await upstream.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  return json({ text, stop_reason: data.stop_reason, usage: data.usage });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type",
    },
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
    },
  });
}
