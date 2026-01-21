# Production Logging with Structured JSON

This project uses a **minimal structured JSON logging system** that provides consistent log formatting without external dependencies.

## Overview

Every log entry is output as JSON with a standardized format:

```json
{
  "timestamp": "2024-01-21T10:30:45.123Z",
  "level": "info",
  "message": "User clicked contact form",
  "action": "form_submit"
}
```

This allows logs to be easily parsed and analyzed by log aggregation services or your own infrastructure.

## Usage

The logger is available via the `logger` module. Simply replace `console.log()` calls with `logger.info()`, etc.

```javascript
import logger from "./lib/logger.js";

// Info logs
logger.info("User signed up", {
  userId: "user123",
  plan: "pro",
});

// Warnings
logger.warn("API response slow", {
  apiEndpoint: "/api/tutors",
  duration: 5000,
});

// Errors
logger.error("Payment processing failed", {
  orderId: "order456",
  reason: "insufficient_funds",
});

// Debug logs
logger.debug("Form validation passed", {
  formId: "contact-form",
});
```

## Structured Log Format

All logs follow this base structure:

```json
{
  "timestamp": "ISO 8601 string",
  "level": "info | warn | error | debug",
  "message": "Human readable message",
  "...context": "Any additional fields you pass"
}
```

## Log Levels

- **`debug`** - Detailed information for debugging (e.g., "Form validation passed")
- **`info`** - General informational messages (e.g., "User signed up")
- **`warn`** - Warning messages for potential issues (e.g., "API response slow")
- **`error`** - Error messages for failures (e.g., "Payment failed")

## Examples

### User Actions

```javascript
logger.info("Contact form submitted", {
  subject: "Math Tutoring Inquiry",
  grade: "12",
});
```

### Errors

```javascript
try {
  await processPayment(data);
} catch (error) {
  logger.error("Payment processing failed", {
    orderId: data.orderId,
    errorMessage: error.message,
  });
}
```

### Performance Issues

```javascript
logger.warn("Slow API response", {
  endpoint: "/api/availability",
  duration: 3000,
  threshold: 1000,
});
```

### Feature Flags / Tracking

```javascript
logger.info("Feature accessed", {
  feature: "booking_system",
  userId: "user123",
});
```

## Best Practices

✅ **DO:**

- Include relevant context (IDs, values, states)
- Use consistent key names across your application
- Log at appropriate levels
- Include contextual metadata

❌ **DON'T:**

- Log sensitive data (passwords, tokens, SSNs)
- Log excessively in tight loops
- Include large objects without summarizing

## Integration with Log Services

These logs can be easily integrated with log aggregation services:

### Datadog

```javascript
// Logs are already in the right format for Datadog's JSON parsing
```

### Splunk

```javascript
// JSON structure is compatible with Splunk's default parsing
```

### CloudWatch

```javascript
// Can be sent to AWS CloudWatch Logs
```

### ELK Stack (Elasticsearch, Logstash, Kibana)

```javascript
// Perfect format for ELK pipeline
```

Simply forward the browser console output to your logging infrastructure, or integrate a log shipping library when needed.

## Environment Variables

Optional configuration in `.env`:

```bash
VITE_APP_VERSION=1.0.0
```

## Zero Dependencies

This logging system has **zero external dependencies** - it's pure JavaScript. When you're ready to scale logging infrastructure:

1. Logs are already in JSON format for easy parsing
2. You can add a logging service (Sentry, Datadog, etc.) without changing your code
3. Or implement a custom log shipper to your backend

## Example: Sending Logs to a Backend

When ready, you can easily add a function to ship logs to your server:

```javascript
const logger = {
  info: (message, data = {}) => {
    const log = createStructuredLog("info", message, data);
    console.log(log);
    // Optionally send to your backend
    // fetch('/api/logs', { method: 'POST', body: JSON.stringify(log) });
  },
  // ... other methods
};
```

## Future: Easy Migration to Sentry/Datadog

If you want to add error tracking and session replay later, you can extend the logger without changing your code:

```javascript
import * as Sentry from "@sentry/browser";

// Just wrap the existing logger
const loggerWithSentry = {
  error: (message, data = {}) => {
    const log = createStructuredLog("error", message, data);
    console.error(log);
    Sentry.captureException(new Error(message), { extra: data });
  },
  // ...
};
```
