


var synthesis = window.speechSynthesis;
var voices = [];
var socket = null;
var langRegex = /^es(-[a-z]{2})?$/i;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'es-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
//const session = `sowxv-${random(999999999)}-sowxv-${random(999999999)}`
function populateVoices() {
    voices = synthesis.getVoices().filter((voice) => langRegex.test(voice.lang));
}

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
} else {
    populateVoices();
}

addLine = (text, emitter) => {
    $("#console").append($("<div>").text(`${emitter} : ${text}`))
}
function removeMarkdown(text) {
    const regex = /(\*\*|\*|__|_|~~|`|\[|\]|\(|\)|\!\[|\]\(|\>|\#|\+|\-|\=|\|)/g;
    return text.replace(regex, '');
}
recognition.onresult = function (event) {
    var text = event.results[event.results.length - 1][0].transcript;
    humanMessage(text);
}

humanMessage = (message) => {
    console.log(message);
    doScreenshot();
    recognition.stop();

    addLine(message, "Human")
    imageBase64 = $(".screenshot-image").attr("src");
    socket.emit('chat message', {message,imageBase64 });

}

function talk(text, fn) {
    var utterance = new SpeechSynthesisUtterance(removeMarkdown(text));
    utterance.voice = voices[18];
    utterance.pitch = 1.2;
    utterance.rate = 1.1;
    utterance.onend = fn
    synthesis.speak(utterance);
};

function random(max) {
    return Math.floor(Math.random() * max) + 1;
}

init = () => {
    initialMessage = "Bienvenido Señor";
    addLine(initialMessage, "AI");
    talk(initialMessage, () => { setTimeout(() => { recognition.start(), 1000 }) })
    $("body").off("click");
    $("body").on("click", () => { synthesis.cancel(); recognition.start(); })
};


$(() => {
    $("body").on("click", init)
    socket = io();
    socket.on('chat response', function(message) {
            addLine(message, "AI");
            talk(message, () => { setTimeout(() => { recognition.start(), 1000 }) })

        })
})
