function handleSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    
    // Here you would typically send this to your backend
    console.log('Email submitted:', email);
    
    // Show some feedback to the user
    alert('Thank you! We will notify you when we launch.');
    
    // Clear the form
    document.getElementById('email').value = '';
    
    return false;
}
