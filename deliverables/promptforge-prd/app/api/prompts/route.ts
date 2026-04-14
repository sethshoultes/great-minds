import { NextRequest, NextResponse } from 'next/server';
import { getAllPrompts, createPrompt } from '@/lib/queries';
import { parseTags, toPromptWithParsedTags, CreatePromptInput } from '@/lib/types';

/**
 * GET /api/prompts
 * List all prompts (lightweight - excludes full content)
 * Ordered by updated_at descending (handled by query)
 */
export async function GET() {
  try {
    const prompts = getAllPrompts();

    // Return lightweight list: exclude current_content for performance
    const lightweightPrompts = prompts.map((prompt) => ({
      id: prompt.id,
      title: prompt.title,
      current_version: prompt.current_version,
      tags: parseTags(prompt.tags),
      created_at: prompt.created_at,
      updated_at: prompt.updated_at,
    }));

    return NextResponse.json({ prompts: lightweightPrompts });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/prompts
 * Create a new prompt with initial version (v1)
 * Body: { title: string, content: string, tags?: string[] }
 * Returns: 201 with new prompt object
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'validation_error', message: 'Title is required and must be a string' },
        { status: 400 }
      );
    }

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'validation_error', message: 'Content is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate tags if provided
    if (body.tags !== undefined && !Array.isArray(body.tags)) {
      return NextResponse.json(
        { error: 'validation_error', message: 'Tags must be an array of strings' },
        { status: 400 }
      );
    }

    const input: CreatePromptInput = {
      title: body.title.trim(),
      content: body.content,
      tags: body.tags,
    };

    // Create prompt and initial version
    const prompt = createPrompt(input);

    // Return with parsed tags
    return NextResponse.json(
      { prompt: toPromptWithParsedTags(prompt) },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'internal_error', message: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}
