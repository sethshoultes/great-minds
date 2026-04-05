/**
 * Fallback summarizer - generates grammatical summaries from git diffs
 * when the API is unavailable or times out.
 */

const UNHELPFUL_MESSAGES = [
  'fix',
  'wip',
  'stuff',
  'update',
  'changes',
  'updates',
  'misc',
  'temp',
  'test',
];

/**
 * Extract changed files from a git diff.
 * Parses diff headers to identify file paths and their status.
 *
 * @param {string} diff - The git diff string
 * @returns {Array<{path: string, status: 'added'|'modified'|'deleted'|'renamed'}>}
 */
export function extractChangedFiles(diff) {
  const files = [];
  const lines = diff.split('\n');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Match diff header: "diff --git a/path b/path"
    if (line.startsWith('diff --git a/')) {
      const match = line.match(/^diff --git a\/(.+) b\/(.+)$/);
      if (!match) {
        i++;
        continue;
      }

      const pathA = match[1];
      const pathB = match[2];
      let status = 'modified';

      // Look ahead for file mode or rename information
      i++;
      while (i < lines.length && !lines[i].startsWith('diff --git')) {
        const nextLine = lines[i];

        if (nextLine.startsWith('new file mode')) {
          status = 'added';
          break;
        }
        if (nextLine.startsWith('deleted file mode')) {
          status = 'deleted';
          break;
        }
        if (nextLine.startsWith('rename from') || nextLine.startsWith('rename to')) {
          status = 'renamed';
          break;
        }

        i++;
      }

      // Use pathB for the final path (destination for renames)
      files.push({ path: pathB, status });
      continue;
    }

    i++;
  }

  return files;
}

/**
 * Categorize changed files by their status.
 *
 * @param {Array<{path: string, status: string}>} files - Array of file objects
 * @returns {{added: string[], modified: string[], deleted: string[], renamed: string[]}}
 */
export function categorizeChanges(files) {
  const categorized = {
    added: [],
    modified: [],
    deleted: [],
    renamed: [],
  };

  for (const file of files) {
    if (categorized[file.status]) {
      categorized[file.status].push(file.path);
    }
  }

  return categorized;
}

/**
 * Get the primary file from a list of changed files.
 * Heuristic: prioritize main source files over config/docs.
 *
 * @param {string[]} files - Array of file paths
 * @returns {string} The primary file
 */
function getPrimaryFile(files) {
  if (files.length === 0) return '';
  if (files.length === 1) return files[0];

  // Prefer source files over config/documentation
  const sourceFiles = files.filter(
    f => !f.match(/\.(md|json|yml|yaml|txt|cfg|conf)$/i) && !f.startsWith('.')
  );

  return sourceFiles.length > 0 ? sourceFiles[0] : files[0];
}

/**
 * Generate a fallback summary from diff and commit message.
 * Creates a grammatical sentence without API calls.
 *
 * @param {{diff: string, commitMessage: string}} params - Parameters
 * @returns {string} Generated summary
 */
