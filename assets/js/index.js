
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

    await loadConfig(data.config)

    // Assuming skills data is located inside the response
    await loadSkills(data.skills); // Load skills
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

// Function to dynamically load skills into columns
async function loadSkills(skills) {
  const skillsContainer = document.querySelector('.skills-content');
  const columns = skills.columns; // Define the number of columns (you can make this configurable)
  skills = skills.data
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