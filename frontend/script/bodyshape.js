// Define templates for each body type with rich content
const bodyShapeTemplates = {
    hourglass: `
        <h4>Hourglass Body Shape</h4>
        <p>The hourglass shape has balanced shoulders and hips with a well-defined waist.</p>
        <img src="../pics/hourglass.jpg" alt="Hourglass Shape" style="width:100px;height:auto;">
        <ul>
            <li><strong>Tip:</strong> Wear fitted clothing to accentuate your waist.</li>
            <li><strong>Recommendation:</strong> Bodycon dresses, wrap dresses, high-waisted skirts.</li>
        </ul>
    `,
    invertedTriangle: `
        <h4>Inverted Triangle Body Shape</h4>
        <p>The inverted triangle shape has broader shoulders compared to hips.</p>
        <img src="../pics/inverted.jpg" alt="Inverted Triangle Shape" style="width:100px;height:auto;">
        <ul>
            <li><strong>Tip:</strong> Choose clothes that add volume to your hips to balance the shoulders.</li>
            <li><strong>Recommendation:</strong> A-line skirts, V-neck tops, straight-leg pants.</li>
        </ul>
    `,
    pear: `
        <h4>Pear Body Shape</h4>
        <p>The pear shape has wider hips and narrower shoulders.</p>
        <img src="../pics/pear.jpg" alt="Pear Shape" style="width:100px;height:auto;">
        <ul>
            <li><strong>Tip:</strong> Highlight your upper body to draw attention away from the hips.</li>
            <li><strong>Recommendation:</strong> Off-the-shoulder tops, structured jackets, flared pants.</li>
        </ul>
    `,
    apple: `
        <h4>Apple Body Shape</h4>
        <p>The apple shape has a wider waist with narrower hips and shoulders.</p>
        <img src="../pics/apple.jpg" alt="Apple Shape" style="width:100px;height:auto;">
        <ul>
            <li><strong>Tip:</strong> Look for clothes that create the illusion of a waist.</li>
            <li><strong>Recommendation:</strong> Empire-waist dresses, A-line silhouettes, tailored jackets.</li>
        </ul>
    `,
    rectangle: `
        <h4>Rectangle Body Shape</h4>
        <p>The rectangle shape has balanced shoulder, waist, and hip measurements.</p>
        <img src="../pics/rectangle.jpg" alt="Rectangle Shape" style="width:100px;height:auto;">
        <ul>
            <li><strong>Tip:</strong> Add curves by layering or belted outfits.</li>
            <li><strong>Recommendation:</strong> Belted dresses, peplum tops, high-waisted pants.</li>
        </ul>
    `,
   // Men's body shapes
   oval: `
   <h4>Oval Body Shape</h4>
   <p>The oval shape has a rounder waist with a broader upper torso.</p>
   <img src="../pics/oval.jpg" alt="Oval Shape" style="width:100px;height:auto;">
   <ul>
       <li><strong>Tip:</strong> Use vertical patterns to create the illusion of height and slimness.</li>
       <li><strong>Recommendation:</strong> Dark-colored shirts, vertical stripes, structured blazers.</li>
   </ul>
    `,
    rectangleM: `
    <h4>Rectangle Body Shape</h4>
    <p>The rectangle shape has balanced shoulder, waist, and hip measurements.</p>
    <img src="../pics/rectangleM.jpg" alt="Rectangle Shape" style="width:100px;height:auto;">
    <ul>
        <li><strong>Tip:</strong> Add definition to the shoulders and upper body with layered clothing.</li>
        <li><strong>Recommendation:</strong> Tailored jackets, padded blazers, crew-neck sweaters.</li>
    </ul>
    `,
    trapezoid: `
    <h4>Trapezoid Body Shape</h4>
    <p>The trapezoid shape has wider shoulders compared to the waist and hips.</p>
    <img src="../pics/trapezoid.jpg" alt="Trapezoid Shape" style="width:100px;height:auto;">
    <ul>
        <li><strong>Tip:</strong> Highlight your athletic build with fitted clothing.</li>
        <li><strong>Recommendation:</strong> Slim-fit shirts, tapered trousers, polo shirts.</li>
    </ul>
    `,
    invertedMale: `
    <h4>Inverted Triangle Body Shape</h4>
    <p>The inverted triangle shape has broad shoulders and a narrower waist and hips.</p>
    <img src="../pics/invertedm.jpg" alt="Inverted Triangle Shape" style="width:100px;height:auto;">
    <ul>
        <li><strong>Tip:</strong> Avoid overly tight tops; balance your look with straight or relaxed-fit pants.</li>
        <li><strong>Recommendation:</strong> V-neck shirts, straight-leg jeans, bomber jackets.</li>
    </ul>
    `
};

function getUserIdFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id; 
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
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
    if (gender === "women") {
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
    } else if (gender === "men") {
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
        const data = {
           measurements: {
                gender: document.querySelector('input[name="gender"]:checked').value,
                shoulderWidth: document.getElementById('shoulder').value,
                waistWidth: document.getElementById('waist').value,
                hipWidth: document.getElementById('hip').value,
                bodyType: calculateBodyShape()
            }
        };

        console.log(data)

        try {   
            const response = await fetch(`https://modelle.onrender.com/api/profile/${userId}/updateProfile`, {
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
            } else {
                showConfirmationMessage('Failed to save data: ' + result.message, true);
            }

        } catch (error) {
            console.log(error.message)
        }

        console.log("Data saved:", data);
    });
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

    // Automatically hide the message after 4 seconds
    setTimeout(() => {
        messageBox.classList.remove('visible');
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 300); // Wait for the transition to complete
    }, 4000);
}
