# Gamma API Helper Reference

## Overview

This document provides reference information for working with the Gamma API v1.0 (Generally Available as of November 2025).

## API Endpoints

### Base URL

```
https://public-api.gamma.app/v1.0
```

### Available Endpoints

1. **Generate a Gamma**
   - **POST** `/generations`
   - Create new presentation/document/webpage
   - Returns `generationId` for tracking

2. **Get Generation Status**
   - **GET** `/generations/{generationId}`
   - Check status and retrieve URLs when complete

3. **List Themes**
   - **GET** `/themes`
   - Get available theme IDs and names

4. **List Folders**
   - **GET** `/folders`
   - Get available folder IDs for organization

## Authentication

All requests require an API key in the header:

```
X-API-KEY: sk-your-api-key-here
```

**Getting an API Key:**

1. Requires Pro, Ultra, Teams, or Business plan
2. Generate at: <https://gamma.app/settings>
3. Store securely (never commit to git)

## Request Parameters

### Required Parameters

| Parameter   | Type   | Description                               | Values                                          |
| ----------- | ------ | ----------------------------------------- | ----------------------------------------------- |
| `inputText` | string | Content for the gamma (1-400k characters) | Markdown text or plain text                     |
| `textMode`  | string | How to process the text                   | `generate`, `preserve`, `condense`              |
| `format`    | string | Type of output to create                  | `presentation`, `document`, `webpage`, `social` |

### Text Mode Explained

- **`generate`**: AI creates new content based on your topic/outline
  - Best for: Quick ideas, brainstorming, when you want AI creativity
  - Input can be brief (a few words or sentences)

- **`preserve`**: Keep your exact text, minimal restructuring
  - Best for: Prepared content, specific wording, detailed markdown
  - Recommended for pre-written presentations

- **`condense`**: AI summarizes and shortens your content
  - Best for: Long documents, detailed notes, verbose content
  - Reduces word count while keeping key points

### Optional But Recommended Parameters

| Parameter      | Type    | Description                      | Default          |
| -------------- | ------- | -------------------------------- | ---------------- |
| `numCards`     | integer | Number of slides/cards to create | Varies by format |
| `textOptions`  | object  | Content generation options       | See below        |
| `imageOptions` | object  | Image generation settings        | See below        |
| `themeId`      | string  | Specific theme to use            | Auto-selected    |
| `folderId`     | string  | Folder for organization          | Root folder      |

### Text Options Object

```json
{
  "amount": "standard",
  "tone": "professional",
  "audience": "executives",
  "language": "en"
}
```

**Amount Guidance:**

- `brief`: Minimal text, key points only (good for visual slides)
- `medium`: Moderate content
- `detailed`: Comprehensive content (recommended for most presentations)
- `extensive`: Maximum detail (good for documents)

**Tone Examples:**

- "professional and data-driven"
- "casual and friendly"
- "inspiring and visionary"
- "technical and precise"

**Audience Examples:**

- "investors and venture capitalists"
- "technical team members"
- "C-suite executives"
- "general public"

### Image Options Object

```json
{
  "source": "aiGenerated"
}
```

**Image Source Options:**

- `aiGenerated`: AI-generated images using default model
- `webAllImages`: Search all web images
- `webFreeToUse`: Free-to-use web images only
- `noImages`: No images, text-only presentation
- `placeholder`: Placeholder images
- `themeAccent`: Use theme's accent colors

**Credit Estimation:**

- 3-4 credits per card/slide (text content)
- Plus image costs (if generated)
- Example: 10-slide deck with 5 basic images ~ 40-50 credits

### Input Text Breaks

Use `\n---\n` in your `inputText` to define slide breaks:

```markdown
# First Slide Title

Content for first slide

---

# Second Slide Title

Content for second slide

---

# Third Slide Title

Content for third slide
```

Each `---` creates a new slide/card.

## Response Format

### Initial Response (Queued)

```json
{
  "generationId": "gen_abc123",
  "status": "queued",
  "creditsUsed": 0
}
```

### Polling Response (In Progress)

```json
{
  "generationId": "gen_abc123",
  "status": "processing",
  "creditsUsed": 0,
  "progress": 45
}
```

### Final Response (Completed)

```json
{
  "generationId": "gen_abc123",
  "status": "completed",
  "gammaUrl": "https://gamma.app/docs/...",
  "exportUrls": {
    "pdf": "https://...",
    "pptx": "https://..."
  },
  "creditsUsed": 45,
  "metadata": {
    "numCards": 10,
    "theme": "Oasis"
  }
}
```

## Error Codes

| Code | Meaning          | Solution                                       |
| ---- | ---------------- | ---------------------------------------------- |
| 401  | Unauthorized     | Check API key is valid and in header           |
| 402  | Payment Required | Insufficient credits, add more at billing page |
| 422  | Validation Error | Check parameters match expected format         |
| 429  | Rate Limit       | Wait before retrying, respect rate limits      |
| 500  | Server Error     | Gamma service issue, retry with backoff        |

## Best Practices

### Content Preparation

1. **Use Markdown**: Format with `#` headers, `**bold**`, bullet points
2. **One Idea Per Slide**: Keep slides focused and clear
3. **Visual Hierarchy**: Use headers, subheaders, and emphasis strategically
4. **Slide Breaks**: Use `---` to control pagination
5. **Length**: Aim for 30-50 words per slide (excluding title)

### API Usage

1. **Start Simple**: Begin with `textMode: "preserve"` and basic images
2. **Test Small**: Create 5-10 slide deck first to verify setup
3. **Monitor Credits**: Check usage before large batches
4. **Save Configs**: Reuse working parameter sets
5. **Error Handling**: Always check response status and handle errors

### Theme Selection

Common themes (use `/themes` endpoint for full list):

- **Oasis**: Clean, professional, minimal
- **Sunset**: Warm, engaging, friendly
- **Ocean**: Cool, calming, corporate
- **Forest**: Natural, organic, earthy
- **Urban**: Modern, bold, tech-focused

## Example Requests

### Minimal Request (Generate Mode)

```json
{
  "inputText": "Create a pitch deck about sustainable energy solutions for startups",
  "textMode": "generate",
  "format": "presentation"
}
```

### Detailed Request (Preserve Mode)

```json
{
  "inputText": "# Market Overview\n\nThe renewable energy market is growing at 15% annually...\n\n---\n\n# Our Solution\n\nWe provide affordable solar panels...",
  "textMode": "preserve",
  "format": "presentation",
  "numCards": 10,
  "textOptions": {
    "amount": "standard",
    "tone": "professional and data-driven",
    "audience": "investors and VCs",
    "language": "en"
  },
  "imageOptions": {
    "source": "aiGenerated"
  },
  "themeId": "theme_oasis"
}
```

## Rate Limits and Quotas

- **Monthly Credits**: Varies by plan tier
- **Request Rate**: Not publicly specified, but be respectful
- **Max Input Size**: 100,000 tokens (~400,000 characters)
- **Max Cards**: Varies by format (presentations typically max 50)

## Additional Resources

- **Official Docs**: <https://developers.gamma.app>
- **API Reference**: <https://developers.gamma.app/reference>
- **Help Center**: <https://help.gamma.app>
- **Pricing**: <https://gamma.app/pricing>
- **Billing**: <https://gamma.app/settings/billing>

## Version History

- **v1.0** (Nov 2025): General Availability, stable API
- **v0.2** (Deprecated): Sunsets January 16, 2026

**Note**: Always use v1.0 endpoints for new integrations.
