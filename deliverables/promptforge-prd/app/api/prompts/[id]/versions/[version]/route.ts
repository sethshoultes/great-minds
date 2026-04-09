import { NextRequest, NextResponse } from 'next/server';
import { getPromptById, getVersion } from '@/lib/queries';

/**
 * GET /api/prompts/:id/versions/:version
 * Get a specific version of a prompt
 * Returns: 200 with version or 404 if prompt or version not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  try {
    const { id, version: versionParam } = await params;

    // Parse version number
    const versionNumber = parseInt(versionParam, 10);

    if (isNaN(versionNumber) || versionNumber < 1) {
      return NextResponse.json(
        {
          error: 'validation_error',
          message: 'Version must be a positive integer',
        },
        { status: 400 }
      );
    }

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

    // Get the specific version
    const version = getVersion(id, versionNumber);

    if (!version) {
      return NextResponse.json(
        {
          error: 'not_found',
          message: `Version ${versionNumber} not found for prompt "${id}".`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ version });
  } catch (error) {
    console.error('Error fetching version:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to fetch version' },
      { status: 500 }
    );
  }
}
