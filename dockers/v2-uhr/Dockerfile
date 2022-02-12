#FROM jgwill/imagemagick
FROM jgwill/alpine:imagemagick

#ENV DEBIAN_FRONTEND noninteractive

####
WORKDIR /work
COPY make_sheetv2-uhr.sh .
RUN dos2unix *sh
#COPY _exec.sh .
ENTRYPOINT ["/bin/bash","make_sheetv2-uhr.sh"]
