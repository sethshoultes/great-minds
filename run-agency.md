# Great Minds Agency — Orchestration Prompt

Use this prompt to kick off the agency loop on a new PRD.

## How to Run

From the `great-minds` directory, use the following workflow:

### Step 1: Place your PRD
Save your PRD to `prds/{project-name}.md`

### Step 2: Start the debate loop
Run this in Claude Code:

```
/loop 2m process the next round for the current PRD project. Read SOUL.md, CLAUDE.md, and MEMORY.md for context. Then:

1. Check prds/ for the active PRD
2. Check rounds/ for the latest completed round number
3. If no rounds exist, start Round 1
4. For the current round:
   a. Launch steve-jobs-visionary agent with the PRD + previous round context. Steve should produce his analysis for all 6 deliverable areas (product design, market fit, customer personas, team personas, marketing goals, marketing messaging)
   b. Launch elon-musk-persona agent with the PRD + Steve's output. Elon should challenge, build on, and add his perspective to all 6 areas
   c. Save the combined round output to rounds/{project-name}/round-{N}.md
5. If this is Round 10, produce final deliverables in deliverables/{project-name}/
6. After completing a project, save learnings to memory/
```

### Step 3: Review deliverables
Check `deliverables/{project-name}/` for the final outputs.

## Manual Single-Round Trigger

To run a single round manually instead of using /loop:

```
Read the PRD in prds/. Read SOUL.md and CLAUDE.md for agency context. Read the latest round in rounds/. Then run the next round of the Great Minds debate — launch both agents, capture their outputs, save to rounds/, and if Round 10, produce final deliverables.
```
