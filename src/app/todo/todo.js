
var itemCounter = 0;

class ToDo extends ReactHTMLElement {

	state = {
		loaded: false,
		items: null
	}

	loadList() {
		var _self = this;
		//setTimeout(function() {
			itemCounter = Object.keys(window.data.items).length;
			_self.setState({
				loaded: true,
				items: window.data.items
			});
		//}, 1000);
	}

	addListItem() {
		if (Object.keys(window.data.items).length >= this.props["max-items"]) {
			console.log('Max List Items!!');
			return;
		}
		console.log('addListItem!');
		itemCounter++;
		var items = data.items;
		items["item" + itemCounter] = "Item " + itemCounter;
		this.setState({
			items: items
		});
	}

	updateListItem(id, text) {
		console.log('editListItem!', id, text);
		var items = data.items;
		items[id] = text;
		this.setState({
			items: items
		});
	}

	removeListItem(id) {
		console.log('removeListItem!', id);
		var items = data.items;
		delete items[id];
		this.setState({
			items: items
		});
	}

	render(props, state) {
		window.app.todo = this;
		//console.log('>>> ToDo render!');

		if (!state.loaded) {
			this.loadList();
			return `
				<div class="loading">...</div>
			`;
		}

		var items = "";
		for (const [id, text] of Object.entries(state.items)) {
			items += `<item-view id="${id}" ref="${id}">${text}</item-view>`;
		}
		return `
			<button onclick="addListItem">Add Item</button>
			<div id="itemList">
				${items}
			</div>
		`;
	}

}

window.customElements.define('todo-view', ToDo);
