import * as inquirer from "inquirer";
import { Lang } from "./lang";
import { getBoundMessage } from "./messages";

interface Params {
  username?: string;
  password?: string;
  domain?: string;
  lang: Lang;
}

export const inquireParams = ({ username, password, domain, lang }: Params) => {
  const m = getBoundMessage(lang);
  const questions = [
    {
      type: "input",
      message: m("question.domain"),
      name: "domain",
      default: domain,
      when: () => !domain,
      validate: (v: string) => !!v
    },
    {
      type: "input",
      name: "username",
      message: m("question.username"),
      default: username,
      when: () => !username,
      validate: (v: string) => !!v
    },
    {
      type: "password",
      name: "password",
      message: m("question.password"),
      default: password,
      when: () => !password,
      validate: (v: string) => !!v
    }
  ];

  return inquirer
    .prompt(questions)
    .then(answers => Object.assign({ username, password, domain }, answers));
};
