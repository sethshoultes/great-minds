import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are generating a changelog entry for a developer's project history.
Read the git diff and commit message below. Write exactly one sentence
in plain English that describes what changed and, if the commit message
explains why, include the reason.

Rules:
- Start with a verb.
- Never start with "This commit" or "This change."
- Use specific names from the code when they add clarity.
- Never invent behavior that isn't in the diff.
- If the commit message is unhelpful (e.g., "fix", "wip", "stuff"),
  rely entirely on the diff and do not echo the commit message.
- If the diff only adds or removes test files, say so explicitly.
- If the diff is a dependency update (lockfile, package.json version bump),
  say so briefly.
- Keep it under 20 words when possible.`;

const MAX_DIFF_LINES = 500;

/**
 * Truncates a diff to a maximum number of lines and appends a marker if truncated
 * @param {string} diff - The git diff string
 * @param {number} maxLines - Maximum number of lines to keep
 * @returns {string} The truncated diff with optional truncation marker
 */
export function truncateDiff(diff, maxLines = MAX_DIFF_LINES) {
  const lines = diff.split('\n');

  if (lines.length <= maxLines) {
    return diff;
  }

  const truncated = lines.slice(0, maxLines).join('\n');
  const marker = `\n[DIFF TRUNCATED — showing first ${maxLines} of ${lines.length} lines]`;
  return truncated + marker;
}

/**
 * Summarizes a git diff and commit message using Claude API
 * @param {Object} params - Parameters object
 * @param {string} params.diff - The git diff string
 * @param {string} params.commitMessage - The commit message
 * @param {Object} params.config - Configuration object with model property
 * @param {string} params.config.model - The Claude model to use (e.g., 'claude-3-5-sonnet-20241022')
 * @returns {Promise<string>} The generated summary
 * @throws {Error} If the API call fails
 */
export async function summarize({ diff, commitMessage, config }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set');
  }

  const client = new Anthropic({
    apiKey,
  });

  const truncatedDiff = truncateDiff(diff, MAX_DIFF_LINES);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 30 * 1000); // 30 second timeout

  try {
    const response = await client.messages.create(
      {
        model: config.model,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Commit message: ${commitMessage}\n\nDiff:\n${truncatedDiff}`,
          },
        ],
        max_tokens: 150,
      },
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    return response.content[0].text;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw new Error('API call timed out after 30 seconds');
    }

    throw new Error(`Failed to summarize diff: ${error.message}`);
  }
}

export { SYSTEM_PROMPT, MAX_DIFF_LINES };
