import joi from 'joi';

export const create = joi.object({
    media: joi.string().required(),
    userId: joi.string().hex().length(24).required(),
    username: joi.string().required(),
    content: joi.string(),
    backdrop_path: joi.string().default(null),
    spoiler: joi.boolean().default(false),
    rewatch: joi.boolean().default(false),
    watched_on: joi.date().default(Date.now),
    rating: joi.number().min(0).max(10).default(null),
    poster_path: joi.string().default(null),
});

