# ZhipuAI glm-4-flash API Research Report

## Endpoint & Authentication

**URL:** `https://open.bigmodel.cn/api/paas/v4/chat/completions`

**Auth:** Bearer token in Authorization header
```
Authorization: Bearer <api_key>
```

## Browser Fetch Pattern

```typescript
const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'glm-4-flash',
    messages: [
      { role: 'system', content: 'You are helpful.' },
      { role: 'user', content: 'Hello' }
    ],
    temperature: 0.7,
    top_p: 0.9,
    stream: false,
  })
});

const data = await response.json();
```

## TypeScript Types

```typescript
// Request
interface ChatCompletionRequest {
  model: 'glm-4-flash';
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number; // 0-2
  top_p?: number; // 0-1
  max_tokens?: number;
  stream?: boolean;
  frequency_penalty?: number;
  presence_penalty?: number;
}

// Response
interface ChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: 'stop' | 'length' | 'content_filter';
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
```

## Streaming (Server-Sent Events)

Set `stream: true` to receive delta chunks via SSE. Each event contains `choices[0].delta` with incremental `content`.

## Key Notes

- OpenAI-compatible format makes it easy to adapt existing OpenAI clients
- Browser fetch works directly (no CORS proxy needed for Vercel)
- API key stored as environment variable (`VITE_ZHIPUAI_API_KEY`)
- glm-4-flash optimized for fast latency with minimal quality loss

## Sources

- [Zhipu AI Open Platform](https://open.bigmodel.cn/dev/api)
- [HTTP Authentication Documentation](https://open.bigmodel.cn/dev/api/http-call/http-auth)
- [GLM-4.6 API Documentation](https://apidog.com/blog/glm-4-6-api/)
- [GLM-4.7-Flash API Quick Start](https://wavespeed.ai/blog/posts/glm-4-7-flash-api/)
