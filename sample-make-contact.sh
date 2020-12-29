#!/bin/bash

export container_tag=jgwill/gis-csm
export source_dir=$1
export out_dir=$(pwd)
export out_file_name=mycontact.jpg

docker run --rm \
    -v $source_dir:/work/input \
    -v $out_dir:/out \
    $container_tag \
 $out_file_name

