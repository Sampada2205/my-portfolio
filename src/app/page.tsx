"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Mail, Phone, MapPin, Menu, X, Sparkles,
  Palette, Code2, Layers, ChevronDown, ExternalLink, Briefcase,
  GraduationCap, Heart
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

/* ============================================================
   DATA
============================================================ */

const NAV_LINKS = [
  { label: "WORK", href: "#work" },
  { label: "ABOUT", href: "#about" },
  { label: "EXPERIENCE", href: "#experience" },
  { label: "CONTACT", href: "#contact" },
];

const SERVICES = [
  {
    num: "01",
    title: "FRONTEND",
    tech: ["React.js", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"],
    desc: "Building responsive, modern and interactive user interfaces.",
    icon: Code2,
  },
  {
    num: "02",
    title: "BACKEND & DATABASE",
    tech: ["Node.js", "Express.js", "Python", "Flask", "REST APIs", "PostgreSQL", "MongoDB", "Firebase"],
    desc: "Developing reliable APIs, backend systems and database-driven applications.",
    icon: Layers,
  },
  {
    num: "03",
    title: "TOOLS & AI",
    tech: ["Git", "GitHub", "Vercel", "Prisma", "Framer Motion", "GSAP", "YOLOv8", "AI APIs"],
    desc: "Modern development tools and AI-powered workflows to build smarter products.",
    icon: Sparkles,
  },
];

const SKILLS = [
  "HTML5", "CSS3", "JavaScript", "TypeScript", "React.js", "Next.js",
  "Tailwind CSS", "Node.js", "Express.js", "Python", "Flask", "SQL",
  "MongoDB", "PostgreSQL", "Firebase", "Prisma", "Git", "GitHub", "Vercel",
];

const PROJECTS = [
  {
    id: "01",
    title: "SPACECRAFT AI",
    subtitle: "AI-POWERED INTERIOR DESIGN & ROOM PLANNING PLATFORM",
    description:
      "SpaceCraft AI is a smart interior design and room planning platform that combines AI-powered recommendations with interactive room planning to help users create and organize their dream spaces.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "PostgreSQL", "Prisma", "AI APIs", "Firebase"],
    features: [
      "AI-powered interior design recommendations",
      "Room planning",
      "Furniture placement",
      "Design suggestions",
      "Project management",
      "Modern responsive interface",
      "Authentication",
    ],
    url: "https://spacecraft-ai.vercel.app/", 
    video: "/spacecraft.mp4",
    accent: "#6C5CE7",
  },
  {
    id: "02",
    title: "VERSION2",
    subtitle: "MODERN BUSINESS / COMPANY WEBSITE",
    description:
      "Version2 is a modern company website focused on creating a professional digital presence with responsive layouts, smooth interactions and engaging visual sections.",
    tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion", "AOS", "EmailJS", "Vercel"],
    features: [
      "Developing responsive web pages",
      "Creating reusable UI components",
      "Implementing animations",
      "Working with Next.js and React",
      "Integrating EmailJS",
      "Git/GitHub workflow",
      "Deployment using Vercel",
    ],
    url: "https://www.version2.in/", 
    video: "/version2.mp4",
    accent: "#00B894",
  },
];

/* ============================================================
   CUSTOM CURSOR
============================================================ */

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const trailX = useSpring(cursorX, { stiffness: 150, damping: 25 });
  const trailY = useSpring(cursorY, { stiffness: 150, damping: 25 });
  const [hovering, setHovering] = useState(false);
  const [hoverType, setHoverType] = useState<"default" | "button" | "project">("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const enter = () => setVisible(true);
    const leave = () => setVisible(false);

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("a, button, [data-cursor]");
      if (interactive) {
        setHovering(true);
        const type = interactive.getAttribute("data-cursor") || "button";
        setHoverType(type as "button" | "project");
      } else {
        setHovering(false);
        setHoverType("default");
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleOver);
    document.body.addEventListener("mouseenter", enter);
    document.body.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleOver);
      document.body.removeEventListener("mouseenter", enter);
      document.body.removeEventListener("mouseleave", leave);
    };
  }, [cursorX, cursorY, visible]);

  if (typeof window !== "undefined" && window.innerWidth < 1024) return null;

  const size = hoverType === "project" ? 80 : hoverType === "button" ? 60 : 16;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference hidden lg:block"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      >
        <motion.div
          className="rounded-full border border-white/60"
          animate={{
            width: size,
            height: size,
            opacity: visible ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9998] hidden lg:block"
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
      >
        <div
          className="rounded-full bg-white/20 blur-sm"
          style={{ width: 6, height: 6, opacity: visible ? 0.6 : 0 }}
        />
      </motion.div>
    </>
  );
}

