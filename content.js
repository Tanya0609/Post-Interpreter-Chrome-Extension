$(document).ready(function () {

	console.log("requesting start")
	console.log("DID WE GOT HERE");
	var apiKey = "200b9fc16df4481384c6dbeeb3ea79df";
	var params = {
            // Request parameters
  };
var tokenURL = 'https://oxford-speech.cloudapp.net/token/issueToken';
var audioURL = "https://speech.platform.bing.com/synthesize";
var token = "default";
var textToSpeak = 'Hallo, its talking';
var language = 'en-us';
var nameLanguage = 'Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)';
var sendString = "<speak version='1.0' xml:lang='"+language+"'><voice xml:lang='"+language+"' xml:gender='Female' name='"+nameLanguage+"'>"+textToSpeak+"</voice></speak>"
var context = new AudioContext();
var speechBuffer = null;

// Endpoint Call an den Text to Speech Serive. Wenn erfolgreich, wird playAudio aufgerufen.
function sendAudioRequest()
{
	console.log("in send audio request")
	sendString = "<speak version='1.0' xml:lang='"+language+"'><voice xml:lang='"+language+"' xml:gender='Female' name='"+nameLanguage+"'>"+textToSpeak+"</voice></speak>";

    var xhttp = new XMLHttpRequest();

    // Hier länger warten!

    xhttp.onreadystatechange = function()
    {
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            context.decodeAudioData(xhttp.response, function(buffer)
            {
								console.log("do we fail here")
								speechBuffer = buffer;
                console.info(speechBuffer);
                playAudio(speechBuffer);
            });

        }
    };
    xhttp.open("POST", audioURL, true);
    xhttp.setRequestHeader("Content-type", 'application/ssml+xml');
    xhttp.setRequestHeader("Authorization", 'Bearer ' + token);
    xhttp.setRequestHeader("X-Microsoft-OutputFormat", 'riff-16khz-16bit-mono-pcm');
    xhttp.setRequestHeader("X-Search-AppId", '07D3234E49CE426DAA29772419F436CA');
    xhttp.setRequestHeader("X-Search-ClientID", '1ECFAE91408841A480F00935DC390960');
    xhttp.responseType = 'arraybuffer'
		console.log("we got here, sending audio")
    xhttp.send(sendString);
}


// Spielt die zurückgegebene Sprache ab.
function playAudio()
{
    var context = new AudioContext();

    var source = context.createBufferSource();
    source.buffer = speechBuffer;
    source.connect(context.destination);
    source.start(0);
}

  $.ajax({
      url: "https://api.cognitive.microsoft.com/sts/v1.0/issueToken?" + $.param(params),
      beforeSend: function(xhrObj){
          // Request headers
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","200b9fc16df4481384c6dbeeb3ea79df");
      },
      type: "POST",
      // Request body
      data: "{body}",
  })
  .done(function(data) {
			console.log(JSON.stringify(data));
			///token = data.access_token;
			token = data
			sendAudioRequest();
			let ssml = "<speak version=1.0 xml:lang=en-us><voice name=Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)<xml:lang=en-us> xml:gender=Female> This is a demo to call Microsoft text to speech service.</voice></speak>"
			console.log(ssml)
  })
  .fail(function() {
      alert("error");
  });
})


function updateImages() {
	console.log("Loaded Page")
	var numRequests = 0;

	$('*').each(function () {
		if ($(this).is('img')) {
			if(numRequests >= 5){
				return;
			}
			var image = this;
			console.log("Checking " + $(image).attr('src'))
			if (!$(this).attr('alt')) {
				console.log($(image).attr('src') + " has no alt!")
				numRequests = numRequests + 1;
				sourceImageUrl = $(this).attr('src');
				if (sourceImageUrl.indexOf("jpeg") < 0 && sourceImageUrl.indexOf("jpg") < 0 && sourceImageUrl.indexOf("png") < 0) {
					console.log("image-type not currently supported")
					return;
				}
				 var subscriptionKey = "6d4d15f30dcc42ba81e90db3b638b2ae";

				 var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";

				 // Request parameters.
				 var params = {
						 "visualFeatures": "Description",
						 "details": "",
						 "language": "en",
				 };

				 // Perform the REST API call.
				 $.ajax({
						 url: uriBase + "?" + $.param(params),

						 // Request headers.
						 beforeSend: function(xhrObj){
								 xhrObj.setRequestHeader("Content-Type","application/json");
								 xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
						 },

						 type: "POST",

						 // Request body.
						 data: '{"url": ' + '"' + sourceImageUrl + '"}',
				 })

				 .done(function(data) {

						 var obj = JSON.parse(JSON.stringify(data, null, 2));
						 // TODO: we should add stuff here
						 $(image).attr('alt', obj.description.captions[0].text);
						 //var tts = require('./js/TTSService.js');
						 console.log("Hello")
						 //tts.Synthesize();
						 console.log("Injected: " + obj.description.captions[0].text + " into " + $(image).attr('src'));

				 })

				 .fail(function(jqXHR, textStatus, errorThrown) {
						 // Display error message.
						 var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
						 errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
						 //console.log(errorString);
				 });
			}
			else {
				if($(this).attr('alt').split(" ").length <= 2){
					numRequests = numRequests + 1;
					sourceImageUrl = $(this).attr('src');
					console.log($(image).attr('src') + " has useless description")
					if (sourceImageUrl.indexOf("jpeg") < 0 && sourceImageUrl.indexOf("jpg") < 0 && sourceImageUrl.indexOf("png") < 0) {
						console.log("image-type not currently supported")
						return;
					}
					 // Replace the subscriptionKey string value with your valid subscription key.
					 var subscriptionKey = "6d4d15f30dcc42ba81e90db3b638b2ae";

					 // Replace or verify the region.
					 //
					 // You must use the same region in your REST API call as you used to obtain your subscription keys.
					 // For example, if you obtained your subscription keys from the westus region, replace
					 // "westcentralus" in the URI below with "westus".
					 //
					 // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
					 // a free trial subscription key, you should not need to change this region.
					 var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";

					 // Request parameters.
					 var params = {
							 "visualFeatures": "Description",
							 "details": "",
							 "language": "en",
					 };

					 // Display the image.
					 //var sourceImageUrl = document.getElementById("inputImage").value;
					 //document.querySelector("#sourceImage").src = sourceImageUrl;

					 // Perform the REST API call.
					 $.ajax({
							 url: uriBase + "?" + $.param(params),

							 // Request headers.
							 beforeSend: function(xhrObj){
									 xhrObj.setRequestHeader("Content-Type","application/json");
									 xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
							 },

							 type: "POST",

							 // Request body.
							 data: '{"url": ' + '"' + sourceImageUrl + '"}',
					 })

					 .done(function(data) {
							 // Show formatted JSON on webpage.
							 //$("#responseTextArea").val(JSON.stringify(data, null, 2));
							 var obj = JSON.parse(JSON.stringify(data, null, 2));
							 $(image).attr('alt', obj.description.captions[0].text);
							 console.log("Injected: " + obj.description.captions[0].text + " into " + $(image).attr('src'));
					 })

					 .fail(function(jqXHR, textStatus, errorThrown) {
							 // Display error message.
							 var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
							 errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
							 //console.log(errorString);
					 });

				}
			}
		}
	})

}
