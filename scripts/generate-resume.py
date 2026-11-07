"""Builds public/resume/Thanishka-Yogesh-Resume.pdf from the résumé content.

The résumé was supplied to the workspace as text (the original PDF was not
readable), so this regenerates a clean, on-brand PDF with the same content.
Replace the output file with the original PDF at any time · the site serves
whatever sits at that path.

Run: python3 scripts/generate-resume.py   (needs reportlab)
"""

from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

INK = HexColor("#080808")
GOLD = HexColor("#FFC928")
DARK_GOLD = HexColor("#8A6C15")
MUTED = HexColor("#6B6B66")
LINE = HexColor("#DAD7CE")
BONE = HexColor("#F5F2E9")

OUT = Path(__file__).resolve().parent.parent / "public" / "resume" / "Thanishka-Yogesh-Resume.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = A4
MARGIN = 16 * mm
BAND = 42 * mm

name_style = ParagraphStyle(
    "name", fontName="Helvetica-Bold", fontSize=27, leading=29, textColor=BONE, spaceAfter=1
)
role_style = ParagraphStyle(
    "role", fontName="Helvetica", fontSize=9.5, leading=12, textColor=GOLD, spaceAfter=5
)
contact_style = ParagraphStyle(
    "contact", fontName="Helvetica", fontSize=7.4, leading=10, textColor=HexColor("#C7C3BA")
)
section_style = ParagraphStyle(
    "section",
    fontName="Helvetica-Bold",
    fontSize=8.4,
    leading=11,
    textColor=INK,
    spaceBefore=10,
    spaceAfter=3,
)
body_style = ParagraphStyle(
    "body", fontName="Helvetica", fontSize=8.5, leading=11.4, textColor=HexColor("#262624")
)
small_style = ParagraphStyle(
    "small", fontName="Helvetica", fontSize=7.6, leading=10, textColor=MUTED
)
bullet_style = ParagraphStyle(
    "bullet",
    parent=body_style,
    leftIndent=9,
    bulletIndent=1,
    spaceBefore=1.4,
    alignment=TA_LEFT,
)
role_line_style = ParagraphStyle(
    "roleline", fontName="Helvetica-Bold", fontSize=9.1, leading=11.4, textColor=INK
)
meta_style = ParagraphStyle(
    "meta", fontName="Helvetica-Oblique", fontSize=7.6, leading=9.8, textColor=MUTED
)


def rule(width: float = PAGE_W - 2 * MARGIN, color=LINE, thickness: float = 0.7):
    table = Table([[""]], colWidths=[width], rowHeights=[thickness])
    table.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, -1), color)]))
    return table


def section(story: list, title: str):
    story.append(Spacer(1, 2))
    story.append(Paragraph(title.upper(), section_style))
    story.append(rule())
    story.append(Spacer(1, 3))


def bullets(items: list):
    return [Paragraph(item, bullet_style, bulletText="–") for item in items]


def header(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, PAGE_H - BAND, PAGE_W, BAND, stroke=0, fill=1)
    canvas.setFillColor(GOLD)
    canvas.rect(0, PAGE_H - BAND, 4 * mm, BAND, stroke=0, fill=1)

    # monogram
    canvas.setFillColor(GOLD)
    canvas.roundRect(PAGE_W - 30 * mm, PAGE_H - 20 * mm, 13 * mm, 13 * mm, 6.5 * mm, stroke=0, fill=1)
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawCentredString(PAGE_W - 23.5 * mm, PAGE_H - 15.4 * mm, "TY")

    # footer
    canvas.setFillColor(HexColor("#8C8880"))
    canvas.setFont("Helvetica", 7)
    canvas.drawString(MARGIN, 11 * mm, "Thanishka Yogesh · Résumé")
    canvas.drawRightString(PAGE_W - MARGIN, 11 * mm, "Page %d" % doc.page)
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.6)
    canvas.line(MARGIN, 14 * mm, PAGE_W - MARGIN, 14 * mm)
    canvas.restoreState()


