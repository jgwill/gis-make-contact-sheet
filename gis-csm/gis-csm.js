#!/usr/bin/env node
/** Guillaume Isabelle GIS-CSM
 * Vision: Simply create a contact sheet using Docker container
 
 * Current Reality:First testing
 */

var preFix = "_"; var sufFix = ".csm"; var ext = ".jpg";
var container_tag = "jgwill/gis-csm";
var mount_in = "/work/input";
var mount_out = "/out";

var os = process.platform;

const { fstat } = require('fs');
//console.log("__dirname:" + __dirname);


var path = require('path');
var fs = require('fs');
var resolve = path.resolve;

const yargs = require('yargs');
var ver = yargs.version();

var appStartMessage =
  `Multi platform Contact Sheet maker
By Guillaume Descoteaux-Isabelle, 2020-2021
version ${ver}
----------------------------------------`;
//const { argv } = require('process');
//const { hideBin } = require('yargs/helpers')
const argv = yargs(process.argv)

  .scriptName("gicsl")
  .usage(appStartMessage)
  // .command('serve [port]', 'start the server', (yargs) => {
  //   yargs
  //     .positional('f', {
  //       describe: 'port to bind on',
  //       type:'string',
  //       default: 5000
  //     })
  // }, (argv) => {
  //   if (argv.verbose) console.info(`start server on :${argv.port}`)
  //   //serve(argv.port)
  //   console.log("test");
  //   console.info(`start server on :${argv.port}`)
  // })
  .option('file', {
    alias: 'f',
    type: 'string',
    description: 'Specify the file out'
  })
  .option('directory', {
    alias: 'd',
    type: 'boolean',
    default: false,
    description: 'Name the output using current Basedirname'
  })
  .option('noclean', {
    alias: 'nc',
    type: 'boolean',
    default: false,
    description: 'do not clean procssing stuff'
  })
  .option('feh', {
    alias: 'o',
    type: 'boolean',
    default: false,
    description: 'Open viewer CSM after generating'
  })
  .example(`gicsl-d --label  # Assuming this file in directory: vm_s01-v01_768x___285k.jpg
    # will extract 285 and add that instead of filename`)
  .option('verbose', {
    alias: 'v',
    default: false,
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .option('label', {
    alias: 'l',
    type: 'boolean',
    default: false,
    description: 'Label using last digit in filename (used for parsing inference result that contain checkpoint number)'
  })
  .argv;

if (argv.directory && argv.file) {
  console.log("Can not use --file and --directory together");
  process.exit(1);
}

// console.log(argv.file)
// console.log(argv.directory?"using Directory":"")
// console.log(argv.label)
// console.log(argv.verbose)
// process.exit(1);
// const argv = yargs(hideBin(process.argv)).argv


//Init vars
var target_file = "";
var target_file_name_only = "";
var target_dir = "";
//process.exit(1);

//For later maybe but Yargs is acceptable
var more = `
  ${appStartMessage}
  
  # Execute in the current directory of images you want contact sheet to be
  gicsl[-d|-f [TARGET FILE]] (--label --verbose)
  --label   extract checkpoint label from filename
  
  ## Example:
  
  gicsl -f ../mycontactsheet.jpg  #target file
  pwd
  /tmp/myimagedata
  gicsl-d                        #Will be ../_myimagedata.csm.jpg
  
  gicsl -d --label  # Assuming this file in directory: vm_s01-v01_768x___285k.jpg
  # will extract 285 and add that instead of filename

  --verbose   # I let you guest what it does ;)
  ----------------------------------------------------------------
  `;


//-----------------------------VERBOSE
var v = argv.verbose;

vb(appStartMessage, "", "", "");
vb("VERBOSE IS ON");
//process.exit(1);

var l = argv.label;
var noclean = argv.noclean;

var feh = argv.feh;
var fehExec = "feh -F "; //Def the process opening the image if -feh is used (might be diff on other platform)
if (process.env.feh) fehExec = process.env.feh;

if (l) vb("LABEL MODE IS ON");

var filein = argv.file ? argv.file : null;

//Use the first arguments as file if not BASEDIRNAME
if (filein) {
  //@a We have specified an output file for the CS
  target_file = filein;
  vb("FILE WAS SPECIFIED: " + target_file);
  // console.log(target_dir);
}
else if (argv.directory) {
  //@status We assume a one level file with the name of this folder will be created
  vbl();
  vb("USING DIR BASENAME TO GENERATE FILE");
  // var cdir = process.cwd();
  var cdirResolved = path.resolve(".");
  var cdirBasename = path.basename(cdirResolved);

  vb("Basename is: " + cdirBasename);
  target_file = "../" + preFix + cdirBasename + sufFix + ext;
  //@STCGoal That we have a file in ../_$basedir.csm.jpg created if noargs.

} else {
  console.log(appStartMessage);
  console.log("DOHHHH\nMigt want to use --directory (-d)"
    + " \n or --help ;)");
  process.exit(1);
}

vb("target_file:" + target_file);
//process.exit(1);
target_file_name_only = path.basename(target_file);
target_dir = path.dirname(target_file);

// console.log(target_file);
// console.log(target_dir);
// console.log(target_file_name_only);
// process.exit(1);
// process.exit(0);

if (os == "win32") {
  //running context will use Powershell to run docker
  const Shell = require('node-powershell');

  const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
  });

  ps.addCommand(`$in = \${PWD}.path;$out = Resolve-Path ${target_dir};echo "$in";"$out"`);

  ps.invoke()
    .then(output => {
      //console.log(output);

      make_docker_cmd_Then_RUN(output);
    })
    .catch(err => {
      console.log(err);
    });
}
else {
  //we assume linux
  var cmd = require('node-cmd');

  //*nix supports multiline commands

  // cwd = cmd.runSync('echo "$(pwd)"');
  // outputting(cwd);
  cmd.run(
    `export indir=$(pwd);export outdir="$(realpath ${target_dir})";echo "$indir\n$outdir"`,
    function (err, data, stderr) {
      // console.log(data);
      make_docker_cmd_Then_RUN(data);
    }
  );

}

