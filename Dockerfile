FROM jgwill/imagemagick

ENV DEBIAN_FRONTEND noninteractive

####
WORKDIR /work
COPY make_sheetv2.sh .
#COPY _exec.sh .
ENTRYPOINT ["/bin/bash","make_sheetv2.sh"]
