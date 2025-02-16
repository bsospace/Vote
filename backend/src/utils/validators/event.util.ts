
// Validate the event ID

import { param, query } from "express-validator";

export const getAllEventValidator = () => [
    query("page").optional().isNumeric().withMessage("Page must be a number"),
        query("pageSize").optional().isNumeric().withMessage("Page size must be a number"),
        query("search").optional().isString().withMessage("Search must be a string"),
        query("logs").optional().isBoolean().withMessage("Logs must be a boolean"),
]

export const getEventByIdValidator = () => [
    param("eventId").isString().withMessage("Event ID must be a string"),
]