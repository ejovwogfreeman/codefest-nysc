// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
  // Initialize animations
  initializeAnimations();

  // Handle CTA button clicks
  const ctaButtons = document.querySelectorAll(".cta-btn, .application-btn");
  ctaButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      showRegistrationModal();
    });
  });

  // Handle track selection
  const trackButtons = document.querySelectorAll(".track-btn");
  trackButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const trackCard = this.closest(".track-card");
      const trackTitle = trackCard.querySelector(".track-title").textContent;
      selectTrack(trackTitle);
    });
  });

  // Handle contact form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleContactForm(this);
    });
  }

  // Add scroll effects
  window.addEventListener("scroll", handleScroll);
});

// Animation initialization
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  // Add animation classes to elements
  const sections = document.querySelectorAll("section");
  sections.forEach((section, index) => {
    const animationClass = index % 2 === 0 ? "fade-in" : "slide-in-left";
    section.classList.add(animationClass);
    observer.observe(section);
  });

  // Animate cards
  const cards = document.querySelectorAll(
    ".track-card, .benefit-item, .structure-item"
  );
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("scale-in");
      observer.observe(card);
    }, index * 100);
  });
}

// Track selection function
function selectTrack(trackName) {
  // Remove previous selections
  document.querySelectorAll(".track-card").forEach((card) => {
    card.classList.remove("selected");
  });

  // Add selection to clicked track
  event.target.closest(".track-card").classList.add("selected");

  // Store selection in localStorage
  localStorage.setItem("selectedTrack", trackName);

  // Show confirmation
  showNotification(`You've selected: ${trackName}`, "success");

  // Scroll to application section
  setTimeout(() => {
    document.querySelector(".application").scrollIntoView({
      behavior: "smooth",
    });
  }, 1000);
}

// Registration modal
function showRegistrationModal() {
  const selectedTrack = localStorage.getItem("selectedTrack") || "Not selected";

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Register for NYSC CodeFest</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Selected Track:</strong> ${selectedTrack}</p>
                <p>Registration is currently open! To complete your registration:</p>
                <ol>
                    <li>Fill out the registration form</li>
                    <li>Choose your preferred track</li>
                    <li>Complete payment of ₦50,000 administration fee</li>
                    <li>Begin your learning journey</li>
                </ol>
                <div class="modal-contact">
                    <h3>Contact Information:</h3>
                    <p><i class="fas fa-phone"></i> +2349061817858</p>
                    <p><i class="fas fa-phone"></i> +2349065576078</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-primary">Proceed to Registration</button>
                <button class="btn-secondary modal-close">Close</button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Add modal styles
  if (!document.querySelector("#modal-styles")) {
    const modalStyles = document.createElement("style");
    modalStyles.id = "modal-styles";
    modalStyles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                animation: fadeInModal 0.3s ease forwards;
            }
            
            .modal-content {
                background: white;
                border-radius: 16px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.8);
                animation: scaleInModal 0.3s ease forwards;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 24px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
            }
            
            .modal-body {
                padding: 24px;
            }
            
            .modal-body ol {
                margin: 16px 0;
                padding-left: 20px;
            }
            
            .modal-contact {
                background: #f3f4f6;
                padding: 16px;
                border-radius: 8px;
                margin-top: 16px;
            }
            
            .modal-contact h3 {
                margin-bottom: 8px;
                color: #1f2937;
            }
            
            .modal-contact p {
                margin: 4px 0;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .modal-footer {
                display: flex;
                gap: 12px;
                padding: 24px;
                border-top: 1px solid #e5e7eb;
            }
            
            .btn-primary {
                background: #2563eb;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                flex: 1;
            }
            
            .btn-secondary {
                background: #6b7280;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            }
            
            @keyframes fadeInModal {
                to { opacity: 1; }
            }
            
            @keyframes scaleInModal {
                to { transform: scale(1); }
            }
        `;
    document.head.appendChild(modalStyles);
  }

  // Handle modal close
  modal.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("modal-overlay") ||
      e.target.classList.contains("modal-close")
    ) {
      closeModal(modal);
    }
  });

  // Handle proceed button
  modal.querySelector(".btn-primary").addEventListener("click", function () {
    showNotification("Redirecting to registration form...", "info");
    closeModal(modal);
    // Here you would redirect to actual registration form
  });
}

function closeModal(modal) {
  modal.style.animation = "fadeOutModal 0.3s ease forwards";
  setTimeout(() => {
    modal.remove();
  }, 300);

  // Add fadeOut animation
  if (!document.querySelector("#fadeout-styles")) {
    const fadeOutStyles = document.createElement("style");
    fadeOutStyles.id = "fadeout-styles";
    fadeOutStyles.textContent = `
            @keyframes fadeOutModal {
                to { opacity: 0; }
            }
        `;
    document.head.appendChild(fadeOutStyles);
  }
}

// Contact form handler
function handleContactForm(form) {
  const formData = new FormData(form);
  const name =
    formData.get("name") || form.querySelector('input[type="text"]').value;
  const email =
    formData.get("email") || form.querySelector('input[type="email"]').value;

  if (!name || !email) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  // Simulate form submission
  showNotification("Thank you! We will contact you soon.", "success");
  form.reset();
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Add notification styles if not present
  if (!document.querySelector("#notification-styles")) {
    const notificationStyles = document.createElement("style");
    notificationStyles.id = "notification-styles";
    notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 10001;
                transform: translateX(400px);
                animation: slideInNotification 0.3s ease forwards;
            }
            
            .notification-success {
                background: #10b981;
            }
            
            .notification-error {
                background: #ef4444;
            }
            
            .notification-info {
                background: #2563eb;
            }
            
            @keyframes slideInNotification {
                to { transform: translateX(0); }
            }
            
            @keyframes slideOutNotification {
                to { transform: translateX(400px); }
            }
        `;
    document.head.appendChild(notificationStyles);
  }

  document.body.appendChild(notification);

  // Auto remove notification
  setTimeout(() => {
    notification.style.animation = "slideOutNotification 0.3s ease forwards";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

// Scroll effects
function handleScroll() {
  const header = document.querySelector(".header");
  const scrolled = window.scrollY > 50;

  if (scrolled) {
    header.style.background = "rgba(255, 255, 255, 0.95)";
    header.style.backdropFilter = "blur(10px)";
  } else {
    header.style.background = "white";
    header.style.backdropFilter = "none";
  }
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Track selection styling
const style = document.createElement("style");
style.textContent = `
    .track-card.selected {
        border-color: #10b981 !important;
        background: rgba(16, 185, 129, 0.05);
        transform: translateY(-8px) scale(1.02);
    }
    
    .track-card.selected .track-btn {
        background: #10b981;
        color: white;
        border-color: #10b981;
    }
`;
document.head.appendChild(style);
