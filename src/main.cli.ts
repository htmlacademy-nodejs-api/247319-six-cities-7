#!/usr/bin/env node
import 'reflect-metadata';
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
