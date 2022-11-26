import { IoChevronDownOutline } from "react-icons/io5";
import Contact from "./contactus";

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <div className="landing-page-header">
        <div>
          <h2>
            <span>BROWSE THROUGH</span>
            <span>DIFFERENT OF PRODUCTS</span>
            <span>ENJOY VISITING MY WEBSITE</span>
          </h2>
          <h3>AND MAKE BETTER USE OF YOUR TIME!</h3>

          <a href="#content" className="scroll-btn">
            <IoChevronDownOutline />
          </a>
        </div>
      </div>

      <div className="landing-page-wraper" id="content">
        <div className="landing-page-content" data-aos="fade-right">
          <div>
            <h2>
              <span>So who we are?</span>
            </h2>
            <p>
              This is a Shopping Website that deliver your orders to your home!
            </p>

            <h2>What you can buy?</h2>

            <p>
              In this website everyone can buy food and drink products. We
              provide to our customers freshest products and fastest delivery,
              while maintaining the highest level of service and quality.
            </p>
          </div>
        </div>

        <div className="vision-content" data-aos="fade-left">
          <div>
            <h2>
              <span>Why you should buy from us?</span>
            </h2>
            <p>
              Our vision is to provide to our customers the best service:
              Comfortable, Fast, Affordable, Accessible, Efficient and Advanced,
              and help our customers make better use of their time.
            </p>
          </div>
        </div>
      </div>
      <div></div>

      <footer className="footer">
        <Contact />
      </footer>
    </div>
  );
};

export default LandingPage;
