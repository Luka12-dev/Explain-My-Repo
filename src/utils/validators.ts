export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateRepositoryUrl(url: string): ValidationResult {
  const errors: string[] = [];

  if (!url || url.trim() === '') {
    errors.push('Repository URL is required');
    return { valid: false, errors };
  }

  const githubPattern = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/i;
  const shortPattern = /^[\w-]+\/[\w.-]+$/;

  if (!githubPattern.test(url) && !shortPattern.test(url)) {
    errors.push('Invalid GitHub repository URL format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email || email.trim() === '') {
    errors.push('Email is required');
    return { valid: false, errors };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    errors.push('Invalid email format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];

  if (!url || url.trim() === '') {
    errors.push('URL is required');
    return { valid: false, errors };
  }

  try {
    new URL(url);
  } catch {
    errors.push('Invalid URL format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateRequired(value: any, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (value === null || value === undefined || value === '') {
    errors.push(`${fieldName} is required`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (value.length < minLength) {
    errors.push(`${fieldName} must be at least ${minLength} characters long`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (value.length > maxLength) {
    errors.push(`${fieldName} must be at most ${maxLength} characters long`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateRange(value: number, min: number, max: number, fieldName: string): ValidationResult {
  const errors: string[] = [];

  if (value < min || value > max) {
    errors.push(`${fieldName} must be between ${min} and ${max}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validatePattern(value: string, pattern: RegExp, fieldName: string, message?: string): ValidationResult {
  const errors: string[] = [];

  if (!pattern.test(value)) {
    errors.push(message || `${fieldName} format is invalid`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateFileSize(size: number, maxSize: number): ValidationResult {
  const errors: string[] = [];

  if (size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    errors.push(`File size must not exceed ${maxSizeMB} MB`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateFileType(filename: string, allowedTypes: string[]): ValidationResult {
  const errors: string[] = [];

  const extension = filename.split('.').pop()?.toLowerCase();
  if (!extension || !allowedTypes.includes(extension)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function combineValidations(...results: ValidationResult[]): ValidationResult {
  const allErrors: string[] = [];

  results.forEach((result) => {
    if (!result.valid) {
      allErrors.push(...result.errors);
    }
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

export function validateObject<T extends Record<string, any>>(
  obj: T,
  schema: Record<keyof T, (value: any) => ValidationResult>
): ValidationResult {
  const errors: string[] = [];

  Object.keys(schema).forEach((key) => {
    const result = schema[key](obj[key]);
    if (!result.valid) {
      errors.push(...result.errors);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateApiKey(key: string): ValidationResult {
  const errors: string[] = [];

  if (!key || key.trim() === '') {
    errors.push('API key is required');
    return { valid: false, errors };
  }

  if (key.length < 20) {
    errors.push('API key appears to be invalid (too short)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateGitHubToken(token: string): ValidationResult {
  const errors: string[] = [];

  if (!token || token.trim() === '') {
    errors.push('GitHub token is required');
    return { valid: false, errors };
  }

  const tokenPattern = /^gh[ps]_[a-zA-Z0-9]{36,}$/;
  if (!tokenPattern.test(token)) {
    errors.push('Invalid GitHub token format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateModelId(modelId: string, availableModels: string[]): ValidationResult {
  const errors: string[] = [];

  if (!modelId || modelId.trim() === '') {
    errors.push('Model ID is required');
    return { valid: false, errors };
  }

  if (!availableModels.includes(modelId)) {
    errors.push('Invalid model ID');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSearchQuery(query: string): ValidationResult {
  const errors: string[] = [];

  if (!query || query.trim() === '') {
    errors.push('Search query is required');
    return { valid: false, errors };
  }

  if (query.length < 2) {
    errors.push('Search query must be at least 2 characters long');
  }

  if (query.length > 200) {
    errors.push('Search query is too long (max 200 characters)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (!password || password.trim() === '') {
    errors.push('Password is required');
    return { valid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateUsername(username: string): ValidationResult {
  const errors: string[] = [];

  if (!username || username.trim() === '') {
    errors.push('Username is required');
    return { valid: false, errors };
  }

  if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (username.length > 20) {
    errors.push('Username must be at most 20 characters long');
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validatePhoneNumber(phone: string): ValidationResult {
  const errors: string[] = [];

  if (!phone || phone.trim() === '') {
    errors.push('Phone number is required');
    return { valid: false, errors };
  }

  const phonePattern = /^\+?[\d\s()-]{10,}$/;
  if (!phonePattern.test(phone)) {
    errors.push('Invalid phone number format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateDate(date: string): ValidationResult {
  const errors: string[] = [];

  if (!date || date.trim() === '') {
    errors.push('Date is required');
    return { valid: false, errors };
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    errors.push('Invalid date format');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateFutureDate(date: string): ValidationResult {
  const baseValidation = validateDate(date);
  if (!baseValidation.valid) {
    return baseValidation;
  }

  const errors: string[] = [];
  const parsedDate = new Date(date);
  const now = new Date();

  if (parsedDate <= now) {
    errors.push('Date must be in the future');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validatePastDate(date: string): ValidationResult {
  const baseValidation = validateDate(date);
  if (!baseValidation.valid) {
    return baseValidation;
  }

  const errors: string[] = [];
  const parsedDate = new Date(date);
  const now = new Date();

  if (parsedDate >= now) {
    errors.push('Date must be in the past');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
