// Get DOM elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');

// Check for SpeechRecognition support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    alert("Your browser doesn't support Speech Recognition.");
} else {
    // Initialize SpeechRecognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep recognizing until stopped
    recognition.lang = 'en-US'; // Set language to English
    recognition.interimResults = true; // Display intermediate results as speech is detected

    // Handle speech recognition result
    recognition.onresult = function(event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        output.value = transcript; // Update the output textarea with the transcribed text
    };

    // Handle errors in speech recognition
    recognition.onerror = function(event) {
        console.error('Speech Recognition Error:', event.error);
        output.value = 'Error: ' + event.error;
    };

    // Start listening
    startBtn.addEventListener('click', () => {
        // Check if microphone permissions have been granted
        navigator.permissions.query({ name: 'microphone' }).then((permissionStatus) => {
            if (permissionStatus.state === 'granted') {
                recognition.start();
                startBtn.disabled = true;
                stopBtn.disabled = false;
                copyBtn.disabled = true;
                output.value = 'Listening...'; // Inform the user that speech is being detected
            } else if (permissionStatus.state === 'denied') {
                alert('Microphone access is denied. Please enable microphone access in your device settings.');
            } else {
                alert('Please grant microphone access to use speech recognition.');
            }
        });
    });

    // Stop listening
    stopBtn.addEventListener('click', () => {
        recognition.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
        copyBtn.disabled = false; // Enable the copy button after stopping
    });

    // Function to copy the text to clipboard
    copyBtn.addEventListener('click', () => {
        output.select(); // Select the text inside the textarea
        document.execCommand('copy'); // Execute the copy command
        alert('Text copied to clipboard!'); // Show a confirmation alert
    });

    // Reset output when speech recognition ends
    recognition.onend = function() {
        if (!stopBtn.disabled) {
            recognition.start(); // Continue listening if the stop button is not clicked
        }
    };
}
