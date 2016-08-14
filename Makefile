default: tmp/Sega\ -\ Dreamcast.dat

node_modules:
	npm install

tmp: node_modules
	mkdir -p tmp

tmp/redump.zip: tmp
	wget -O tmp/redump.zip http://redump.org/datfile/dc/

tmp/redump.xml: tmp/redump.zip
	unzip tmp/redump.zip -d tmp
	mv tmp/*.dat tmp/redump.xml

tmp/Sega\ -\ Dreamcast.dat: tmp/redump.xml
	node .

clean:
	rm -rf tmp
