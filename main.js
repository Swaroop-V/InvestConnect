
import { services } from './services.js';
import { views } from './views.js';
import log from "https://cdn.jsdelivr.net/npm/loglevel@1.9.1/+esm";

// Ensure Logger is set up (services.js does it too, but main acts as controller)
log.setLevel("info");
log.info("🚀 [Main] Application Starting...");

// --- State ---
let user = null;
try {
    const storedUser = localStorage.getItem('investconnect_user');
    if (storedUser) {
        user = JSON.parse(storedUser);
        log.info("👤 [State] Restored user session for:", user.email);
    }
} catch (e) {
    log.error("❌ [State] Error restoring user session:", e);
}

const state = { user };

// --- Utils ---
const showToast = (msg, type) => {
    log.debug(`🔔 [Toast] Showing ${type} message: ${msg}`);
    const app = document.getElementById('app');
    const toastHtml = views.toast(msg, type);
    const temp = document.createElement('div');
    temp.innerHTML = toastHtml.trim();
    const toast = temp.firstChild;
    app.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
};

// --- Error Handler ---
const handleFirebaseError = (err) => {
    log.error("🚨 [App Error Handler]", err);
    if (err.code === 'auth/api-key-not-valid' || (err.message && err.message.includes('api-key-not-valid'))) {
        log.warn("⚠️ [Config] API Key invalid. Prompting user.");
        const newKey = prompt("⚠️ CONFIGURATION ERROR ⚠️\n\nThe Firebase API Key is missing or invalid.\n\nPlease copy the 'apiKey' from your Firebase Console > Project Settings > General and paste it here:");
        if (newKey) {
            services.updateApiKey(newKey);
        }
    } else {
        showToast(err.message || 'An unexpected error occurred', 'error');
    }
};

