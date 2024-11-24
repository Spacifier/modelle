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
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).id; // Adjust key based on your JWT structure
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
         colorType
        };

        console.log(data)
        const token = localStorage.getItem('token');
        const userId = getUserIdFromToken(token);

        try {   
            const response = await fetch(`http://localhost:5000/api/profile/${userId}/skincolor`, {
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
