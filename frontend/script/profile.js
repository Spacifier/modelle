//checking when page loads then request is send to route asnd then to controller 
// to get the function and send back data
document.addEventListener("DOMContentLoaded", async () => {
    await loadProfile();  // Ensure profile is loaded only after DOM is ready
});

async function loadProfile() {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token); 

    if (!userId) {
        console.error("User ID not found");
        return;
    }

    try {
        const response = await fetch(`https://modelle-backend.onrender.com/api/profile/${userId}/displayProfile`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }

        const profile = await response.json();
        console.log("Fetched Profile:", profile);

        // Populate form fields
        document.getElementById("firstName").value = profile.personalInfo?.firstName || "";
        document.getElementById("lastName").value = profile.personalInfo?.lastName || "";
        document.getElementById("email").value = profile.personalInfo?.email || "";
        document.getElementById("phone").value = profile.personalInfo?.phone || "";
        document.getElementById("age").value = profile.personalInfo?.age || "";

        document.getElementById("height").value = profile.measurements?.height || "";
        document.getElementById("gender").value = profile.measurements?.gender || "";
        updateBodyTypeOptions(profile.measurements?.gender, profile.measurements?.bodyType);
        document.getElementById("shoulderWidth").value = profile.measurements?.shoulderWidth || "";
        document.getElementById("waistWidth").value = profile.measurements?.waistWidth || "";
        document.getElementById("hipWidth").value = profile.measurements?.hipWidth || "";
        document.getElementById("bodyType").value = profile.measurements?.bodyType || "";

        document.getElementById("hairColor").value = profile.preferences?.hairColor || "";
        document.getElementById("eyeColor").value = profile.preferences?.eyeColor || "";
        document.getElementById("skinTone").value = profile.preferences?.skinTone || "";

        document.getElementById("stylePreferences").value = profile.preferences?.stylePreferences?.join(", ") || "";

    } catch (error) {
        console.error("Error fetching profile:", error);
    }
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

// Function to update body type dropdown based on selected gender
function updateBodyTypeOptions(gender, selectedBodyType) {
    const bodyTypeSelect = document.getElementById("bodyType");
    bodyTypeSelect.innerHTML = ""; // Clear previous options

    let options = [];
    
    if (gender === "men") {
        options = ["Select Body Type", "Oval", "Rectangle", "Trapezoid", "Inverted Triangle"];
    } else if (gender === "women") {
        options = ["Select Body Type", "Hourglass", "Inverted Triangle", "Pear", "Apple", "Rectangle"];
    } else {
        options = ["Select Body Type"];
    }

    // Populate new options
    options.forEach(bodyType => {
        let optionElement = document.createElement("option");
        optionElement.value = bodyType;
        optionElement.textContent = bodyType;
        if (bodyType === selectedBodyType) {
            optionElement.selected = true;
        }
        bodyTypeSelect.appendChild(optionElement);
    });
}

//Update when gender is changed manually
document.getElementById("gender").addEventListener("change", function() {
    updateBodyTypeOptions(this.value, null);
});

//Save changes to the profile
document.getElementById("save-profile").addEventListener('click', async(event) => {
    event.preventDefault();       //to stop reloading automatically

    const token = localStorage.getItem('token');
    const userId = getUserIdFromToken(token);

    // Collect all data from form inputs
    const data = {
        personalInfo: {
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            age: document.getElementById("age").value
        },
        measurements: {
            height: document.getElementById("height").value,
            gender: document.getElementById("gender").value,
            shoulderWidth: document.getElementById("shoulderWidth").value,
            waistWidth: document.getElementById("waistWidth").value,
            hipWidth: document.getElementById("hipWidth").value,
            bodyType: document.getElementById("bodyType").value
        },
        preferences: {
            skinTone: document.getElementById("skinTone").value,
            hairColor: document.getElementById("hairColor").value,
            eyeColor: document.getElementById("eyeColor").value
        }
    };

    try {   
        const response = await fetch(`https://modelle-backend.onrender.com/api/profile/${userId}/updateProfile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            showConfirmationMessage("Data has been saved successfully!");
            loadProfile();   //dynamically load details when saved
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