var targetOutput = "";
/**
 * Make a docker container command from input system dir and target dir prepared for the required platform path token (slash or backslash, why do windows choose backslash, anyway ?? to make us code this..nahh)
 * By Guillaume Descoteaux-Isabelle, 2020
 * @param {*} output 
 */
function make_docker_cmd_Then_RUN(output) {
  var arr = output.split("\n");
  var inPath = arr[0];
  var outPath = arr[1];
  targetOutput = outPath;
  var callArgs = "";

  if (l) {
    callArgs += " --label"; //Add call args label extraction
    vb("--label was used");
  }
  if (noclean) {
    callArgs += " --noclean"; //Add call args noclean
    vb("--noclean was used");
  }
  var cmdToRun =
    `docker run -d -t --rm ` +
    `-v ${inPath.trim()}:${mount_in} ` +
    `-v ${outPath.trim()}:${mount_out}  ` +
    `${container_tag}  ` +
    `${target_file_name_only}` +
    `${callArgs}`;

  vb("\nDocker Commands:\n\t ", cmdToRun + "\n");
  platform_run(cmdToRun);

}

const specialMessageForWindowsIssues = `
--------------Windows Issue WARNING------------
--:s                                        ---  
-----------You can press CTRL+C twice to break-
-----------back to terminal at any time       -
-----------and the process will continue in BG-          
-----------------------------------------------
`;

/**
 * Run a command on the platform context using node-cmd or node-powershell basically makes running commands compatible with windows.
 * by Guillaume Descoteaux-Isabelle, 2020
 * @param {*} cmdToRun 
 */
function platform_run(cmdToRun) {

  vb("Running: " + cmdToRun);
  vb("  on platform: " + os);

  if (os == "win32") {
    vb("Windows system detected");
    //running context will use Powershell to run docker
    const Shell = require('node-powershell');

    const ps = new Shell({
      executionPolicy: 'Bypass',
      noProfile: true
    });

    ps.addCommand(cmdToRun);
    ps.invoke()
      .then(output => {
        console.log(output);
        console.log(specialMessageForWindowsIssues);
        if (feh) console.log("--feh not implemented on windows yet");

        if (feh) {
          if (!process.env.feh) console.log("WARNING - It might not work, think of settin env var :  export feh=\"myviewer args\" \n");
          else {
            console.log("-- Result will open pretty soon----\n-------------------------------");
            //@a OPEN THE RESULT
            var fehCMD = `${fehExec} ${targetOutput.replace("/","\\")}  `;
            var fullCMD = `(sleep 2;echo "opening image result soon";sleep 5;${fehCMD})&`;

            const ps2 = new Shell({
              executionPolicy: 'Bypass',
              noProfile: true
            });

            ps2.addCommand(fehCMD);
            ps2.invoke()
              .then(output2 => {
                console.log(output2);
                console.log("We should be viewing it now...or pretty soon");

              }
              );
          }
        }

      })
      .catch(err => {
        console.log(err);
      });
  }
  else {
    vb("Non windows os detected");
    //we assume linux
    var cmd = require('node-cmd');

    cmd.run(
      cmdToRun,
      function (err, data, stderr) {
        if (stderr) console.log(stderr);
        if (err) console.log(err);
        else {
          console.log(data);
          console.log(`---------------------------
          Container is working in background and will stop when done :)`);
          console.log(` your result will be : ${target_file}
          ---------------------------------------`);
          if (feh) {
            console.log("-- Result will open pretty soon----\n-------------------------------");
            //@a OPEN THE RESULT
            var fehCMD = `${fehExec} ${targetOutput}  `;
            var fullCMD = `(sleep 2;echo "opening image result soon";sleep 5;${fehCMD})&`;
            cmd.run(fullCMD, function (err, data, stderr) {
              if (stderr) console.log(stderr);
              if (err) console.log(err);
              else {
                console.log("We should be viewing it now...or pretty soon");
                console.log(data);
              }
            });

          }
        }

      }
    );

  }

}

function vb(log, b4Log = " ", prefix = "----", separator = " : ") {
  if (v) console.log(prefix + b4Log + separator + log);
}

function vbl(name = "-------") {
  if (v) console.log(`------------------${name}----------------`);
}