def build():
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=BAND + 5 * mm,
        bottomMargin=18 * mm,
        title="Thanishka Yogesh · Résumé",
        author="Thanishka Yogesh",
        subject="Computer Science and Engineering student · full-stack and web developer",
    )
    frame = Frame(
        MARGIN,
        18 * mm,
        PAGE_W - 2 * MARGIN,
        PAGE_H - (BAND + 5 * mm) - 18 * mm,
        id="body",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=header)])

    story = []

    # Name block lives inside the dark band drawn by header(); the story starts
    # below it with the summary.
    section(story, "Summary")
    story.append(
        Paragraph(
            "Second-year B.E. Computer Science and Engineering undergraduate with an 8.60 CGPA, "
            "focused on full-stack and web development. Experienced in building and deploying "
            "responsive web applications across frontend, backend and database layers using React, "
            "JavaScript, Node.js and Python, with hands-on experience through internships, "
            "hackathons and independent projects.",
            body_style,
        )
    )

    section(story, "Education")
    story.append(
        Paragraph("Bachelor of Engineering · Computer Science and Engineering", role_line_style)
    )
    story.append(
        Paragraph(
            "Sri Sairam Engineering College, Chennai &nbsp;·&nbsp; Aug 2025 – Expected Aug 2029 "
            "&nbsp;·&nbsp; CGPA 8.60",
            meta_style,
        )
    )

    section(story, "Technical Skills")
    skills = [
        ("Languages", "Python · Java · C · JavaScript · TypeScript · SQL"),
        ("Web", "HTML · CSS · React.js · Next.js · Node.js · Express.js · Tailwind CSS"),
        ("Backend &amp; database", "FastAPI · MySQL · PostgreSQL · Supabase · Convex · REST APIs"),
        ("AI &amp; data", "Scikit-learn · Pandas · SHAP · Computer vision · Speech recognition"),
        ("Tools", "Git · GitHub · Vercel · VS Code · Figma"),
    ]
    rows = [
        [Paragraph(f"<b>{label}</b>", body_style), Paragraph(value, body_style)]
        for label, value in skills
    ]
    table = Table(rows, colWidths=[33 * mm, (PAGE_W - 2 * MARGIN) - 33 * mm])
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1.5),
                ("TOPPADDING", (0, 0), (-1, -1), 1.5),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(table)

    section(story, "Projects")

    project_blocks = [
        {
            "title": "PAIMANA-AI · Infrastructure Risk Intelligence Platform",
            "meta": "2026 · AI-powered project monitoring &amp; risk prediction · paimana-ai-tau.vercel.app",
            "bullets": [
                "Built a predictive intelligence platform to identify cost, schedule and execution risks across infrastructure projects, enabling proactive intervention.",
                "Developed risk scoring, portfolio analytics, alerts and AI-driven insights, with SHAP-based explainability for key prediction factors.",
                "Implemented an interactive dashboard with risk trends, What-If simulation and RAG-assisted insights.",
            ],
            "stack": "React · Vite · FastAPI · Python · Scikit-learn · SHAP · Pandas",
        },
        {
            "title": "Silent Voices Seen · Accessibility &amp; Communication Platform",
            "meta": "2026 · Full-stack web application · Team Lead · silent-voice-seen.vercel.app",
            "bullets": [
                "Led development and team integration of an accessibility platform supporting speech, text and sign-language communication.",
                "Developed text-to-sign, voice-to-sign and sign-to-text workflows with camera-based sign recognition and fingerspelling.",
                "Built responsive, user-focused interfaces with real-time interaction capabilities.",
            ],
            "stack": "React · Next.js · Node.js · Computer Vision · Speech Recognition · Vercel",
        },
        {
            "title": "CongestiQ-AI · AI-Powered Urban Traffic Intelligence · 2nd Prize",
            "meta": "2026 · 8-hour hackathon · Team Lead · Code Carnival 2K26, SIMATS Engineering · congestiq-ai.vercel.app",
            "bullets": [
                "Led development of a predictive traffic intelligence system combining traffic, weather, incident and safety data to identify emerging congestion risks.",
                "Engineered an explainable Low / Medium / High risk engine with reasoning behind each prediction.",
                "Developed a live MVP with traffic dashboards, signal timing recommendations and route suggestions; led ideation, integration and final presentation.",
            ],
            "stack": "React · TypeScript · Vite · Tailwind CSS · Vercel · Custom rule engine",
        },
    ]

    for project in project_blocks:
        story.append(
            KeepTogether(
                [
                    Paragraph(project["title"], role_line_style),
                    Paragraph(project["meta"], meta_style),
                    Spacer(1, 1.5),
                    *bullets(project["bullets"]),
                    Paragraph(f"<b>Stack:</b> {project['stack']}", small_style),
                    Spacer(1, 4),
                ]
            )
        )

    section(story, "Experience")
    experience = [
        (
            "Full-Stack Web Development Intern",
            "Prodigy InfoTech · Jan 2026 – Feb 2026",
            "Built full-stack web applications using HTML/CSS, JavaScript and Node.js.",
        ),
        (
            "Web Development and Designing Intern",
            "Oasis Infobyte · Dec 2025 – Jan 2026",
            "Developed and styled web interfaces using modern front-end frameworks.",
        ),
        (
            "Artificial Intelligence / App Development Intern",
            "CodeAlpha · Dec 2025 – Jan 2026",
            "Enhanced AI algorithms using machine-learning techniques and contributed to open-source AI projects.",
        ),
        (
            "Human Resources Intern",
            "Missile Man Scientific and Research Publications · Dec 2025 – Mar 2026",
            "Supported research-publication operations and coordination.",
        ),
        (
            "Student Coordinator &amp; Event Organizer",
            "Sri Sairam Engineering College · 2026",
            "Coordinated INTELLECT HACK 2026, Design Sprint, Innovate to Impact, Portfolio Workshop and "
            "GEN-A-THON · registrations, communication, promotions and execution.",
        ),
    ]
    for title, meta, body in experience:
        story.append(
            KeepTogether(
                [
                    Paragraph(title, role_line_style),
                    Paragraph(meta, meta_style),
                    Paragraph(body, body_style),
                    Spacer(1, 3.5),
                ]
            )
        )

    section(story, "Leadership &amp; Community")
    leadership = [
        "IEEE TEMS Sairam Chapter · Outreach &amp; Multimedia Lead (Oct 2026 – present)",
        "IEEE Reliability Society SEC SBC · Volunteer (Oct 2025 – present)",
        "Unnat Bharat Abhiyan · Advocate (Oct 2026 – present) · Design Team (Jan 2026 – present)",
        "Microsoft Learn Student Ambassador (Apr 2026 – present) · Google Student Ambassador '26",
        "GeeksforGeeks Campus Mantri (Jun 2026 – present) · Sairam UiAutomistix · Mastermind (Aug 2026 – present)",
        "IEEE Returning Mothers Conference 2026 · Outreach Committee · IGNITERS · Event Coordinator &amp; Social Media",
    ]
    story.append(Paragraph("<br/>".join(leadership), body_style))

    section(story, "Honors &amp; Certifications")
    story.append(
        Paragraph(
            "<b>Second Prize</b> · Code Carnival 2K26, SIMATS Engineering &nbsp;·&nbsp; "
            "<b>1× Hackathon Runner-up</b> &nbsp;·&nbsp; Sparkle'26 Ramp Walk · 2nd Place",
            body_style,
        )
    )
    story.append(Spacer(1, 3))
    certs = [
        "IBM · 1M1B: Think Beyond",
        "Cisco · Introduction to Modern AI",
        "Skillsoft · Python Concurrent Programming",
        "Forage · Tata GenAI Powered Data Analytics Job Simulation",
        "TATA Crucible Campus Quiz 2025 · Introduction to Graphic Design · Basics of UI/UX",
    ]
    for cert in certs:
        story.append(Paragraph(cert, bullet_style, bulletText="–"))

    doc.build(story)
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


