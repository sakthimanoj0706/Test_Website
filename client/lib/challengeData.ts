export interface Requirement {
  icon: string;
  text: string;
}

export interface Scenario {
  title: string;
  question: string;
  requirements: Requirement[];
}

export interface HeroData {
  id: string; // The canonical code (case insensitive matching)
  name: string;
  icon: string;
  domain: string;
  scenarios: Scenario[];
}

export const HEROES: HeroData[] = [
  {
    id: "spider man",
    name: "Spider-Man",
    icon: "🕷️",
    domain: "Full Stack Developer",
    scenarios: [
      {
        title: "Scenario 1 – Fresher Full Stack Developer",
        question: "Mission: Build a standout portfolio website for a Fresher Software Engineer role.",
        requirements: [
          { icon: "👋", text: "Hero/Home Section" },
          { icon: "🙋", text: "About Me" },
          { icon: "🎯", text: "Career Objective" },
          { icon: "🎓", text: "Education" },
          { icon: "💻", text: "Technical Skills" },
          { icon: "🌐", text: "Frontend Skills" },
          { icon: "⚙️", text: "Backend Skills" },
          { icon: "🗄️", text: "Database Skills" },
          { icon: "☁️", text: "Cloud & Deployment Tools" },
          { icon: "💼", text: "Internship Experience (if applicable)" },
          { icon: "🚀", text: "3–5 Full Stack Projects" },
          { icon: "🔗", text: "GitHub Repository" },
          { icon: "🌍", text: "Live Project Links" },
          { icon: "📜", text: "Certifications" },
          { icon: "🏆", text: "Achievements" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Section" },
          { icon: "🔗", text: "Social Media Links" },
        ]
      },
      {
        title: "Scenario 2 – 3rd Year Computer Science Student",
        question: "Mission: Create a student portfolio highlighting skills and projects for a Full Stack Internship.",
        requirements: [
          { icon: "👨‍🎓", text: "Student Profile" },
          { icon: "🙋", text: "About Me" },
          { icon: "🎓", text: "Education" },
          { icon: "💻", text: "Technical Skills" },
          { icon: "📂", text: "College Projects" },
          { icon: "🥇", text: "Hackathons & Competitions" },
          { icon: "🌟", text: "Open Source Contributions (if any)" },
          { icon: "📊", text: "GitHub Profile/Statistics" },
          { icon: "📜", text: "Certifications" },
          { icon: "👥", text: "Leadership or Club Activities" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      }
    ]
  },
  {
    id: "mickey mouse",
    name: "Mickey Mouse",
    icon: "🎨",
    domain: "UI/UX Designer",
    scenarios: [
      {
        title: "Scenario 1 – Junior UI/UX Designer",
        question: "Mission: Design a creative portfolio showcasing your UI/UX skills for a product-based company.",
        requirements: [
          { icon: "👋", text: "Introduction" },
          { icon: "🎨", text: "Design Philosophy" },
          { icon: "🙋", text: "About Me" },
          { icon: "🎓", text: "Education" },
          { icon: "🛠️", text: "Design Skills" },
          { icon: "🎯", text: "Design Tools (Figma, Adobe XD, Sketch, etc.)" },
          { icon: "🔍", text: "UX Research" },
          { icon: "👥", text: "User Personas" },
          { icon: "📐", text: "Wireframes" },
          { icon: "🧩", text: "Design Systems" },
          { icon: "📚", text: "3–5 UI/UX Case Studies" },
          { icon: "🎨", text: "High-Fidelity UI Designs" },
          { icon: "🖱️", text: "Interactive Prototypes" },
          { icon: "📜", text: "Certifications" },
          { icon: "🏆", text: "Awards & Achievements" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      },
      {
        title: "Scenario 2 – Final-Year Design Student",
        question: "Mission: Build a visually stunning student portfolio for a highly competitive UI/UX Internship.",
        requirements: [
          { icon: "👨‍🎓", text: "Student Introduction" },
          { icon: "🙋", text: "About Me" },
          { icon: "🎓", text: "Education" },
          { icon: "🎨", text: "Design Skills" },
          { icon: "🔍", text: "User Research" },
          { icon: "📐", text: "Wireframes" },
          { icon: "📱", text: "Mobile UI Design Projects" },
          { icon: "💻", text: "Web UI Design Projects" },
          { icon: "🖱️", text: "Interactive Prototypes" },
          { icon: "💡", text: "Design Challenges or Personal Projects" },
          { icon: "🥇", text: "Hackathons & Design Competitions" },
          { icon: "🎭", text: "Behance Profile" },
          { icon: "🏀", text: "Dribbble Profile" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      }
    ]
  },
  {
    id: "batman",
    name: "Batman",
    icon: "🦇",
    domain: "Data Analyst",
    scenarios: [
      {
        title: "Scenario 1 – Fresher Data Analyst",
        question: "Mission: Present your analytical skills and data projects effectively for a Data Analyst role.",
        requirements: [
          { icon: "👋", text: "Introduction" },
          { icon: "🎯", text: "Career Summary" },
          { icon: "🎓", text: "Education" },
          { icon: "🗄️", text: "SQL Skills" },
          { icon: "🐍", text: "Python Skills" },
          { icon: "📊", text: "Microsoft Excel Skills" },
          { icon: "📈", text: "Power BI Skills" },
          { icon: "📉", text: "Tableau Skills" },
          { icon: "💼", text: "Business Intelligence Projects" },
          { icon: "📊", text: "Dashboard Projects" },
          { icon: "📜", text: "Certifications" },
          { icon: "🏆", text: "Achievements" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      },
      {
        title: "Scenario 2 – Data Analytics Student",
        question: "Mission: Highlight your data analytics journey and projects for an upcoming internship.",
        requirements: [
          { icon: "👨‍🎓", text: "Student Profile" },
          { icon: "🙋", text: "About Me" },
          { icon: "🎓", text: "Education" },
          { icon: "💻", text: "Technical Skills" },
          { icon: "🧹", text: "Data Cleaning Projects" },
          { icon: "📊", text: "Dashboard Projects" },
          { icon: "🤖", text: "Machine Learning Basics" },
          { icon: "🗄️", text: "SQL Projects" },
          { icon: "📈", text: "Kaggle Profile" },
          { icon: "📜", text: "Certifications" },
          { icon: "👥", text: "Leadership or Club Activities" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      }
    ]
  },
  {
    id: "iron man",
    name: "Iron Man",
    icon: "🤖",
    domain: "AI/ML Engineer",
    scenarios: [
      {
        title: "Scenario 1 – AI/ML Engineer",
        question: "Mission: Showcase advanced AI models and projects for a role at a leading AI startup.",
        requirements: [
          { icon: "🙋", text: "About Me" },
          { icon: "🤖", text: "AI & Machine Learning Skills" },
          { icon: "💻", text: "Programming Languages" },
          { icon: "📊", text: "Machine Learning Projects" },
          { icon: "🧠", text: "Deep Learning Projects" },
          { icon: "💬", text: "Natural Language Processing (NLP) Projects" },
          { icon: "👁️", text: "Computer Vision Projects" },
          { icon: "🚀", text: "Model Deployment Experience" },
          { icon: "📂", text: "AI/ML Project Showcase" },
          { icon: "📄", text: "Research Work or Publications (if any)" },
          { icon: "🔗", text: "GitHub Profile" },
          { icon: "🤗", text: "Hugging Face Profile" },
          { icon: "📜", text: "Certifications" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      },
      {
        title: "Scenario 2 – AI & Data Science Student",
        question: "Mission: Compile your research, models, and AI projects to land a highly-coveted AI Internship.",
        requirements: [
          { icon: "👨‍🎓", text: "Student Introduction" },
          { icon: "🎓", text: "Education" },
          { icon: "🤖", text: "AI & Machine Learning Skills" },
          { icon: "📊", text: "Machine Learning Projects" },
          { icon: "🧠", text: "Deep Learning Projects" },
          { icon: "🥇", text: "Kaggle Competitions" },
          { icon: "📄", text: "Research Papers or Publications (if any)" },
          { icon: "🌐", text: "Open Source Contributions" },
          { icon: "📜", text: "Certifications" },
          { icon: "🏆", text: "Achievements" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      }
    ]
  },
  {
    id: "thor",
    name: "Thor",
    icon: "⚡",
    domain: "Cloud Engineer",
    scenarios: [
      {
        title: "Scenario 1 – Cloud Engineer",
        question: "Mission: Construct a portfolio demonstrating your cloud infrastructure and deployment expertise.",
        requirements: [
          { icon: "👋", text: "Professional Summary" },
          { icon: "🎓", text: "Education" },
          { icon: "☁️", text: "AWS Services" },
          { icon: "🔷", text: "Microsoft Azure" },
          { icon: "🌐", text: "Google Cloud Platform (GCP)" },
          { icon: "🐳", text: "Docker" },
          { icon: "☸️", text: "Kubernetes" },
          { icon: "🏗️", text: "Terraform" },
          { icon: "🐧", text: "Linux" },
          { icon: "🌍", text: "Networking Concepts" },
          { icon: "🔄", text: "CI/CD Pipeline Experience" },
          { icon: "🚀", text: "Cloud Computing Projects" },
          { icon: "📜", text: "Certifications" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      },
      {
        title: "Scenario 2 – Computer Science Student (Cloud & DevOps)",
        question: "Mission: Build a strong student DevOps portfolio focusing on cloud platforms and containerization.",
        requirements: [
          { icon: "👨‍🎓", text: "Student Introduction" },
          { icon: "☁️", text: "Cloud Computing Skills" },
          { icon: "🐧", text: "Linux Skills" },
          { icon: "🐳", text: "Docker" },
          { icon: "☸️", text: "Kubernetes" },
          { icon: "🔗", text: "GitHub Profile" },
          { icon: "🚀", text: "AWS Cloud Projects" },
          { icon: "🌍", text: "Deployment Experience" },
          { icon: "📊", text: "Monitoring Tools" },
          { icon: "📜", text: "Certifications" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      }
    ]
  },
  {
    id: "doctor strange",
    name: "Doctor Strange",
    icon: "🧙",
    domain: "Prompt Engineer",
    scenarios: [
      {
        title: "Scenario 1 – Prompt Engineer",
        question: "Mission: Show off your LLM prompt designs, RAG architecture, and AI automation prowess.",
        requirements: [
          { icon: "🙋", text: "About Me" },
          { icon: "🤖", text: "AI Expertise" },
          { icon: "✍️", text: "Prompt Engineering Skills" },
          { icon: "📚", text: "Prompt Libraries" },
          { icon: "🔄", text: "AI Workflows" },
          { icon: "🧠", text: "LLM-Based Projects" },
          { icon: "🤝", text: "Multi-Agent System Projects" },
          { icon: "⚡", text: "AI Automation Projects" },
          { icon: "📖", text: "RAG (Retrieval-Augmented Generation) Projects" },
          { icon: "🔗", text: "API Integration Experience" },
          { icon: "📝", text: "Blogs or Technical Articles" },
          { icon: "📜", text: "Certifications" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      },
      {
        title: "Scenario 2 – Student (Prompt Engineering & AI Automation)",
        question: "Mission: Prepare a portfolio that highlights your understanding of AI workflows and LLM prompt engineering.",
        requirements: [
          { icon: "👨‍🎓", text: "Student Profile" },
          { icon: "🤖", text: "AI Skills" },
          { icon: "✍️", text: "Prompt Engineering Skills" },
          { icon: "📂", text: "AI Projects" },
          { icon: "⚡", text: "AI Automation Projects" },
          { icon: "🔄", text: "Workflow Designs" },
          { icon: "🛠️", text: "AI Tools You Have Used" },
          { icon: "🥇", text: "Hackathons & AI Competitions" },
          { icon: "🔗", text: "GitHub Profile" },
          { icon: "📝", text: "Blogs or Technical Articles" },
          { icon: "📜", text: "Certifications" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      }
    ]
  },
  {
    id: "doraemon",
    name: "Doraemon",
    icon: "🐱",
    domain: "IoT Engineer",
    scenarios: [
      {
        title: "Scenario 1 – IoT Engineer",
        question: "Mission: Create a hardware-centric portfolio showcasing your embedded systems and IoT solutions.",
        requirements: [
          { icon: "👋", text: "Professional Introduction" },
          { icon: "🙋", text: "About Me" },
          { icon: "🎓", text: "Education" },
          { icon: "🔧", text: "Embedded Systems Skills" },
          { icon: "📡", text: "Sensor Technologies" },
          { icon: "🤖", text: "Arduino Projects" },
          { icon: "⚡", text: "ESP32 Projects" },
          { icon: "🍓", text: "Raspberry Pi Projects" },
          { icon: "📶", text: "MQTT Communication" },
          { icon: "☁️", text: "Cloud IoT Integration" },
          { icon: "🚀", text: "IoT Project Showcase" },
          { icon: "🖼️", text: "Hardware Gallery" },
          { icon: "📜", text: "Certifications" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      },
      {
        title: "Scenario 2 – Final-Year Electronics & Communication Student",
        question: "Mission: Compile your robotics and IoT internship projects into a compelling electronics portfolio.",
        requirements: [
          { icon: "👨‍🎓", text: "Student Introduction" },
          { icon: "🙋", text: "About Me" },
          { icon: "🎓", text: "Education" },
          { icon: "💻", text: "Technical Skills" },
          { icon: "🔧", text: "Embedded Systems Knowledge" },
          { icon: "📐", text: "PCB Design" },
          { icon: "📡", text: "Sensor Technologies" },
          { icon: "🤖", text: "Arduino Projects" },
          { icon: "⚡", text: "ESP32 Projects" },
          { icon: "🍓", text: "Raspberry Pi Projects" },
          { icon: "🦾", text: "Robotics Projects" },
          { icon: "📜", text: "Certifications" },
          { icon: "🔗", text: "GitHub Profile" },
          { icon: "📄", text: "Resume Download" },
          { icon: "📞", text: "Contact Information" }
        ]
      }
    ]
  }
];

export function getHeroByCode(code: string): HeroData | null {
  const normalized = decodeURIComponent(code).trim().toLowerCase();
  return HEROES.find(h => h.id === normalized) || null;
}
