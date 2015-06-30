words = [];    
var path = window.location.pathname;
var page = path.split("/").pop();
if (page == "word.html" || page == "image.html"){
	$.getJSON("https://api.myjson.com/bins/3ajxn&jsoncallback=", function(data) {
		words = data;
	});
	//words = ["hello", "boat", "dog", "cat", "fish", "other"]; 
}
if (page == "sentence.html"){
	$.getJSON("https://api.myjson.com/bins/3eu97&jsoncallback=", function(data) {
		words = data;
	});
	//words = ["i am the king of the mountain", "i am your father", "what did you say", "say my name", "the winter is coming", "officer down i repeat officer down"];
}

var final_transcript = '';
var recognizing = false;
var query = "apple";


var language = 'en-US';  // change this to your language

$(document).ready(function() {
	
    // check that your browser supports the API
    if (!('webkitSpeechRecognition' in window)) {
        alert("Your Browser does not support the Speech API");

    } else {
        // Create the recognition object and define four event handlers (onstart, onerror, onend, onresult)

        var recognition = new webkitSpeechRecognition();
        recognition.continuous = true;         // keep processing input until stopped
        recognition.interimResults = true;     // show interim results
        recognition.lang = language;           // specify the language

        recognition.onstart = function() {
            recognizing = true;
            $('#instructions').html('Speak slowly and clearly');
            $('#start_button').html('Click to Stop');
        };

        recognition.onerror = function(event) {
            console.log("There was a recognition error...");
        };

        recognition.onend = function() {
            recognizing = false;
            $('#instructions').html('Done');
        };

        recognition.onresult = function(event) {
            var interim_transcript = '';
            // Assemble the transcript from the array of results
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            console.log("interim:  " + interim_transcript);
            console.log("final:    " + final_transcript);
            // update the web page
            if(final_transcript.length > 0) {
                $('#transcript').html(final_transcript);
            }
			$("#eraser").click(function(e) {
				document.getElementById("transcript").innerText = "";
				document.getElementById("input_box").value = "";
				final_transcript = "";
			});
        };

        $("#start_button").click(function(e) {
            e.preventDefault();
			args = new Array();
			args[1] = "http://www2.psd100.com/ppp/2013/11/2701/Microphone-1127234642.png";
			args[2] = "http://www.iconsdb.com/icons/preview/red/microphone-xxl.png";
			img = document.images[1];
            if (recognizing) {
				img.src = args[1];
                recognition.stop();
                $('#start_button').html('Click to Start Again');
                recognizing = false;
            } else {
				final_transcript = '';
				img.src = args[2];
                // Request access to the User's microphone and Start recognizing voice input
                recognition.start();

                $('#instructions').html('Allow the browser to use your Microphone');
                $('#start_button').html('waiting');
                $('#transcript').html('&nbsp;');
            }
        });
		
		
		
    }
        
    $("#confirm").click(function(e) {
		alert("aqui");
		alert(document.getElementById("demo").innerHTML);
		if (document.getElementById("demo").innerHTML == document.getElementById("transcript").innerText){
			alert("aqui2");
			document.getElementById("instructions").innerHTML = "Correct";
			var score = parseInt(document.getElementById("score").innerText);
			document.getElementById("score").innerText = score + 100;
            setTimeout(function(){
                removeWord();
				document.getElementById("transcript").innerText = "";
            }, 1000);
		}
		else{
			document.getElementById("instructions").innerHTML = "Not yet!";
		}
	});
        
	
	$("#sound_button").click(function(e) {
		var u = new SpeechSynthesisUtterance();
		//var x = document.getElementById("input_box").value;
		u.text = document.getElementById("input_box").value;
		u.lang = 'en-US';
		u.rate = 1.0;
		u.onend = function(event) { document.getElementById("instructions").innerHTML =('Finished in ' + event.elapsedTime + ' seconds.'); }
		speechSynthesis.speak(u);
	});
	
});

function changeWord(){
	var i = sorteio();
	var score = parseInt(document.getElementById("score").innerText);
	query = words[i];
	if (score >= 50){
		$("#images").empty();
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",{tags: query, tagmode: "any", format: "json",  machine_tags: "dc:"},
		function(data) {
			$.each(data.items, function(i,item){
				$("<img/>").attr("src", item.media.m).appendTo("#images");
				if ( i == 3 ) return false;
			});
		});
		document.getElementById("score").innerText = score - 50;
		if (words[i] != document.getElementById("demo").innerText){
			document.getElementById("demo").innerHTML = words[i];
		}		
		else{
			changeWord();
		}
	}
	else{
		alert("Your score is too low to change the word!");
	}

}

function sorteio(){
	if (words.length == 0){
		alert("Empty array!!");
	}
	else{
		var i = Math.floor(Math.random() * words.length);
		return i;
	}
}

function removeWord(){
	var i = sorteio();
	/*alert("indice sorteado: " + i);
	alert("Vetor antes de tirar: " + words);
	alert("Palavra sorteada: " + words[i]);*/
	var indice = words.indexOf(document.getElementById("demo").innerText);
	//alert("indice que vai ser excluido: " + indice);
	document.getElementById("demo").innerHTML = words[i];
	query = document.getElementById("demo").innerHTML;
	$("#images").empty();
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",{tags: query, tagmode: "any", format: "json",  machine_tags: "dc:"},
		function(data) {
			$.each(data.items, function(i,item){
				$("<img/>").attr("src", item.media.m).appendTo("#images");
				if ( i == 3 ) return false;
			});
		});
	words.splice(indice , 1);
	//alert("Vetor depois de tirar: " + words);
}

function init(){
	query = document.getElementById("demo").innerHTML;
	$("#images").empty();
		$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",{tags: query, tagmode: "any", format: "json",  machine_tags: "dc:"},
		function(data) {
			$.each(data.items, function(i,item){
				$("<img/>").attr("src", item.media.m).appendTo("#images");
				if ( i == 3 ) return false;
			});
		});
}