export abstract class BasePage {
  protected app: any;

  constructor(app: any) {
    this.app = app;
  }

  abstract render(container: HTMLElement): void;
  protected createFooter(): string {
    return `
      <footer class="footer" style="background: #f6f6f6; padding: 48px 0 24px 0; margin-top: 48px;">
        <div class="container" style="max-width: 1200px; margin: 0 auto;">
          <div class="footer__top" style="display: flex; flex-wrap: wrap; gap: 48px 32px; justify-content: space-between;">
            <div class="footer__brand" style="flex: 1 1 220px; min-width: 220px;">
              <h2 style="font-weight: 700; font-size: 2rem; margin-bottom: 16px;">SHOP.CO</h2>
              <p style="color: #555; font-size: 15px; margin-bottom: 24px;">
                We have clothes that suits your style and which you're proud to wear. From women to men.
              </p>
              <div class="footer__social" style="display: flex; gap: 12px;">
                <a href="#" aria-label="Twitter" style="color: #222;"><i class="fa-brands fa-twitter"></i></a>
                <a href="#" aria-label="Facebook" style="color: #222;"><i class="fa-brands fa-facebook"></i></a>
                <a href="#" aria-label="Instagram" style="color: #222;"><i class="fa-brands fa-instagram"></i></a>
                <a href="#" aria-label="GitHub" style="color: #222;"><i class="fa-brands fa-github"></i></a>
              </div>
            </div>
            <div class="footer__links" style="display: flex; flex: 3 1 600px; gap: 48px 32px; flex-wrap: wrap;">
              <div>
                <h4 style="font-weight: 600; margin-bottom: 16px; letter-spacing: 1px;">COMPANY</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li><a href="#" style="color: #555; text-decoration: none;">About</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">Features</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">Works</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">Career</a></li>
                </ul>
              </div>
              <div>
                <h4 style="font-weight: 600; margin-bottom: 16px; letter-spacing: 1px;">HELP</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li><a href="#" style="color: #555; text-decoration: none;">Customer Support</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">Delivery Details</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">Terms & Conditions</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 style="font-weight: 600; margin-bottom: 16px; letter-spacing: 1px;">FAQ</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li><a href="#" style="color: #555; text-decoration: none;">Account</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">Manage Deliveries</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">Orders</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">Payments</a></li>
                </ul>
              </div>
              <div>
                <h4 style="font-weight: 600; margin-bottom: 16px; letter-spacing: 1px;">RESOURCES</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li><a href="#" style="color: #555; text-decoration: none;">Free eBooks</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">Development Tutorial</a></li>
                  <li><a href="#" style="color: #555; text-decoration: none;">How to - Blog</a></li>
                  <li><a href="https://youtu.be/dQw4w9WgXcQ" style="color: #555; text-decoration: none;">Youtube Playlist</a></li>
                  
                </ul>
              </div>
            </div>
          </div>
          <div class="footer__bottom" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; border-top: 1px solid #e5e5e5; margin-top: 32px; padding-top: 16px;">
            <div style="color: #888; font-size: 14px;">
              Shop.co © 2000-2023, All Rights Reserved
            </div>
            <div class="footer__payments" style="display: flex; gap: 12px; margin-top: 8px;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style="height: 28px;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" style="height: 28px;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" style="height: 28px;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/2880px-Apple_Pay_logo.svg.png" alt="Apple Pay" style="height: 28px;">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/1024px-Google_Pay_Logo.svg.png" alt="Google Pay" style="height: 28px;">
            </div>
          </div>
        </div>
      </footer>
    `;
  }
  protected createHeader(): string {
    return `
      <div class="header-top-banner" style="background: #000; color: #fff; text-align: center; padding: 8px 0; font-size: 15px;">
      Sign up and get 20% off to your first order. <a href="/signup" data-navigo style="color: #fff; text-decoration: underline; font-weight: 500;">Sign Up Now</a>
      </div>
      <header class="header">
      <div class="container">
        <div class="header__content">
        <a href="/" class="header__logo" data-navigo>
          <h1>SHOP.CO</h1>
        </a>
        <nav class="header__nav">
          <a href="/cart" class="header__cart" data-navigo>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 18.1 16.1 19 15 19H9C7.9 19 7 18.1 7 17V13M17 13H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          </a>
        </nav>
        </div>
      </div>
      </header>
    `;
  }

  protected createSubscribeBanner(): string {
    return `
      <section class="subscribe-banner" style="background: #000; color: #fff; border-radius: 28px; margin: 32px 0; padding: 48px 0;">
        <div class="container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 32px;">
          <div style="flex: 1 1 400px; min-width: 300px;">
            <h2 style="font-size: 2.5rem; font-weight: 700; margin-bottom: 12px; line-height: 1.1;">
              STAY UPTO DATE ABOUT<br>OUR LATEST OFFERS
            </h2>
          </div>
          <div style="flex: 1 1 400px; min-width: 300px; display: flex; flex-direction: column; gap: 18px; position: relative;">
            <form class="subscribe-form" id="subscribe-form" style="display: flex; flex-direction: column; gap: 18px;">
              <div style="display: flex; align-items: center; background: #fff; border-radius: 32px; padding: 0 18px;">
                <span style="color: #888; font-size: 1.2rem; margin-right: 8px;">
                  <i class="fa-regular fa-envelope"></i>
                </span>
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  class="subscribe-form__input"
                  id="subscribe-email"
                  required
                  style="border: none; outline: none; background: transparent;z-index:1000; padding: 16px 0; flex: 1; font-size: 1rem; color: #222;"
                />
              </div>
              <button type="submit" class="subscribe-form__button" style="z-index:10000;background: #fff; color: #000; border: none; border-radius: 32px; padding: 16px 0; font-size: 1.1rem; font-weight: 600; cursor: pointer;">
                Subscribe to Newsletter
              </button>
            </form>
            <div id="success-message" style="position: absolute; right: -120px; top: 50%; transform: translateY(-50%); color: white; opacity: 0; transition: opacity 0.3s ease;">
              Success!
            </div>
          </div>
        </div>
      </section>
    `;
  }

  public setupSubscribeBanner(): void {
    const form = document.getElementById('subscribe-form') as HTMLFormElement;
    const emailInput = document.getElementById('subscribe-email') as HTMLInputElement;
    const submitButton = form?.querySelector('.subscribe-form__button') as HTMLButtonElement;
    const successMessage = document.getElementById('success-message') as HTMLElement;

    if (form && emailInput && submitButton && successMessage) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        if (!email || !this.isValidEmail(email)) {
          emailInput.classList.add('error');
          return;
        }
        emailInput.classList.remove('error');
        
        // Show success message
        successMessage.style.opacity = '1';
        
        // Clear email input
        emailInput.value = '';
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          successMessage.style.opacity = '0';
        }, 3000);
      });

      emailInput.addEventListener('input', () => {
        emailInput.classList.remove('error');
      });
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  protected setupNavigation(): void {
    const links = document.querySelectorAll('[data-navigo]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = (link as HTMLAnchorElement).getAttribute('href');
        if (href && this.app && this.app.navigate) {
          this.app.navigate(href);
        }
      });
    });
  }
} 