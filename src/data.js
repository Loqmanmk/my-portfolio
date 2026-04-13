export const INFO = {
  name: "Loqman Makouri",
  role: "Future Software Engineer",
  sub: "Computer Engineering · EHEI Oujda · 4th Year",
  bio: "I’m a 4th-year Computer Engineering student passionate about building real-world software. I focus on full-stack development, AI systems, and scalable architectures, and I’ve gained hands-on experience through internships and academic projects where I turn ideas into working applications",
  email: "loqmanmakouri66@gmail.com",
  phone: "+212 6 13 15 81 22",
  location: "Oujda, Morocco",
  github: "https://github.com/Loqman-Makouri",
  linkedin: "www.linkedin.com/in/loqman-makouri-11871138b",
};

export const SKILLS = [
  { icon:"🌐", title:"Frontend", color:"v", tags:["React.js","AngularJS","TypeScript","JavaScript","HTML5","CSS3"] },
  { icon:"⚙️", title:"Backend", color:"c", tags:["Laravel","Symfony","ASP.NET Core","JEE","PHP OOP","Python"] },
  { icon:"🗄️", title:"Databases", color:"f", tags:["MySQL","PostgreSQL","Oracle","MongoDB","NoSQL"] },
  { icon:"☁️", title:"DevOps & Cloud", color:"a", tags:["Docker","AWS","Git","GitLab","Linux","CI/CD"] },
  { icon:"🤖", title:"AI & Data", color:"g", tags:["Python AI","Jupyter","Anaconda","Statistics","Linear Opt."] },
  { icon:"🔧", title:"Systems", color:"v", tags:["C","C++ OOP","Java OOP","TCP/UDP","Sockets","EVE-NG"] },
  { icon:"📋", title:"Methods", color:"c", tags:["Scrum (Agile methodology)","Jira","UML","Merise","Agile"] },
  { icon:"📱", title:"Mobile & API", color:"f", tags:["Cordova","REST API","Web-to-Mobile","Full Stack"] },
];

export const EXPERIENCES = [
  {
    icon:"🏥",
    title:"IT Systems Internship",
    org:"CHU Mohammed VI d'Oujda",
    period:"Jul 2025 — Sep 2025",
    type:"Internship",
    desc:"Designed and developed an intelligent doctor-patient follow-up platform for one of the largest university hospitals in eastern Morocco. Architected the data model, built the REST API, and delivered a full web interface for clinical staff.",
    tags:[{l:"Laravel",c:"c"},{l:"MySQL",c:"c"},{l:"REST API",c:"a"},{l:"Healthcare",c:"g"}],
  },
  {
    icon:"🏛️",
    title:"Digital Development Internship",
    org:"Direction Régionale de la Santé — Oujda",
    period:"Mar 2024 — Apr 2024",
    type:"Internship",
    desc:"Built and deployed a complete leave management system for the Regional Health Directorate. Delivered end-to-end from requirements gathering to production deployment, serving multiple departments across the region.",
    tags:[{l:"PHP OOP",c:"v"},{l:"Oracle DB",c:"f"},{l:"Bootstrap",c:"v"},{l:"Gov Tech",c:"g"}],
  },
];

export const PROJECTS = [
  { num:"01", cat:"AI", name:"PathFinder — AI Career Guide", desc:"AI system helping students navigate career choices with personalized recommendations based on academic profile and interests.", tags:[{l:"Python",c:"g"},{l:"AI/ML",c:"g"},{l:"Full Stack",c:"v"}] },
  { num:"02", cat:"Web App", name:"EHEICHATHUB", desc:"University-wide real-time communication platform for the EHEI campus — messaging, notifications, and collaboration. Synthesis capstone project.", tags:[{l:"React.js",c:"v"},{l:"Laravel",c:"c"},{l:"WebSockets",c:"f"}] },
  { num:"03", cat:"Healthcare", name:"Doctor-Patient Platform", desc:"Intelligent medical tracking system built at CHU Mohammed VI. Digitizes patient follow-up workflows and care coordination for clinical staff.", tags:[{l:"Laravel",c:"c"},{l:"MySQL",c:"c"},{l:"REST API",c:"a"}] },
  { num:"04", cat:"Gov Tech", name:"Leave Management System", desc:"Full-stack HR system deployed for the Regional Health Directorate of Oujda, streamlining leave requests across departments.", tags:[{l:"PHP OOP",c:"v"},{l:"Oracle",c:"f"},{l:"Bootstrap",c:"v"}] },
  { num:"05", cat:"Mobile", name:"Weather App — Cordova", desc:"Cross-platform weather application converted from web to mobile using Apache Cordova with real-time API integration.", tags:[{l:"Cordova",c:"a"},{l:"JavaScript",c:"a"},{l:"OpenWeather",c:"c"}] },
  { num:"06", cat:"Networking", name:"Network Simulation", desc:"Full enterprise network environment simulated under EVE-NG on Linux — routing, VLANs, switching, and security hardening.", tags:[{l:"EVE-NG",c:"g"},{l:"Linux",c:"g"},{l:"Cisco IOS",c:"c"}] },
  { num:"07", cat:"Web App", name:"Service Booking System", desc:"Booking platform with intelligent time slot management, conflict detection, and calendar sync for service providers.", tags:[{l:"Symfony",c:"c"},{l:"MySQL",c:"c"},{l:"AngularJS",c:"f"}] },
];

export const EDUCATION = [
  { icon:"🎓", degree:"Génie Informatique — Computer Engineering", school:"EHEI, Oujda", period:"2024 — 2027", note:"4th year · Engineering cycle" },
  { icon:"💻", degree:"Specialized Technician — Web Full Stack", school:"OFPPT OFSHORING, Oujda", period:"2022 — 2024", note:"Front-end & Back-end · Diplôme" },
  { icon:"📚", degree:"Baccalauréat — Sciences Physiques", school:"Isly, Oujda", period:"2021 — 2022", note:"" },
];

export const LANGUAGES = [
  { flag:"🇲🇦", name:"Arabic",   level:"Native" },
  { flag:"🇫🇷", name:"Français", level:"Fluent" },
  { flag:"🇬🇧", name:"English",  level:"Fluent" },
  { flag:"🇩🇪", name:"Deutsch",  level:"Intermediate" },
];
