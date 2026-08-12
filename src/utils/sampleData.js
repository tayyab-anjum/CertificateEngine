// Generates 100 sample recipients for instant testing of batch certificate generation

const firstNames = ["Alexander", "Sophia", "Liam", "Olivia", "Ethan", "Ava", "Noah", "Emma", "Mason", "Isabella", "William", "Mia", "James", "Charlotte", "Benjamin", "Amelia", "Lucas", "Harper", "Henry", "Evelyn", "Daniel", "Abigail", "Matthew", "Emily", "Michael", "Elizabeth", "Jackson", "Mila", "David", "Ella"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"];

const courses = [
  "Advanced Web Development & React Architecture",
  "Artificial Intelligence & Machine Learning Specialization",
  "Cybersecurity & Cloud Infrastructure Mastery",
  "UI/UX Design & Systems Engineering",
  "Data Science & Predictive Analytics Professional",
  "Full Stack Software Engineering Bootcamp",
  "Digital Marketing & Brand Strategy Excellence",
  "Executive Business Management Leadership"
];

export const generateSample100Recipients = () => {
  const recipients = [];
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  for (let i = 1; i <= 100; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const course = courses[i % courses.length];
    
    recipients.push({
      id: i,
      name: `${fn} ${ln}`,
      course: course,
      date: currentDate,
      certId: `CERT-2026-${String(i).padStart(4, '0')}`,
      signatory: "Dr. Marcus Aurelius, Dean of Academic Studies"
    });
  }
  
  return recipients;
};
