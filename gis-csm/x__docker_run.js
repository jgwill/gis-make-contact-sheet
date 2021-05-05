
var os = process.platform;



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
    `echo $(pwd)`,
    function (err, data, stderr) {
      // console.log(data);
      run_docker(data);
    }
  );

}
function run_docker(out) {
  var container_tag="jgwill/csm";

  console.log(`docker run -it --rm -v ${out.trim()}:/work/input ${container_tag} `);
  // console.log(out);
}