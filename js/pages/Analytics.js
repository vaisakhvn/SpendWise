import { storageService } from '../services/storageService.js';
import { authService } from '../services/authService.js';

export default class AnalyticsPage {
    constructor() {
        this.user = authService.getUser();
        this.expenses = storageService.getExpenses(this.user.id);
        this.categories = storageService.getCategories();
        this.chartInstance = null;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'container';
        container.style.paddingBottom = '100px';

        container.innerHTML = `
            <div class="flex items-center gap-md" style="margin-bottom: var(--spacing-lg);">
                <a href="#/" style="padding: 8px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </a>
                <h1 class="text-xl">Analytics</h1>
            </div>

            <div class="flex gap-sm" style="margin-bottom: var(--spacing-md);">
                <button class="btn btn-primary text-sm" id="filter-month">This Month</button>
                <button class="btn btn-outline text-sm" id="filter-year">This Year</button>
            </div>

            <div class="card" style="margin-bottom: var(--spacing-lg);">
                <h2 class="text-lg" style="margin-bottom: var(--spacing-md);">Expense Breakdown</h2>
                <div style="position: relative; height: 250px;">
                    <canvas id="expense-chart"></canvas>
                </div>
            </div>

            <div class="card">
                <h2 class="text-lg" style="margin-bottom: var(--spacing-md);">Top Categories</h2>
                <div id="category-list" class="flex flex-col gap-sm">
                    <!-- Injected via JS -->
                </div>
            </div>
        `;

        this.container = container;
        return container;
    }

    afterRender() {
        this.renderChart('month');

        this.container.querySelector('#filter-month').addEventListener('click', (e) => {
            this.updateFilterStyles(e.target);
            this.renderChart('month');
        });

        this.container.querySelector('#filter-year').addEventListener('click', (e) => {
            this.updateFilterStyles(e.target);
            this.renderChart('year');
        });
    }

    updateFilterStyles(activeBtn) {
        const btns = this.container.querySelectorAll('button');
        btns.forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        });
        activeBtn.classList.remove('btn-outline');
        activeBtn.classList.add('btn-primary');
    }

    getFilteredExpenses(filterType) {
        const now = new Date();
        return this.expenses.filter(exp => {
            const expDate = new Date(exp.date);
            if (filterType === 'month') {
                return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
            } else {
                return expDate.getFullYear() === now.getFullYear();
            }
        });
    }

    renderChart(filterType) {
        const filteredExpenses = this.getFilteredExpenses(filterType).filter(e => e.type === 'expense');

        // Group by category
        const categoryTotals = {};
        filteredExpenses.forEach(exp => {
            if (!categoryTotals[exp.categoryId]) {
                categoryTotals[exp.categoryId] = 0;
            }
            categoryTotals[exp.categoryId] += parseFloat(exp.amount);
        });

        const labels = [];
        const data = [];
        const colors = [];

        Object.keys(categoryTotals).forEach(catId => {
            const cat = this.categories.find(c => c.id === catId);
            if (cat) {
                labels.push(cat.name);
                data.push(categoryTotals[catId]);
                colors.push(cat.color);
            }
        });

        // Update List
        const listContainer = this.container.querySelector('#category-list');
        if (labels.length === 0) {
            listContainer.innerHTML = '<p class="text-secondary text-center">No data for this period</p>';
        } else {
            listContainer.innerHTML = labels.map((label, i) => `
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-sm">
                        <div style="width: 12px; height: 12px; border-radius: 50%; background: ${colors[i]}"></div>
                        <span>${label}</span>
                    </div>
                    <span class="font-medium">${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(data[i])}</span>
                </div>
            `).join('');
        }

        // Render Chart
        const ctx = this.container.querySelector('#expense-chart').getContext('2d');

        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        if (labels.length > 0) {
            this.chartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                usePointStyle: true,
                                boxWidth: 10
                            }
                        }
                    }
                }
            });
        } else {
            // Clear canvas if no data
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.font = "14px Inter";
            ctx.fillStyle = "#64748b";
            ctx.textAlign = "center";
            ctx.fillText("No expenses found", ctx.canvas.width / 2, ctx.canvas.height / 2);
        }
    }
}