// --- Router ---
const router = async () => {
    const app = document.getElementById('app');
    const hash = window.location.hash || '#/';
    log.info(`🧭 [Router] Navigating to: ${hash}`);

    // 1. Render Structure (Navbar + Content Area) if missing
    if (!document.getElementById('content-area')) {
        app.innerHTML = `
            ${views.navbar(state.user, hash, services.isLive())}
            <div id="content-area" class="flex-1 flex flex-col"></div>
        `;
    } else {
        const navContainer = app.firstElementChild;
        if (navContainer.tagName === 'NAV') {
             navContainer.outerHTML = views.navbar(state.user, hash, services.isLive());
        }
    }

    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="flex-1 flex items-center justify-center min-h-[50vh]">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
        </div>
    `;

    try {
        let viewHtml = '';

        if (hash === '#/') {
            viewHtml = views.home();
        } 
        else if (hash === '#/login') {
            viewHtml = views.login();
        } 
        else if (hash === '#/signup') {
            viewHtml = views.signup();
        } 
        else if (hash === '#/explore') {
            log.debug("🔍 [Router] Fetching ideas for Explore page...");
            const ideas = await services.getIdeas();
            viewHtml = views.explore(ideas);
        }
        else if (hash.startsWith('#/idea/')) {
            const ideaId = hash.split('/')[2];
            log.info(`🔍 [Router] Fetching details for idea ID: ${ideaId}`);
            const idea = await services.getIdeaById(ideaId);
            viewHtml = views.ideaDetails(idea);
        }
        else if (hash.startsWith('#/category/')) {
            const categoryName = decodeURIComponent(hash.split('/')[2]);
            log.info(`🔍 [Router] Fetching ideas for category: ${categoryName}`);
            const ideas = await services.getIdeasByCategory(categoryName);
            viewHtml = views.categoryView(categoryName, ideas);
        }
        else if (hash.startsWith('#/dashboard')) {
            if (!state.user) {
                log.warn("🔒 [Router] Unauthenticated access to Dashboard. Redirecting to Login.");
                window.location.hash = '#/login';
                return;
            }
            log.info(`📊 [Router] Loading Dashboard for role: ${state.user.role}`);
            // Role-based Content
            switch (state.user.role) {
                case 'USER':
                    const uIdeas = await services.getIdeas();
                    viewHtml = views.dashboardUser(uIdeas);
                    break;
                case 'ENTREPRENEUR':
                    const eIdeas = await services.getIdeas();
                    viewHtml = views.dashboardEntrepreneur(eIdeas);
                    break;
                case 'INVESTOR':
                    const iIdeas = await services.getIdeas();
                    const iProps = await services.getProposals();
                    viewHtml = views.dashboardInvestor(iIdeas, iProps);
                    break;
                case 'BANKER':
                    const loans = await services.getLoans();
                    viewHtml = views.dashboardBanker(loans);
                    break;
                case 'ADVISOR':
                    const posts = await services.getAdvisories();
                    const queries = await services.getQueries(); 
                    viewHtml = views.dashboardAdvisor(posts, queries);
                    break;
                default:
                    log.error(`❌ [Router] Unknown role detected: ${state.user.role}`);
                    viewHtml = `<div class="p-8 text-center">Unknown Role</div>`;
                }
            } else {
                log.warn(`⚠️ [Router] Unknown route ${hash}, defaulting to Home.`);
                viewHtml = views.home(); 
            }

            contentArea.innerHTML = viewHtml;
            log.debug("✅ [Router] View rendered successfully.");

        } catch (err) {
            // If getting data failed due to API Key, handle it here
            if (err.code === 'auth/api-key-not-valid' || (err.message && err.message.includes('api-key-not-valid'))) {
                 handleFirebaseError(err);
            } else {
                log.error("❌ [Router] Error loading page:", err);
                contentArea.innerHTML = `
                    <div class="p-8 text-center text-red-600">
                        <h3 class="font-bold">Error Loading Page</h3>
                        <p>${err.message}</p>
                        <button onclick="window.location.reload()" class="mt-4 underline">Reload</button>
                        <div class="mt-8 text-sm text-slate-500">
                             <button onclick="services.resetApiKey()" class="text-xs border px-2 py-1 rounded">Reset API Key</button>
                        </div>
                    </div>
                `;
            }
        }
    };

    // --- Event Listeners ---

    document.addEventListener('click', async (e) => {
        // Logout
        if (e.target.closest('#btn-logout')) {
            log.info("🖱️ [UI] Logout button clicked.");
            await services.logout();
            state.user = null;
            localStorage.removeItem('investconnect_user');
            showToast('Logged Out', 'success');
            window.location.hash = '#/';
            if (window.location.hash === '#/') router(); 
        }
    });

    // Form Submissions
    document.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        log.info(`📝 [UI] Form Submission detected: ${form.id}`);
        
        // Special handling for dynamic solution forms
        if (form.classList.contains('form-post-solution')) {
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '...';
            btn.disabled = true;
            
            try {
                await services.postSolution(form.queryId.value, {
                    authorId: state.user.id,
                    authorName: state.user.name,
                    content: form.solution.value
                });
                showToast('Solution Posted', 'success');
                router();
            } catch(err) {
                handleFirebaseError(err);
            } finally {
                btn.textContent = originalText;
                btn.disabled = false;
            }
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;

        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Processing...';

        try {
            if (form.id === 'login-form') {
                const user = await services.login(form.email.value, form.password.value);
                state.user = user;
                localStorage.setItem('investconnect_user', JSON.stringify(user));
                window.location.hash = '#/dashboard';
                showToast('Welcome back!', 'success');
            } 
            else if (form.id === 'signup-form') {
                const user = await services.signup({
                    name: form.name.value,
                    email: form.email.value,
                    password: form.password.value,
                    role: form.role.value
                });
                state.user = user;
                localStorage.setItem('investconnect_user', JSON.stringify(user));
                window.location.hash = '#/dashboard';
                showToast('Account Created!', 'success');
            }
            else if (form.id === 'form-post-idea') {
                await services.postIdea({
                    authorId: state.user.id,
                    authorName: state.user.name,
                    title: form.title.value,
                    category: form.category.value,
                    amountNeeded: Number(form.amountNeeded.value),
                    description: form.description.value
                });
                showToast('Idea Posted', 'success');
                router(); 
            }
            else if (form.id === 'form-post-proposal') {
                await services.postProposal({
                    authorId: state.user.id,
                    authorName: state.user.name,
                    title: form.title.value,
                    investmentRange: form.investmentRange.value,
                    description: form.description.value
                });
                showToast('Proposal Posted', 'success');
                router();
            }
            else if (form.id === 'form-post-loan') {
                await services.postLoan({
                    bankerId: state.user.id,
                    bankName: state.user.name + "'s Bank",
                    title: form.title.value,
                    interestRate: Number(form.interestRate.value),
                    tenureMonths: Number(form.tenureMonths.value),
                    maxAmount: Number(form.maxAmount.value),
                    description: form.description.value
                });
                showToast('Loan Posted', 'success');
                router();
            }
            else if (form.id === 'form-post-advisory') {
                await services.postAdvisory({
                    advisorId: state.user.id,
                    authorName: state.user.name,
                    title: form.title.value,
                    content: form.content.value,
                    type: 'INFO'
                });
                showToast('Advice Posted', 'success');
                router();
            }
            else if (form.id === 'form-post-query') {
                await services.postQuery({
                    authorId: state.user.id,
                    authorName: state.user.name,
                    title: form.title.value,
                    content: form.content.value
                });
                showToast('Query Sent to Advisors', 'success');
                router();
            }
        } catch (err) {
            handleFirebaseError(err);
        } finally {
            if (btn) {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        }
    });

    // Init
    window.addEventListener('hashchange', router);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', router);
    } else {
        router();
    }
    // Expose for manual debugging if needed
    window.services = services;