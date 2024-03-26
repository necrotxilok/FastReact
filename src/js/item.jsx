
class ListItem extends ReactHTMLElement {

	clickItem() {
		console.log('clickItem');
	}

	render(props, state, content) {
		return `
			<div class="item" onclick="clickItem">${content}</div>
		`;
	}
}

window.customElements.define('item-view', ListItem);
