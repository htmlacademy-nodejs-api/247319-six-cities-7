import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
      ${chalk.magenta('Программа для подготовки данных для REST API сервера.')}
      Пример:
        cli.js --<${chalk.green('command')}> [${chalk.cyan('--arguments')}]
      Команды:
        ${chalk.green('--version')}:                                                                         ${chalk.yellowBright('# выводит номер версии')}
        ${chalk.green('--help')}:                                                                            ${chalk.yellowBright('# печатает этот текст')}
        ${chalk.green('--import to DB')} ${chalk.cyan('<path import file> <DB_USER> <DB_PASSWORD> <HOST> <DB_NAME> <SALT>')}: ${chalk.yellowBright('# импортирует данные из TSV')}
        ${chalk.green('--generate')} ${chalk.cyan('<n> <path> <url>')}                                                        ${chalk.yellowBright('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
