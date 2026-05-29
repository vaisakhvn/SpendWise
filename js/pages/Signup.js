import { authService } from '../services/authService.js';

export default class SignupPage {
    render() {
        const container = document.createElement('div');
        container.className = 'container flex flex-col justify-center';
        container.style.minHeight = '100vh';

        container.innerHTML = `
            <div class="card" style="max-width: 400px; margin: 0 auto; width: 100%;">
                <h1 class="text-xl text-center" style="margin-bottom: var(--spacing-lg);">Join SpendWise</h1>
                
                <form id="signup-form">
                    <div class="input-group">
                        <label class="text-sm text-secondary">Full Name</label>
                        <input type="text" name="name" class="input-field" placeholder="Your Name" required>
                    </div>

                    <div class="input-group">
                        <label class="text-sm text-secondary">Email</label>
                        <input type="email" name="email" class="input-field" placeholder="YourEmail@xyz.com" required>
                    </div>
                    
                    <div class="input-group">
                        <label class="text-sm text-secondary">Password</label>
                        <input type="password" name="password" class="input-field" placeholder="••••••••" required>
                    </div>

                    <div id="error-message" class="text-sm text-center" style="color: var(--danger-color); margin-bottom: var(--spacing-md); display: none;"></div>

                    <button type="submit" class="btn btn-primary" style="width: 100%;">Sign Up</button>
                </form>

                <div class="text-center" style="margin-top: var(--spacing-lg);">
                    <p class="text-sm text-secondary">
                        Already have an account? <a href="#/login" style="color: var(--primary-color); font-weight: 500;">Sign in</a>
                    </p>
                </div>
            </div>
        `;

        this.container = container;
        return container;
    }

    afterRender() {
        const form = this.container.querySelector('#signup-form');
        const errorMsg = this.container.querySelector('#error-message');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.name.value;
            const email = form.email.value;
            const password = form.password.value;
            const btn = form.querySelector('button');

            btn.disabled = true;
            btn.textContent = 'Creating account...';
            errorMsg.style.display = 'none';

            const result = await authService.signup(name, email, password);

            if (result.success) {
                window.location.hash = '/';
                window.location.reload(); // Reload to update nav state
            } else {
                errorMsg.textContent = result.message;
                errorMsg.style.display = 'block';
                btn.disabled = false;
                btn.textContent = 'Sign Up';
            }
        });
    }
}
