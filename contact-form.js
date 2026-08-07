const contactForm = document.getElementById("contact-form");
const contactFormStatus = document.getElementById("contact-form-status");

if (contactForm && contactFormStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    contactFormStatus.textContent = "Sending your message...";
    contactFormStatus.dataset.state = "pending";

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "Unable to send message right now.");
      }

      contactForm.reset();
      window.location.href = "thank-you.html";
    } catch (error) {
      contactFormStatus.textContent = error.message || "Unable to send message right now.";
      contactFormStatus.dataset.state = "error";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}