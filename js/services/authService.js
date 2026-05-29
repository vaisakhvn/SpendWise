import { storageService } from './storageService.js';

class AuthService {
    constructor() {
        this.currentUser = storageService.getCurrentUser();
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getUser() {
        return this.currentUser;
    }

    async login(email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = storageService.getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            storageService.setCurrentUser(user);
            return { success: true, user };
        } else {
            return { success: false, message: 'Invalid email or password' };
        }
    }

    async signup(name, email, password) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const users = storageService.getUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'Email already exists' };
        }

        const newUser = {
            id: 'user_' + Date.now(),
            name,
            email,
            password, // In a real app, this should be hashed!
            createdAt: new Date().toISOString()
        };

        storageService.saveUser(newUser);
        this.currentUser = newUser;
        storageService.setCurrentUser(newUser);
        return { success: true, user: newUser };
    }

    logout() {
        this.currentUser = null;
        storageService.setCurrentUser(null);
        window.location.reload();
    }
}

export const authService = new AuthService();
