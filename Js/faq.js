document.addEventListener("DOMContentLoaded", () => {
    const faqs = document.querySelectorAll(".faq-item");

    faqs.forEach(item => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", () => {
            item.classList.toggle("active");
        });
    });
});
