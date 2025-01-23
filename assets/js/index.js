
// Ensure the document is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();

  const birthdayElement = document.getElementById('birthday');
  const ageElement = document.getElementById('age');

  if (birthdayElement && ageElement) {
    // Extract date string from the #birthday span and convert to ISO format
    const birthdayText = birthdayElement.textContent.trim();
    const formattedDate = new Date(birthdayText).toISOString().split('T')[0]; // Convert to YYYY-MM-DD

    // Update the #age element with the calculated age
    ageElement.textContent = await calculateAge(formattedDate);
  } else {
    console.warn('Either the birthday or age element is missing in the document.');
  }
});

// Load data asynchronously
async function loadData() {
  try {
    const response = await fetch('assets/data/data.json'); // Fetch the JSON file
    const data = await response.json(); // Parse the JSON

    await loadConfig(data.config);

    await loadLinks(data.links);

    await loadSkills(data.skills);

    await loadResume(data.resume);

    await loadTestimonials(data.testimonials)
  } catch (error) {
    console.error('Error loading JSON data:', error);
  }
}

async function loadConfig(config) {
  const maintenance_mode = config.maintenance_mode;
  
  if (maintenance_mode == 1) {
    console.log('Maintenance Mode Active');
    const iframe = document.createElement('iframe');
    iframe.src = 'https://mbanifawaz.github.io/coming-soon/';
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.zIndex = '99999';  // Ensure the iframe is on top of other content

    // Append the iframe to the body as an overlay
    document.body.appendChild(iframe);
    document.body.style.overflow = "hidden"
  }
  
}

async function loadLinks(links) {
  const linksContainer = document.querySelector('.social-links');
  let linksHTML = '';
  linksHTML += links.map(skill => `
    <a href="${skill.href}" target="_blank"><i class="${skill.icon}"></i></a>
  `)
  .join('');
  linksContainer.innerHTML = linksHTML;
}

// Function to dynamically load skills into columns
async function loadSkills(skills) {
  const skillsContainer = document.querySelector('.skills-content');
  const columns = skills.columns; // Define the number of columns (you can make this configurable)
  skills = skills.data
  // Sort skills by level in descending order
  skills.sort((a, b) => b.level - a.level);
  const itemsPerColumn = Math.ceil(skills.length / columns); // Evenly distribute items

  let columnHTML = '';

  // Calculate column width based on the number of columns
  const colSize = 12 / columns; // Bootstrap's grid system has 12 columns, so divide 12 by the number of columns

  // Create columns dynamically
  for (let i = 0; i < columns; i++) {
    const start = i * itemsPerColumn;
    const end = start + itemsPerColumn;
    const columnSkills = skills.slice(start, end);

    columnHTML += `<div class="col-lg-${colSize}">`; // Use calculated column size

    columnHTML += columnSkills
      .map(skill => `
        <div class="progress">
          <span class="skill">${skill.name} <i class="val">${skill.level}%</i></span>
          <div class="progress-bar-wrap">
            <div class="progress-bar" role="progressbar" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
      `)
      .join('');

    columnHTML += `</div>`; // Close column wrapper
  }

  // Populate the skills section with the columns
  skillsContainer.innerHTML = columnHTML;
}

async function loadResume(resume) {
  const container = document.querySelector(".resume .container .row");

    // Load Summary
    const summaryDiv = document.createElement("div");
    summaryDiv.className = "col-lg-6";
    summaryDiv.innerHTML = `
      <h3 class="resume-title">Summary</h3>
      <div class="resume-item pb-0">
        <h4>${resume.summary.name}</h4>
        <p><em>${resume.summary.description}</em></p>
        <ul>${resume.summary.contact.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
    `;
    container.appendChild(summaryDiv);

    // Load Education
    summaryDiv.innerHTML += `<h3 class="resume-title">Education</h3>`;
    resume.education.forEach((edu) => {
      summaryDiv.innerHTML += `
        <div class="resume-item">
          <h4>${edu.degree}</h4>
          <h5>${edu.year}</h5>
          <p><em>${edu.institution}</em></p>
          <p>${edu.description}</p>
        </div>
      `;
    });

    // Load Experience
    const experienceDiv = document.createElement("div");
    experienceDiv.className = "col-lg-6";
    experienceDiv.innerHTML = `<h3 class="resume-title">Professional Experience</h3>`;
    resume.experience.forEach((exp) => {
      experienceDiv.innerHTML += `
        <div class="resume-item">
          <h4>${exp.title}</h4>
          <h5>${exp.year}</h5>
          <p><em>${exp.company}</em></p>
          <ul>${exp.responsibilities.map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
      `;
    });

    container.appendChild(experienceDiv);
}

async function loadTestimonials(testimonials) {
  const container = document.getElementById("testimonial-container");

  testimonials.forEach(testimonial => {
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    slide.innerHTML = `
  <div class="testimonial-item">
    <p>
      <i class="bi bi-quote quote-icon-left"></i>
      <span class="testimonial-text">
        ${shortenText(testimonial.text)} <span class="read-more" onclick="toggleText(this)">Read more...</span>
      </span>
      <span class="testimonial-full-text hide">
        ${testimonial.text} <span class="read-less" onclick="toggleText(this)">Read less...</span>
      </span>
      <i class="bi bi-quote quote-icon-right"></i>
    </p>
    <img src="${testimonial.image}" class="testimonial-img" alt="">
    <h3>${testimonial.name}</h3>
    <h4>${testimonial.title}</h4>
  </div>
`;

    container.appendChild(slide);
  });
}

function shortenText(text, maxLength = 150) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

function toggleText(element) {
  const testimonialText = element.closest('.testimonial-item').querySelector('.testimonial-text');
  const fullText = element.closest('.testimonial-item').querySelector('.testimonial-full-text');
  const temp = testimonialText.innerHTML;
  testimonialText.innerHTML = fullText.innerHTML;
  fullText.innerHTML = temp;
}

// Calculate age based on the given birth date
async function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Adjust for month and day differences
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}