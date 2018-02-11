console.log("javascript loaded")
var toggleOn

chrome.storage.sync.get("pupilExtensionActive", function(response) {
	console.log(response)
	bg = document.getElementById("background");
	if (response.pupilExtensionActive === undefined) {
		toggleOn = true;
	} else if (!(response.pupilExtensionActive)) {
		toggleOn = false;
		if (!(background.classList.contains("off"))) {
			bg.classList.add('off');
		}
		if (!power.classList.contains("down")) {
			power.classList.add("down");
		} 
	} else {
		toggleOn = true;
	}
})

document.getElementById("background").addEventListener("click", function () {

	if (!toggleOn) {
		this.classList.remove('off');
		toggleOn = true;

		// save this setting in browser storage
		chrome.storage.sync.set({'pupilExtensionActive': true}, function () {
			console.log("data saved");
		});

	} else {
		this.classList.add('off');
		toggleOn = false;

		// save this setting in browser storage
		chrome.storage.sync.set({'pupilExtensionActive': false}, function () {
			console.log("data saved");
		});
	}

	var power = document.getElementById("power");
	if (!power.classList.contains("down")) {
		power.classList.add("down");
	} else {
		power.classList.remove("down");
	}
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.startRequest == "true")
      sendResponse({startResponse: toggleOn});
  });

