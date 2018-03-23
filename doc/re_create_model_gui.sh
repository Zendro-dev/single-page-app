echo 'Deleting existing components and recreating them'

rm -f ./src/components/*
rm -f ./src/router/*
rm -f ./src/sciencedb-globals.js

sh ./doc/create_model_gui.sh
