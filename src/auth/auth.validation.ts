import Joi from "joi";

export const login = Joi.object({
    input: Joi.string().trim().lowercase().min(6).required(),
    password: Joi.string()
        .min(8)
        .max(50)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
            "string.pattern.base":
                "Password must have a mix of lower and uppercase letters, a number, and a special character.",
        }),
})
export const register = Joi.object({
    username: Joi.string()
        .trim()
        .lowercase()
        .min(6)
        .required()
        .messages({
            'string.min': 'Username must be at least 6 characters long'
        }),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required()
        .messages({
            'string.email': 'Email must be a valid email address'
        }),

    password: Joi.string()
        .min(8)
        .max(50)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.max': 'Password cannot exceed 50 characters',
            'string.pattern.base': 'Password must have a mix of lower and uppercase letters, a number, and a special character.'
        }),

    password2: Joi.ref('password')
}).with('password', 'password2');