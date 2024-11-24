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
     eyeColor = color; 
}

function getUserIdFromToken(token) {
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).id; // Adjust key based on your JWT structure
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
         eyeColor
        };

        console.log(data)
        const token = localStorage.getItem('token');
        const userId = getUserIdFromToken(token);

        try {   
            const response = await fetch(`http://localhost:5000/api/profile/${userId}/eyecolor`, {
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
                    alert("Data has been saved successfully!");
                } else {
                    alert('Failed to save data: ' + jsonResponse.message);
                }
            } catch (error) {
                console.error("Unexpected response:", result);
                alert("An error occurred while saving data.");
            }
        } catch (error) {
            console.log(error.message)
        }

        console.log("Data saved:", data);
    });




