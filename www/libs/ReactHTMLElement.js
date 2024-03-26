
(function() {
	"use strict";

	function getNodeProps(node) {
		var props = {};
		for (const name of node.getAttributeNames()) {
			if (name.startsWith('on')) continue;
			props[name] = node.getAttribute(name);
		}
		return props;
	}

	function getRefChildren(children) {
		var refs = {};
		for (var child of children) {
			var ref = child.getAttribute('ref');
			if (ref) {
				refs[ref] = child;
			}
		}
		return refs;
	}

	function renderDiff(dNode, vNode) {
		var dChildren = [...dNode.children];
		var vChildren = [...vNode.children];
		if (vChildren.length != dChildren.length) {
			var dRefs = getRefChildren(dChildren);
			if (Object.keys(dRefs).length) {
				var vRefs = getRefChildren(vChildren);
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
				dNode.innerHTML = "";
				dNode.children = vNode.children;
			}
			return;
		}
		for (var i in dChildren) {
			updateNode(dChildren[i], vChildren[i]);
		}
	}

	function updateNode(dNode, vNode) {
		// Update React Node
		if (dNode instanceof ReactHTMLElement) {
			dNode.renderDiff();
			return;
		}
		// Update Node Props
		var dProps = getNodeProps(dNode);
		var vProps = getNodeProps(vNode);
		if (JSON.stringify(dProps) != JSON.stringify(vProps)) {
			for (const name of Object.keys(dProps)) {
				if (!vProps.hasOwnProperty(name)) {
					dNode.removeAttribute(name);
				}
			}
			for (const name of Object.keys(vProps)) {
				if (vProps[name] != dProps[name]) {
					dNode.setAttribute(name, vProps[name]);
				}
			}
		}
		// Update Children
		if (dNode.children && dNode.children.length) {
			renderDiff(dNode, vNode);
			return;
		}
		// Update Node Content
		if (dNode.innerHTML != vNode.innerHTML) {
			dNode.innerHTML = vNode.innerHTML;
		}
	}

	class ReactHTMLElement extends HTMLElement {

		domNode = null;
		props = {};
		state = {};
		events = {};

		constructor() {
			super();
			var props = {};
			for (const propName of this.getAttributeNames()) {
				props[propName] = this.getAttribute(propName);
			}
			this.props = props;
		}

		connectedCallback() {
			this.renderDomNode();
			this.attachEvents(this);
		}

		setState(newState) {
			for (const [key, value] of Object.entries(newState)) {
				this.state[key] = value;
			}
			this.renderDiff();
		}

		render(props, state, content) {
			return "";
		}

		renderDomNode() {
			this.content = this.innerHTML;
			var html = this.render(this.props, this.state, this.content);
			this.innerHTML = html;
		}

		renderDiff() {
			var html = this.render(this.props, this.state, this.content);
			var virtual = document.createElement('div');
			virtual.innerHTML = html;
			renderDiff(this, virtual);
		}

		attachEvents(node) {
			for (const name of node.getAttributeNames()) {
				if (name.startsWith('on')) {
					var method = node.getAttribute(name);
					node.removeAttribute(name);
					if (method && typeof this[method] == 'function') {
						node[name] = this[method].bind(this);
					}
				}
			}
			if (!node.children || !node.children.length) {
				return;
			}
			for (var child of node.children) {
				this.attachEvents(child);
			}			
		}

	};

	window.ReactHTMLElement = ReactHTMLElement;

})();