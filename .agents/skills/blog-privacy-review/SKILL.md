# Blog Privacy Review

Use this skill before publishing Markdown content or after importing content from Obsidian.

## Goal

Prevent private, sensitive, or operational information from being published to the website.

## Check For

- Phone numbers, private email addresses, home addresses, government IDs, bank details.
- API keys, tokens, cookies, passwords, private server addresses, internal credentials.
- Customer, colleague, friend, student, or partner real names and identifiable details.
- Non-public commercial information, contracts, pricing, strategy, or internal plans.
- Private diary material, screenshots with sensitive information, and copied chat logs.
- Pages marked or implied as drafts that are accidentally set to `draft: false`.

## Action On Risk

If a risk is found:

1. Set `draft: true`.
2. Add this marker near the end of the file:

```md
<!-- privacy-review: needs-user-confirmation -->
```

3. Summarize the issue without repeating the sensitive value.

## Publishing Rule

Do not publish questionable content by trying to partially redact it unless the user explicitly confirms the safe public version.
