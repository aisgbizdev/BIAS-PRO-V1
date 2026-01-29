/**
 * Metric Value Utilities
 * Handles large social media metrics that exceed JavaScript Number.MAX_SAFE_INTEGER
 */

export interface MetricValue {
  raw: string;      // Exact value as string (from BigInt)
  approx: number;   // Safe approximation for calculations
}

/**
 * Parse a metric value as BigInt
 */
export function parseMetricBigInt(value: unknown): bigint {
  if (typeof value === 'bigint') {
    return value;
  }
  if (typeof value === 'number') {
    return BigInt(Math.floor(value));
  }
  if (typeof value === 'string') {
    try {
      return BigInt(value);
    } catch {
      return BigInt(0);
    }
  }
  return BigInt(0);
}

/**
 * Convert BigInt metric to MetricValue
 */
export function toMetricValue(metric: bigint | number | string, fallbackForApprox?: number): MetricValue {
  const bigIntValue = parseMetricBigInt(metric);
  const raw = bigIntValue.toString();
  
  // Safe approximation: clamp to MAX_SAFE_INTEGER if needed
  let approx: number;
  try {
    const numValue = Number(bigIntValue);
    
    if (numValue > Number.MAX_SAFE_INTEGER) {
      approx = fallbackForApprox ?? Number.MAX_SAFE_INTEGER;
    } else if (numValue < Number.MIN_SAFE_INTEGER) {
      approx = fallbackForApprox ?? Number.MIN_SAFE_INTEGER;
    } else {
      approx = numValue;
    }
  } catch {
    approx = fallbackForApprox ?? 0;
  }
  
  return { raw, approx };
}

/**
 * Safe division for BigInt metrics
 * Returns a number suitable for percentages/ratios
 */
export function safeDivideBigInt(numerator: bigint, denominator: bigint): number {
  if (denominator === BigInt(0)) {
    return 0;
  }
  
  // Convert to number for division (precision loss acceptable for ratios)
  const num = Number(numerator);
  const denom = Number(denominator);
  
  if (!isFinite(num) || !isFinite(denom)) {
    return 0;
  }
  
  return num / denom;
}

/**
 * Calculate engagement rate from BigInt metrics
 * Formula: (Average likes per video / followers) * 100
 * 
 * Note: This is the standard TikTok engagement rate formula
 * Normal range: 1-10%, top performers: 10-15%
 */
export function calculateEngagementRate(likes: bigint, followers: bigint, videoCount?: bigint): number {
  if (followers === BigInt(0)) {
    return 0;
  }
  
  // If videoCount provided, calculate proper engagement rate
  if (videoCount && videoCount > BigInt(0)) {
    const avgLikesPerVideo = safeDivideBigInt(likes, videoCount);
    const engagementRate = (avgLikesPerVideo / Number(followers)) * 100;
    return Math.round(engagementRate * 100) / 100; // Round to 2 decimals
  }
  
  // Fallback: estimate based on total likes / followers
  // This gives "lifetime engagement" not per-video rate
  return Math.round(safeDivideBigInt(likes * BigInt(100), followers) * 100) / 100;
}

/**
 * Calculate average from BigInt metrics
 */
export function calculateAverage(total: bigint, count: bigint): number {
  if (count === BigInt(0)) {
    return 0;
  }
  
  return Math.round(safeDivideBigInt(total, count));
}

/**
 * Format large number for display (e.g., 2.5B, 161M, 1.2K)
 * Handles BigInt values above Number.MAX_SAFE_INTEGER without precision loss
 */
export function formatMetricForDisplay(value: bigint | string | number): string {
  // For BigInt values above MAX_SAFE_INTEGER, use string division
  if (typeof value === 'bigint') {
    const absValue = value < 0 ? -value : value;
    const sign = value < 0 ? '-' : '';
    
    if (absValue >= BigInt(1_000_000_000)) {
      const billions = Number(absValue / BigInt(1_000_000_000));
      const remainder = Number(absValue % BigInt(1_000_000_000)) / 1_000_000_000;
      return `${sign}${(billions + remainder).toFixed(1)}B`;
    }
    if (absValue >= BigInt(1_000_000)) {
      const millions = Number(absValue / BigInt(1_000_000));
      const remainder = Number(absValue % BigInt(1_000_000)) / 1_000_000;
      return `${sign}${(millions + remainder).toFixed(1)}M`;
    }
    if (absValue >= BigInt(1_000)) {
      const thousands = Number(absValue / BigInt(1_000));
      const remainder = Number(absValue % BigInt(1_000)) / 1_000;
      return `${sign}${(thousands + remainder).toFixed(1)}K`;
    }
    return `${sign}${absValue.toString()}`;
  }
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}
