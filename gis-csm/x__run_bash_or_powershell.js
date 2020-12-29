
var os = process.platform;
var cwd = ""
if (os == "win32") {
  //running context will use Powershell to run docker
  const Shell = require('node-powershell');

  const ps = new Shell({
    executionPolicy: 'Bypass',
    noProfile: true
  });

  ps.addCommand('echo node-powershell ${PWD}');
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

  //*nix supports multiline commands

  cmd.runSync('echo "We are in Linux context $(pwd)"');

  cmd.run(
    `echo docker run ... -v $(pwd):/out`,
    function (err, data, stderr) {
      console.log('examples dir now contains the example file along with : ', data)
    }
  );

}