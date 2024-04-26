#!/usr/bin/env node
import { CLIApp, HelpCommand, VersionCommand, ImportCommand } from "./cli/index.js";

function bootstrap() {
  const cliApp = new CLIApp();
  cliApp.registerCommands([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
  ]);

  cliApp.processCommand(process.argv);
}

bootstrap();
