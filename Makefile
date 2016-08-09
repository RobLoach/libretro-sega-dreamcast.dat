default: tmp/Sega\ -\ Mega\ CD.dat

node_modules:
	npm install

tmp: node_modules
	mkdir tmp

tmp/redump.zip: tmp
	wget -O tmp/redump.zip http://redump.org/datfile/scd/

tmp/redump.xml: tmp/redump.zip
	unzip tmp/redump.zip -d tmp
	mv tmp/*.dat tmp/redump.xml

tmp/Sega\ -\ Mega\ CD.dat: tmp/redump.xml
	node .

clean:
	rm -rf tmp
