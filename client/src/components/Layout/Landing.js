import React from "react";

const Landing = () => {
  return (
    <section className='landing'>
      <div className='dark-overlay'>
        <div className='landing-inner'>
          <h1 className='x-large'>Connecting Developers Globaly</h1>
          <p className='lead'>
            Create your personal Profile <br />
            Share your Portafolio <br /> Help other Developers
          </p>
          <div className='buttons'>
            <a href='register.html' class='btn btn-primary'>
              Sign Up
            </a>
            <a href='login.html' class='btn btn-light'>
              Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
