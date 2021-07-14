export container_tag=jgwill/gis-csm-hr

docker build -t $container_tag . --no-cache
docker push $container_tag
