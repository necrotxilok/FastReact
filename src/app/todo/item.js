
class ListItem extends ReactHTMLElement {

	/*clickItem() {
		console.log('clickItem');
	}*/

	updateItem() {
		var $input = this.querySelector('input');
		app.todo.updateListItem(this.props.id, $input.value);
	}

	removeItem() {
		app.todo.removeListItem(this.props.id);
	}

	render(props, state, content) {
		return `
			<div class="item">
				<input type="text" value="${content}" onchange="updateItem"/>
				<button onclick="removeItem" tabindex="-1">X</button>
			</div>
		`;
	}
}

window.customElements.define('item-view', ListItem);