def draw_band_text(canvas, doc):
    """Name block inside the band · drawn in header's coordinate space."""
    canvas.saveState()
    canvas.setFillColor(BONE)
    canvas.setFont("Helvetica-Bold", 25)
    canvas.drawString(MARGIN, PAGE_H - 20 * mm, "THANISHKA YOGESH")
    canvas.setFillColor(GOLD)
    canvas.setFont("Helvetica", 9)
    canvas.drawString(MARGIN, PAGE_H - 25 * mm, "Full Stack & Web Developer  ·  B.E. Computer Science")
    canvas.setFillColor(HexColor("#B9B5AC"))
    canvas.setFont("Helvetica", 7.2)
    canvas.drawString(
        MARGIN,
        PAGE_H - 31 * mm,
        "+91 90256 58705  ·  thanishka.ykb@gmail.com  ·  linkedin.com/in/thanishka-yogesh  ·  github.com/thanishkaykb",
    )
    canvas.drawString(MARGIN, PAGE_H - 36 * mm, "portfolio-thanishka-yogesh.vercel.app")
    canvas.restoreState()


if __name__ == "__main__":
    # Compose the header text draw into the page callback.
    original_header = header

    def header_with_name(canvas, doc):
        original_header(canvas, doc)
        draw_band_text(canvas, doc)

    header = header_with_name
    build()
