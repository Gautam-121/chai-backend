import { PASSWORD_REGEX, EMAIL_REGEX } from "../constants.js";

export const isValidEmail = email => EMAIL_REGEX.test(email)

export const isValidPassword = password => PASSWORD_REGEX.test(password)

export const isValidLengthUsername = username => (username.length > 4 && username.length < 20)
