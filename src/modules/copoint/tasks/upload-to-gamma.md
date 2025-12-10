# Upload Presentation to Gamma

## CRITICAL EXECUTION NOTICE

**THIS IS AN EXECUTABLE WORKFLOW - NOT REFERENCE MATERIAL**

This task uploads a generated presentation to Gamma via their API.

## Prerequisites Check

Before proceeding, verify:

1. **API Access**: User has Gamma Pro, Ultra, Teams, or Business plan
2. **API Key**: User has generated API key from gamma.app/settings
3. **Presentation Content**: Markdown file exists with presentation content
4. **Credits Available**: User has sufficient API credits (check gamma.app/settings/billing)

If any prerequisite is missing, guide the user to obtain it before continuing.

## Step 1: Load Presentation Content

1. Ask user for the presentation markdown file path (default: `docs/gamma-presentation.md`)
2. Read the file to get the `inputText` content
3. Display a preview of the content (first 500 characters)
4. Confirm with user this is the correct content to upload

## Step 2: Configure API Parameters

Present the user with configuration options:

### Required Parameters

1. **textMode** (how Gamma processes the content):
   - `preserve`: Keep exact text, minimal AI restructuring
   - `generate`: AI creates new content based on topic
   - `condense`: AI summarizes and shortens content
   - **Recommended**: `preserve` for prepared markdown

2. **format** (output type):
   - `presentation`: Slide-based presentation
   - `document`: Long-form document
   - `webpage`: Single-page website
   - **Default**: `presentation`

3. **numCards** (number of slides/sections):
   - Count `---` separators in markdown + 1
   - Or let user specify desired count
   - **Range**: 1-50 recommended

### Optional But Recommended

4. **textOptions**:
   - `amount`: `brief` | `standard` | `detailed`
   - `tone`: User's desired tone (e.g., "professional and inspiring")
   - `audience`: Target audience description
   - `language`: Language code (default: "en")

5. **imageOptions**:
   - `source`: `aiGenerated` | `webAllImages` | `webFreeToUse` | `noImages`
   - **Note**: AI-generated images use more credits

6. **themeId** (optional):
   - If user wants specific theme, run `*list-themes` first
   - Otherwise, Gamma auto-selects appropriate theme

7. **folderId** (optional):
   - Organize into specific folder
   - Leave empty for default folder

Present these options with numbered choices and get user selections.

## Step 3: Build API Request

Construct the JSON payload:

```json
{
  "inputText": "[Content from presentation file]",
  "textMode": "[user selection]",
  "format": "[user selection]",
  "numCards": [calculated or user-specified],
  "textOptions": {
    "amount": "[user selection]",
    "tone": "[user selection]",
    "audience": "[user selection]",
    "language": "en"
  },
  "imageOptions": {
    "source": "[user selection]"
  }
}
```

**Display the complete JSON to user for final review.**

## Step 4: API Key Configuration

1. Check if `.env` file exists in project root
2. Look for `GAMMA_API_KEY` variable
3. If not found, ask user: "Please provide your Gamma API key (starts with 'sk-...')"
4. Offer to save to `.env` file for future use
5. **SECURITY NOTE**: Ensure `.env` is in `.gitignore`

## Step 5: Execute API Call

Use curl or HTTP client to make the request:

```bash
curl -X POST https://public-api.gamma.app/v1.0/generations \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: [API_KEY]" \
  -d '[JSON_PAYLOAD]'
```

**Important**: The API call is asynchronous. The response contains a `generationId`, not the final presentation.

## Step 6: Handle Response

The API returns:

```json
{
  "generationId": "gen_...",
  "status": "queued",
  "creditsUsed": 0
}
```

Explain to user:

- Generation is processing in background
- Visit gamma.app dashboard to see "API Generated" tab
- Presentation will appear there when ready (usually 30-60 seconds)
- They'll receive email notification when complete

## Step 7: Poll for Completion (Optional)

Offer to poll for completion:

```bash
curl -X GET https://public-api.gamma.app/v1.0/generations/[generationId] \
  -H "X-API-KEY: [API_KEY]"
```

Response when complete:

```json
{
  "generationId": "gen_...",
  "status": "completed",
  "gammaUrl": "https://gamma.app/docs/...",
  "exportUrls": {
    "pdf": "https://...",
    "pptx": "https://..."
  },
  "creditsUsed": 45
}
```

Display:

- Status updates every 5-10 seconds
- Final URL when complete
- Credits used
- Export URLs if available

## Step 8: Error Handling

Common errors and solutions:

1. **401 Unauthorized**: Invalid or expired API key
2. **402 Payment Required**: Insufficient credits
3. **422 Validation Error**: Invalid parameters
4. **429 Rate Limit**: Too many requests, wait and retry
5. **500 Server Error**: Gamma service issue, retry later

For each error, provide specific guidance to user.

## Step 9: Next Steps

Once successful, inform user:

1. Presentation URL: [gammaUrl from response]
2. Credits used: [creditsUsed]
3. Options:
   - Open presentation in browser to edit
   - Export to PDF/PPTX via export URLs
   - Share via Gamma's sharing features
   - Create more presentations with remaining credits

## CRITICAL REMINDERS

**NEVER:**

- Store API keys in code or commit them to git
- Skip error handling
- Proceed without user confirmation

**ALWAYS:**

- Validate all parameters before API call
- Provide clear status updates
- Handle errors gracefully with helpful messages
- Respect user's API credit limits
