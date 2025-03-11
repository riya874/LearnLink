import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer>
      <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          textAlign: "center",
          padding: "20px",
          color: "#333"
        }}>
          
        {/* Terms and Privacy Section */}
        <div style={{ flex: 1, minWidth: "150px", marginBottom: "10px" }}>
          <p><a href="/terms" style={{ color: "#0072FF", textDecoration: "none", fontWeight: "bold" }}>Terms of Service</a></p>
          <p><a href="/privacy" style={{ color: "#0072FF", textDecoration: "none", fontWeight: "bold" }}>Privacy Policy</a></p>
        </div>

        {/* Support Section */}
        <div style={{ flex: 1, minWidth: "200px", marginBottom: "10px" }}>
          <p>Have questions? Contact us:</p>
          <p><a href="mailto:support@learnlink.com" style={{ color: "#0072FF", textDecoration: "none" }}>support@learnlink.com</a></p>
        </div>

        {/* Copyright Notice */}
        <div style={{ flex: 1, minWidth: "250px", marginBottom: "10px" }}>
          <p>© 2024 LearnLink. All rights reserved.</p>
          <p>The LearnLink logo and name are trademarks of LearnLink Platform.</p>
        </div>

        {/* Social Media Section */}
        <div style={{ flex: 1, minWidth: "150px", marginBottom: "10px" }}>
          <p>Follow us:</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1DA1F2", fontSize: "16px" }}><FaTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: "#0077B5", fontSize: "16px" }}><FaLinkedin /></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#4267B2", fontSize: "16px" }}><FaFacebook /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

