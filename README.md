# mbanifawaz.github.io

Personal portfolio of **Munes Bani Fawaz**, Senior Full Stack Software Engineer.
Live at <https://mbanifawaz.github.io>.

A single static page with no build step. GitHub Pages serves the repo as is.

## Structure

```
index.html            the page
404.html              "you broke the loop" page GitHub Pages shows for missing URLs
assets/css/site.css   all styles
assets/js/site.js     all behaviour; renders content from data.json
assets/data/data.json the content: projects, experience, skills, testimonials, links
assets/img/           profile photo, icons, project and testimonial images
assets/video/         project preview videos
assets/audio/         optional background music (off until the visitor turns it on)
assets/vendor/        Bootstrap Icons and the EmailJS browser SDK
```

## Editing content

Almost everything lives in `assets/data/data.json`:

- `portfolio.items`: projects. Set `"featured": true` and add a `highlights` list to show a project
  as a case study at the top of the Work section. Use `image` or `video` for the media.
- `resume.experience` / `resume.education`: the career timeline and education.
- `skills.data`: skill names and levels (0–100).
- `testimonials`: quotes, names, titles and photos.
- `links`: social links (Bootstrap Icons class names).
- `config.cv_url`: where every "Full CV" button points.
- `config.maintenance_mode`: set to `1` to show the coming-soon page instead of the site.

Copy in the hero, impact, services and contact sections is in `index.html`.

## Running locally

`fetch()` does not work over `file://`, so serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Contact form

The form sends through [EmailJS](https://www.emailjs.com/) (service `service_w8ondbc`,
template `template_pl80m3p`). If sending starts failing with an error such as
"Invalid grant. Please reconnect your Outlook account", reconnect the mail account in the
EmailJS dashboard under **Email Services**. No code change is needed.
