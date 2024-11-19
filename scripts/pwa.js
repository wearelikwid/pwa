let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show the install button if it exists
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'block';
        
        installButton.addEventListener('click', (e) => {
            // Show the install prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
    }
});

// If the app is already installed, hide the install button
window.addEventListener('appinstalled', (evt) => {
    const installButton = document.getElementById('install-button');
    if (installButton) {
        installButton.style.display = 'none';
    }
});
