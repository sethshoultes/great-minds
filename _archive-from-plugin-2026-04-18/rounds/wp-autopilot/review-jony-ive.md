# WP Autopilot Design Review

## Visual Hierarchy

**Fails primary test**: greeting isn't visually dominant.

- `chat-panel.css:33` - h2 at 24px/400 weight reads timid
- `chat-panel.css:40` - example prompt in italics/gray screams "ignore me"
- Should be reversed: example loud, question quiet

**Settings hierarchy confused**:
- `settings.php:15` - page title competes with form
- `settings.php:150` - sidebar h2 same weight as page h1
- API key field gets lost in WP form-table noise

## Whitespace

**Chat panel cramped**:
- `chat-panel.css:23` - 20px padding too tight against viewport-height container
- `chat-panel.css:49` - 20px message spacing creates vertical stutter
- `chat-panel.css:64` - 12px/16px padding in bubbles feels suffocating
- Input area (194-201) has breathing room; messages don't

**Settings breathes better**:
- `settings.php:130` - 30px gap works
- `settings.php:162` - 15px gap in steps feels right
- But numbered circles (165-176) fight their content

## Consistency

**Type scale chaos**:
- Chat: 24px, 14px, 13px (no system)
- Settings: 18px, 14px, 13px, 12px (4 sizes for simple form)
- `chat-panel.css:114-118` - h2/h3 in messages at 18/16 conflicts with greeting at 24

**Color palette fractured**:
- Blues: #0073aa, #005a87 (chat), #0073aa (settings)
- Greens: #28a745, #218838 (actions), #46b450, #d7f0d7 (success)
- Grays: #6c757d, #8c8f94, #dcdcde, #ccd0d4, #f0f0f1, #f9f9f9
- 12+ grays doing work of 3

**Border radius inconsistent**:
- 8px for messages (`chat-panel.css:65`)
- 4px for containers/buttons/inputs (everywhere else)
- 50% for step numbers (`settings.php:170`)
- No logic to choices

## Craft

**Delightful details**:
- `chat-panel.css:246-261` - scrollbar styling shows care
- `settings.php:112` - dashicons checkmark with color match
- `chat-panel.css:214-217` - focus state properly built

**Disappointing details**:
- `chat-panel.php:39` - hardcoded copy in view file
- `chat-panel.css:90` - Monaco/Courier fallback lazy (use SF Mono first on macOS)
- `settings.php:127-219` - entire stylesheet embedded in PHP (sins against separation)
- `chat.js:187-220` - markdown renderer regex fragile, will break on edge cases
- `chat-panel.css:75-79` - assistant message white bg with 1px border barely visible on white page

**Missing polish**:
- No transitions anywhere
- No loading states (just text that says "Thinking...")
- Button hover states change color, not elegance
- Error state (`chat-panel.css:179-186`) just angry red box

## What Would Make It Quieter But More Powerful

**Reduce type scale to 3 sizes**:
- Heading: 21px (not 24)
- Body: 15px (not 14)
- Small: 13px (not 12/13/14 chaos)

**Reduce color palette**:
- One blue: #0073aa
- One green: #46b450
- Three grays: #1d2327, #a0a5aa, #f6f7f8

**One border radius**: 6px everywhere except buttons (4px)

**Greeting demands attention**:
- `chat-panel.php:39` - h2 to 32px, weight 300
- Remove example prompt entirely (patronizing)
- Add 120px top padding for ceremonial space

**Messages need air**:
- `chat-panel.css:49` - margin-bottom to 32px
- `chat-panel.css:64` - padding to 16px 20px
- `chat-panel.css:23` - padding to 40px

**Assistant messages need presence**:
- `chat-panel.css:75-79` - change white bg to #f6f7f8, remove border

**Separate style from structure**:
- `settings.php:127-219` - move to CSS file
- `chat-panel.php:93` - placeholder too long, use "How can I help?"

**Add transitions everywhere**:
- 150ms ease-out on hovers
- 300ms ease on message entry
- Fade in, don't just appear

**Rethink action confirmation**:
- `chat-panel.css:137-176` - yellow warning box screams distrust
- Use ghost buttons in message footer instead
- Green/gray buttons want too much attention

**Loading state**:
- `chat-panel.css:131-134` - italic gray text lazy
- Add subtle pulse animation
- Consider typing indicator (3 dots)

**Step numbers too loud**:
- `settings.php:165-176` - blue circles with white numbers feel like app install wizard
- Try outline circles with blue text instead
- Or remove entirely, rely on vertical flow
