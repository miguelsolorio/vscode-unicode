import './ui.css'

const container = <HTMLElement>document.getElementById("container")
const searchbox = <HTMLInputElement>document.getElementById('search')

let styleCount:number

onmessage = (event) => {

	const pluginMessage = event.data.pluginMessage
	console.log('plugin loaded...')
	

	if (pluginMessage.type == 'loadStyles') {
		
		console.log('loading styles...')

		let counter = pluginMessage.styles[0].length
		let categories = []
		pluginMessage.styles[0].forEach((style: any, index: number) => {

			let styleName:string = style.name
			let styleId:number = style.id
			let styleColor:string = style.color
			let styleDescription:string = style.description
			let styleParent:string
			let styleShortName:string
			if (styleName.includes("/")) {

				if ((styleName.split('/').length - 1) > 1) {
				  styleParent = styleName.substr(0, styleName.lastIndexOf('/'))
				  styleShortName = styleName.substring(styleName.lastIndexOf("/") + 1)
				} else {
				  styleParent = styleName.substr(0, styleName.indexOf('/'))
				  styleShortName = styleName.substring(styleName.indexOf("/") + 1)
				}
		
				// Remove whitespace from first character in name
				if (styleName.charAt(0) == ' ') {
					styleShortName = styleName.replace(/ /g,'')
				}
				
			  }

			let newStyleParent = styleParent.split('/')[1].replace(/ /g,'');
			
			if(categories.indexOf(styleParent) === -1){
				categories.push(styleParent)
				container.innerHTML += `
						<li class="category-item">${newStyleParent}</li>
					`
			}
			
			let newItem:string = `
				<li data-id="${styleId}" data-category="${newStyleParent}" class="style-item">
					<div class="color" style="background-color: #${styleColor};"></div>
					<div class="name" data-name="${styleName}">${styleShortName}</div>
					<div class="description">${styleDescription}</div>
				</li>`

			container.innerHTML += newItem;

			if ((index + 1) === counter) {
				
				console.log(categories)
				console.log('👏 done loading styles')
				startListening()
			}
		})
		

	}

}

function startListening(){
	searchbox.addEventListener('keyup', function (e) {
		filterList()
	});

	document.getElementById("container").addEventListener('click', function(e){
        let target = <HTMLElement>e.target
		let styleId = String(target.getAttribute('data-id'))
		
		console.log(styleId)

        parent.postMessage({ pluginMessage: { type: 'apply-styles', styleId }}, '*')   

    })

}

function filterList(){
	let searchValue:string = searchbox.value.toLowerCase()
	
	document.querySelectorAll('.style-item').forEach(item => {
		let itemParent = <HTMLElement>item
		let itemName = <HTMLElement>item.childNodes[3]
		let styleName:string = itemName.innerHTML.toLowerCase()
		
		let itemDescription = <HTMLElement>item.childNodes[5]
		let styleDescription:string = itemDescription.innerHTML.toLowerCase()

		if(styleName.includes(searchValue) || styleDescription.includes(searchValue)){
			itemParent.classList.remove('hidden')
		} else {
			itemParent.classList.add('hidden')
		}
	})

	document.querySelectorAll('.category-item').forEach(c => {
		let category = c.innerHTML
		let count = 0
		document.querySelectorAll(`[data-category='${category}']`).forEach(item => {
			if(!item.className.includes('hidden')){
				count++;
			}
		})
		console.log(count)
		if(count === 0){
			c.classList.add('hidden')
		} else {
			c.classList.remove('hidden')
		}
	})
}

searchbox.focus()