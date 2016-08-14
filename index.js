const fs = require('fs')
var xml = require('xml2js').Parser()
var pkg = require('./package')
const async = require('async')
const sort = require('sort-object')
const fileExists = require('file-exists')

// Construct the header.
var output = `clrmamepro (
	name "${pkg.title}"
	description "${pkg.title}"
	version "${pkg.version}"
	comment "${pkg.description}"
	homepage "${pkg.homepage}"
)\n`

// Read every XML dat file.
var files = [
	'tmp/redump.xml'
]

// Process each XML file.
async.map(files, processXml, function (err, results) {
	if (err) {
		throw err
	}

	// Loop through the results and build a game database.
	var games = {}
	for (var i in results) {
		for (var game in results[i]) {
			games[game] = results[i][game]
		}
	}

	// Loop through the sorted games database, and output the rom.
	for (var game in sort(games)) {
		var rom = games[game]
		output += `\ngame (
	name "${game}"
	description "${game}"
	rom ( name "${rom.name}" size ${rom.size} crc ${rom.crc} md5 ${rom.md5} sha1 ${rom.sha1} )
)\n`
	}

	// Write the new .dat file.
	fs.writeFileSync(`tmp/${pkg.title}.dat`, output)
})

/**
 * Process the given XML file.
 */
function processXml(path, done) {
	if (!fileExists(path)) {
		throw new Error(`$path does not exist. Make sure to download the DAT files correctly.`)
	}
	// Read in the file asyncronously.
	fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
		if (err) {
			return done(err)
		}

		// Convert the string to a JSON object.
		xml.parseString(data, (error, dat) => {
			if (error) {
				return done(error)
			}

			// Convert the JSON object to a Games array.
			var result = getGamesFromXml(dat)

			// We have the result, move to the next one.
			done(null, result)
		})
	})
}

/**
 * Convert an XML dat object to a games array.
 */
function getGamesFromXml(result) {
	var out = {}

	// Loop through each game.
	for (var i in result.datafile.game) {
		var game = result.datafile.game[i]

		// Find Track 1, since that is the only one to load.
		for (var x in game.rom) {
			var rom = game.rom[x]['$']
			if (rom.name.indexOf('.gdi') >= 0) {
				out[game.description[0]] = rom
				break
			}
		}
	}

	return out
}
