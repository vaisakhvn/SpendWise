/**
 * StorageService
 * Wrapper around localStorage to handle data persistence.
 * Simulates database operations.
 */
class StorageService {
    constructor() {
        this.KEYS = {
            USERS: 'em_users',
            CURRENT_USER: 'em_current_user',
            EXPENSES: 'em_expenses',
            CATEGORIES: 'em_categories'
        };
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.KEYS.USERS)) {
            localStorage.setItem(this.KEYS.USERS, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.EXPENSES)) {
            localStorage.setItem(this.KEYS.EXPENSES, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.KEYS.CATEGORIES)) {
            const defaultCategories = [
                { id: 'cat_1', name: 'Food', color: '#ef4444', type: 'expense' },
                { id: 'cat_2', name: 'Transport', color: '#f59e0b', type: 'expense' },
                { id: 'cat_3', name: 'Entertainment', color: '#8b5cf6', type: 'expense' },
                { id: 'cat_4', name: 'Salary', color: '#22c55e', type: 'income' },
                { id: 'cat_5', name: 'Freelance', color: '#10b981', type: 'income' }
            ];
            localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(defaultCategories));
        }
    }

    // Generic Helpers
    _getData(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    _saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // User Operations
    getUsers() {
        return this._getData(this.KEYS.USERS);
    }

    saveUser(user) {
        const users = this.getUsers();
        users.push(user);
        this._saveData(this.KEYS.USERS, users);
    }

    setCurrentUser(user) {
        if (user) {
            localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(this.KEYS.CURRENT_USER);
        }
    }

    getCurrentUser() {
        const user = localStorage.getItem(this.KEYS.CURRENT_USER);
        return user ? JSON.parse(user) : null;
    }

    // Expense Operations
    getExpenses(userId) {
        const allExpenses = this._getData(this.KEYS.EXPENSES);
        return allExpenses.filter(exp => exp.userId === userId);
    }

    addExpense(expense) {
        const expenses = this._getData(this.KEYS.EXPENSES);
        expenses.push(expense);
        this._saveData(this.KEYS.EXPENSES, expenses);
        return expense;
    }

    deleteExpense(id) {
        let expenses = this._getData(this.KEYS.EXPENSES);
        expenses = expenses.filter(exp => exp.id !== id);
        this._saveData(this.KEYS.EXPENSES, expenses);
    }

    // Category Operations
    getCategories() {
        return this._getData(this.KEYS.CATEGORIES);
    }

    addCategory(category) {
        const categories = this.getCategories();
        categories.push(category);
        this._saveData(this.KEYS.CATEGORIES, categories);
        return category;
    }
}

export const storageService = new StorageService();
