const baseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value)
                    return helpers.error("string.escapeHTML", { value });
                return clean;
            },
        },
    },
});

const joi = baseJoi.extend(extension);

module.exports.campgroundSchema = joi.object({
    campground: joi.object({
        title: joi.string().required().escapeHTML(),
        price: joi.number().min(0).required(),
        // image: joi.string().required(),
        description: joi.string().required().escapeHTML(),
        location: joi.string().required().escapeHTML(),
        deleteImages: joi.array(),
    }),
});

module.exports.reviewSchema = joi.object({
    review: joi
        .object({
            rating: joi.number().min(1).max(5).required(),
            body: joi.string().required().escapeHTML(),
        })
        .required(),
});
