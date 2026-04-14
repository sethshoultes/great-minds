import { NextRequest, NextResponse } from 'next/server';
import { getPromptById, updatePrompt, deletePrompt } from '@/lib/queries';
import { toPromptWithParsedTags, UpdatePromptInput } from '@/lib/types';

/**
 * GET /api/prompts/:id
 * Get a single prompt by ID with full content
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Return full prompt with parsed tags
    return NextResponse.json({ prompt: toPromptWithParsedTags(prompt) });
  } catch (error) {
    console.error('Error fetching prompt:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to fetch prompt' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/prompts/:id
 * Update an existing prompt
 * Body: { title?: string, content?: string, tags?: string[] }
 * - If content is changed, creates a new version automatically
 * Returns: 200 with updated prompt or 404 if not found
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if prompt exists
    const existing = getPromptById(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'not_found', message: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Validate fields if provided
    if (body.title !== undefined && typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'validation_error', message: 'Title must be a string' },
        { status: 400 }
      );
    }

    if (body.content !== undefined && typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'validation_error', message: 'Content must be a string' },
        { status: 400 }
      );
    }

    if (body.tags !== undefined && !Array.isArray(body.tags)) {
      return NextResponse.json(
        { error: 'validation_error', message: 'Tags must be an array of strings' },
        { status: 400 }
      );
    }

    // Build update input
    const updateInput: UpdatePromptInput = {};

    if (body.title !== undefined) {
      updateInput.title = body.title.trim();
    }

    if (body.content !== undefined) {
      updateInput.content = body.content;
    }

    if (body.tags !== undefined) {
      updateInput.tags = body.tags;
    }

    // Check if there's anything to update
    if (Object.keys(updateInput).length === 0) {
      return NextResponse.json(
        { error: 'validation_error', message: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // Update prompt (this handles version creation if content changed)
    const updated = updatePrompt(id, updateInput);

    if (!updated) {
      return NextResponse.json(
        { error: 'internal_error', message: 'Failed to update prompt' },
        { status: 500 }
      );
    }

    return NextResponse.json({ prompt: toPromptWithParsedTags(updated) });
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to update prompt' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/prompts/:id
 * Delete a prompt and all its associated versions and tests
 * Returns: 204 No Content or 404 if not found
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete prompt (this handles cascade deletion of versions and tests)
    const deleted = deletePrompt(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'not_found', message: 'Prompt not found' },
        { status: 404 }
      );
    }

    // Return 204 No Content on successful deletion
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to delete prompt' },
      { status: 500 }
    );
  }
}
