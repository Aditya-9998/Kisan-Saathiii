document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const ksid = document.getElementById("ksid").value.trim();
    const feedback = document.getElementById("feedback").value.trim();
    const problem = document.getElementById("problem").value.trim();

    // Minimum 10-word feedback rule
    const wordCount = feedback.split(/\s+/).filter(Boolean).length;
    if (wordCount < 10) {
      alert("Feedback must contain at least 10 words!");
      return;
    }

    alert(
      "Your message has been submitted!\n\nWe will contact you soon.\n\nThank you 🙏"
    );

    form.reset();
  });
});
