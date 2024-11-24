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
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).id; // Adjust key based on your JWT structure
}

document.getElementById("save-hair-color").addEventListener('click', async() => {
        const data = {
         hairColor
        };

        console.log(data)
        const token = localStorage.getItem('token');
        const userId = getUserIdFromToken(token);

        try {   
            const response = await fetch(`http://localhost:5000/api/profile/${userId}/haircolor`, {
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