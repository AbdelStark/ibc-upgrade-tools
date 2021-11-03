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
    this.log(`[PRE MIGRATION]  REFERENCE NODE URL: ${chalk.blue(config.oldNodeBaseUrl)}`)
    this.log(`[POST MIGRATION] REFERENCE NODE URL: ${chalk.blue(config.newNodeBaseUrl)}`)
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
      this.compareAndDisplayDiff('TOTAL SUPPLY', oldTotalSupply, newTotalSupply)
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
        const balanceNewResponse = await axios.get(`${config.newNodeBaseUrl}/bank/balances/${account.address}`)
        const newBalance = balanceNewResponse.data.balances[0].amount
        this.compareAndDisplayDiff('BALANCE', oldBalance, newBalance)
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

  private async checkStakingPool(config: Config): Promise<void> {
    cli.action.start('Fetching staking pool data')
    try {
      const stakingPoolOldResponse = await axios.get(`${config.oldNodeBaseUrl}/staking/pool`)
      const oldData = stakingPoolOldResponse.data.result
      const oldBondedTokens = oldData.bonded_tokens
      const oldNotBondedTokens = oldData.not_bonded_tokens
      const stakingPoolNewResponse = await axios.get(`${config.newNodeBaseUrl}/staking/pool`)
      const newData = stakingPoolNewResponse.data.pool
      const newBondedTokens = newData.bonded_tokens
      const newNotBondedTokens = newData.not_bonded_tokens
      this.compareAndDisplayDiff('BONDED TOKENS', oldBondedTokens, newBondedTokens)
      this.compareAndDisplayDiff('NOT BONDED TOKENS', oldNotBondedTokens, newNotBondedTokens)

      this.log()
      cli.action.stop(logSymbols.success)
      this.log()
    } catch (error) {
      cli.action.stop(logSymbols.error)
      throw error
    }
  }

  private async checkValidators(config: Config): Promise<void> {
    cli.action.start('Fetching validators data')
    try {
      const validatorsOldResponse = await axios.get(`${config.oldNodeBaseUrl}/staking/validators`)
      const oldValidators = CheckPostmigration.sortValidators(validatorsOldResponse.data.result)
      const validatorsNewResponse = await axios.get(`${config.newNodeBaseUrl}/staking/validators`)
      const newValidators = CheckPostmigration.sortValidators(validatorsNewResponse.data.validators)
      const oldValidatorCount = oldValidators.length
      const newValidatorCount = newValidators.length
      this.log(`Old validator count: ${oldValidatorCount}`)
      this.log(`New validator count: ${newValidatorCount}`)
      const oldValidatorsMap = new Map()
      for (const oldValidator of oldValidators) {
        oldValidatorsMap.set(oldValidator.operator_address, oldValidator)
      }
      for (const newValidator of newValidators) {
        if (oldValidatorsMap.has(newValidator.operator_address)) {
          this.compareAndDisplayDiff('VALIDATOR TOKENS', newValidator.tokens, oldValidatorsMap.get(newValidator.operator_address).tokens, false)
        } else {
          this.log(`${logSymbols.error} Validator ${newValidator.operator_address} was not present before migration`)
        }
      }
      cli.action.stop(logSymbols.success)
    } catch (error) {
      cli.action.stop(logSymbols.error)
      throw error
    }
  }

  private compareAndDisplayDiff(label: string, value1Str: any, value2Str: any, displayIfEqual = true): boolean {
    this.log()
    const value1 = Number(value1Str)
    const value2 = Number(value2Str)
    const isEq = value1 === value2
    if (!isEq || displayIfEqual) {
      this.log(`[PRE MIGRATION]  ${label}: ${chalk.blue(value1)}`)
      this.log(`[POST MIGRATION] ${label}: ${chalk.blue(value2)}`)
    }
    if (isEq) {
      if (displayIfEqual) {
        this.log(`${logSymbols.success} ${label} ${chalk.green('MATCH')}`)
      }
      return true
    }
    let suffix
    if (value1 < value2) {
      suffix = `( + ${value2 - value1} )`
    } else {
      suffix = `( - ${value1 - value2} )`
    }
    this.log(`${logSymbols.error} ${label} ${chalk.red('MISMATCH')} ${chalk.yellowBright(suffix)}`)
    return false
  }

  private static sortValidators(validators: any): any {
    return validators.sort((a: any, b: any) => a.operator_address.localeCompare(b.operator_address))
  }
}
