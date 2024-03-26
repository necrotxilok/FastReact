
function getNodeProps(node) {
	var props = {};
	for (const name of node.getAttributeNames()) {
		if (name.startsWith('on')) continue;
		props[name] = node.getAttribute(name);
	}
	return props;
}

function getChildrenRefs(children) {
	var refs = {};
	for (var child of children) {
		var ref = child.getAttribute('ref');
		if (ref) {
			refs[ref] = child;
		}
	}
	return refs;
}

function isObject(obj) {
	return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
}

function isEqual(a, b) {
	return JSON.stringify(a) == JSON.stringify(b)
}

function isChildrenDiff(dChildren, vChildren) {
	if (dChildren.length != vChildren.length) {
		return true;
	}
	for (var i in dChildren) {
		var dNode = dChildren[i];
		var vNode = vChildren[i];
		if (dNode.tagName != vNode.tagName) {
			return true;
		}
	}
	return false;
}

function renderDiff(dNode, vNode) {
//console.log('---> RENDER DIFF!!', dNode);
	var dChildren = [...dNode.children];
	var vChildren = [...vNode.children];
	if (isChildrenDiff(dChildren, vChildren)) {
		var dRefs = getChildrenRefs(dChildren);
		if (Object.keys(dRefs).length) {
//console.log('Update by Ref!');
			var vRefs = getChildrenRefs(vChildren);
			for (const ref of Object.keys(dRefs)) {
				if (!vRefs[ref]) {
					dRefs[ref].remove();
				}
			}
			for (const ref of Object.keys(vRefs)) {
				if (dRefs[ref]) {
					updateNode(dRefs[ref], vRefs[ref]);
				} else {
					dNode.append(vRefs[ref]);
				}
			}
		} else {
//console.log('Update ALL!!');
			dNode.innerHTML = vNode.innerHTML;
		}
		return;
	}
	for (var i in dChildren) {
		updateNode(dChildren[i], vChildren[i]);
	}
}

function updateNode(dNode, vNode) {
//console.log('---> UPDATE NODE', dNode);
	// Update Node Props
	var propsUpdated = false;
	var dProps = getNodeProps(dNode);
	var vProps = getNodeProps(vNode);
	if (!isEqual(dProps, vProps)) {
//console.log('Update Props!');
		for (const name of Object.keys(dProps)) {
			if (!vProps.hasOwnProperty(name)) {
				dNode.removeAttribute(name);
				propsUpdated = true;
			}
		}
		for (const name of Object.keys(vProps)) {
			if (vProps[name] != dProps[name]) {
				dNode.setAttribute(name, vProps[name]);
				propsUpdated = true;
			}
		}
	}
	// Update React Node
	if (dNode instanceof ReactHTMLElement) {
//console.log('RENDERED:', dNode.innerHTML, 'OLD:', dNode.content, 'NEW:', vNode.innerHTML);
		if (propsUpdated || !isEqual(dNode.content, vNode.innerHTML)) {
//console.log('Update React Node!');
			dNode.renderUpdate(vProps, vNode.innerHTML);
		}
		return;
	}
	// Update Children
	if (dNode.children && dNode.children.length) {
//console.log('Update Children!');
		renderDiff(dNode, vNode);
		return;
	}
	// Update Node Content
	if (dNode.innerHTML != vNode.innerHTML) {
//console.log('Update Content!');
		dNode.innerHTML = vNode.innerHTML;
	}
}


function attachEvents(reactNode, node) {
	for (const name of node.getAttributeNames()) {
		if (!name.startsWith('on')) continue;
		var method = node.getAttribute(name);
		//node.removeAttribute(name);
		if (method && typeof reactNode[method] == 'function') {
			////console.log('Binding ' + name + ' to ' + method + ' function.');
			node[name] = reactNode[method].bind(reactNode);
		} else {
			console.error('FastReact ERROR: Unable to attach "' + method + '" to element ', node);
		}
	}
	if (!node.children || !node.children.length) {
		return;
	}
	for (var child of node.children) {
		if (child instanceof ReactHTMLElement) {
			continue;
		}
		attachEvents(reactNode, child);
	}			
}

class ReactHTMLElement extends HTMLElement {

	domNode = null;
	props = {};
	state = {};

	constructor() {
		super();
		this.props = getNodeProps(this);
	}

	connectedCallback() {
		this.renderDomNode();
		attachEvents(this, this);
	}

	setState(newState) {
		var prevState = {...this.state};
		for (const [key, value] of Object.entries(newState)) {
			if (isObject(value)) {
				this.state[key] = {...value};
				continue;
			} 
			if (Array.isArray(value)) {
				this.state[key] = [...value];
				continue;
			}
			this.state[key] = value;
		}
		if (isEqual(prevState, this.state)) {
			return;
		}
		var _self = this;
		setTimeout(function() {
			_self.renderNodeTree();
		}, 0);
	}

	render(props, state, content) {
		return "";
	}

	renderDomNode() {
		this.content = this.innerHTML;
		var html = this.render(this.props, this.state, this.content);
		this.innerHTML = html;
	}

	renderUpdate(props, content) {
		this.props = props;
		this.content = content;
		this.renderNodeTree();
	}

	renderNodeTree() {
		var html = this.render(this.props, this.state, this.content);
		var virtual = document.createElement('div');
		virtual.innerHTML = html;
		renderDiff(this, virtual);
		attachEvents(this, this);
	}

};

window.ReactHTMLElement = ReactHTMLElement;
