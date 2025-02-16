import { body } from "express-validator";


export const loginGuestValidator = () => [
    body("key").isString().withMessage("Key must be a string"),
];