export container_tag=jgwill/gis-csm-hr
cp ../../make_sheetv2-hr.sh .
docker build -t $container_tag . --no-cache
docker push $container_tag
