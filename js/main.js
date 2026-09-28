const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const year = document.getElementById("year");
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");
year.textContent = new Date().getFullYear();

// Initialize EmailJS
emailjs.init("Z5d0Jx1WZ55q3hqUp");

// Create scroll progress line
const createScrollProgress = () => {
  const progressLine = document.createElement("div");
  progressLine.className = "scroll-progress-line";
  document.body.appendChild(progressLine);
};

createScrollProgress();

const closeMenu = () => {
  mobileNav.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
};

menuToggle.addEventListener("click", () => {
  const open = mobileNav.classList.toggle("open");
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});

mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 12);
  
  // Update scroll progress line
  const scrollProgress = document.querySelector(".scroll-progress-line");
  if (scrollProgress) {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + "%";
  }
});

const sections = [...document.querySelectorAll("section[id]")];
const page = document.body.dataset.page;

const setActive = () => {
  const y = window.scrollY + 120;
  let current = "home";
  for (const section of sections) {
    if (y >= section.offsetTop) current = section.id;
  }
  document.querySelectorAll(".nav a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", setActive);
setActive();

if (form) {
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    if (!form.reportValidity()) return;
    
    // Get form values
    const templateParams = {
      from_name: document.getElementById("name").value,
      from_email: document.getElementById("email").value,
      project_type: document.getElementById("project_type").value,
      message: document.getElementById("message").value,
      to_email: "badshaheditor9@gmail.com"
    };
    
    // Show loading state
    statusEl.textContent = "Sending your message...";
    statusEl.classList.remove("error");
    statusEl.style.color = "#b8b8b8";
    
    // Send email using EmailJS
    emailjs.send("service_qvp02m3", "template_8kl6x2d", templateParams)
      .then((response) => {
        console.log("Email sent successfully!");
        statusEl.textContent = "✓ Successfully sent your query! I'll get back to you soon.";
        statusEl.style.color = "#32d74b";
        statusEl.classList.remove("error");
        form.reset();
        
        // Clear success message after 6 seconds
        setTimeout(() => {
          statusEl.textContent = "";
          statusEl.style.color = "#b8b8b8";
        }, 6000);
      })
      .catch((error) => {
        console.error("Email error:", error);
        statusEl.textContent = "✗ Error sending message. Please try again or email directly.";
        statusEl.style.color = "#ff6b6b";
        statusEl.classList.add("error");
      });
    
    return false;
  }, false);
}
