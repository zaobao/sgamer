var indexDB = require('sdk/indexed-db').indexDB;
var pageMod = require("sdk/page-mod");
var panels = require("sdk/panel");
var self = require("sdk/self");
var ss = require("sdk/simple-storage");
var tabs = require("sdk/tabs");
var buttons = {};
buttons.toggleButton = require('sdk/ui/button/toggle').ToggleButton;
var isActive = true;

var button = buttons.toggleButton({
  id: "sgamer-button",
  label: "All for farming",
  icon: ss.storage.active === 0 ? "./icon-disabled-32.ico" : "./icon-32.ico",
  onChange: handleButtonChange
});

var postListPageMod = {
	mod: null,
	set: function () {
		if (this.mod == null) {
			this.mod = pageMod.PageMod({
				include: [
					/http:\/\/bbs\.sgamer\.com\/thread-.*\.html/,
					/http:\/\/bbs\.sgamer\.com\/.*mod=(forumdisplay|viewthread).*/
				],
				contentScriptFile: self.data.url("./sg_farmkit.js"),
				contentScriptWhen: "ready"
			});
		}
	},
	del: function () {
		if (this.mod)
		{
			this.mod.destroy();
			this.mod = null;
		}
	}
};

var panel = panels.Panel({
	height: 76,
	width: 160,
	contentURL: self.data.url("panel.html"),
	contentScriptFile: self.data.url("panel.js"),
	contentScriptWhen: "ready",
	onHide: handlePanelHide
});

panel.port.on("active", function () {
	button.icon = "./icon-32.ico";
	ss.storage.active = 1;
});
panel.port.on("inactive", function () {
	button.icon = "./icon-disabled-32.ico";
	ss.storage.active = 0;
});

if (ss.storage.active === 0) {
	panel.port.emit("inactive");
} else {
	panel.port.emit("active");
	postListPageMod.set();
}

function handleButtonChange (state) {
	if (state.checked) {
		panel.show({
			position: button
		});
	}
}

function handlePanelHide() {
	button.state("window", {checked: false});
	if (ss.storage.active === 0)
	{
		postListPageMod.del();
	}
	else
	{
		postListPageMod.set();
	}
}

function handlePanelShow() {
	panel.port.emit("show", isActive);
}