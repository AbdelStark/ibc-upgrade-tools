import {Command, flags} from '@oclif/command'
import axios from 'axios'
import cli from 'cli-ux'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const logSymbols = require('log-symbols')
const chalk = require('chalk')

export default class CheckPostmigration extends Command {
  static description = 'perform post migration check';

  static flags = {
    help: flags.help({char: 'h'}),
    old: flags.string({char: 'o', description: 'old node base url'}),
    new: flags.string({char: 'n', description: 'new node base url'}),
  };

  async run() {
    const {flags} = this.parse(CheckPostmigration)

    this.log(`old node base url: ${chalk.green(flags.old)}`)
    this.log(`new node base url: ${chalk.green(flags.new)}`)
    await CheckPostmigration.getTotalSupply()
    this.exit()
  }

  private static async getTotalSupply(): Promise<void> {
    cli.action.start('Fetching total supply')
    try {
      cli.action.stop(logSymbols.success)
    } catch (error) {
      cli.action.stop(logSymbols.error)
      throw error
    }
  }
}
