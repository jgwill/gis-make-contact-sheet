export container_tag=jgwill/gis-csm

docker build -t $container_tag .
docker push $container_tag
