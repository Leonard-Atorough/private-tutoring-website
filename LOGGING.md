# Logging Strategy

This project uses a **structured JSON logging system integrated with Sentry** for error tracking, performance monitoring, and session replay.

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

Logs are output to the console and automatically forwarded to Sentry for error tracking and monitoring.

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

## Sentry Integration

Sentry is integrated for comprehensive error tracking and monitoring:

### Error Tracking

- **Error logs** (`logger.error()`) are captured as messages in Sentry
- **Warnings** (`logger.warn()`) are captured as warning-level messages
- **Info & Debug** logs are recorded as breadcrumbs for context

### Breadcrumb Recording

All log levels automatically create breadcrumbs in Sentry, providing useful context for investigating errors. Breadcrumbs include:

- The log message
- The structured log data
- A category (defaulting to "app")
- The log level

### Performance Monitoring

- **Transactions are sampled at 20%** to monitor application performance without overwhelming the system
- Tracks slow requests, rendering delays, and other performance metrics

### Session Replay

- **10% of normal sessions** are recorded for replay
- **100% of error sessions** are recorded for detailed debugging
- Allows playback of user interactions leading up to errors

## Configuration

Sentry is configured in [src/lib/sentry-config.js](src/lib/sentry-config.js) with the following environment variables:

```bash
VITE_SENTRY_DSN=<your-sentry-dsn>
VITE_ENVIRONMENT=production  # or development, staging, etc.
VITE_APP_VERSION=1.0.0       # Current application version
```

If `VITE_SENTRY_DSN` is not set, Sentry will not initialize and the application will continue to work with console logging only.
