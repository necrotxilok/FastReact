
console.log('Hello FastReact Todo App!');

window.data = {
	items: {
		item1: "Item 1",
		item2: "Item 2"
	}
}

const maxItems = 10;

class App extends ReactHTMLElement {

	state = {
		counter: 0,
		type: 'even',
	}

	click() {
		console.log('click');
		var counter = this.state.counter + 1;
		this.setState({
			counter: counter,
			type: counter % 2 == 0 ? 'even' : 'odd'
		});
	}

	render(props, state) {
		//console.log('>>> App render!');
		window.app = this;
		var dot = (state.type == 'even') ? `<div class="dot red">●</div>` : `<span class="dot green">●</span>`;
		return `
			<h1>Hello ${props.name}!</h1>
			<button class="clicker ${state.type}" onclick="click">Click <span>${state.counter}</span></button>
			<todo-view max-items="${maxItems}"></todo-view>
			<div class="footer">Developed by necro_txilok ${dot}</div>
		`;
	}

}

window.customElements.define('app-view', App);
