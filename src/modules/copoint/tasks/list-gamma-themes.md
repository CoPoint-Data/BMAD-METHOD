# List Available Gamma Themes

## Task Overview

This task retrieves and displays available Gamma themes via the API.

## Prerequisites

1. Gamma API key configured
2. API access (Pro account or higher)

## Execution Steps

### Step 1: Check for API Key

Look for API key in:

1. Environment variable: `GAMMA_API_KEY`
2. `.env` file: `GAMMA_API_KEY=sk-...`
3. Ask user if not found

### Step 2: Make API Request

Execute:

```bash
curl -X GET https://public-api.gamma.app/v1.0/themes \
  -H "X-API-KEY: $GAMMA_API_KEY"
```

### Step 3: Parse and Display Results

The API returns themes in format:

```json
{
  "themes": [
    {
      "id": "theme_oasis",
      "name": "Oasis",
      "description": "Clean, professional, minimal design",
      "preview": "https://..."
    },
    {
      "id": "theme_sunset",
      "name": "Sunset",
      "description": "Warm, engaging, friendly colors",
      "preview": "https://..."
    }
  ]
}
```

### Step 4: Present to User

Display as formatted table:

| Theme ID     | Theme Name | Description                         |
| ------------ | ---------- | ----------------------------------- |
| theme_oasis  | Oasis      | Clean, professional, minimal design |
| theme_sunset | Sunset     | Warm, engaging, friendly colors     |
| ...          | ...        | ...                                 |

Inform user:

- Use `themeId` value (e.g., "theme_oasis") in API requests
- Preview URLs available if they want to see theme examples
- Can leave theme unspecified for auto-selection

### Step 5: Save for Reference (Optional)

Offer to save theme list to file for future reference:

- Default location: `docs/gamma-themes.json`
- Update periodically as new themes are added

## Error Handling

- **401 Unauthorized**: API key invalid or expired
- **403 Forbidden**: Account doesn't have API access
- **500 Server Error**: Retry after brief delay

## Output

Display complete theme list with recommendation:

- For professional presentations: "Oasis" or similar minimal themes
- For creative presentations: Themes with more visual flair
- For technical audiences: Clean, data-focused themes

## Theme Recommendations by Use Case

| Use Case         | Recommended Themes     |
| ---------------- | ---------------------- |
| Investor Pitch   | Oasis, Urban, Minimal  |
| Technical Talk   | Ocean, Forest, Clean   |
| Marketing        | Sunset, Vibrant, Bold  |
| Internal Meeting | Any professional theme |
| Creative Project | Experimental, Artistic |
