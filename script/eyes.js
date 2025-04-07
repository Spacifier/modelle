var eyeColor = ''; 

function selectEyeColor(color) {
    const selectedColorDisplay = document.getElementById('selected-eye-color-display');
    selectedColorDisplay.innerText = `Selected Eye Color: ${color}`;
    //selectedColorDisplay.style.color = color; // Optional: display the text in the selected color
    const irisDisplay = document.getElementById('iris-display');
    
    // Set the background image based on the color hovered
    irisDisplay.style.backgroundImage = `url('/pics/${color}-iris.jpg')`;
    
    // Make the display visible
    irisDisplay.style.display = 'block';
     eyeColor = color.toLowerCase(); 
}

function getUserIdFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id; // Adjust based on your JWT structure
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

function showIris(element, color) {
    // Change the background image of the color option to the iris image
    element.style.backgroundImage = `url('/pics/${color}-iris.jpg')`;
}

function hideIris(element, color) {
    // Reset the background to the original color
    element.style.backgroundImage = 'none';
    element.style.backgroundColor = color;
}

document.getElementById("save-eye-color").addEventListener('click', async() => {
        const data = {
            "preferences.eyeColor": eyeColor
        };

        console.log(data)
        const token = localStorage.getItem('token');
        const userId = getUserIdFromToken(token);

        try {   
            const response = await fetch(`http://localhost:5000/api/profile/${userId}/updateProfile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.text();
            console.log(result)
            try {
                const jsonResponse = JSON.parse(result);
                if (response.ok) {
                    showConfirmationMessage("Data has been saved successfully!");
                } else {
                    showConfirmationMessage('Failed to save data: ' + jsonResponse.message, true);
                }
            } catch (error) {
                console.error("Unexpected response:", result);
                showConfirmationMessage("An error occurred while saving data.", true);
            }
            
        } catch (error) {
            console.log(error.message)
        }

        console.log("Data saved:", data);
    });

function showConfirmationMessage(message, isError = false) {
    const messageBox = document.getElementById('confirmation-message');
    const messageText = document.getElementById('message-text');
    const messageIcon = document.getElementById('message-icon');
    const closeButton = document.getElementById('close-button');

    // Set the message text and icon
    messageText.textContent = message;
    messageIcon.textContent = isError ? '✖' : '✔';

    // Add appropriate class based on whether it's an error or success
    if (isError) {
        messageBox.classList.add('error');
    } else {
        messageBox.classList.remove('error');
    }

    // Show the message box
    messageBox.classList.remove('hidden');
    messageBox.classList.add('visible');

    // Close the message box when the close button is clicked
    closeButton.onclick = () => {
        messageBox.classList.remove('visible');
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 300); // Wait for the transition to complete
    };

    // Automatically hide the message after 5 seconds
    setTimeout(() => {
        messageBox.classList.remove('visible');
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 300); // Wait for the transition to complete
    }, 5000);
}

