import { errorResponse } from '../utils/response.js';

export const parseJsonFields = (fields = []) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch {
          // leave as string if not valid JSON
        }
      }
    }
    next();
  };
};

export const validate = (schema, type = 'body') => {
  return (req, res, next) => {
    try {
      const data = type === 'query' ? req.query : type === 'params' ? req.params : req.body;
      schema.parse(data);
      next();
    } catch (error) {
      const errors = error.errors?.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      }));
      return errorResponse(res, 'Validation failed', { errors }, 400);
    }
  };
};
