import { NextRequest, NextResponse } from 'next/server';
import { getPromptById, getVersion, revertToVersion } from '@/lib/queries';
import { toPromptWithParsedTags } from '@/lib/types';

/**
 * POST /api/prompts/:id/revert
 * Revert a prompt to a previous version
 * Body: { version: number }
 *
 * This creates a NEW version with the old content (does not delete any versions)
 * and updates the prompt's current_content
 *
 * Returns: 200 with the updated prompt and new version, or error
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate the request body
    if (body.version === undefined || body.version === null) {
      return NextResponse.json(
        { error: 'validation_error', message: 'Version number is required' },
        { status: 400 }
      );
    }

    const versionNumber = Number(body.version);

    if (!Number.isInteger(versionNumber) || versionNumber < 1) {
      return NextResponse.json(
        { error: 'validation_error', message: 'Version must be a positive integer' },
        { status: 400 }
      );
    }

    // Check if prompt exists
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

    // Check if the target version exists
    const targetVersion = getVersion(id, versionNumber);
    if (!targetVersion) {
      return NextResponse.json(
        {
          error: 'not_found',
          message: `Version ${versionNumber} was not found for this prompt.`,
        },
        { status: 404 }
      );
    }

    // Check if already at this version (comparing content to avoid unnecessary revert)
    if (prompt.current_content === targetVersion.content) {
      return NextResponse.json(
        {
          error: 'no_change',
          message: `The current content is already identical to version ${versionNumber}. No revert needed.`,
        },
        { status: 400 }
      );
    }

    // Perform the revert
    const newVersion = revertToVersion(id, versionNumber);

    if (!newVersion) {
      return NextResponse.json(
        { error: 'internal_error', message: 'Failed to revert to the specified version' },
        { status: 500 }
      );
    }

    // Get the updated prompt
    const updatedPrompt = getPromptById(id);

    if (!updatedPrompt) {
      return NextResponse.json(
        { error: 'internal_error', message: 'Failed to retrieve updated prompt' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully reverted to version ${versionNumber}. Created new version ${newVersion.version_number}.`,
      prompt: toPromptWithParsedTags(updatedPrompt),
      newVersion: newVersion,
      revertedFromVersion: versionNumber,
    });
  } catch (error) {
    console.error('Error reverting prompt:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to revert prompt' },
      { status: 500 }
    );
  }
}
