function active() {
	document.getElementById("active").style.display = "none";
	document.getElementById("inactive").style.display = "block";
}
function inactive() {
	document.getElementById("inactive").style.display = "none";
	document.getElementById("active").style.display = "block";
}

document.getElementById("active").onclick = function () {
	active();
	self.port.emit("active");
}

document.getElementById("inactive").onclick = function () {
	inactive();
	self.port.emit("inactive");
}

self.port.on("active", active);
self.port.on("inactive", inactive);