$(document).ready(function () {

	console.log("requesting start");
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
		 							 alert(obj.description.captions[0].text);
		 							 console.log("Injected: " + obj.description.captions[0].text );
		 					 })

		 					 .fail(function(jqXHR, textStatus, errorThrown) {
		 							 // Display error message.
		 							 var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
		 							 errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
		 							 //console.log(errorString);
		 					 });
	});
});
