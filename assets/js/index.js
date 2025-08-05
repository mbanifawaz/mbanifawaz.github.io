let globalData;
let globalVideoPlayBackRate=4;
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
    globalData = data; // Store the data in the global variable

    await loadConfig(data.config);

    await loadLinks(data.links);

    await loadSkills(data.skills);

    await loadResume(data.resume);

    await loadTestimonials(data.testimonials);

    await loadPortfolio(data.portfolio);
    document.querySelectorAll('video').forEach(video => {
        video.playbackRate = globalVideoPlayBackRate;
    });
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
  // Create the swiper container
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'init-swiper');

  // Create the Swiper config as a script tag and append it to the container
  const swiperConfigScript = document.createElement('script');
  swiperConfigScript.type = 'application/json';
  swiperConfigScript.classList.add('swiper-config');
  swiperConfigScript.innerText = JSON.stringify({
    loop: true,
    speed: 600,
    autoplay: {
      delay: 5000
    },
    slidesPerView: 'auto',
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 40
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 1
      }
    }
  });

  swiperContainer.appendChild(swiperConfigScript);

  // Create the swiper wrapper container
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.id = 'testimonial-container';
  swiperContainer.appendChild(swiperWrapper);

  // Create the pagination container
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination');
  swiperContainer.appendChild(swiperPagination);

  // Append the swiper container to the body (or any other desired container)
  document.querySelector('.swipermaincontainer').appendChild(swiperContainer);

  // Add testimonial slides
  testimonials.forEach(testimonial => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');

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

    swiperWrapper.appendChild(slide);
  });

  // Initialize Swiper after adding the testimonials
  new Swiper('.swiper', JSON.parse(swiperConfigScript.innerText));
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

