import { ArgumentParser } from 'argparse'
import { vote } from './vote'
import { updateKey } from './updateKey'

function registerCommands(parser: ArgumentParser): void {
  const subparsers = parser.addSubparsers({
    title: `commands`,
    dest: `subparser_name`,
    description: `Available commands`,
  })

  // Voting command
  const voteCommand = subparsers.addParser(`vote`, {
    addHelp: true,
    description: `Get price data from sources, vote for all denoms in data`,
  })

  voteCommand.addArgument([`--ledger`], {
    action: `storeTrue`,
    help: `using ledger`,
    dest: 'ledgerMode',
    defaultValue: false,
  })

  voteCommand.addArgument(['-l', '--lcd'], {
    action: 'store',
    help: 'lcd address',
    dest: 'lcdAddress',
    required: false,
  })

  voteCommand.addArgument([`-c`, `--chain-id`], {
    action: `store`,
    help: `chain ID`,
    dest: `chainID`,
    required: false,
  })

  voteCommand.addArgument([`--validator`], {
    action: `append`,
    help: `validator address (e.g. terravaloper1...), can have multiple`,
    required: false,
  })

  voteCommand.addArgument([`-s`, `--source`], {
    action: `append`,
    help: `Append price data source(It can handle multiple sources)`,
    required: false,
  })

  voteCommand.addArgument([`-p`, `--password`], {
    action: `store`,
    help: `voter password`,
  })

  voteCommand.addArgument([`-d`, `--denoms`], {
    action: `store`,
    help: `denom list to vote (ex: "all" or "krw,eur,usd")`,
    defaultValue: `all`,
  })

  voteCommand.addArgument([`-k`, `--key-path`, `--keystore`], {
    action: `store`,
    help: `key store path to save encrypted key`,
    dest: `keyPath`,
    defaultValue: `voter.json`,
  })

  voteCommand.addArgument([`-g`, `--gas-prices`], {
    action: `store`,
    help: `gas prices (default 169.77ukrw)`,
    dest: `gasPrices`,
    defaultValue: `169.77ukrw`,
  })

  // Updating Key command
  const keyCommand = subparsers.addParser(`update-key`, { addHelp: true })

  keyCommand.addArgument([`-k`, `--keypath`], {
    action: `store`,
    help: `key store path to save encrypted key`,
    dest: `keyPath`,
    defaultValue: `voter.json`,
  })
}

async function main(): Promise<void> {
  const parser = new ArgumentParser({
    version: `1.3.12`,
    addHelp: true,
    description: `Terra oracle voter`,
  })

  registerCommands(parser)
  const args = parser.parseArgs()

  if (args.subparser_name === `vote`) {
    await vote(args)
  } else if (args.subparser_name === `update-key`) {
    await updateKey(args.keyPath)
  }
}

main().catch((e) => {
  console.error(e)
})
