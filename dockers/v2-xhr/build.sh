export container_tag=jgwill/gis-csm:xhr
cp ../../make_sheetv2-xhr.sh .
docker build -t $container_tag . --no-cache
docker push $container_tag
