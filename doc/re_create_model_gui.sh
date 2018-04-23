echo 'Deleting existing components and recreating them'

ls ./src/components/* | grep -vP 'Login|Home' | awk '{print "rm -f " $1}' 
#rm -f ./src/router/*
#rm -f ./src/sciencedb-globals.js

#sh ./doc/create_model_gui.sh
