document.getElementById('submitButton').addEventListener('click', submitForm);

function submitForm(event) {
    event.preventDefault(); // Prevents the default form submission which causes a page reload
    State(); // Call the State function to handle the form submission
}

let Commands = [{
    'commands': []
}, {
    'handleEvent': []
}];

async function State() {
    const jsonInput = document.getElementById('json-data');
    const button = document.getElementById('submitButton');
    const spinner = document.querySelector('.spinner-border');

    try {
        button.style.display = 'none';
        spinner.style.display = 'block'; // Show loading spinner

        const State = JSON.parse(jsonInput.value);

        if (State && typeof State === 'object') {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    state: State,
                    commands: Commands,
                    prefix: document.getElementById('inputOfPrefix').value,
                    admin: document.getElementById('inputOfAdmin').value,
                    adminName: "Kiff Hyacinth Pon",
                    botName: "𝙴𝚌𝚑𝚘𝙱𝚘𝚝",
                }),
            });

            const data = await response.json();

            if (response.ok) { // Check for success
                jsonInput.value = '';
                const message = `
                    <strong>Successful Login</strong><br>
                    Prefix: ${data.prefix || 'N/A'}<br>
                    Bot Name: ${data.botName || 'N/A'}
                `;
                showResult(message, true); // Pass true for success
                setTimeout(() => {
                    window.location.href = 'home'; // Redirect to index.html after showing the result
                }, 4000); // Adjust the delay as needed
            } else {
                jsonInput.value = '';
                showResult(data.message || 'An error occurred.', false); // Pass false for error
            }
        } else {
            jsonInput.value = '';
            showResult('Invalid JSON data. Please check your input.', false);
        }
    } catch (parseError) {
        jsonInput.value = '';
        console.error('Error parsing JSON:', parseError);
        showResult('Error parsing JSON. Please check your input.', false);
    } finally {
        button.style.display = 'block';
        spinner.style.display = 'none'; // Hide loading spinner
    }
}

function showResult(message, isSuccess) {
    const resultContainer = document.getElementById('result');
    let iconHtml = '';

    if (isSuccess) {
        iconHtml = `
            <div class="icon check-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12l4 4L18 8"></path>
                </svg>
            </div>
        `;
    } else {
        iconHtml = `
            <div class="icon error-icon">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
        `;
    }

    resultContainer.innerHTML = `
        ${iconHtml}
        <h5>${message}</h5>
    `;

    // Show the modal
    $('#resultModal').modal('show');
}

async function fetchAndProcessCommands() {
    try {
        const response = await fetch('/commands');
        const { commands, handleEvent } = await response.json();

        commands.forEach(cmd => {
            Commands[0].commands.push(cmd);
        });

        handleEvent.forEach(cmd => {
            Commands[1].handleEvent.push(cmd);
        });

    } catch (error) {
        console.log(error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndProcessCommands();
});

