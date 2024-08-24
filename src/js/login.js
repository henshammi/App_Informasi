document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
  
        const result = await response.json();
  
        if (response.ok) {
            console.log('Login successful:', result);
            if (result.userId && result.userName) {
                localStorage.setItem('userId', result.userId);
                localStorage.setItem('userName', result.userName);
                window.location.href = 'index.html';
            } else {
                throw new Error('User data missing in response');
            }
        } else {
            alert(result.error || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
    }
  });
  
