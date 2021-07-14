#!/bin/bash

#@STCGoal ADD Feature Custom Label that is a Checkpoint.
export out=$1
export tngeo=1024
export pointsize=44
export lfsuffix='l.jpg'
export tngeox=$tngeo'x'
logfile=/work/input/log.csm.txt
label='%f'
echo "----DEBUG::$out--------$(date)--------"
#sleep 1
# ls /out
# pwd
# df -h /out
# df -h /work/input

wdir=/work/build

if [ "$2" == "--label" ]  ||  [ "$3" == "--label" ]   ||  [ "$3" == "-l" ] ||  [ "$2" == "-l" ] ;then
   echo "--- We have arguments..."
   #sleep 1
   echo "-----------------------" >> $logfile
   echo "----------$(date)------" >> $logfile
   echo "----------$1------" >> $logfile
   echo "----------$2------" >> $logfile

   rm -rf $wdir
   mkdir -p $wdir
   #@a Loop foreach in input/*.{jpg,JPG,png,PNG,bmp,BMP} and create thumbnails in $wdir
   cd /work/input
   c=0
  #echo "----" > /out/tmpls.txt

   for i in *.{jpg,JPG,png,PNG,bmp,BMP} ; do
      if [ -f "$i" ]; then
         #echo "$i" >> /out/tmpls.txt
         echo "Processing:---$i------" >> $logfile
         #@a Construct custom label with the last segment __$ckp.jpg
         # /x__Unsupervised_Segmentation__2011030205__1k_vm_s01-v01_768x___285k.jpg
         # we want :   285
         fn=$i
         fnb=${fn%.*}
         arrF=(${fnb//__/ })
         arrSize=${#arrF[@]}
         arrCount=$(expr $arrSize - 1)
         tmpstring=${arrF[arrCount]}
         echo "DEBUG::arrSize:$arrSize, arrCount:$arrCount, arrF:$arrF"
         #>> $logfile
         #echo "DEBUG::{arrF[arrCount]}=${arrF[arrCount]}">> $logfile
         # Clean the string from char to keep only number
         secondString=""
         replacerstr="_"
         tmpstring="${tmpstring/$replacerstr/$secondString}"
         replacerstr="k"
         tmpstring="${tmpstring/$replacerstr/$secondString}"
         replacerstr="m"
         tmpstring="${tmpstring/$replacerstr/$secondString}"
         #padding tree zero
         #echo "DEBUG:STRING_BFORE:tmpstring=$tmpstring" 
         #>> $logfile
         tmpstring=`printf %03d $tmpstring`
         #echo "DEBUG:STRING:tmpstring=$tmpstring" >> $logfile
         
         label=$tmpstring
         cc=`printf %03d $c`
         tfile=$cc'__'$label'.jpg'
         tfile=$label'.jpg'
         tfile=$label
         echo "Resized: $tmpstring  : $tfile" >> $logfile

         #echo convert -geometry $tngeox -auto-orient $i $wdir/$tfile>> /out/tmpls.txt
         convert -geometry $tngeox -auto-orient $i $wdir/$tfile
         #echo "---just converted to  $wdir/$tfile" >> /out/tmpls.txt
         #echo "../wdir/tfile=../$wdir/$tfile">> log.csm.txt
         #@state image is resized in $wdir

         c=$( expr $c + 1 )
      fi
   done
#    echo "---just done loop: ls  $wdir" >> /out/tmpls.txt
#    ls $wdir >> /out/tmpls.txt

#    echo "ls /out" >> $logfile
#    echo "---" >> $logfile
# ls /out >> /out/tmpls.txt
#    echo "---" >> $logfile

   cd /work
   #echo "---$wdir content: ">> $logfile
   echo "ls $wdir" >> $logfile
   ls $wdir >> $logfile

   echo "-----$out---DONE RESIZE----$(date)----">> $logfile

   fn=$1
   echo "DEBUG::fn=$fn" >> $logfile
   fnb=${fn%.*}
   export out=/work/$fnb.$lfsuffix
   echo "DEBUG::out=$out" >> $logfile

   #exit 0
   echo    montage -verbose -label '%f' -font Helvetica -pointsize $pointsize -background '#000000' -fill 'gray' -define jpeg:size=$tngeo'x'$tngeo -geometry $tngeo'x'$tngeo+2+2  -auto-orient $wdir/* $out >> $logfile

   # montage -verbose -label '%f' -font Helvetica -pointsize 11 -background '#000000' -fill 'gray' -define jpeg:size=$tngeo'x'$tngeo -geometry $tngeo'x'$tngeo+2+2 -auto-orient $wdir/* /out/$out
   montage -verbose -label '%f' -font Helvetica -pointsize $pointsize -background '#000000' -fill 'gray' -define jpeg:size=$tngeo'x'$tngeo -geometry $tngeo'x'$tngeo+2+2 \
      -auto-orient $wdir/* "$out"
   
  #echo "montage ...    -auto-orient $wdir/* /out/$out "  >> $logfile

   # montage -verbose -label '%f' -font Helvetica -pointsize 11 -background '#000000' -fill 'gray' -define jpeg:size=$tngeo'x'$tngeo -geometry $tngeo'x'$tngeo+2+2 -auto-orient $wdir/*.{jpg,JPG,png,PNG,bmp,BMP} /out/$out

   # Keeping the TN
   cd $wdir 
   for f in * # Give them back their JPG name from previous labeling workaround
      do
         mv $f $f'.jpg'
      done

   cd ..

   echo "-----$out---ALL DONE------$(date)------">> $logfile
   echo "---------------------------------------">> $logfile

   chown 1000.1000 $out

   # echo "----" > /out/tmp.txt
   # echo "ls /work/input" >> /out/tmp.txt
   # ls /work/input >> /out/tmp.txt
   # echo "ls ." >> /out/tmp.txt
   # ls  >> /out/tmp.txt
   # echo "ls /out" >> /out/tmp.txt
   # ls /out >> /out/tmp.txt
   # echo "ls /work/build" >> /out/tmp.txt
   # ls /work/build >> /out/tmp.txt
   # echo "out=$out" >> /out/tmp.txt
   # echo "PWD:" >> /out/tmp.txt
   # pwd >> /out/tmp.txt
   # ls >> /out/tmp.txt
   # ls build >> /out/tmp.txt
   # chown 1000.1000 /out/tmp.txt
   # echo cp $out /out>> /out/tmp.txt
   # echo ls out=$out >> /out/tmp.txt
   # ls $out >> /out/tmp.txt


   cp -r $wdir input #Temp to test listing in order

   #chown 1000.1000 /work/input/*

   if [ "$2" != "--noclean" ] && [ "$3" != "--noclean" ] && [ "$4" != "--noclean" ]  && [ "$5" != "--noclean" ]; then 
      echo "cleaning"
      rm -rf /work/input/build 
      rm $logfile
   #else
   fi
   # cp /work/input/_*.csm.l.jpg /out/
   # cp $out /work/input
   # cp /work/input/_*.csm.l.jpg /out/
   cp $out /out/
   
   

else
   montage -verbose -label $label -font Helvetica -pointsize $pointsize -background '#000000' -fill 'gray' -define jpeg:size=$tngeo'x'$tngeo -geometry $tngeo'x'$tngeo+2+2 -auto-orient input/*.{jpg,JPG,png,PNG,bmp,BMP} /out/$1
fi

chown 1000.1000 /out/*.csm.$lfsuffix
chown 1000.1000 /out/*.csm.jpg
# montage -verbose -label $label -font Helvetica -pointsize 10 -background '#000000' -fill 'gray' -define jpeg:size=$tngeo'x'$tngeo -geometry $tngeo'x'$tngeo+2+2 -auto-orient input/*.{jpg,JPG,png,PNG,bmp,BMP} /out/$1


sleep 5
