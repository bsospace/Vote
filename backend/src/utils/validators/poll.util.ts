import { query } from "express-validator";


export const getAllPollValidator = () => [
    query("page").optional().isNumeric().withMessage("Page must be a number"),
    query("pageSize").optional().isNumeric().withMessage("Page size must be a number"),
    query("search").optional().isString().withMessage("Search must be a string"),
    query("logs").optional().isBoolean().withMessage("Logs must be a boolean"),
]

export const getPollByIdValidator = () => [
    query("pollId").isString().withMessage("Poll ID must be a string"),
]