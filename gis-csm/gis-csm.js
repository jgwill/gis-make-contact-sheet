#!/usr/bin/env node
/** Guillaume Isabelle GIS-CSM
 * Vision: Simply create a contact sheet using Docker container
 
 * Current Reality:First testing
 */

var os = process.platform;

var myArgs = process.argv.slice(2);
var target_file = myArgs[0];
var path = require('path');
var resolve = path.resolve;
var target_file_name_only = path.basename(target_file);
var target_dir = path.dirname(target_file);
console.log(target_dir);
var mount_in = "/work/input";
var mount_out = "/out";

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

      run_docker(output);
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
      run_docker(data);
    }
  );

}

var container_tag = "jgwill/csm";

function run_docker(output) {
  var arr = output.split("\n");
  var inPath = arr[0];
  var outPath = arr[1];

  console.log(
    `docker run -it --rm \\
    -v ${inPath.trim()}:/work/input \\
    -v ${outPath.trim()}:/out \\
    ${container_tag} \\
    ${target_file_name_only}`);
  // console.log(out);
}