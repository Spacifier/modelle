$(document).ready(async function() {
  // Handle "Create Account" form submission
  const signinForm = document.querySelector('#signup-form'); 
  signinForm.addEventListener('submit',
    async function(event) {
      event.preventDefault();

      const formData = {
          firstname: document.getElementById('first-name').value, 
          lastname:document.getElementById('last-name').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        };
      
      try {
        const response = await fetch('https://modelle.onrender.com/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Handle successful signup
          console.log('Signup successful:', data);
          // Redirect the user to the appropriate page
        //   document.getElementById('user-icon-btn').href = '/html/profile.html';
          window.location.href = '../html/home.html'; 
        } else {
          // Handle signup error
          console.error('Signup failed:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  ); 

  
  // Handle "Log In" form submission
  const loginForm = document.querySelector('#signin-form')
  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = {
      email: $('#login-email').val(),
      password: $('#login-password').val()
    };
    console.log(formData); 

    try {
      const response = await fetch('https://modelle.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login

        console.log('Login successful:', data);
        // Store the token in localStorage or a cookie
        localStorage.setItem('token', data.token);
        // Redirect the user to the appropriate page
        window.location.href = '../html/home.html';
      } else {
        // Handle login error
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});