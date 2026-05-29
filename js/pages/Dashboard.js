import { storageService } from '../services/storageService.js';
import { authService } from '../services/authService.js';

export default class DashboardPage {
    constructor() {
        this.user = authService.getUser();
        this.expenses = storageService.getExpenses(this.user.id);
        this.categories = storageService.getCategories();
    }

    getSummary() {
        const income = this.expenses
            .filter(e => e.type === 'income')
            .reduce((sum, e) => sum + parseFloat(e.amount), 0);

        const expense = this.expenses
            .filter(e => e.type === 'expense')
            .reduce((sum, e) => sum + parseFloat(e.amount), 0);

        return { income, expense, total: income - expense };
    }

    formatCurrency(amount, currency = 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    render() {
        const summary = this.getSummary();
        const container = document.createElement('div');
        container.className = 'container';
        container.style.paddingBottom = '100px'; // Space for FAB

        // Header
        const header = `
            <div class="flex justify-between items-center" style="margin-bottom: var(--spacing-lg);">
                <div>
                    <h1 class="text-xl">Hello, ${this.user.name.split(' ')[0]}</h1>
                    <p class="text-sm text-secondary">Welcome back</p>
                </div>
                <div class="profile-icon" style="width: 40px; height: 40px; background: var(--primary-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                    ${this.user.name.charAt(0).toUpperCase()}
                </div>
            </div>
        `;

        // Summary Card
        const summaryCard = `
            <div class="card" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; border: none; margin-bottom: var(--spacing-lg);">
                <div class="text-center" style="margin-bottom: var(--spacing-md);">
                    <p class="text-sm" style="opacity: 0.9;">Total Balance</p>
                    <h2 class="text-2xl" style="font-size: 2rem; font-weight: 700;">${this.formatCurrency(summary.total)}</h2>
                </div>
                <div class="flex justify-between" style="background: rgba(255,255,255,0.1); padding: var(--spacing-md); border-radius: var(--radius-md);">
                    <div>
                        <div class="flex items-center gap-sm">
                            <div style="width: 20px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                            </div>
                            <span class="text-sm">Income</span>
                        </div>
                        <p class="text-lg" style="margin-top: 4px;">${this.formatCurrency(summary.income)}</p>
                    </div>
                    <div class="text-right">
                        <div class="flex items-center gap-sm justify-end">
                            <span class="text-sm">Expense</span>
                            <div style="width: 20px; height: 20px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
                            </div>
                        </div>
                        <p class="text-lg" style="margin-top: 4px;">${this.formatCurrency(summary.expense)}</p>
                    </div>
                </div>
            </div>
        `;

        // Recent Transactions
        const transactionsList = this.expenses.length === 0
            ? `<div class="text-center text-secondary" style="padding: var(--spacing-xl);">
                <p>No transactions yet.</p>
                <p class="text-sm">Tap + to add one.</p>
               </div>`
            : `<div class="flex flex-col gap-md">
                ${this.expenses.slice().reverse().map(exp => {
                const cat = this.categories.find(c => c.id === exp.categoryId) || {};
                const isExpense = exp.type === 'expense';
                return `
                        <div class="card flex justify-between items-center" style="padding: var(--spacing-md);">
                            <div class="flex items-center gap-md">
                                <div style="width: 40px; height: 40px; background: ${cat.color}20; color: ${cat.color}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
                                    ${cat.name ? cat.name.charAt(0) : '?'}
                                </div>
                                <div>
                                    <p class="text-lg" style="font-size: 1rem;">${exp.title}</p>
                                    <p class="text-sm text-secondary">${new Date(exp.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="text-lg" style="color: ${isExpense ? 'var(--danger-color)' : 'var(--success-color)'};">
                                    ${isExpense ? '-' : '+'}${this.formatCurrency(exp.amount, exp.currency)}
                                </p>
                                <p class="text-sm text-secondary">${cat.name || 'Uncategorized'}</p>
                            </div>
                        </div>
                    `;
            }).join('')}
               </div>`;

        container.innerHTML = `
            ${header}
            ${summaryCard}
            <div class="flex justify-between items-center" style="margin-bottom: var(--spacing-md);">
                <h2 class="text-lg">Recent Transactions</h2>
                <a href="#/analytics" class="text-sm" style="color: var(--primary-color);">See All</a>
            </div>
            ${transactionsList}
            
            <a href="#/add" class="fab">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </a>
        `;

        return container;
    }
}
