const USERNAME_REGEX = /^\w{2,20}$/
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d@$!%*?&]{6,}$/
const CAPITAL_CASE_REGEX = /[A-Z]/
const SMALL_CASE_REGEX = /[a-z]/
const DIGIT_REGEX = /\d/
const SPECIAL_CHARACTER_REGEX = /[!@#$%^&*(),.?":{}|<>]/
const SPECIAL_CHARACTER = "||"
const PROMPT =
  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What is a hobby you have recently started?||If you could have dinner with any historical figure, who would it be?||What is a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."

export {
  USERNAME_REGEX,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  CAPITAL_CASE_REGEX,
  SMALL_CASE_REGEX,
  DIGIT_REGEX,
  SPECIAL_CHARACTER_REGEX,
  SPECIAL_CHARACTER,
  PROMPT
}
