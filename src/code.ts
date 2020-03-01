figma.showUI(__html__, { width: 400, height: 360 });

let darkTheme = [
	'90ff5d9a9932808273c1a69ecb457fb3e816a852',
	'bf2280de33c53944f688af3e5a571c99a53d20b5',
	'099dcb5bd2baddb0ad3c54d08256b45e722a6a3e',
	'c919ac2c18713828af4b58516fa9534791dd4bc4',
	'47a7c845437166cbe05702949e322ebb60495929',
	'ac7c2d54d50f0870d27f75a3f97bcf7f655d5312',
	'9fc238b130e8f6f24ab1ecfaff5ecd1f1389528f',
	'183ffc5e2148aa8920343559accaf39d0259ad99',
	'921c1632dec963521ed316013c727d5b8197c476',
	'07f0e7df7cff216f9fcfb22e1d517f4eb5639bd3',
	'14460f0b1237862f7148b2d194b1ddd6c701f4ad',
	'418d16a0d0d672321583e8700ebfc61289639d5f',
	'505c42cd5657c5022ee0c86d508f960c97c806b5',
	'fa345a861a2b71b91ae973daea5b004cf1203149',
	'7c806d468a8eb2176c46ce8832eab5a8acad2020',
	'5c6dfaee4d6cf818eb8dc79f2d52633e097b6c06',
	'8811cc978e8517251e330789ef1aa3fe384adb3d',
	'a8bc846bbaf875b757f96a6345d3d02fb20f2a2c',
	'3614fc0a308e8e8f82327998a5973c7a61092f04',
	'a03fbb4f84705201ea945cb26ef98f5e5e26d963',
	'0070316030a7c188c9e1dcedea0187d2949bd883',
	'4af991036504badf5c4d0578516168df56be594d',
	'26627bca9883d9200e386a8d5462eff78a0035b8',
	'ab12677724b5168c67a01f37f6603045ccb881f7',
	'b728b193e7c2ee35b343017d7096244dfc5f4f18',
	'7b9ad4681d635f48ca10988c74ad4724a48b2c56',
	'38f4bdbf5944d6a54bc929cc13c6acdde3ab1e64',
	'476f1f7fe0b9c1df5a2b1e902fdd9ec89ae042fc',
	'12d683debebbde56b56061e5c898ae0248e25b5e',
	'68d9760b7939f35ad04e87fc92f207c6b52e8ae0',
	'672b84d98a00b11ef932ccb9b54cda31c4a517f8',
	'64d98940992f2aed005ac9f2f34642b25e35de01',
	'13c5b77d12213348b02313f2c4eff7ae4699bd24',
	'd55e9e58b332fe1bfe73639bdbb68b196108be08',
	'cc9759fe532dc9fe58b749262ea66158ef772d7d',
	'b25aa6c99f7b37725817d2239341cc679809d240',
	'b239a43290d678f3b227b59cc75c16d903a90d36',
	'efbcec1b827c37f82d8db3bba2cc03ecd8f9fe96',
	'0f091d66f1c53aa0d51a6a4370ee533f5b6eb665',
	'a3ea305f24ea04cd017ccaf2bdf5dc7546382cc9',
	'272341d23320381dbab91cac950a621fe1671693',
	'c14b04cd9e1f871197d8dd442cc92dc5425db315',
	'641167bcf73821338b06bd1f10e1cdecc525f6bd',
	'b007c83c9f01f799ba53866025d5050b65490977',
	'74affa436e157562d169fda6e11753e5f882483a',
	'1105038453d943bd7c0e161d0a629ef69e728ac2',
	'b697b710b887719ab36631c57e782c8782d05bb5',
	'3d7214d981f99f5448b5f468c3f2531925e09d8d',
	'14273d571b98ba2bcd38e68fae6e260bd4f2e3b7',
	'e291f0df433876cf66ff7c17d64892adcb553029',
	'3fbeb9143e8d541519ff9c327a0cf8e2326055fd',
	'41f0c94d560e9b73b202dfc059e411effca235a4',
	'd42f23f96d794a9a77b06f33e64c0a60d9a65e4d',
	'6c135a228b64291abbe34aea91f1365c84c488fe',
	'f3420117ee3e4a8d828319a7db4d6924b62c4a17',
	'da2977b71fccaab097947bf6e615da87f4dedb8b',
	'59b510d1b6309bd5a0df5b82b3e0693395323baf'
]

let ref = new Array
let count = darkTheme.length
let current = 1

darkTheme.forEach(styleKey => {

	let style = figma.importStyleByKeyAsync(styleKey)
	
	style.then(function(object){
		let styleId = object.id
		let styleName = object.name
		let styleDescription = object.description
		let styleColorRaw = <SolidPaint>object.paints[0]
		let styleColor = findTheHEX(styleColorRaw.color.r, styleColorRaw.color.g, styleColorRaw.color.b)
		
		ref.push({
			id: styleId,
			key: styleKey,
			name: styleName,
			description: styleDescription,
			color: styleColor
		})

		if(current == count){
			ref.sort((n1,n2) => n1 - n2)
			ref.reverse()
			
			figma.ui.postMessage({ type: 'loadStyles', styles: [ref] })
		} else {
			current++
		}

		
		
		
	})

})

figma.ui.onmessage = async msg => {

	if (msg.type === "apply-styles") {
		let style = msg.styleId

		if(figma.currentPage.selection.length > 0){
			figma.currentPage.selection.forEach(node => {
				(node as VectorNode).fillStyleId = style
			})
		} else {
			// show notification
			console.log("No layer selected")
			figma.ui.postMessage({ type: 'noLayerSelected', isEmpty: true })
		  }
	}

}

function findTheHEX(red: number, green: number, blue: number) {
	var redHEX = rgbToHex(red)
	var greenHEX = rgbToHex(green)
	var blueHEX = rgbToHex(blue)

	return redHEX + greenHEX + blueHEX
}

function rgbToHex(rgb: any) {
	rgb = Math.floor(rgb * 255)
	var hex = Number(rgb).toString(16)
	if (hex.length < 2) {
		hex = '0' + hex
	}
	return hex
}