// Rate limiter sederhana di memori (cukup untuk single-instance / development).
const buckets = new Map();

export function rateLimit({ windowMs, max, keyPrefix }) {
  return (req, res, next) => {
    const id = `${keyPrefix}:${req.ip}`;
    const now = Date.now();
    const entry = buckets.get(id);
    if (!entry || now > entry.resetAt) {
      buckets.set(id, { count: 1, resetAt: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({ error: 'TOO_MANY_ATTEMPTS', retryAfter });
    }
    next();
  };
}
