# ibc-upgrade-tools

IBC upgrade tools

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ibc-upgrade-tools.svg)](https://npmjs.org/package/ibc-upgrade-tools)
[![Downloads/week](https://img.shields.io/npm/dw/ibc-upgrade-tools.svg)](https://npmjs.org/package/ibc-upgrade-tools)
[![License](https://img.shields.io/npm/l/ibc-upgrade-tools.svg)](https://github.com/abdelhamidbakhta/ibc-upgrade-tools/blob/master/package.json)

<!-- toc -->
* [ibc-upgrade-tools](#ibc-upgrade-tools)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g ibc-upgrade-tools
$ ibc-upgrade-tools COMMAND
running command...
$ ibc-upgrade-tools (-v|--version|version)
ibc-upgrade-tools/0.0.5 darwin-x64 node-v16.6.1
$ ibc-upgrade-tools --help [COMMAND]
USAGE
  $ ibc-upgrade-tools COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`ibc-upgrade-tools check:postmigration`](#ibc-upgrade-tools-checkpostmigration)
* [`ibc-upgrade-tools help [COMMAND]`](#ibc-upgrade-tools-help-command)

## `ibc-upgrade-tools check:postmigration`

perform post migration check

```
USAGE
  $ ibc-upgrade-tools check:postmigration

OPTIONS
  -d, --data=data  data file
  -h, --help       show CLI help
  -n, --new=new    new node base url
  -o, --old=old    old node base url
```

_See code: [src/commands/check/postmigration.ts](https://github.com/abdelhamidbakhta/ibc-upgrade-tools/blob/v0.0.5/src/commands/check/postmigration.ts)_

## `ibc-upgrade-tools help [COMMAND]`

display help for ibc-upgrade-tools

```
USAGE
  $ ibc-upgrade-tools help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.3/src/commands/help.ts)_
<!-- commandsstop -->
