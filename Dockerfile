FROM jgwill/imagemagick

ENV DEBIAN_FRONTEND noninteractive

####
WORKDIR /work
COPY make_sheetv1.sh .
ENTRYPOINT ["/bin/bash","make_sheetv1.sh"]