// Calculate age based on the given birth date
function calculateAge(birthDate) {
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
  
  // Ensure the document is fully loaded
  document.addEventListener('DOMContentLoaded', () => {
    const birthdayElement = document.getElementById('birthday');
    const ageElement = document.getElementById('age');
  
    if (birthdayElement && ageElement) {
      // Extract date string from the #birthday span and convert to ISO format
      const birthdayText = birthdayElement.textContent.trim();
      const formattedDate = new Date(birthdayText).toISOString().split('T')[0]; // Convert to YYYY-MM-DD
  
      // Update the #age element with the calculated age
      ageElement.textContent = calculateAge(formattedDate);
    } else {
      console.warn('Either the birthday or age element is missing in the document.');
    }
  });  