// Define templates for each body type with rich content
const bodyShapeTemplates = {
    hourglass: `
        <h4>Hourglass Body Shape</h4>
        <p>The hourglass shape has balanced shoulders and hips with a well-defined waist.</p>
        <img src="path/to/hourglass.jpg" alt="Hourglass Shape" style="width:100px;height:auto;">
        <ul>
            <li><strong>Tip:</strong> Wear fitted clothing to accentuate your waist.</li>
            <li><strong>Recommendation:</strong> Bodycon dresses, wrap dresses, high-waisted skirts.</li>
        </ul>
    `,
    invertedTriangle: `
        <h4>Inverted Triangle Body Shape</h4>
        <p>The inverted triangle shape has broader shoulders compared to hips.</p>
        <img src="path/to/inverted-triangle.jpg" alt="Inverted Triangle Shape" style="width:100px;height:auto;">
        <ul>
            <li><strong>Tip:</strong> Choose clothes that add volume to your hips to balance the shoulders.</li>
            <li><strong>Recommendation:</strong> A-line skirts, V-neck tops, straight-leg pants.</li>
        </ul>
    `,
    pear: `
        <h4>Pear Body Shape</h4>
        <p>The pear shape has wider hips and narrower shoulders.</p>
        <img src="path/to/pear.jpg" alt="Pear Shape" style="width:100px;height:auto;">
        <ul>
            <li><strong>Tip:</strong> Highlight your upper body to draw attention away from the hips.</li>
            <li><strong>Recommendation:</strong> Off-the-shoulder tops, structured jackets, flared pants.</li>
        </ul>
    `,
    apple: `
        <h4>Apple Body Shape</h4>
        <p>The apple shape has a wider waist with narrower hips and shoulders.</p>
        <img src="path/to/apple.jpg" alt="Apple Shape" style="width:100px;height:auto;">
        <ul>
            <li><strong>Tip:</strong> Look for clothes that create the illusion of a waist.</li>
            <li><strong>Recommendation:</strong> Empire-waist dresses, A-line silhouettes, tailored jackets.</li>
        </ul>
    `,
    rectangle: `
        <h4>Rectangle Body Shape</h4>
        <p>The rectangle shape has balanced shoulder, waist, and hip measurements.</p>
        <img src="path/to/rectangle.jpg" alt="Rectangle Shape" style="width:100px;height:auto;">
        <ul>
            <li><strong>Tip:</strong> Add curves by layering or belted outfits.</li>
            <li><strong>Recommendation:</strong> Belted dresses, peplum tops, high-waisted pants.</li>
        </ul>
    `,
    // Add more templates for male body shapes if needed
};

function getUserIdFromToken(token) {
    const base64Url = token.split('.')[1]; // Get the payload part
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload).id; // Adjust key based on your JWT structure
}

// Usage
const token = localStorage.getItem('token');
const userId = getUserIdFromToken(token);

// Function to calculate body shape and display information
function calculateBodyShape() {
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const waist = parseFloat(document.getElementById('waist').value);
    const hip = parseFloat(document.getElementById('hip').value);
    const shoulder = parseFloat(document.getElementById('shoulder').value);
    const tolerance = 2;

    let shape = "Unknown";
    let shapeDisplay= "Unknown";
    let template = "";

    // Determine the body shape based on the measurements
    if (gender === "female") {
        if (Math.abs(waist - hip) <= tolerance && Math.abs(shoulder - hip) <= tolerance) {
            shape = "Hourglass";
            shapeDisplay="hourglass";
        } else if ((waist <= hip - tolerance) && (shoulder >= hip + tolerance)) {
            shape = "Inverted Triangle";
            shapeDisplay="invertedTriangle";
        } else if ((waist <= hip - tolerance) && (shoulder <= hip - tolerance)) {
            shape = "Pear";
            shapeDisplay="pear";
        } else if ((waist >= hip + tolerance)) {
            shape = "Apple";
            shapeDisplay="apple";
        } else {
            shape = "Rectangle";
            shapeDisplay="rectangle";
        }
    } else if (gender === "male") {
        if (waist <= hip - tolerance && shoulder >= hip + 3 * tolerance) {
            shape = "Inverted Triangle";
            shapeDisplay="invertedMale";
        } else if (Math.abs(waist - hip) <= tolerance && Math.abs(shoulder - hip) <= tolerance) {
            shape = "Rectangle";
            shapeDisplay="rectangleM";
        } else if (waist >= hip + 2 * tolerance) {
            shape = "Oval";
            shapeDisplay="oval";
        } else if (waist <= hip - tolerance && shoulder <= hip + tolerance) {
            shape = "Trapezoid";
            shapeDisplay="trapezoid";
        }
    }

    // Get the template for the identified shape and display it
    template = bodyShapeTemplates[shapeDisplay] || "<p>Shape information not available.</p>";
    document.getElementById('result').innerText = `Your body shape is: ${shape}`;
    document.getElementById('shape-info').innerHTML = template;
    document.getElementById('shape-info').style.display = "block";

    return shape;
}

// Add event listeners after the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    // Calculate button event
    document.getElementById("calculator-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission
        calculateBodyShape();
    });

    // Save button event
    document.getElementById("save-button").addEventListener("click", async () => {
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const shoulder = document.getElementById('shoulder').value;
        const waist = document.getElementById('waist').value;
        const hip = document.getElementById('hip').value;
        const shape = calculateBodyShape();
        const height = 200; // todo : get it from profile page 
        
        const data = {
            height,
            shoulder,
            waist,
            hip,
            shape
        };

        console.log(data)

        try {   
            const response = await fetch(`http://localhost:5000/api/profile/${userId}/measurements`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                    
                },
                body: JSON.stringify(data)
            });

            const result = await response.text();
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
});
