#!/usr/bin/env node
import { CLIApp, HelpCommand, VersionCommand, ImportCommand, GenerateCommand } from './cli/index.js';

function bootstrap() {
  const cliApp = new CLIApp();
  cliApp.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);

  cliApp.processCommand(process.argv);
}

bootstrap();
