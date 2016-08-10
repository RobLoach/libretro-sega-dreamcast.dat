default: tmp/NEC\ -\ PC\ Engine\ CD\ -\ TurboGrafx-CD.dat

node_modules:
	npm install

tmp: node_modules
	mkdir tmp

tmp/redump.zip: tmp
	wget -O tmp/redump.zip http://redump.org/datfile/pce/

tmp/redump.xml: tmp/redump.zip
	unzip tmp/redump.zip -d tmp
	mv tmp/*.dat tmp/redump.xml

tmp/NEC\ -\ PC\ Engine\ CD\ -\ TurboGrafx-CD.dat: tmp/redump.xml
	node .

clean:
	rm -rf tmp
