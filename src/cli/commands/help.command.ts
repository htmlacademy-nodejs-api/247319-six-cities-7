import { Command } from './command.interface.js';
import chalk from 'chalk';

export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
      Программа для подготовки данных для REST API сервера.
      Пример:
        cli.js --<${chalk.green('command')}> [${chalk.cyan('--arguments')}]
      Команды:
        ${chalk.green('--version')}:                   ${chalk.yellowBright('# выводит номер версии')}
        ${chalk.green('--help')}:                      ${chalk.yellowBright('# печатает этот текст')}
        ${chalk.green('--import')} ${chalk.cyan('<path>')}:             ${chalk.yellowBright('# импортирует данные из TSV')}
        ${chalk.green('--generate')} ${chalk.cyan('<n> <path> <url>')}  ${chalk.yellowBright('# генерирует произвольное количество тестовых данных')}
    `);
  }
}
