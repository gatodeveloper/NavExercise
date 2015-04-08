"use strict";

var oReq = new XMLHttpRequest();
oReq.onload = req;
oReq.open("get", "api/nav.json", true);
oReq.send() ;

function init(){

	var logo = document.querySelectorAll("header .logo")[0];
	var nav = document.querySelectorAll("header nav")[0];
	var navItems = document.querySelectorAll("nav ul a");
	var navLink = document.querySelectorAll("nav ul a.goto-true");
	var opacity = document.querySelectorAll(".opacity")[0]
	var iconMenu = document.querySelectorAll(".icon-menu")[0]
	var iconClose = document.querySelectorAll("header .close-nav")[0];

	for (var i = 0; i < navItems.length; i++) {
		navItems[i].parentNode.addEventListener("click",function(e){
		    removeAllClass(navItems, 'active')
		    addClass(this, 'active')
		    addClass(opacity, 'show');
		},false);
	};

	for (var i = 0; i < navLink.length; i++) {
		navLink[i].addEventListener("click",function(e){
		    window.location.reload()
		},false);
	};

	opacity.addEventListener("click",function(e){
		removeClass(this, 'show');
		removeAllClass(navItems, 'active');
		removeClass(nav, 'show');
		removeClass(logo, 'show');
		removeClass(iconMenu, 'hide');
		removeClass(iconClose, 'show');
	},false);
		
	iconMenu.addEventListener("click",function(e){
		toggleClass(logo, 'show');
		toggleClass(opacity, 'show');
		toggleClass(nav, 'show');
		toggleClass(this, 'hide');
		toggleClass(iconClose, 'show');
	},false);

	iconClose.addEventListener("click",function(e){
		toggleClass(logo, 'show');
		toggleClass(opacity, 'show');
		toggleClass(nav, 'show');
		toggleClass(iconMenu, 'hide');
		toggleClass(this, 'show');
	},false);

};

function addClass(el, className){
	el.classList.add(className)
};

function removeClass(el, className){
	return el.classList.remove( className );
};

function removeAllClass(els, className){
	for (var i = 0; i < els.length; i++) {	
		removeClass(els[i].parentNode, 'active')
	};
};

function toggleClass(el, className){
	el.classList.toggle(className)
};

function req (){

	console.log('ajax', this.responseText);
	var responseObj = JSON.parse(this.responseText);
	var items = responseObj.items;

	function appendHtml(el, str) {
		var div = document.createElement('div');
		div.innerHTML = str;
		while (div.children.length > 0) {
			el.appendChild(div.children[0]);
		}
	};

	var menu = '';

	items.forEach(function(item) {

		var submenuItems = item.items
		var isSubmenu = (submenuItems.length > 0) ? true : false;

		var li = '<li><a href="{{url}}" class="goto-'+ !isSubmenu +'">{{label}}</a></li>';

		li = li.replace('{{label}}', item.label)
		li = li.replace('{{url}}', item.url)

		if( isSubmenu ){
			var submenu = '';
			submenuItems.forEach(function(submenuItem) {
				var addSubmenuItem = '<li><a href="{{url}}" class="goto-true">{{label}}</a></li>';
				addSubmenuItem = addSubmenuItem.replace('{{label}}', submenuItem.label)
				addSubmenuItem = addSubmenuItem.replace('{{url}}', submenuItem.url)
				submenu += addSubmenuItem;
			});
			li = li.replace('</a>', '</a><i class="i-submenu"></i><ul class="submenu">'+ submenu +'</ul>')
		};

		menu += li
	});
	appendHtml(document.querySelectorAll("nav ul")[0], menu);
	init();
};