/* ============================================================
   LOADER
============================================================ */

function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + Math.random() * 18 + 4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0a]"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="overflow-hidden">
        <motion.h1
          className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-white"
          initial={{ y: 120 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          SAMPADA
        </motion.h1>
      </div>
      <div className="mt-6 h-[2px] w-48 sm:w-64 bg-white/10 overflow-hidden rounded-full">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <motion.p
        className="mt-4 text-xs tracking-[0.3em] text-white/40 uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Creative Developer
      </motion.p>
    </motion.div>
  );
}

/* ============================================================
   NAVBAR
============================================================ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 lg:px-10"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
      >
        <nav
          className={`mx-auto flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? "mt-3 max-w-5xl rounded-full border border-white/10 bg-black/60 backdrop-blur-xl px-4 py-2.5 sm:px-6 sm:py-3"
              : "mt-6 max-w-7xl bg-transparent px-2 py-4"
          }`}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm font-bold tracking-tight text-white hover:text-white/70 transition-colors"
          >
            SAMPADA
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="group relative px-3 py-2 text-[11px] font-medium tracking-[0.15em] text-white/60 hover:text-white transition-colors"
              >
                {link.label}
                <span className="absolute bottom-1 left-3 right-3 h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            ))}
          </div>

          <div className="p-8 flex flex-col gap-6">
  {/* Social icons row */}
  <div className="flex items-center gap-3">
    <a
      href="https://www.linkedin.com/in/sampada-brijpuriya-5a0b9b2a2"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
    >
      <FaLinkedin size={16} />
    </a>
    <a
      href="https://github.com/Sampada2205"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
    >
      <FaGithub size={16} />
    </a>
    <a
      href="https://mail.google.com/mail/?view=cm&fs=1&to=sampadabrijpuriya@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Email"
      className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-all"
    >
      <Mail size={16} />
    </a>
  </div>

  {/* Availability */}
 