export function generateFallback({ diff, commitMessage }) {
  const files = extractChangedFiles(diff);
  const categorized = categorizeChanges(files);

  if (files.length === 0) {
    return 'Made changes to the repository';
  }

  const trimmedMessage = commitMessage.trim();
  const lowerMessage = trimmedMessage.toLowerCase();

  // Check if commit message is meaningful
  // Only reject exact matches for unhelpful words, or messages shorter than 5 chars
  const isMeaningful =
    trimmedMessage.length >= 4 &&
    !UNHELPFUL_MESSAGES.includes(lowerMessage);

  if (isMeaningful) {
    // Use commit message as base
    let summary = trimmedMessage;

    // Strip conventional commit prefix (feat:, fix:, etc.)
    summary = summary.replace(/^(feat|fix|chore|docs|style|refactor|test|ci|build|perf)(\(.+?\))?:\s*/i, '');

    // Ensure first word is capitalized
    if (summary.length > 0 && summary[0] !== summary[0].toUpperCase()) {
      summary = summary[0].toUpperCase() + summary.slice(1);
    }

    // Convert imperative verbs to past tense for consistency with changelog
    // e.g., "Add" -> "Added", "Update" -> "Updated", "Refactor" -> "Refactored"
    const imperativeVerbs = {
      'Add ': 'Added ',
      'Remove ': 'Removed ',
      'Update ': 'Updated ',
      'Refactor ': 'Refactored ',
      'Fix ': 'Fixed ',
      'Change ': 'Changed ',
      'Rename ': 'Renamed ',
      'Delete ': 'Deleted ',
      'Modify ': 'Modified ',
      'Create ': 'Created ',
      'Implement ': 'Implemented ',
      'Improve ': 'Improved ',
      'Enhance ': 'Enhanced ',
      'Clean ': 'Cleaned ',
      'Optimize ': 'Optimized ',
    };

    for (const [imperative, past] of Object.entries(imperativeVerbs)) {
      if (summary.startsWith(imperative)) {
        summary = past + summary.slice(imperative.length);
        break;
      }
    }

    // Add file context if the message doesn't already mention specific files
    const fileNames = files.map(f => f.path.split('/').pop());
    const mentionsFiles = fileNames.some(name => summary.includes(name));

    if (!mentionsFiles && files.length > 0 && files.length <= 3) {
      const fileList = fileNames.join(' and ');
      summary = `${summary} in ${fileList}`;
    }

    return summary;
  }

  // Construct from diff headers
  const totalFiles = files.length;
  const allFiles = [
    ...categorized.added,
    ...categorized.modified,
    ...categorized.deleted,
    ...categorized.renamed,
  ];

  if (totalFiles === 1) {
    const file = allFiles[0];
    const status = files[0].status;

    if (status === 'added') {
      return `Added ${file}`;
    }
    if (status === 'deleted') {
      return `Removed ${file}`;
    }
    if (status === 'renamed') {
      return `Renamed ${file}`;
    }
    return `Updated ${file}`;
  }

  if (totalFiles === 2) {
    const file1 = allFiles[0];
    const file2 = allFiles[1];
    const status1 = files.find(f => f.path === file1)?.status || 'modified';
    const status2 = files.find(f => f.path === file2)?.status || 'modified';

    const verb1 = status1 === 'added' ? 'Added' : status1 === 'deleted' ? 'Removed' : 'Updated';
    const verb2 = status2 === 'added' ? 'added' : status2 === 'deleted' ? 'removed' : 'modified';

    return `${verb1} ${file1} and ${verb2} ${file2}`;
  }

  if (totalFiles === 3) {
    const file1 = allFiles[0];
    const file2 = allFiles[1];
    const file3 = allFiles[2];
    const status1 = files.find(f => f.path === file1)?.status || 'modified';
    const status2 = files.find(f => f.path === file2)?.status || 'modified';
    const status3 = files.find(f => f.path === file3)?.status || 'modified';

    const verb1 = status1 === 'added' ? 'Added' : status1 === 'deleted' ? 'Removed' : 'Updated';
    const verb2 = status2 === 'added' ? 'added' : status2 === 'deleted' ? 'removed' : 'modified';
    const verb3 = status3 === 'added' ? 'added' : status3 === 'deleted' ? 'removed' : 'modified';

    return `${verb1} ${file1}, ${verb2} ${file2}, and ${verb3} ${file3}`;
  }

  // 4+ files: use primary file + count
  const primary = getPrimaryFile(allFiles);
  const primaryStatus = files.find(f => f.path === primary)?.status || 'modified';
  const verb =
    primaryStatus === 'added' ? 'Added' : primaryStatus === 'deleted' ? 'Removed' : 'Updated';

  const remaining = totalFiles - 1;
  return `${verb} ${primary} and ${remaining} other file${remaining !== 1 ? 's' : ''}`;
}
