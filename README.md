# Thanishka Yogesh | Developer Portfolio

<p align="center">
  <a href="https://thethanishkayogesh.vercel.app/">
    <img src="https://img.shields.io/badge/LIVE_PORTFOLIO-Visit_Website-C9A23F?style=for-the-badge" alt="Live Portfolio" />
  </a>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <b>A digital space where creativity meets code.</b>
  <br />
  An interactive portfolio showcasing my projects, technical skills, experiences, achievements, and creative journey through modern web technologies.
</p>

<p align="center">
  <a href="https://thethanishkayogesh.vercel.app/">Live Website</a> •
  <a href="https://github.com/thanishkaykb">GitHub</a>
</p>

---

## ✨ Overview

Welcome to my personal portfolio!

This project is designed to be more than a traditional portfolio website. It represents my identity, creativity, technical abilities, and journey as a Computer Science and Engineering student.

Featuring a distinctive black-and-golden aesthetic, the portfolio combines interactive elements, animations, modern web technologies, and carefully crafted visual experiences.

From exploring interactive skill environments to discovering detailed project case studies, every section is designed to make browsing an engaging experience.

**Explore the portfolio:**  
https://thethanishkayogesh.vercel.app/

## 🚀 Features

### 1. Hero Section
- Interactive 3D golden particle environment.
- Animated concentric rings.
- Pointer-responsive parallax effects.
- Custom portrait presentation.
- Animated loading experience.

### 2. Interactive Skills World
- Five procedurally generated 3D doors.
- Interactive hover and opening animations.
- Individual content sections for different skill disciplines.
- Keyboard and touch-friendly navigation.

### 3. Interactive Ability Card
- 3D rotating card.
- Realistic depth using CSS 3D transforms.
- Pointer-responsive rotation.
- Animated golden foil lighting.
- Interactive front-and-back flip.

### 4. Journey & Experience Timeline
- Scroll-triggered animations using GSAP.
- Interactive timeline progression.
- Active entry tracking.
- Animated progress indicator.

### 5. Project Showcase
- Interactive project cards.
- Detailed project case studies.
- Full-screen animated project overlays.
- Project descriptions, features, and technology stacks.
- Relevant project resources and links.

### 6. Web Development Showcase
- Dedicated section for web development projects.
- Interactive project exploration.
- Detailed project information.
- Visual project presentations.

### 7. Frames Gallery
- Asymmetrical image gallery.
- Full-screen image lightbox.
- Keyboard navigation between images.
- Interactive visual presentation.

### 8. Contact Section
- Interactive contact form.
- Client-side form validation.
- Individual field error messages.
- Loading, success, and error states.
- Email client fallback.

### 9. Additional Interactions
- Custom desktop cursor.
- Animated navigation.
- Responsive mobile navigation.
- Smooth scrolling using Lenis.
- Scroll progress indicator.
- Reduced-motion accessibility support.
- WebGL fallback for unsupported devices.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | Frontend development |
| TypeScript | Type safety |
| Vite | Development and build tooling |
| Tailwind CSS v4 | Styling and responsive layouts |
| Three.js | 3D graphics |
| React Three Fiber | React-based 3D rendering |
| GSAP | Advanced animations and scroll interactions |
| Framer Motion | UI animations |
| Lenis | Smooth scrolling |
| CSS 3D Transforms | Interactive visual effects |

## 📁 Project Structure

```text
Portfolio-V2/
│
├── public/
│   ├── images/
│   ├── frames/
│   ├── resume/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── og-image.png
│
├── scripts/
├── sites/
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   ├── three/
│   │   └── ui/
│   │
│   ├── lib/
│   └── styles/
│
├── .env.example
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚙️ Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js 20 or later
- npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/thanishkaykb/Portfolio-V2.git
```

### 2. Navigate to the Project Directory

```bash
cd Portfolio-V2
```

### 3. Install Dependencies

```bash
npm install
```

Alternatively:

```bash
npm ci
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal.

### 5. Create a Production Build

```bash
npm run build
```

### 6. Preview the Production Build

```bash
npm run preview
```

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Creates the production build |
| `npm run build:sites` | Builds the application and prepares the sites build |
| `npm run preview` | Previews the production build |
| `npm run typecheck` | Runs TypeScript type checking |

## 📬 Contact Form Configuration

The contact form supports an email client fallback.

To enable direct form submissions through an external endpoint:

1. Create a `.env` file using `.env.example` as a reference.
2. Configure the endpoint:

```env
VITE_CONTACT_ENDPOINT=your_form_endpoint
```

3. Ensure the endpoint accepts JSON data containing:

```json
{
  "name": "Visitor Name",
  "email": "visitor@example.com",
  "subject": "Hello",
  "message": "Your message here"
}
```

4. Rebuild and redeploy the application.

**Security note:** Never expose private API keys or secret credentials through client-side environment variables.

## ♿ Accessibility & Performance

- Semantic HTML and accessible landmarks.
- Keyboard-accessible interactive elements.
- Visible focus indicators.
- Accessible contact form labels.
- Reduced-motion preferences.
- WebGL fallback for unsupported devices.
- Responsive layouts for different screen sizes.
- Keyboard navigation for interactive overlays.

## 🌐 Deployment

The portfolio is deployed using **Vercel**.

**Live Website:**  
https://thethanishkayogesh.vercel.app/

## 🎨 Design Philosophy

**Your work deserves more than a list of links.**

I wanted to build an experience that reflects the way I approach development: combining technical thinking, creativity, experimentation, and attention to detail.

Every interaction, animation, and visual element contributes to telling my story as a developer.

## 👩‍💻 About Me

I'm **Thanishka Yogesh**, a Computer Science and Engineering student at Sri Sairam Engineering College, Chennai.

I'm passionate about:

- Web development and full-stack development.
- Building interactive digital experiences.
- Exploring modern web technologies.
- Designing and developing creative projects.
- Turning ideas into practical solutions.

I enjoy experimenting with new technologies, learning through building, and continuously improving my development skills.

## 🤝 Let's Connect

- 🌐 **Portfolio:** https://thethanishkayogesh.vercel.app/
- 💻 **GitHub:** https://github.com/thanishkaykb
- 💼 **LinkedIn:** https://www.linkedin.com/in/thanishka-yogesh/

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the conditions specified in the MIT License.

The original copyright notice and permission notice must be included in all copies or substantial portions of the software.

See the [LICENSE](LICENSE) file for the complete license terms.

**Copyright © 2026 Thanishka Yogesh.**

---

<p align="center">
  <b>Designed with intention. Developed with curiosity. Built with code.</b>
  <br /><br />
  If you enjoyed exploring this project, consider giving the repository a ⭐!
  <br /><br />
  © 2026 Thanishka Yogesh. All rights reserved under the terms of the MIT License.
</p>
