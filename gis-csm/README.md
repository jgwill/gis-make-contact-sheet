# Cross Platform Contact Sheet maker

Making a contact sheet and adapt to Operating system context.

# Usage
## Run from directory where all your files are
```sh
gis-csm ../mycontactsheet.jpg #specify target image
gis-csm   # no target will use _$CURRENT_BASEDIR.csm.jpg

# It will start the docker container in bg to do its work
```
# Install

```sh
npm i gis-csm --g
docker pull jgwill/gis-csm
```

# Dependencies

* Docker
* NodeJS (obviously ;) )


----

# Further research

* Use this project as a model to build Command Wrapper for Containerized infrastructure

