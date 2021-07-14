export container_tag=jgwill/gis-csm-uhr
cp ../../make_sheetv2-uhr.sh .
docker build -t $container_tag . --no-cache
docker push $container_tag
