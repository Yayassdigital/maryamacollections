const PASSWORD_FIELDS = new Set([
  "password",
  "confirmPassword",
  "currentPassword",
  "newPassword",
  "oldPassword",
]);

const isPlainObject = (value) =>
  Object.prototype.toString.call(value) === "[object Object]";

const stripHtml = (value) => {
  if (typeof value !== "string") return value;
  return value.replace(/<[^>]*>?/gm, "").trim();
};

const sanitizeValue = (key, value) => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(key, item));
  }

  if (isPlainObject(value)) {
    const cleaned = {};

    for (const [objKey, objValue] of Object.entries(value)) {
      const safeKey = String(objKey).replace(/[$.]/g, "");
      cleaned[safeKey] = sanitizeValue(safeKey, objValue);
    }

    return cleaned;
  }

  if (typeof value === "string") {
    if (PASSWORD_FIELDS.has(key)) {
      return value;
    }

    return stripHtml(value);
  }

  return value;
};

const mutateObject = (target, source) => {
  for (const key of Object.keys(target)) {
    delete target[key];
  }

  for (const [key, value] of Object.entries(source)) {
    target[key] = value;
  }
};

export const sanitizeRequest = (req, res, next) => {
  try {
    if (req.body && (isPlainObject(req.body) || Array.isArray(req.body))) {
      req.body = sanitizeValue(null, req.body);
    }

    if (req.query && isPlainObject(req.query)) {
      const sanitizedQuery = sanitizeValue(null, req.query);
      mutateObject(req.query, sanitizedQuery);
    }

    if (req.params && isPlainObject(req.params)) {
      const sanitizedParams = sanitizeValue(null, req.params);
      mutateObject(req.params, sanitizedParams);
    }

    next();
  } catch (error) {
    next(error);
  }
};