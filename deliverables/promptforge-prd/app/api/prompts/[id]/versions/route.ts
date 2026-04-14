import { NextRequest, NextResponse } from 'next/server';
import { getPromptById, getVersionsByPromptId } from '@/lib/queries';

/**
 * GET /api/prompts/:id/versions
 * Get all versions for a prompt, ordered by version number ascending
 * Returns: 200 with array of versions or 404 if prompt not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if prompt exists first
    const prompt = getPromptById(id);

    if (!prompt) {
      return NextResponse.json(
        {
          error: 'not_found',
          message: `Prompt with ID "${id}" was not found. Please check the ID and try again.`,
        },
        { status: 404 }
      );
    }

    // Get all versions for this prompt
    // Note: getVersionsByPromptId returns DESC order, we need ASC
    const versions = getVersionsByPromptId(id);

    // Sort by version_number ascending (oldest first)
    const sortedVersions = versions.sort((a, b) => a.version_number - b.version_number);

    return NextResponse.json({ versions: sortedVersions });
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to fetch versions' },
      { status: 500 }
    );
  }
}
