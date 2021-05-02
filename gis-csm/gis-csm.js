#!/usr/bin/env node
/** Guillaume Isabelle GIS-CSM
 * Vision: Simply create a contact sheet using Docker container
 
 * Current Reality:First testing
 */

var preFix = "_";var sufFix = ".csm";var ext = ".jpg";
var container_tag = "jgwill/gis-csm";
var mount_in = "/work/input";
var mount_out = "/out";

var os = process.platform;

const { fstat } = require('fs');
//console.log("__dirname:" + __dirname);


var path = require('path');
var fs = require('fs');
var resolve = path.resolve;

//Init vars
var target_file ="";
var target_file_name_only ="";
var target_dir = "";

var myArgs = null;
try {
  myArgs = process.argv.slice(2);
  
} catch (error) {
  
}

var appStartMessage = 
`Multi platform Contact Sheet maker
By Guillaume Descoteaux-Isabelle, 2020
version 0.1.33
----------------------------------------`;
if (myArgs && myArgs[0] == "--help")
{
  console.log(`
${appStartMessage}
  
  # Execute in the current directory of images you want contact sheet to be
  gis-csm ([TARGET FILE]) (--label)
  --label   extract checkpoint label from filename

  ## Example:

  gis-csm ../mycontactsheet.jpg  #target file
  pwd
  /tmp/myimagedata
  gis-csm                         #Will be ../_myimagedata.csm.jpg

  gis-csm   # Assuming this file in directory: vm_s01-v01_768x___285k.jpg
            # will extract 285 and add that instead of filename
  ----------------------------------------------------------------
  `);
  process.exit(0);
}

//-----------------------------VERBOSE
var v = false;
if (myArgs && (myArgs[0] || myArgs[1]) &&(myArgs[0] == "--verbose" || myArgs[1] == "--verbose"  ) )v=true;
vb(appStartMessage,"","","");
vb("VERBOSE IS ON");
//process.exit(1);

var l = false;
if (myArgs && (myArgs[0] || myArgs[1]) &&(myArgs[0] == "--label" || myArgs[1] == "--label"  ) )l=true;
if (l) vb("LABEL MODE IS ON");

//Use the first arguments as
if (myArgs &&
     (myArgs[0] != "--verbose" && myArgs[0] != "--label" )
)
{
  //@a We have specified an output file for the CS
  target_file = myArgs[0];  
  // console.log(target_dir);
}
else
{
  //@status We assume a one level file with the name of this folder will be created
  vbl();
  vb("USING DIR BASENAME TO GENERATE FILE");
  // var cdir = process.cwd();
  var cdirResolved = path.resolve(".");
  var cdirBasename = path.basename(cdirResolved);
  
  vb("Basename is: " + cdirBasename);
  target_file =  "../" + preFix + cdirBasename + sufFix + ext ;
  //@STCGoal That we have a file in ../_$basedir.csm.jpg created if noargs.
  
}

vb("target_file:" + target_file);
//process.exit(1);
target_file_name_only = path.basename(target_file);
target_dir = path.dirname(target_file);

// console.log(target_file);
// console.log(target_dir);
// console.log(target_file_name_only);
//process.exit(0);

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
    
    make_docker_cmd(output);
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
      make_docker_cmd(data);
    }
    );
    
  }
  
  
  /**
   * Make a docker container command from input system dir and target dir prepared for the required platform path token (slash or backslash, why do windows choose backslash, anyway ?? to make us code this..nahh)
   * By Guillaume Descoteaux-Isabelle, 2020
   * @param {*} output 
   */
  function make_docker_cmd(output) {
    var arr = output.split("\n");
    var inPath = arr[0];
    var outPath = arr[1];
    var callArgs = "";
    
    if (l) callArgs+= " --label"; //Add call args label extraction

    var cmdToRun =
    `docker run -d -t --rm ` +
    `-v ${inPath.trim()}:${mount_in} ` +
    `-v ${outPath.trim()}:${mount_out}  ` +
    `${container_tag}  ` +
    `${target_file_name_only}` +
    `${callArgs}`;
    
    vb("\nDocker Commands:\n\t ",cmdToRun + "\n");
    platform_run(cmdToRun);
    
  }
  
  /**
   * Run a command on the platform context using node-cmd or node-powershell basically makes running commands compatible with windows.
   * by Guillaume Descoteaux-Isabelle, 2020
   * @param {*} cmdToRun 
   */
  function platform_run(cmdToRun) {
    
    console.log("Running: " + cmdToRun);
    console.log("  on platform: " + os);
    
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
        console.log("--Win32 Issue:  You can press CTRL+C to break back to terminal at any time");
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
          if (err) console.log(err);
          if (stderr) console.log(stderr);
          console.log(data);
          
        }
        );
        
      }
      
      console.log(`---------------------------
      Container is working in background and will stop when done :)`);
      console.log(` your result will be : ${target_file}
      ---------------------------------------`);
    }

function vb(log,b4Log=" ",prefix="----",separator=" : "){
  if (v) console.log(prefix +b4Log+ separator+ log);
}

function vbl(name="-------"){
  if (v) console.log(`------------------${name}----------------`);
}