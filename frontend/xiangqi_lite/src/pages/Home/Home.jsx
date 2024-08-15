
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import LoginSignup from './components/LoginSignup';
import Footer from './components/Footer';

function Home() {
    return (
      <div>
        <Header />
        <Hero />
        <About />
        <LoginSignup />
        <Footer />
      </div>
    );
  }
  
export default Home;