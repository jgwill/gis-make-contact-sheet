# Cross Platform Contact Sheet maker

Making a contact sheet and adapt to Operating system context.

# Usage

>Other alias : gicsl

## Run from directory where all your files are
```sh
gis-csm -f ../mycontactsheet.jpg #specify target image
gis-csm -d  # no target will use _$CURRENT_BASEDIR.csm.jpg
gis-csm -d  # idem + it will open in viewer the CS

# for file that has a digit (sequence as last number for the labeling)
gis-csm -f -l ../mycontactsheet.jpg #specify target image
gis-csm -d -l # no target will use _$CURRENT_BASEDIR.csm.jpg
gis-csm -d --label # idem

gis-csm -d --label --feh # idem + it will open in viewer the CS

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

