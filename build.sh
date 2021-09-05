ccsfiles=`ls ./dist/*.css`
for eachfile in $ccsfiles
do
   minify $eachfile > "$eachfile.min"
   rm $eachfile
   mv "$eachfile.min" "$eachfile"
done

jsfiles=`ls ./dist/*.js`
for eachfile in $jsfiles
do
   minify $eachfile > "$eachfile.min"
   rm $eachfile
   mv "$eachfile.min" "$eachfile"
done
