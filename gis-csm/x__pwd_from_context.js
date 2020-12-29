
var os = process.platform;
var cwd = "";

if (os == "win32") {
  //running context will use Powershell to run docker
  const Shell = require('node-powershell');

  const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
  });

  ps.addCommand('echo ${PWD}.path');
  ps.invoke()
    .then(output => {
      //console.log(output);

      outputting(output);
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
    `echo $(pwd)`,
    function (err, data, stderr) {
      // console.log(data);
      outputting(data);
    }
  );

}
function outputting(out) {


  console.log("---CWD: ");
  console.log(out);
}