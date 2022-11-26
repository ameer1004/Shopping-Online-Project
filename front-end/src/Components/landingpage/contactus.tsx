import { IoPowerSharp } from "react-icons/io5";
import "./LandingPage.css";

export default function Contact() {
  return (
    <div className="contact-component" id="contact">
      <h2>
        <span>Shopping</span>{" "}
        <span>
          <IoPowerSharp />
          nline
        </span>
      </h2>
      <div className="contact-container">
        <div>
          <div className="contact-me">Contact me! </div>
          <img
            className="phone-gif"
            src={require("./images/icons/phone.gif")}
            alt="phone"
          />
        </div>
        <div className="social-icons">
          <div className="icon-div">
            <a
              href="https://www.linkedin.com/in/ameer-emran-437a54206/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="black-icon"
                src={require("./images/icons/linkedin.png")}
                alt="linkedin"
              />
              <img
                src={require("./images/icons/linkedin-c.png")}
                alt="linkedin"
              />
            </a>
          </div>
          <div className="icon-div">
            <a
              href="https://github.com/ameer1004?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="black-icon"
                src={require("./images/icons/github.png")}
                alt="github"
              />
              <img src={require("./images/icons/github-c.png")} alt="github" />
            </a>
          </div>
          <div className="icon-div">
            <a
              href="mailto:ameer.em.89@gmail.com?subject=Mail from Ameer Website"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="black-icon"
                src={require("./images/icons/mail.png")}
                alt="mail"
              />
              <img
                src={require("./images/icons/mail-c.png")}
                alt="mail"
                role="presentation"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="copyright">All Rights Reserved: Ameer Emran - 2022</div>
    </div>
  );
}
