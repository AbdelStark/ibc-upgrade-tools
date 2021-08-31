import {Command, flags} from '@oclif/command'
import axios from 'axios'
import cli from 'cli-ux'
import {Config} from '../../config'
const logSymbols = require('log-symbols')
const chalk = require('chalk')
const fs = require('fs')

export default class CheckPostmigration extends Command {
  static description = 'perform post migration check';

  static flags = {
    help: flags.help({char: 'h'}),
    old: flags.string({char: 'o', description: 'old node base url'}),
    new: flags.string({char: 'n', description: 'new node base url'}),
    data: flags.string({char: 'd', description: 'data file'}),
  };

  async run() {
    const {flags} = this.parse(CheckPostmigration)
    const rawData = fs.readFileSync(flags.data)
    const data = JSON.parse(rawData)
    const config = new Config(flags.old as string, flags.new as string, flags.data as string, data)
    this.log(`old node base url: ${chalk.yellow(config.oldNodeBaseUrl)}`)
    this.log(`new node base url: ${chalk.green(config.newNodeBaseUrl)}`)
    this.log(`data file: ${chalk.blue(flags.data)}`)
    await this.getTotalSupply(config)
    await this.checkBalances(config)
    await this.checkVestingAccounts(config)
    await this.checkStakingPool(config)
    await this.checkValidators(config)
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

  private async checkBalances(config: Config): Promise<void> {
    cli.action.start('Fetching account balances')
    try {
      const accounts = config.data.accounts
      for (const account of accounts) {
        this.log()
        this.log(`Checking account: ${chalk.blue(account.address)}`)
        const balanceOldResponse = await axios.get(`${config.oldNodeBaseUrl}/bank/balances/${account.address}`)
        const oldBalance = balanceOldResponse.data.result[0].amount
        const balanceNewResponse = await axios.get(`${config.newNodeBaseUrl}/cosmos/bank/v1beta1/balances/${account.address}`)
        const newBalance = balanceNewResponse.data.balances[0].amount
        this.log(`balance old: ${chalk.yellow(oldBalance)}`)
        this.log(`balance new: ${chalk.green(newBalance)}`)
        if (oldBalance === newBalance) {
          this.log(`${logSymbols.success} balance match`)
        } else {
          this.log(`${logSymbols.error} balance mismatch`)
        }
        this.log()
      }
      cli.action.stop(logSymbols.success)
    } catch (error) {
      cli.action.stop(logSymbols.error)
      throw error
    }
  }

  // TODO: implement the logic
  private async checkVestingAccounts(config: Config): Promise<void> {
    cli.action.start('Fetching vesting accounts')
    try {
      const vestingAccounts = config.data.vestingAccounts
      for (const vestingAccount of vestingAccounts) {
        this.log(`Checking account: ${chalk.blue(vestingAccount.address)}`)
      }
      cli.action.stop(logSymbols.success)
    } catch (error) {
      cli.action.stop(logSymbols.error)
      throw error
    }
  }

  // TODO: implement the logic
  private async checkStakingPool(config: Config): Promise<void> {
    cli.action.start('Fetching staking pool data')
    try {
      // old: /staking/pool
      // new: /cosmos/staking/v1beta1/pool
      cli.action.stop(logSymbols.success)
    } catch (error) {
      cli.action.stop(logSymbols.error)
      throw error
    }
  }

  // TODO: implement the logic
  private async checkValidators(config: Config): Promise<void> {
    cli.action.start('Fetching validators data')
    try {
      // old: /staking/validators
      // new: /cosmos/staking/v1beta1/validators
      cli.action.stop(logSymbols.success)
    } catch (error) {
      cli.action.stop(logSymbols.error)
      throw error
    }
  }
}
