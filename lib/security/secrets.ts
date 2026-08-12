export interface SecretScanResult {
  hasSecrets: boolean;
  warningMessage: string | null;
  redactedText: string;
}

const SECRET_PATTERNS = [
  { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{32,64}/g },
  { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'Generic API Key / Token', regex: /(api_key|apikey|secret_key|access_token|bearer)\s*[:=]\s*["']?([a-zA-Z0-9_\-\.]{16,})["']?/gi },
  { name: 'Private Key Header', regex: /-----BEGIN\s+(RSA|EC|PGP|OPENSSH|DSA)?\s*PRIVATE\s+KEY-----[\s\S]*?-----END\s+(RSA|EC|PGP|OPENSSH|DSA)?\s*PRIVATE\s+KEY-----/gi },
  { name: 'Database / Basic Auth URL credentials', regex: /:\/\/[a-zA-Z0-9_]+:[a-zA-Z0-9_]+@/g },
];

export function scanAndRedactSecrets(input: string): SecretScanResult {
  if (!input) {
    return { hasSecrets: false, warningMessage: null, redactedText: '' };
  }

  let text = input;
  let detectedCount = 0;
  const detectedNames: string[] = [];

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.regex.test(text)) {
      detectedCount++;
      if (!detectedNames.includes(pattern.name)) {
        detectedNames.push(pattern.name);
      }
      text = text.replace(pattern.regex, '[REDACTED_SECRET]');
    }
  }

  if (detectedCount > 0) {
    return {
      hasSecrets: true,
      warningMessage: `Possible sensitive information detected (${detectedNames.join(', ')}). Consider redacting credentials before publishing or processing.`,
      redactedText: text,
    };
  }

  return {
    hasSecrets: false,
    warningMessage: null,
    redactedText: text,
  };
}
