import { authService } from './services/authService.js';

class App {
    constructor() {
        this.appElement = document.getElementById('app');
        this.navElement = document.getElementById('bottom-nav');
        this.topNavElement = document.getElementById('top-nav');
        this.routes = {
            '/': { component: 'DashboardPage', auth: true },
            '/login': { component: 'LoginPage', auth: false },
            '/signup': { component: 'SignupPage', auth: false },
            '/analytics': { component: 'AnalyticsPage', auth: true },
            '/add': { component: 'AddEntryPage', auth: true }
        };

        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.hash.slice(1) || '/';
        const route = this.routes[path] || this.routes['/'];

        // Auth Guard
        if (route.auth && !authService.isAuthenticated()) {
            window.location.hash = '/login';
            return;
        }

        if (!route.auth && authService.isAuthenticated()) {
            window.location.hash = '/';
            return;
        }

        // Load Component
        try {
            // Dynamic import based on component name
            // Note: In a real bundler setup, this might need mapping. 
            // For native ES modules, we'll import directly.
            let module;
            switch (route.component) {
                case 'DashboardPage':
                    module = await import('./pages/Dashboard.js');
                    break;
                case 'LoginPage':
                    module = await import('./pages/Login.js');
                    break;
                case 'SignupPage':
                    module = await import('./pages/Signup.js');
                    break;
                case 'AnalyticsPage':
                    module = await import('./pages/Analytics.js');
                    break;
                case 'AddEntryPage':
                    module = await import('./pages/AddEntry.js');
                    break;
            }

            if (module && module.default) {
                const page = new module.default();
                this.appElement.innerHTML = '';
                this.appElement.appendChild(page.render());

                // Post-render hooks (listeners etc)
                if (page.afterRender) page.afterRender();

                this.updateNavigation(path);
            }
        } catch (error) {
            console.error('Error loading page:', error);
            this.appElement.innerHTML = '<div class="container text-center"><h1>404</h1><p>Page not found</p></div>';
        }
    }

    updateNavigation(path) {
        if (!authService.isAuthenticated()) {
            this.navElement.style.display = 'none';
            this.topNavElement.style.display = 'none';
            return;
        }

        // Top Nav
        this.topNavElement.style.display = 'flex';
        this.topNavElement.innerHTML = `
            <div class="brand-logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                SpendWise
            </div>
        `;

        this.navElement.style.display = 'flex';
        // Simple bottom nav rendering
        this.navElement.innerHTML = `
            <a href="#/" class="nav-item ${path === '/' ? 'active' : ''}">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                <span>Home</span>
            </a>
            <a href="#/add" class="nav-item ${path === '/add' ? 'active' : ''}">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                <span>Add</span>
            </a>
            <a href="#/analytics" class="nav-item ${path === '/analytics' ? 'active' : ''}">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                <span>Analytics</span>
            </a>
            <div class="nav-item" onclick="window.auth.logout()" style="cursor: pointer">
                <svg class="nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                <span>Logout</span>
            </div>
        `;
    }
}

// Expose auth for logout button
window.auth = authService;

// Initialize App
new App();
