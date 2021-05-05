#!/usr/bin/env node

require('yargs')
  .scriptName("pirate-parser")
  .usage("My App Title \n--------\n")
  .usage('$0  [args]')
  .command('csm [file]', 'welcome ter yargs!', (yargs) => {
    yargs.positional('file', {
      type: 'string',
      describe: 'the name the file'
    })
  }, function (argv) {
    console.log('hello', argv.file, 'welcome to yargs!')
  })
  .command('chk', 'Checkpointing!', (yargs) => {
    // yargs.positional('name', {
    //   type: 'string',
    //   default: 'Cambi',
    //   describe: 'the name to say hello to'
    // })
  }, function (argv) {
    console.log('chk switch used')
  })
  
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .option('label', {
    alias: 'l',
    type: 'boolean',
    description: 'Label using last digit in filename (used for parsing inference result that contain checkpoint number)'
  })
  .help()
  .argv

