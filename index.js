#!/usr/bin/env node

const comm = require('commander');
const request = require('request');
const chalk = require('chalk');
const _ = require('lodash');


const puts = msg => console.log(msg);
let callsign = null;

const display = data => {
  json = JSON.parse(data);

  if (json.status === 'VALID') {

    puts(chalk.green(`Status: ${ json.status }`));
    puts(`Type: ${ json.type }`);
    puts(`Callsign: ${ chalk.bold(json.current.callsign) }`);
    puts(`Class: ${ json.current.operClass }`);
    puts('');

    puts(`${ chalk.bold(json.name) }`);
    _.keys(json.address).map(line => json.address[line].length ? puts(json.address[line]) : null);
    puts('');

    puts(`Effective: ${ json.otherInfo.grantDate }`);
    puts(`Expires: ${ json.otherInfo.expiryDate }`);
    puts(`FCC ULS lookup: ${ chalk.cyan(json.otherInfo.ulsUrl) }`);

  } else if (json.status === 'UPDATING')
    puts(chalk.yellow(`Status: ${ json.status }`));
  else
    puts(chalk.red(`Status: ${ json.status }`));
};

const fetch = () => {
  request(`https://callook.info/${ callsign }/json`, (err, res, data) => {
    if (!err && res.statusCode == 200)
      display(data);
  });
};

comm
  .version('1.0.0')
  .arguments('<callsign>')
  .action(c => callsign = c);

comm.parse(process.argv);

if (!callsign) {
  puts(chalk.red('<callsign> is required'));
  comm.help();
}

fetch();
