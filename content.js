$(document).ready(function () {
	console.log("requesting start");
	analyzeImage();

});

//function that detect and analyze a image that you hover on
function analyzeImage(){
		$('img').mouseover(function() {
		 	console.log("analyze image ...");
		 	console.log("image: " + this.src);

		 	var sourceImageUrl = this.src;

		 			var subscriptionKey = "4a52c84890c345768aa4a6b539bac2bf";
		 			var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze";

		 					 // Request parameters.
		 					 var params = {
		 							 visualFeatures: "Description",
		 							 details: "",
		 							 language: "en",
		 					 };
		 					 console.log("start ajax call");
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
		 							 console.log(data);
		 							 var obj = JSON.parse(JSON.stringify(data, null, 2));
		 							 //alert(obj.description.captions[0].text);
									 textToSpeech(obj.description.captions[0].text);
		 							 console.log("Injected: " + obj.description.captions[0].text );
		 					 })

		 					 .fail(function(jqXHR, textStatus, errorThrown) {
		 							 // Display error message.
		 							 var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
		 							 errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
		 							 //console.log(errorString);
		 					 });
		});
};

//function that converts the analzye result into speech
function textToSpeech(analyzeResult){

	console.log("requesting start")
	console.log("DID WE GOT HERE");
	var apiKey = "200b9fc16df4481384c6dbeeb3ea79df";
	var params = {
            // Request parameters
  };
	var tokenURL = 'https://oxford-speech.cloudapp.net/token/issueToken';
	var audioURL = "https://speech.platform.bing.com/synthesize";
	var token = "default";
	var textToSpeak = analyzeResult;
	var language = 'en-us';
	var nameLanguage = 'Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)';
	var sendString = "<speak version='1.0' xml:lang='"+language+"'><voice xml:lang='"+language+"' xml:gender='Female' name='"+nameLanguage+"'>"+textToSpeak+"</voice></speak>"
	var context = new AudioContext();
	var speechBuffer = null;

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

	function sendAudioRequest()
	{
			console.log("in send audio request")
			sendString = "<speak version='1.0' xml:lang='"+language+"'><voice xml:lang='"+language+"' xml:gender='Female' name='"+nameLanguage+"'>"+textToSpeak+"</voice></speak>";

		    var xhttp = new XMLHttpRequest();

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

	function playAudio()
	{
	    var context = new AudioContext();

	    var source = context.createBufferSource();
	    source.buffer = speechBuffer;
	    source.connect(context.destination);
	    source.start(0);
	}

};
