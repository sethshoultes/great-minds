import { promises as fs } from 'fs';
import path from 'path';

/**
 * Default configuration values.
 * Only 3 fields per locked decisions: model, ignore, attribution.
 */
const DEFAULT_CONFIG = {
  model: 'claude-haiku-4-5-20251001',
  ignore: [],
  attribution: true,
};

/**
 * Load configuration from .narraterc.json if it exists, otherwise use defaults.
 * Merges defaults with file values (file values override defaults).
 * Handles malformed JSON gracefully.
 *
 * @param {string} repoRoot - The root directory to search for .narraterc.json
 * @returns {Promise<object>} Configuration object
 */
export async function loadConfig(repoRoot) {
  const configPath = path.join(repoRoot, '.narraterc.json');

  let fileConfig = {};
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    fileConfig = JSON.parse(fileContent);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error(
        `  Warning: .narraterc.json is malformed. Using defaults.`
      );
    }
  }

  // Only allow known fields
  const config = {
    model: fileConfig.model || DEFAULT_CONFIG.model,
    ignore: Array.isArray(fileConfig.ignore) ? fileConfig.ignore : DEFAULT_CONFIG.ignore,
    attribution: typeof fileConfig.attribution === 'boolean' ? fileConfig.attribution : DEFAULT_CONFIG.attribution,
  };

  return config;
}

/**
 * Get the Anthropic API key from environment variables.
 * No config file storage for secrets.
 *
 * @returns {string|null} API key or null if not found
 */
export function getApiKey() {
  return process.env.ANTHROPIC_API_KEY || null;
}
