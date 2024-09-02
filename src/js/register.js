document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const alamat = document.getElementById('alamat').value;
            const no_hp = document.getElementById('no_hp').value;

            console.log('Register form submitted');
            console.log('Name:', name);
            console.log('Email:', email);
            console.log('Password:', password);

            try {
                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password, alamat, no_hp })
                });

                const result = await response.json();
                console.log('Registration response:', result);

                if (response.ok) {
                    alert('Registration successful!');
                    window.location.href = 'login.html'; 
                } else {
                    alert(result.error || 'Registration failed');
                }
            } catch (error) {
                console.error('Error during registration:', error);
            }
        });
    } else {
        console.error('Register form not found!');
    }
});
