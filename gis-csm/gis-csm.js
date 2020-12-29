#!/usr/bin/env node
/** Guillaume Isabelle GIS-CSM
 * Vision: Simply create a contact sheet using Docker container
 
 * Current Reality:First testing
 */
var container_tag = "jgwill/gis-csm";
var mount_in = "/work/input";
var mount_out = "/out";




var os = process.platform;

var myArgs = process.argv.slice(2);
var target_file = myArgs[0];
var path = require('path');
var resolve = path.resolve;
var target_file_name_only = path.basename(target_file);
var target_dir = path.dirname(target_file);
// console.log(target_dir);

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


function make_docker_cmd(output) {
  var arr = output.split("\n");
  var inPath = arr[0];
  var outPath = arr[1];

  var cmdToRun =
    `docker run -d -t --rm ` +
    `-v ${inPath.trim()}:${mount_in} ` +
    `-v ${outPath.trim()}:${mount_out}  ` +
    `${container_tag}  ` +
    `${target_file_name_only}`;

  platform_run(cmdToRun);

}

function platform_run(cmdToRun) {

  console.log("Running: " + cmdToRun);
  console.log("  on platform: " + os);

  if (os == "win32") {
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
      })
      .catch(err => {
        console.log(err);
      });
  }
  else {
    //we assume linux
    var cmd = require('node-cmd');

    cmd.run(
      cmdToRun,
      function (err, data, stderr) {
        console.log(data);

      }
    );

  }

  console.log("Container is working in background and will stop when done :)");
  console.log(` your result will be : ${target_file}`);
}