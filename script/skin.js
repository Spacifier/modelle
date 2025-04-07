var colorType = ''; 
function hoverColor(color) {
    const hoveredColorBox = document.getElementById('hovered-color-box');
    hoveredColorBox.style.backgroundColor = color;
    hoveredColorBox.innerText = color;
    hoveredColorBox.style.color = 'white';
}

function resetHoverColor() {
    const hoveredColorBox = document.getElementById('hovered-color-box');
    hoveredColorBox.style.backgroundColor = ''; // Reset to default (e.g., white or transparent)
    hoveredColorBox.innerText = 'Hovered Color'; // Default text
    hoveredColorBox.style.color = 'black';
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



function selectColor(color, colortype) {
    const selectedColorBox = document.getElementById('selected-color-box');
    selectedColorBox.style.backgroundColor = color;
    selectedColorBox.innerText = color;
    selectedColorBox.style.color = 'white';
    colorType = colortype; 
    console.log(colorType)
}

document.getElementById("save-skin-color").addEventListener('click', async() => {
    const data = {
        "preferences.skinTone": colorType
    };

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

        const result = await response.json();
        console.log("Server Response:", result);
        if (response.ok) {
            showConfirmationMessage("Data has been saved successfully!");
        } else {
            showConfirmationMessage('Failed to save data: ' + result.message, true);
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


