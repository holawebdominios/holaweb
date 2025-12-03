export const siteConfig = {
  name: "Hola Empresa",
  description: "Verificación y gestión profesional de dominios argentinos",
  url: "https://holaweb.com.ar",
  
  contact: {
    email: "info@holaweb.com.ar",
    phone: "+54 11 1234-5678",
    whatsapp: "5491112345678",
    address: "Buenos Aires, Argentina"
  },
  
  social: {
    twitter: "https://twitter.com/holaweb",
    linkedin: "https://linkedin.com/company/holaweb",
    instagram: "https://instagram.com/holaweb"
  },
  
  colors: {
    primary: "#13314c",
    secondary: "#ff9900",
    accent: "#ff6600",
    success: "#22c55e",
    error: "#ef4444",
    warning: "#f59e0b"
  },
  
  supportedTLDs: {
    argentina: ['.ar', '.com.ar', '.net.ar', '.org.ar'],
    international: ['.com', '.net', '.org', '.io', '.app', '.dev']
  },
  
  publicLimits: {
    maxDomainsPerSearch: 10,
    searchCooldown: 2000,
    resultsPerPage: 20
  }
};

