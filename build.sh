export container_tag=jgwill/gis-csm

docker build -t $container_tag . --no-cache
docker push $container_tag
