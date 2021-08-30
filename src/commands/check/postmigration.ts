import {Command, flags} from '@oclif/command'
import axios from 'axios'
import cli from 'cli-ux'
import {Config} from '../../config'
const logSymbols = require('log-symbols')
const chalk = require('chalk')

export default class CheckPostmigration extends Command {
  static description = 'perform post migration check';

  static flags = {
    help: flags.help({char: 'h'}),
    old: flags.string({char: 'o', description: 'old node base url'}),
    new: flags.string({char: 'n', description: 'new node base url'}),
    accounts: flags.string({char: 'a', description: 'accounts file'}),
  };

  async run() {
    const {flags} = this.parse(CheckPostmigration)
    const config = new Config(flags.old as string, flags.new as string)
    this.log(`old node base url: ${chalk.yellow(config.oldNodeBaseUrl)}`)
    this.log(`new node base url: ${chalk.green(config.newNodeBaseUrl)}`)
    this.log(`accounts file: ${chalk.blue(flags.accounts)}`)
    await this.getTotalSupply(config)
    this.exit()
  }

  private async getTotalSupply(config: Config): Promise<void> {
    cli.action.start('Fetching total supply')
    try {
      const totalSupplyOldResponse = await axios.get(`${config.oldNodeBaseUrl}/supply/total`)
      const oldTotalSupply = totalSupplyOldResponse.data.result[0].amount
      const totalSupplyNewResponse = await axios.get(`${config.newNodeBaseUrl}/cosmos/bank/v1beta1/supply`)
      const newTotalSupply = totalSupplyNewResponse.data.supply[0].amount
      this.log(`total supply old: ${chalk.yellow(oldTotalSupply)}`)
      this.log(`total supply new: ${chalk.green(newTotalSupply)}`)
      if (oldTotalSupply === newTotalSupply) {
        this.log(`${logSymbols.success} total supply match`)
      } else {
        this.log(`${logSymbols.error} total supply mismatch`)
      }

      cli.action.stop(logSymbols.success)
    } catch (error) {
      cli.action.stop(logSymbols.error)
      throw error
    }
  }
}
