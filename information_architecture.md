# Ayushman Bharadwaj — Portfolio Information Architecture (IA)

Below is the comprehensive Information Architecture diagram outlining the structure of the 2026 UX Portfolio. It visualizes the top-level routes, page sections, and the specific narrative flow of the deep-dive UX case study.

```mermaid
mindmap
  root((Ayushman Bharadwaj<br/>Portfolio 2026))
    Home["Home Page ( / )"]
      Hero["Hero Section"]
        Brand["Brand Statement"]
        Skills["Skill Pills (UX, Vibe Coding)"]
      Work["Selected Works"]
        Hoychoy["Hoychoy Cafe (Link)"]
      About["About Section"]
        Hobbies["Interactive Hobby Pills"]
      Footer["Footer & Socials"]
        LinkedIn["LinkedIn"]
        Twitter["X (Twitter)"]
        Email["Email CTA"]
        
    CaseStudy["Case Study ( /case-study )"]
      CS_Hero["1. Editorial Hero"]
        Role["Role & Ownership"]
        Splash["Splash Screen Media"]
      Context["2. Workflow Issue"]
        Problem["Problem Framing & HMW"]
      Insight["3. The Critical Insight"]
        Signals["Real User Signals (Quotes)"]
      Blueprint["4. Uncovering Friction"]
        BP_Before["Before Redesign Blueprint"]
        BP_After["After Redesign Blueprint"]
      Strategy["5. Design Strategy"]
        Model["Model Shift Architeture"]
      Solution["6. The Solution & UX"]
        Iteration["Iteration Example (Before/After)"]
      Impact["7. Business Impact"]
        Metrics["Hard Metrics Table"]
      Media["8. Shipped Application"]
        Video["Web-App Video Demo"]
        
    Experiments["Experiments ( /experiments )"]
      Exp_Hero["Header & Intro Line"]
      FieldNote["FieldNote AI Tool"]
        Desc["Project Description"]
        Link["Live Link"]
        
    Resume["Resume ( /resume )"]
      Res_Header["Header & Actions"]
        Download["Download PDF"]
      Experience["Experience Section"]
        Roles["Professional Roles"]
      Education["Education Block"]
      SkillsList["Skills & Tools Breakdown"]
```

## Navigation Flow
- **Global Pill Navigation:** Accessible from all routes. Provides immediate routing to `Work (Home)`, `Experiments`, `Resume`, and a `Connect` magnetic deep-link.
- **GSAP Custom Cursor:** Persists globally across all pages, ensuring a unified micro-interaction language regardless of the active route.
