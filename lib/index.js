const changelog = require("keepachangelog");
const meow = require("meow");
const assert = require("assert");

const cli = meow(`
  Usage
    changelogger <type> <message>

  Examples
    $ changelogger add "Added some feature"
    $ changelogger fix "Fixed a bug"
`);

const changeTypes = {
  change: "Changed",
  add: "Added",
  remove: "Removed",
  fix: "Fixed"
};

const [changeType, message] = cli.input;

assert(
  !!changeTypes[changeType],
  `Not a valid change type, must be one of ${Object.keys(changeTypes).join(
    ", "
  )}`
);

assert(message, "A message is required");

changelog
  .read("CHANGELOG.md")
  .then(log => {
    const upcoming = log.getRelease("upcoming");
    assert(upcoming, "Not able to find upcoming section");

    let section = upcoming[changeTypes[changeType]];
    if (!section) {
      section = upcoming[changeTypes[changeType]] = [];
    }
    section.push(message);

    return log.write("CHANGELOG.md");
  })
  .catch(err => {
    console.error(err);
  });
