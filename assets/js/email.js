(function() {
    emailjs.init("JgwpfmPhF5CMdTpy0"); // Replace with your EmailJS Public Key
})();

document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const submitButton = this.querySelector("button[type='submit']");

    submitButton.disabled = true; // Disable the button
    submitButton.style.pointerEvents = "none"; // Prevent clicks

    const serviceID = "service_w8ondbc"; // Replace with your EmailJS Service ID
    const templateID = "template_pl80m3p"; // Replace with your EmailJS Template ID

    const templateParams = {
        name: document.getElementById("name-field").value,
        email: document.getElementById("email-field").value,
        subject: document.getElementById("subject-field").value,
        message: document.getElementById("message-field").value
    };

    this.querySelector('.loading').classList.add('d-block');
    this.querySelector('.error-message').classList.remove('d-block');
    this.querySelector('.sent-message').classList.remove('d-block');

    emailjs.send(serviceID, templateID, templateParams)
        .then(response => {
            this.querySelector('.loading').classList.remove('d-block');
            this.querySelector(".sent-message").classList.add("d-block");
            this.querySelector(".error-message").classList.remove("d-block");
            this.reset();

            submitButton.disabled = false; // Re-enable button
            submitButton.style.pointerEvents = "auto"; // Allow clicks
        })
        .catch(error => {
            this.querySelector(".error-message").innerText = error.text;
            this.querySelector('.loading').classList.remove('d-block');
            this.querySelector(".error-message").classList.add("d-block");
            this.querySelector(".sent-message").classList.remove("d-block");

            submitButton.disabled = false; // Re-enable button
            submitButton.style.pointerEvents = "auto"; // Allow clicks
        });
});