async function loadPortfolio(portfolio) {

    // Populate Filters
    const filtersContainer = document.getElementById('portfolio-filters');
    portfolio.filters.forEach(filter => {
        const li = document.createElement('li');
        li.setAttribute('data-filter', filter.value);
        li.textContent = filter.label;
        if (filter.active) li.classList.add('filter-active');
        filtersContainer.appendChild(li);
    });

    // Prepare gallery groups
    const galleryGroups = {};
    portfolio.items.forEach(item => {
        if (!galleryGroups[item.galleryGroup]) {
            galleryGroups[item.galleryGroup] = [];
        }
        if (item.image) {
            galleryGroups[item.galleryGroup].push(item.image);
        } else if (item.video) {
            galleryGroups[item.galleryGroup].push(item.video);
        }
    });

    // Populate Portfolio Items
    const portfolioContainer = document.getElementById('portfolio-container');
    portfolio.items.forEach(item => {
        const div = document.createElement('div');
        div.className = `col-lg-4 col-md-6 portfolio-item isotope-item ${item.category}`;
        
        // Generate hidden gallery links
        const hiddenLinks = galleryGroups[item.galleryGroup]
            .map(img => `<a href="${img}" class="gallery-hidden-link glightbox" data-gallery="${item.galleryGroup}"></a>`)
            .join('');

        div.innerHTML = `
            <div class="portfolio-content h-100">
                  ${item.image ? 
                    `<img src="${item.image}" alt="${item.title}" class="img-fluid">` : 
                    (item.video ? 
                        `<video autoplay muted class="img-fluid" loop>
                            <source src="${item.video}" />
                        </video>` : 
                        '')
                }
                <div class="portfolio-info">
                    <h4>${item.title}</h4>
                    <p>${item.shortDescription}</p>
                    <a href="#" data-open-gallery="${item.galleryGroup}" src=${item.image ? item.image : (item.video ? item.video : '')}
                       class="gallery-trigger preview-link">
                       <i class="bi bi-zoom-in"></i>
                    </a>
                    <a href="#" 
                       title="More Details" 
                       class="details-link">
                       <i class="bi bi-link-45deg"></i>
                    </a>
                </div>
                ${hiddenLinks}
            </div>
        `;
        portfolioContainer.appendChild(div);
    });

    // Initialize Glightbox
    const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        zoomable: true
    });

    // Gallery & Details Trigger Logic
    document.addEventListener('click', function(e) {
        const triggerLink = e.target.closest('.gallery-trigger');
        const portfolioDetailsModal = new bootstrap.Modal(document.getElementById('portfolioDetailsModal'));
        const detailsLink = e.target.closest('.details-link');
        if (triggerLink) {
            e.preventDefault();
            const galleryGroup = triggerLink.getAttribute('data-open-gallery');
            const hiddenLinks = document.querySelectorAll(
                `.gallery-hidden-link[data-gallery="${galleryGroup}"]`
            );
            
            if (hiddenLinks.length > 0) {
                const clickedItemGroup = triggerLink.closest('.portfolio-item');
                const anchorTags = clickedItemGroup.querySelectorAll('a.gallery-hidden-link.glightbox');
                const index = Array.from(anchorTags).findIndex(anchor => anchor.getAttribute('href').includes(triggerLink.getAttribute('src')));

                const lightbox = GLightbox({
                    selector: `.gallery-hidden-link[data-gallery="${galleryGroup}"]`,
                    touchNavigation: true,
                    loop: true,
                    zoomable: true,
                    startAt: hiddenLinks.length > 1 ? index : 0
                });
                
                lightbox.open();
            }
        }
        if (detailsLink) {
          e.preventDefault();
          const portfolioItem = detailsLink.closest('.portfolio-item');
          const title = portfolioItem.querySelector('.portfolio-info h4').textContent;
          const item = globalData.portfolio.items.find(item => item.title === title);
          const category = item.category.replace(/filter-/g, "").replace(/\b\w/g, str => str.toUpperCase()).replace(/ /g, " | ");        
          const description = item.description
          const stack = item.stack
          const platform = item.platform
          const client = item.client
          const projectDate = item.projectDate
          const projectURL = item.projectURL
          const projectURLText = item.projectURLText
      
          // Populate modal with the first image (or any image you prefer)
          const portfolioImage = document.querySelector('#portfolioDetailsModal .portfolio-image');
          portfolioImage.innerHTML = `
              ${item.image ? 
                  `<img src="${item.image}" alt="${title}" class="img-fluid">` : 
                  (item.video ? 
                      `<video autoplay muted loop width="50%">
                          <source src="${item.video}" />
                      </video>` : 
                      '')
              }
          `;

      
      
          // Populate project info (you can customize this)
          const portfolioInfo = document.querySelector('#portfolioDetailsModal .portfolio-info ul');
          portfolioInfo.innerHTML = `
              <li><strong>Category</strong>: ${category}</li>
              <li><strong>Stack</strong>: ${stack}</li>
              <li><strong>Platform</strong>: ${platform}</li>
              <li><strong>Client</strong>: ${client}</li>
              <li><strong>Project Date</strong>: ${projectDate}</li>
              <li><strong>Project URL</strong>: <a href="${projectURL}" target="_blank">${projectURLText}</a></li>
          `;
      
          // Populate description
          const portfolioDescription = document.querySelector('#portfolioDetailsModal .portfolio-description');
          portfolioDescription.innerHTML = `
              <h2>${title}</h2>
              <p>${description}</p>
          `;
      
          // Show the modal
          portfolioDetailsModal.show();
          portfolioDetailsModal._element.addEventListener('shown.bs.modal', () => {
              document.querySelectorAll('video').forEach(video => {
                  video.playbackRate = globalVideoPlayBackRate; // Set the desired playback speed
              });
          });
      }      

    });

    // Initialize Isotope with additional options
    const $container = $('.isotope-container');
    $container.imagesLoaded(() => {
        $container.isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'masonry',
            percentPosition: true,
            masonry: {
                columnWidth: '.portfolio-item'
            }
        });
    });

    // Recalculate layout on window resize
    $(window).on('resize', () => {
        $container.isotope('layout');
    });

    // Filter Items
    $('.portfolio-filters li').on('click', function() {
        $('.portfolio-filters li').removeClass('filter-active');
        $(this).addClass('filter-active');

        const filterValue = $(this).attr('data-filter');
        $container.isotope({ filter: filterValue });
    });

    // Initialize AOS
    AOS.init();
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

