import { storageService } from '../services/storageService.js';
import { authService } from '../services/authService.js';

export default class AddEntryPage {
    constructor() {
        this.user = authService.getUser();
        this.categories = storageService.getCategories();
        this.currencies = ['INR', 'USD', 'EUR', 'GBP', 'JPY'];
        this.calculatorOpen = false;
        this.calcValue = '0';
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
                <h1 class="text-xl">Add Transaction</h1>
            </div>

            <form id="add-entry-form">
                <!-- Amount & Currency -->
                <div class="card" style="margin-bottom: var(--spacing-md);">
                    <label class="text-sm text-secondary">Amount</label>
                    <div class="flex items-center gap-sm" style="margin-top: var(--spacing-sm);">
                        <select name="currency" class="input-field" style="width: 80px; padding: var(--spacing-sm);">
                            ${this.currencies.map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                        <div class="flex-1 relative">
                            <input type="text" name="amount" id="amount-input" class="input-field" value="0" readonly style="font-size: 1.5rem; font-weight: 600; text-align: right; cursor: pointer;">
                        </div>
                    </div>
                </div>

                <!-- Calculator Modal (Hidden by default) -->
                <div id="calculator-modal" style="display: none; position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface-color); border-top-left-radius: var(--radius-lg); border-top-right-radius: var(--radius-lg); box-shadow: 0 -4px 20px rgba(0,0,0,0.2); z-index: 200; padding: var(--spacing-md);">
                    <div class="flex justify-between items-center" style="margin-bottom: var(--spacing-md);">
                        <span class="text-lg">Calculator</span>
                        <button type="button" id="close-calc" class="text-secondary">Done</button>
                    </div>
                    <div class="grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-sm);">
                        <button type="button" class="calc-btn btn-outline" data-val="C">C</button>
                        <button type="button" class="calc-btn btn-outline" data-val="/">/</button>
                        <button type="button" class="calc-btn btn-outline" data-val="*">*</button>
                        <button type="button" class="calc-btn btn-outline" data-val="DEL">⌫</button>
                        
                        <button type="button" class="calc-btn btn-outline" data-val="7">7</button>
                        <button type="button" class="calc-btn btn-outline" data-val="8">8</button>
                        <button type="button" class="calc-btn btn-outline" data-val="9">9</button>
                        <button type="button" class="calc-btn btn-outline" data-val="-">-</button>
                        
                        <button type="button" class="calc-btn btn-outline" data-val="4">4</button>
                        <button type="button" class="calc-btn btn-outline" data-val="5">5</button>
                        <button type="button" class="calc-btn btn-outline" data-val="6">6</button>
                        <button type="button" class="calc-btn btn-outline" data-val="+">+</button>
                        
                        <button type="button" class="calc-btn btn-outline" data-val="1">1</button>
                        <button type="button" class="calc-btn btn-outline" data-val="2">2</button>
                        <button type="button" class="calc-btn btn-outline" data-val="3">3</button>
                        <button type="button" class="calc-btn btn-primary" data-val="=" style="grid-row: span 2;">=</button>
                        
                        <button type="button" class="calc-btn btn-outline" data-val="0" style="grid-column: span 2;">0</button>
                        <button type="button" class="calc-btn btn-outline" data-val=".">.</button>
                    </div>
                </div>

                <!-- Details -->
                <div class="card">
                    <div class="input-group">
                        <label class="text-sm text-secondary">Title</label>
                        <input type="text" name="title" class="input-field" placeholder="e.g. Grocery Shopping" required>
                    </div>

                    <div class="input-group">
                        <label class="text-sm text-secondary">Description (Optional)</label>
                        <textarea name="description" class="input-field" rows="2"></textarea>
                    </div>

                    <div class="input-group">
                        <label class="text-sm text-secondary">Category</label>
                        <div class="flex gap-sm" style="flex-wrap: wrap; margin-top: var(--spacing-xs);" id="category-list">
                            ${this.renderCategories()}
                        </div>
                        <button type="button" id="add-category-btn" class="text-sm text-primary" style="margin-top: var(--spacing-sm); text-align: left;">+ Create New Category</button>
                    </div>

                    <div class="input-group">
                        <label class="text-sm text-secondary">Date</label>
                        <input type="date" name="date" class="input-field" value="${new Date().toISOString().split('T')[0]}" required>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: var(--spacing-lg); padding: var(--spacing-md);">Save Transaction</button>
            </form>
        `;

        this.container = container;
        return container;
    }

    renderCategories() {
        return this.categories.map(cat => `
            <label class="category-tag" style="cursor: pointer;">
                <input type="radio" name="categoryId" value="${cat.id}" style="display: none;" ${cat.id === 'cat_1' ? 'checked' : ''}>
                <span style="padding: 6px 12px; border-radius: 20px; border: 1px solid var(--border-color); display: inline-block; font-size: 0.875rem; transition: all 0.2s;">
                    ${cat.name}
                </span>
            </label>
        `).join('');
    }

    afterRender() {
        const form = this.container.querySelector('#add-entry-form');
        const amountInput = this.container.querySelector('#amount-input');
        const calcModal = this.container.querySelector('#calculator-modal');
        const closeCalc = this.container.querySelector('#close-calc');
        const categoryList = this.container.querySelector('#category-list');
        const addCatBtn = this.container.querySelector('#add-category-btn');

        // Calculator Logic
        amountInput.addEventListener('click', () => {
            calcModal.style.display = 'block';
        });

        closeCalc.addEventListener('click', () => {
            calcModal.style.display = 'none';
        });

        this.container.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.dataset.val;
                this.handleCalcInput(val, amountInput);
            });
        });

        // Category Selection Styling
        categoryList.addEventListener('change', (e) => {
            if (e.target.name === 'categoryId') {
                this.updateCategoryStyles();
            }
        });
        this.updateCategoryStyles(); // Init

        // Add Category Logic
        addCatBtn.addEventListener('click', () => {
            const name = prompt('Enter category name:');
            if (name) {
                const type = confirm('Is this an expense category? (Cancel for Income)') ? 'expense' : 'income';
                const newCat = {
                    id: 'cat_' + Date.now(),
                    name,
                    color: '#6366f1', // Default color
                    type
                };
                storageService.addCategory(newCat);
                this.categories = storageService.getCategories();
                categoryList.innerHTML = this.renderCategories();
                this.updateCategoryStyles();
            }
        });

        // Form Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const categoryId = formData.get('categoryId');
            const category = this.categories.find(c => c.id === categoryId);

            const expense = {
                id: 'exp_' + Date.now(),
                userId: this.user.id,
                amount: parseFloat(formData.get('amount')),
                currency: formData.get('currency'),
                title: formData.get('title'),
                description: formData.get('description'),
                categoryId: categoryId,
                type: category ? category.type : 'expense',
                date: formData.get('date'),
                createdAt: new Date().toISOString()
            };

            storageService.addExpense(expense);
            window.location.hash = '/';
        });
    }

    handleCalcInput(val, input) {
        if (val === 'C') {
            this.calcValue = '0';
        } else if (val === 'DEL') {
            this.calcValue = this.calcValue.slice(0, -1) || '0';
        } else if (val === '=') {
            try {
                // Safe eval for calculator
                this.calcValue = String(eval(this.calcValue));
            } catch {
                this.calcValue = 'Error';
            }
        } else {
            if (this.calcValue === '0' && !['.', '/', '*', '+', '-'].includes(val)) {
                this.calcValue = val;
            } else {
                this.calcValue += val;
            }
        }
        input.value = this.calcValue;
    }

    updateCategoryStyles() {
        const inputs = this.container.querySelectorAll('input[name="categoryId"]');
        inputs.forEach(input => {
            const span = input.nextElementSibling;
            if (input.checked) {
                span.style.backgroundColor = 'var(--primary-color)';
                span.style.color = 'white';
                span.style.borderColor = 'var(--primary-color)';
            } else {
                span.style.backgroundColor = 'transparent';
                span.style.color = 'var(--text-primary)';
                span.style.borderColor = 'var(--border-color)';
            }
        });
    }
}
