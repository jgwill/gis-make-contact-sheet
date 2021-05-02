#!/bin/bash

#@STCGoal ADD Feature Custom Label that is a Checkpoint.

label='%f'
if [ "$2" != "" ];then

   echo "-----------------------" >> input/log.csm.txt
   echo "----------$(date)------" >> input/log.csm.txt
   echo "----------$1------" >> input/log.csm.txt
   echo "----------$2------" >> input/log.csm.txt

   wdir=./build
   rm -rf $wdir
   mkdir -p $wdir
   #@a Loop foreach in input/*.{jpg,JPG,png,PNG,bmp,BMP} and create thumbnails in $wdir
   cd input
   c=0
   for i in *.{jpg,JPG,png,PNG,bmp,BMP}
      do
         #@a Construct custom label with the last segment __$ckp.jpg
         # /x__Unsupervised_Segmentation__2011030205__1k_vm_s01-v01_768x___285k.jpg
         # we want :   285
         fn=$i
         fnb=${fn%.*}
         arrF=(${fnb//__/ })
         arrSize=${#arrF[@]}
         arrCount=$(expr $arrSize - 1)
         tmpstring=${arrF[arrCount]}
         # Clean the string from char to keep only number
         secondString=""
         replacerstr="_"
         tmpstring="${tmpstring/$replacerstr/$secondString}"
         replacerstr="k"
         tmpstring="${tmpstring/$replacerstr/$secondString}"
         replacerstr="m"
         tmpstring="${tmpstring/$replacerstr/$secondString}"

         
         label=$tmpstring
         tfile=$c'__'$label'.jpg'
         echo "$tmpstring  : $tfile" >> log.csm.txt

         convert -geometry 200x -auto-orient $i ../$wdir/$tfile #@state image is resized in $wdir

         c=$( expr $c + 1 )
      done
   cd ..
   echo "---$wdir content: ">> input/log.csm.txt
   ls $wdir >> input/log.csm.txt
   echo "-----------DONE RESIZE----$(date)-----------">> input/log.csm.txt


fi
#exit 0

echo montage -verbose -label '%f' -font Helvetica -pointsize 11 -background '#000000' -fill 'gray' -define jpeg:size=200x200 -geometry 200x200+2+2 -auto-orient $wdir/*.{jpg,JPG,png,PNG,bmp,BMP} /out/$1 >> input/log.csm.txt

montage -verbose -label '%f' -font Helvetica -pointsize 11 -background '#000000' -fill 'gray' -define jpeg:size=200x200 -geometry 200x200+2+2 -auto-orient $wdir/*.{jpg,JPG,png,PNG,bmp,BMP} /out/$1

echo "--------ALL DONE------$(date)------------">> input/log.csm.txt
# montage -verbose -label $label -font Helvetica -pointsize 10 -background '#000000' -fill 'gray' -define jpeg:size=200x200 -geometry 200x200+2+2 -auto-orient input/*.{jpg,JPG,png,PNG,bmp,BMP} /out/$1