</div>

          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-white p-2"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[200] bg-[#0a0a0a] flex flex-col"
            initial={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 100% 0%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex justify-between items-center p-6">
              <span className="text-sm font-bold text-white">SAMPADA</span>
              <button onClick={() => setMobileOpen(false)} className="text-white p-2" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-4xl sm:text-5xl font-bold tracking-tight text-white/80 hover:text-white transition-colors py-2"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
            <div className="p-8 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-[10px] tracking-[0.15em] text-white/50">
                AVAILABLE FOR FREELANCE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================================
   MAGNETIC BUTTON
============================================================ */

function MagneticButton({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "outline";
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.3);
    y.set(relY * 0.3);
  };

  const reset = () => { x.set(0); y.set(0); };

  const base =
    "relative inline-flex items-center gap-2 rounded-full text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 cursor-pointer";
  const styles =
    variant === "primary"
      ? "bg-white text-black px-6 py-3.5 hover:bg-white/90"
      : "border border-white/20 text-white px-6 py-3.5 hover:border-white/50 hover:bg-white/5";

  const content = (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      className={`${base} ${styles} ${className}`}
      data-cursor="button"
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("https") ? "_blank" : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return <div onClick={onClick}>{content}</div>;
}

/* ============================================================
   REVEAL WRAPPER
============================================================ */

function Reveal({
  children,
  delay = 0,
  y = 40,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   HERO
============================================================ */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const px = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const py = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 30);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 30);
  };

  const words1 = ["HELLO,", "I'M", "SAMPADA."];
  const words2 = ["CREATIVE", "WEB", "DEVELOPER."];

  return (
    <section
      ref={ref}
      onMouseMove={handleMouse}
      className="relative min-h-screen flex items-center overflow-hidden px-4 sm:px-6 lg:px-10 pt-24"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <motion.div
        className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
        style={{ background: "radial-gradient(circle, #6C5CE7, transparent)", x: px, y: py }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px]"
        style={{ background: "radial-gradient(circle, #00B894, transparent)", x: py, y: px }}
      />

      {/* Floating shapes */}
      <motion.div
        className="absolute top-[20%] right-[15%] w-20 h-20 border border-white/10 rounded-2xl hidden lg:block"
        style={{ x: px, y: py }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[10%] w-12 h-12 border border-white/10 rounded-full hidden lg:block"
        style={{ x: py, y: px }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[35%] left-[45%] w-2 h-2 bg-white/30 rounded-full hidden lg:block"
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            
          </motion.div>
          {/* Hero portrait */}
<motion.div
  className="absolute right-2 sm:right-8 xl:right-16 bottom-0 w-[160px] sm:w-[240px] lg:w-[380px] xl:w-[460px] pointer-events-none opacity-70 lg:opacity-100"
  initial={{ opacity: 0, x: 60, y: 40 }}
  animate={{ opacity: 0.7, x: 0, y: 0 }}
  transition={{ duration: 1.2, delay: 1.2, ease: [0.76, 0, 0.24, 1] }}
>
  <div
    className="absolute inset-0 blur-3xl opacity-50"
    style={{ background: "radial-gradient(circle at 50% 70%, #6C5CE7, transparent 60%)" }}
  />
  <img
    src="/me.png"
    alt="Sampada Brijpuriya"
    className="relative w-full h-auto object-contain drop-shadow-[0_20px_80px_rgba(0,0,0,0.7)]"
  />
</motion.div>
        </div>

        <h1 className="font-bold tracking-tighter leading-[0.9]">
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-x-4">
              {words1.map((word, i) => (
                <motion.span
                  key={word}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] text-white inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.4 + i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="overflow-hidden mt-2">
            <div className="flex flex-wrap gap-x-4">
              {words2.map((word, i) => (
                <motion.span
                  key={word}
                  className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] xl:text-[8rem] inline-block"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1.5px rgba(255,255,255,0.7)",
                  }}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, delay: 0.7 + i * 0.1, ease: [0.76, 0, 0.24, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </div>
        </h1>

        <motion.p
          className="mt-8 max-w-xl text-sm sm:text-base text-white/50 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          I build modern digital experiences that combine clean development, thoughtful design and engaging interactions.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          <MagneticButton href="#work">
            VIEW MY WORK <ArrowRight size={14} />
          </MagneticButton>
          <MagneticButton href="#contact" variant="outline">
            LET'S WORK TOGETHER
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <span className="text-[9px] tracking-[0.3em] text-white/30 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={14} className="text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ============================================================
   ABOUT
============================================================ */

function About() {
  return (
<section id="about" className="relative pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24">      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[1px] bg-white/30" />
                <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">About</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-white">
                A LITTLE
                <br />
                <span className="text-white/40">ABOUT ME.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:pt-20">
            <Reveal delay={0.2}>
              <p className="text-lg sm:text-xl md:text-2xl text-white/70 leading-relaxed font-light">
                I'm <span className="text-white font-normal">Sampada Brijpuriya</span>, a Computer Science Engineering student and creative web developer based in India. I enjoy turning ideas into modern, responsive and interactive digital experiences.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 text-sm sm:text-base text-white/40 leading-relaxed max-w-xl">
                I work with modern frontend technologies and enjoy creating visually engaging websites that feel polished, performant and memorable. My approach combines clean engineering with a strong eye for design detail.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-14 border-t border-white/10">
                <div className="grid sm:grid-cols-2 gap-x-8">
                  <div className="py-6 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap size={14} className="text-white/30" />
                      <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Degree</span>
                    </div>
                    <p className="text-white text-sm font-medium">B.Tech — Computer Science Engineering</p>
                  </div>
                  <div className="py-6 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-white/30" />
                      <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">College</span>
                    </div>
                    <p className="text-white text-sm font-medium">Lakshmi Narain College of Technology, Bhopal</p>
                  </div>
                  <div className="py-6 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles size={14} className="text-white/30" />
                      <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Graduation</span>
                    </div>
                    <p className="text-white text-sm font-medium">2027</p>
                  </div>
                  <div className="py-6 border-b border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart size={14} className="text-white/30" />
                      <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">CGPA</span>
                    </div>
                    <p className="text-white text-sm font-medium">7.00</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SERVICES
============================================================ */

function ServiceCard({ service, index }: { service: typeof SERVICES[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });
  const Icon = service.icon;

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 8);
    rotateX.set(-y * 8);
  };

  const reset = () => { rotateX.set(0); rotateY.set(0); };

  return (
    <Reveal delay={index * 0.1}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        style={{ rotateX: springX, rotateY: springY, transformPerspective: 1000 }}
        className="group relative h-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl p-6 sm:p-8 transition-colors duration-500 overflow-hidden"
        data-cursor="button"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex items-start justify-between mb-8">
          <span className="text-5xl sm:text-6xl font-bold text-white/10 group-hover:text-white/20 transition-colors duration-500">
            {service.num}
          </span>
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:border-white/30 transition-all duration-500">
            <Icon size={16} />
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white mb-4">
          {service.title}
        </h3>

        <p className="text-sm text-white/40 leading-relaxed mb-6">
          {service.desc}
        </p>

        <div className="flex flex-wrap gap-2">
          {service.tech.map((t) => (
            <span
              key={t}
              className="text-[10px] tracking-wide text-white/50 border border-white/10 rounded-full px-2.5 py-1 group-hover:border-white/20 group-hover:text-white/70 transition-colors duration-500"
            >
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </Reveal>
  );
}

function Services() {
  return (
    <section className="relative pt-16 sm:pt-20 lg:pt-24 pb-24 sm:pb-32 lg:pb-40">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 sm:mb-20">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-white/30" />
              <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Services</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white">
              WHAT I DO
            </h2>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.num} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SKILLS MARQUEE
============================================================ */

function SkillsMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="relative py-16 sm:py-20 border-y border-white/10 overflow-hidden">
      <div
        className="flex overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex gap-8 sm:gap-12 pr-8 sm:pr-12 whitespace-nowrap"
          animate={{ x: paused ? undefined : ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[...SKILLS, ...SKILLS].map((skill, i) => (
            <div key={`${skill}-${i}`} className="flex items-center gap-8 sm:gap-12">
              <span className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white/20 hover:text-white/60 transition-colors duration-300 cursor-default">
                {skill}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================================
   PROJECT CARD
============================================================ */

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const imageY = useTransform(
    useSpring(useMotionValue(0), { stiffness: 100, damping: 30 }),
    [0, 1],
    [0, -50]
  );

  return (
    <div ref={ref} className="relative">
      {/* Project number + title */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-10">
        <div className="lg:col-span-7">
          <Reveal>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
                Project {project.id}
              </span>
              <span className="flex-1 h-[1px] bg-white/10" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
              {project.title}
            </h3>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:pt-12">
          <Reveal delay={0.2}>
            <p className="text-[11px] tracking-[0.2em] text-white/40 uppercase mb-4">
              {project.subtitle}
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-sm text-white/50 leading-relaxed">
              {project.description}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Large visual mockup */}
     {/* Large visual — video */}
<Reveal delay={0.2}>
  <motion.a
    href={project.url}
    target="_blank"
    rel="noopener noreferrer"
    className="relative group rounded-2xl overflow-hidden border border-white/10 mb-10 block cursor-pointer"
    data-cursor="project"
    style={{ y: imageY }}
  >
    <div className="relative aspect-[16/9] sm:aspect-[16/8] overflow-hidden bg-black">
      {/* Video */}
      <video
        src={project.video}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />

      {/* Subtle dark gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
        <motion.div
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
        >
          <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-white text-black text-[11px] font-semibold tracking-[0.15em] uppercase">
            <ExternalLink size={13} />
            VIEW PROJECT
          </div>
        </motion.div>
      </div>
    </div>
  </motion.a>
</Reveal>

      {/* Tech + features + CTA */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-4">Technologies</p>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="text-[11px] text-white/60 border border-white/10 rounded-full px-3 py-1.5 hover:border-white/30 hover:text-white transition-colors duration-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-4">
          <Reveal delay={0.1}>
            <p className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-4">Features</p>
            <ul className="space-y-2.5">
              {project.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white/50">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-white/30 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-3 flex lg:justify-end items-start">
          <Reveal delay={0.2}>
            <MagneticButton href={project.url} variant="outline">
              VIEW PROJECT <ArrowUpRight size={14} />
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROJECTS SECTION
============================================================ */

function Projects() {
  return (
    <section id="work" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 sm:mb-28">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-white/30" />
              <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Selected Work</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white">
              PROJECTS
            </h2>
          </Reveal>
        </div>

        <div className="space-y-32 sm:space-y-40 lg:space-y-48">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   EXPERIENCE
============================================================ */

function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-white/30" />
            <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Experience</span>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white">
                WHERE I'VE
                <br />
                <span className="text-white/40">WORKED.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.2}>
              <div className="group border-t border-white/10 py-8 sm:py-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <Briefcase size={14} className="text-white/30" />
                      <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">Internship</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      VERSION2
                    </h3>
                    <p className="text-sm text-white/50 mt-1">Web Development Intern</p>
                  </div>
                  <span className="text-[11px] tracking-[0.15em] text-white/30 uppercase">
                    2026
                  </span>
                </div>
                <p className="mt-6 text-sm text-white/40 leading-relaxed max-w-2xl">
                  Worked on modern responsive web interfaces using Next.js, React and Tailwind CSS, while implementing animations, reusable components and frontend integrations.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Next.js", "React", "Tailwind CSS", "Framer Motion", "EmailJS", "Vercel", "Git/GitHub"].map((t) => (
                    <span key={t} className="text-[10px] text-white/50 border border-white/10 rounded-full px-2.5 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CREATIVE SECTION (BEYOND CODE)
============================================================ */

function CreativeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sx = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const sy = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / 20);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / 20);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMouse}
      className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-10 overflow-hidden border-t border-white/10"
    >
      {/* Abstract animated shapes */}
      <motion.div
        className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full border border-white/5"
        style={{ x: sx, y: sy }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[8%] w-40 h-40 border border-white/5"
        style={{ x: sy, y: sx, rotate: 45 }}
        animate={{ rotate: [45, 135, 45] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      <motion.svg
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03]"
        viewBox="0 0 200 200"
        style={{ x: sx, y: sy }}
      >
        <motion.path
          d="M40,100 C40,60 80,40 100,40 C120,40 160,60 160,100 C160,140 120,160 100,160 C80,160 40,140 40,100 Z"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          animate={{ pathLength: [0, 1, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <Reveal>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-white/30" />
            <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Personal</span>
            <span className="w-8 h-[1px] bg-white/30" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9]">
            BEYOND
            <br />
            <span className="text-white/40">CODE.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 space-y-2">
            <p className="text-lg sm:text-xl md:text-2xl text-white/60 font-light">
              Code is what I build.
            </p>
            <p className="text-lg sm:text-xl md:text-2xl text-white/40 font-light">
              Creativity is how I see.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.3}>
          <p className="mt-8 text-sm text-white/30 max-w-md mx-auto">
            I also enjoy painting, drawing and visual creativity — exploring ideas beyond the screen.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT
============================================================ */

function Contact() {
 
  return (
    <section id="contact" className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[1px] bg-white/30" />
            <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase">Contact</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7rem] font-bold tracking-tighter text-white leading-[0.9]">
            LET'S BUILD
            <br />
            SOMETHING
            <br />
            <span className="text-white/40">GREAT.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <Reveal delay={0.2}>
              <p className="text-sm sm:text-base text-white/50 leading-relaxed max-w-md">
                Have an idea, project or collaboration in mind? Let's turn it into something people remember.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
             <div className="mt-8 flex flex-wrap gap-4">
  <MagneticButton href="tel:+919340283621">
    CALL ME <Phone size={14} />
  </MagneticButton>
  <MagneticButton
  href="https://mail.google.com/mail/?view=cm&fs=1&to=sampadabrijpuriya@gmail.com&su=Project%20Inquiry&body=Hi%20Sampada%2C%0A%0AI%20came%20across%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project.%0A%0AThanks!"
  variant="outline"
>
  MAIL ME <Mail size={14} />
</MagneticButton>
</div>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:pl-12">
            <Reveal delay={0.3}>
              <div className="space-y-6">
                <a
                  href="mailto:sampadabrijpuriya@gmail.com"
                  className="group flex items-center gap-4 text-white/50 hover:text-white transition-colors"
                  data-cursor="button"
                >
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                    <Mail size={15} />
                  </div>
                  <span className="text-sm">sampadabrijpuriya@gmail.com</span>
                </a>
                <a
                  href="tel:+919340283621"
                  className="group flex items-center gap-4 text-white/50 hover:text-white transition-colors"
                  data-cursor="button"
                >
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
                    <Phone size={15} />
                  </div>
                  <span className="text-sm">+91 93402 83621</span>
                </a>
              </div>
            </Reveal>

           
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   FOOTER
============================================================ */

function Footer() {
  return (
    <footer className="relative py-12 px-4 sm:px-6 lg:px-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-sm font-bold tracking-tight text-white">SAMPADA BRIJPURIYA</p>
          <p className="text-[11px] tracking-[0.15em] text-white/30 uppercase mt-1">
            Creative Web Developer — India
          </p>
        </div>
        <div className="flex items-center gap-6">
          <p className="text-[11px] text-white/30">
            © 2026 Sampada Brijpuriya
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 text-[11px] tracking-[0.15em] text-white/40 uppercase hover:text-white transition-colors"
            data-cursor="button"
          >
            Back to top
            <span className="group-hover:-translate-y-1 transition-transform duration-300">
              <ArrowUpRight size={13} className="rotate-[-45deg]" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

/* ============================================================
   MAIN APP
============================================================ */

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!loading) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [loading]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.main
          className="relative bg-[#0a0a0a] min-h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <CustomCursor />
          <Navbar />
          <Hero />
          <About />
          <Services />
          <SkillsMarquee />
          <Projects />
          <Experience />
          <CreativeSection />
          <Contact />
          <Footer />
        </motion.main>
      )}
    </>
  );
}