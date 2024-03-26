
console.log('Hello React App!');

function getRandomInt(min, max) {
	return min + Math.floor(Math.random() * (max - min));
}

var itemCounter = 2;

class App extends ReactHTMLElement {

	state = {
		counter: 0,
		type: 'even',
		items: {
			i1: "Item 1",
			i2: "Item 2"
		}
	}

	click() {
		console.log('click');
		var counter = this.state.counter;
		this.setState({
			counter: counter + 1,
			type: (counter + 1) % 2 == 0 ? 'even' : 'odd'
		});
	}

	addListItem() {
		console.log('addListItem!');
		itemCounter++;
		var items = this.state.items;
		items["i" + itemCounter] = "Item " + itemCounter;
		this.setState({
			items: items
		});
	}

	editListItem(id, text) {

	}

	removeListItem(id) {

	}

	render(props, state) {
		//console.log('>>> App render!');
		var items = "";
		for (const [id, text] of Object.entries(state.items)) {
			items += `<item-view ref="${id}">${text}</item-view>`;
		}
		return `
			<h1>Hello ${props.name}!</h1>
			<button class="clicker ${state.type}" onclick="click">Click <span>${state.counter}</span></button>
			<button onclick="addListItem">Add Item</button>
			<div id="itemList">
				${items}
			</div>
		`;
	}

}

window.customElements.define('app-view', App);
