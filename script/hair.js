var hairColor = ''; 

function showHoverColor(colorName, colorHex) {
    const hoveredColorDisplay = document.getElementById('hovered-hair-color-display');
    hoveredColorDisplay.style.backgroundColor = colorHex;  // Change background color on hover
    hoveredColorDisplay.innerHTML = `Hovering Over: ${colorName}`;
    hoveredColorDisplay.style.color='white';
    // hairColor = colorName.toLowerCase(); 
    //  console.log(hairColor); 
}

function selectHairColor(colorName, colorHex) {
    const selectedColorDisplay = document.getElementById('selected-hair-color-display');
    selectedColorDisplay.style.backgroundColor = colorHex;  // Change background color when selected
    selectedColorDisplay.innerText = `Selected Hair Color: ${colorName}`;
    selectedColorDisplay.style.color='white';

    hairColor = colorName.toLowerCase(); 
    console.log(hairColor); 
}


function getUserIdFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}

document.getElementById("save-hair-color").addEventListener('click', async() => {
        const data = {
            "preferences.hairColor": hairColor       
        };

        console.log(data)
        const token = localStorage.getItem('token');
        const userId = getUserIdFromToken(token);

        try {   
            const response = await fetch(`https://modelle.onrender.com/api/profile/${userId}/updateProfile`, {
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
    
    