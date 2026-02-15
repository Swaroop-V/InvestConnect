


// Helper to format currency
const formatMoney = (amount) => '₹' + Number(amount).toLocaleString('en-IN');

export const views = {
    // New Toast Component
    toast(message, type = 'error') {
        const bg = type === 'error' ? 'bg-red-600' : 'bg-green-600';
        const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
        return `
            <div id="toast-notification" class="fixed top-5 right-5 ${bg} text-white px-6 py-4 rounded-lg shadow-2xl z-[100] fade-in flex items-center gap-3 max-w-md">
                <i class="fa-solid ${icon} text-xl"></i>
                <div class="text-sm font-medium">${message}</div>
                <button onclick="this.parentElement.remove()" class="ml-4 hover:bg-white/20 rounded p-1">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `;
    },

    navbar(user, currentHash = '#/', isLive = true) {
        const statusBadge = `<div class="hidden sm:flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-100" title="Connected to Firebase">
                 <span class="relative flex h-2 w-2">
                   <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                   <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                 </span>
                 <span class="text-[10px] font-bold text-green-700 uppercase tracking-wider">Live DB</span>
               </div>`;

        const isActive = (path) => {
            if (path === '#/') return currentHash === '#/' || currentHash === '';
            return currentHash.startsWith(path);
        };

        const linkClass = (path) => isActive(path) 
            ? "border-brand-500 text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200";

        return `
            <nav class="bg-white shadow-sm sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <a href="#/" class="flex-shrink-0 flex items-center gap-2">
                                <div class="bg-brand-600 p-2 rounded-lg">
                                   <i class="fa-solid fa-arrow-trend-up text-white"></i>
                                </div>
                                <span class="font-bold text-xl text-slate-800">InvestConnect</span>
                            </a>
                            <div class="ml-4">
                                ${statusBadge}
                            </div>
                            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <a href="#/" class="${linkClass('#/')}">Home</a>
                                <a href="#/explore" class="${linkClass('#/explore')}">Explore Ideas</a>
                                ${user ? `<a href="#/dashboard" class="${linkClass('#/dashboard')}">Dashboard</a>` : ''}
                            </div>
                        </div>
                        <div class="flex items-center">
                            ${user ? `
                                <span class="text-sm text-slate-600 mr-4">
                                    <i class="fa-solid fa-circle text-green-500 text-[8px] mr-1"></i>
                                    ${user.name} <span class="text-xs bg-slate-100 px-2 py-0.5 rounded-full ml-1">${user.role === 'USER' ? 'General User' : user.role}</span>
                                </span>
                                <button id="btn-logout" class="text-slate-400 hover:text-red-500 transition-colors">
                                    <i class="fa-solid fa-right-from-bracket fa-lg"></i>
                                </button>
                            ` : `
                                <a href="#/login" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700">
                                    Sign In
                                </a>
                                <a href="#/signup" class="ml-2 inline-flex items-center px-4 py-2 border border-brand-600 text-sm font-medium rounded-md text-brand-600 bg-white hover:bg-slate-50">
                                    Sign Up
                                </a>
                            `}
                        </div>
                    </div>
                </div>
            </nav>
        `;
    },

    home() {
        return `
            <div class="bg-white fade-in">
                <div class="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
                    <div class="text-center">
                        <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
                            <span class="block">InvestConnect</span>
                            <span class="block text-brand-600">Bridge Between Investors & Businesses</span>
                        </h1>
                        <p class="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
                            Connect with the right people to fuel your business growth. Whether you are an entrepreneur, investor, banker, or advisor.
                        </p>
                        <div class="mt-8 flex justify-center gap-4">
                            <a href="#/signup" class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 md:py-4 md:text-lg md:px-10">
                                Join Now
                            </a>
                            <a href="#/explore" class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-brand-700 bg-brand-100 hover:bg-brand-200 md:py-4 md:text-lg md:px-10">
                                Explore Ideas
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="bg-slate-50 py-12">
                     <div class="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div class="p-6 bg-white rounded-lg shadow-sm">
                            <div class="text-brand-600 mb-2"><i class="fa-solid fa-briefcase fa-2x"></i></div>
                            <h3 class="font-bold text-lg">Entrepreneurs</h3>
                            <p class="text-sm text-slate-500 mt-2">Post ideas and find funding.</p>
                        </div>
                        <div class="p-6 bg-white rounded-lg shadow-sm">
                            <div class="text-brand-600 mb-2"><i class="fa-solid fa-arrow-trend-up fa-2x"></i></div>
                            <h3 class="font-bold text-lg">Investors</h3>
                            <p class="text-sm text-slate-500 mt-2">Discover the next unicorn.</p>
                        </div>
                        <div class="p-6 bg-white rounded-lg shadow-sm">
                            <div class="text-brand-600 mb-2"><i class="fa-solid fa-building-columns fa-2x"></i></div>
                            <h3 class="font-bold text-lg">Bankers</h3>
                            <p class="text-sm text-slate-500 mt-2">Provide loans and capital.</p>
                        </div>
                        <div class="p-6 bg-white rounded-lg shadow-sm">
                            <div class="text-brand-600 mb-2"><i class="fa-solid fa-user-graduate fa-2x"></i></div>
                            <h3 class="font-bold text-lg">Advisors</h3>
                            <p class="text-sm text-slate-500 mt-2">Share wisdom and solutions.</p>
                        </div>
                     </div>
                </div>
            </div>
        `;
    },

    login() {
        return `
            <div class="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 fade-in">
                <div class="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">Sign in to InvestConnect</h2>
                    <p class="mt-2 text-center text-sm text-slate-600">
                        Or
                        <a href="#/signup" class="font-medium text-brand-600 hover:text-brand-500">
                            create a new account
                        </a>
                    </p>
                </div>

                <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form id="login-form" class="space-y-6">
                            <div>
                                <label for="email" class="block text-sm font-medium text-slate-700">Email address</label>
                                <input id="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm mt-1">
                            </div>

                            <div>
                                <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
                                <input id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm mt-1">
                            </div>

                            <div>
                                <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                                    Sign in
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    signup() {
        return `
            <div class="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 fade-in">
                <div class="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-slate-900">Create your account</h2>
                    <p class="mt-2 text-center text-sm text-slate-600">
                        Already have an account?
                        <a href="#/login" class="font-medium text-brand-600 hover:text-brand-500">
                            Sign in
                        </a>
                    </p>
                </div>

                <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form id="signup-form" class="space-y-6">
                            <div>
                                <label for="name" class="block text-sm font-medium text-slate-700">Full Name</label>
                                <input id="name" name="name" type="text" autocomplete="name" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm mt-1">
                            </div>

                            <div>
                                <label for="email" class="block text-sm font-medium text-slate-700">Email address</label>
                                <input id="email" name="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm mt-1">
                            </div>

                            <div>
                                <label for="role" class="block text-sm font-medium text-slate-700">I am a...</label>
                                <select id="role" name="role" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md border">
                                    <option value="USER">General User (Browse Categories)</option>
                                    <option value="ENTREPRENEUR">Business Person (Entrepreneur)</option>
                                    <option value="INVESTOR">Investor</option>
                                    <option value="BANKER">Banker</option>
                                    <option value="ADVISOR">Business Advisor</option>
                                </select>
                            </div>

                            <div>
                                <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
                                <input id="password" name="password" type="password" autocomplete="new-password" required class="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm mt-1">
                            </div>

                            <div>
                                <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500">
                                    Sign Up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    },

    ideaDetails(idea) {
        if (!idea) return `<div class="p-8 text-center text-slate-500">Idea not found</div>`;
        
        return `
            <div class="max-w-4xl mx-auto px-4 py-8 fade-in">
                <a href="#/explore" class="text-slate-500 hover:text-slate-700 text-sm mb-6 inline-flex items-center">
                    <i class="fa-solid fa-arrow-left mr-2"></i> Back to Explore
                </a>

                <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-8 border-b border-slate-100">
                        <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-100 text-brand-800">
                                ${idea.category}
                            </span>
                            <span class="text-sm text-slate-500">
                                Posted on ${new Date(idea.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 class="text-3xl font-bold text-slate-900 mb-2">${idea.title}</h1>
                        <p class="text-lg text-slate-600">by ${idea.authorName}</p>
                    </div>

                    <div class="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div class="md:col-span-2 space-y-6">
                            <div>
                                <h3 class="text-lg font-bold text-slate-900 mb-3">About the Project</h3>
                                <p class="text-slate-700 leading-relaxed whitespace-pre-line">${idea.description}</p>
                            </div>
                            
                            <div class="bg-slate-50 p-6 rounded-lg border border-slate-100">
                                <h4 class="font-bold text-slate-900 mb-2">Why this matters</h4>
                                <p class="text-sm text-slate-600">This project aims to solve critical challenges in the ${idea.category} sector through innovative approaches.</p>
                            </div>
                        </div>

                        <div class="md:col-span-1">
                            <div class="bg-white rounded-lg border-2 border-brand-100 p-6 sticky top-24">
                                <div class="text-center mb-6">
                                    <div class="text-sm text-slate-500 font-medium uppercase tracking-wider mb-1">Target Funding</div>
                                    <div class="text-3xl font-bold text-brand-600">${formatMoney(idea.amountNeeded)}</div>
                                </div>
                                
                                <button class="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors mb-3 flex items-center justify-center gap-2" onclick="alert('Connect feature coming soon! For now, please check user profile.')">
                                    <i class="fa-solid fa-envelope"></i> Contact Entrepreneur
                                </button>
                                <button class="w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2" onclick="alert('Save feature coming soon!')">
                                    <i class="fa-regular fa-bookmark"></i> Save for Later
                                </button>

                                <div class="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
                                    InvestConnect Protection <br> Verified Listing
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    explore(ideas) {
        let content;
        if (ideas.length === 0) {
            content = `
                <div class="col-span-full text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
                    <i class="fa-solid fa-lightbulb text-slate-300 text-5xl mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-900">No ideas yet</h3>
                    <p class="text-slate-500">Be the first to post a business idea!</p>
                </div>
            `;
        } else {
            content = ideas.map(idea => `
                <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition">
                    <div class="flex justify-between items-start">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">${idea.category}</span>
                        <span class="text-xs text-slate-400">${new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 class="mt-4 text-xl font-bold text-slate-900">${idea.title}</h3>
                    <p class="text-sm text-slate-500 mt-1">by ${idea.authorName}</p>
                    <p class="mt-3 text-slate-600 line-clamp-3">${idea.description}</p>
                    <div class="mt-4 pt-4 border-t border-slate-100">
                        <a href="#/idea/${idea.id}" class="text-brand-600 text-sm font-medium hover:text-brand-700">View Details <i class="fa-solid fa-angle-right"></i></a>
                    </div>
                </div>
            `).join('');
        }

        return `
            <div class="max-w-7xl mx-auto px-4 py-8 fade-in">
                <div class="flex items-center justify-between mb-8">
                    <div>
                        <h1 class="text-3xl font-bold mb-2">Explore Ideas</h1>
                        <p class="text-slate-500">See what others are building.</p>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    ${content}
                </div>
            </div>
        `;
    },

    categoryView(category, ideas) {
        let content;
        if (ideas.length === 0) {
            content = `
                <div class="col-span-full w-full bg-white rounded-xl border-2 border-dashed border-slate-200 text-center py-16 px-6 sm:px-12">
                    <div class="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                        <i class="fa-solid fa-folder-open"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900">No opportunities found</h3>
                    <p class="text-slate-500 mt-2 max-w-lg mx-auto">There are currently no business ideas posted in the <span class="font-semibold text-brand-600">${category}</span> category.</p>
                    <a href="#/dashboard" class="mt-8 inline-flex items-center text-brand-600 font-medium hover:text-brand-700 hover:underline">
                        <i class="fa-solid fa-arrow-left mr-2"></i> Back to Dashboard
                    </a>
                </div>
            `;
        } else {
            content = ideas.map(idea => `
                <div class="bg-white p-6 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all">
                    <div class="flex justify-between items-start">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800">${idea.category}</span>
                        <span class="text-xs text-slate-400">${new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 class="mt-4 text-xl font-bold text-slate-900">${idea.title}</h3>
                    <p class="text-sm text-slate-500 mt-1">by ${idea.authorName}</p>
                    <p class="mt-3 text-slate-600 line-clamp-3">${idea.description}</p>
                    <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                         <div class="text-sm font-bold text-slate-800 whitespace-nowrap">
                            Needed: ${formatMoney(idea.amountNeeded)}
                         </div>
                         <a href="#/idea/${idea.id}" class="text-brand-600 text-sm font-medium hover:text-brand-700 whitespace-nowrap">View Details <i class="fa-solid fa-angle-right"></i></a>
                    </div>
                </div>
            `).join('');
        }

        return `
            <div class="max-w-7xl mx-auto px-4 py-8 fade-in">
                <div class="mb-8">
                     <a href="#/dashboard" class="text-slate-500 hover:text-slate-700 text-sm mb-4 inline-block">
                        <i class="fa-solid fa-arrow-left mr-1"></i> Back to Dashboard
                     </a>
                     <h1 class="text-3xl font-bold text-slate-900"><span class="text-brand-600">${category}</span> Opportunities</h1>
                     <p class="text-slate-500 mt-1">Browse investment opportunities in this sector.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${content}
                </div>
            </div>
        `;
    },

    // DASHBOARDS
    dashboardUser(ideas) {
        const categories = [
            { name: 'Technology', icon: 'fa-laptop-code', color: 'bg-blue-100 text-blue-600' },
            { name: 'Agriculture', icon: 'fa-wheat-awn', color: 'bg-green-100 text-green-600' },
            { name: 'Healthcare', icon: 'fa-heart-pulse', color: 'bg-red-100 text-red-600' },
            { name: 'Retail', icon: 'fa-shop', color: 'bg-orange-100 text-orange-600' },
            { name: 'Manufacturing', icon: 'fa-industry', color: 'bg-slate-100 text-slate-600' },
            { name: 'Services', icon: 'fa-bell-concierge', color: 'bg-purple-100 text-purple-600' }
        ];

        const categoryGrid = categories.map(cat => `
            <a href="#/category/${cat.name}" class="bg-white p-6 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group text-center hover:border-brand-200 block">
                <div class="h-14 w-14 mx-auto rounded-full ${cat.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    <i class="fa-solid ${cat.icon}"></i>
                </div>
                <h3 class="font-bold text-slate-900">${cat.name}</h3>
                <p class="text-xs text-slate-500 mt-1">View Businesses</p>
            </a>
        `).join('');

        const recentIdeas = ideas.slice(0, 6).map(idea => `
            <a href="#/idea/${idea.id}" class="block bg-white p-5 rounded-lg shadow-sm border border-slate-200 hover:border-brand-300 transition-colors">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded border border-brand-100">${idea.category}</span>
                    <span class="text-xs text-slate-400">${new Date(idea.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 class="font-bold text-slate-900 text-lg mb-2">${idea.title}</h4>
                <p class="text-sm text-slate-500 line-clamp-2 mb-3">${idea.description}</p>
                <div class="text-sm font-medium text-slate-700">
                    <i class="fa-solid fa-indian-rupee-sign text-xs text-slate-400"></i> ${formatMoney(idea.amountNeeded).replace('₹', '')} needed
                </div>
            </a>
        `).join('');

        return `
            <div class="max-w-7xl mx-auto px-4 py-8 fade-in space-y-10">
                <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
                    <div class="relative z-10">
                        <h1 class="text-3xl sm:text-4xl font-extrabold mb-4">Welcome to InvestConnect</h1>
                        <p class="text-slate-300 max-w-2xl text-lg">Explore a world of innovative business ideas and connect with the entrepreneurs shaping the future.</p>
                    </div>
                    <div class="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                         <i class="fa-solid fa-layer-group text-[12rem] -mb-10 -mr-10"></i>
                    </div>
                </div>

                <div>
                    <div class="flex items-center gap-2 mb-6">
                        <div class="h-8 w-1 bg-brand-500 rounded-full"></div>
                        <h2 class="text-2xl font-bold text-slate-900">Browse Business Categories</h2>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        ${categoryGrid}
                    </div>
                </div>

                <div>
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center gap-2">
                            <div class="h-8 w-1 bg-brand-500 rounded-full"></div>
                            <h2 class="text-2xl font-bold text-slate-900">Featured Opportunities</h2>
                        </div>
                        <a href="#/explore" class="text-brand-600 font-medium hover:text-brand-700 text-sm">View All <i class="fa-solid fa-arrow-right ml-1"></i></a>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        ${recentIdeas || '<div class="text-slate-500 col-span-full text-center py-8">No businesses listed yet.</div>'}
                    </div>
                </div>
            </div>
        `;
    },

    dashboardInvestor(ideas, proposals) {
        let ideaCards;
        if (ideas.length === 0) {
            ideaCards = `<div class="p-8 text-center bg-white rounded shadow-sm text-slate-500">No active business ideas found.</div>`;
        } else {
            ideaCards = ideas.map(idea => `
                <div class="bg-white flex flex-col shadow-sm rounded-lg hover:shadow-lg transition-all border border-slate-100 p-6">
                    <div class="flex justify-between items-start">
                    <span class="bg-brand-100 text-brand-800 text-xs px-2 py-0.5 rounded-full">${idea.category}</span>
                    <span class="text-sm text-slate-400">${new Date(idea.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 class="mt-4 text-xl font-bold text-slate-900">${idea.title}</h3>
                    <p class="mt-2 text-slate-600 flex-grow">${idea.description}</p>
                    <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center gap-4">
                        <span class="text-2xl font-bold text-slate-900 whitespace-nowrap">${formatMoney(idea.amountNeeded)}</span>
                        <a href="#/idea/${idea.id}" class="text-brand-600 font-medium text-sm hover:underline whitespace-nowrap">View Details</a>
                    </div>
                </div>
            `).join('');
        }

        const proposalList = proposals.map(p => `
            <div class="bg-white shadow rounded-lg p-6 mb-4">
                <div class="flex justify-between">
                    <h4 class="text-lg font-bold text-slate-900">${p.title}</h4>
                    <span class="text-brand-600 font-medium">${p.investmentRange}</span>
                </div>
                <p class="text-sm text-slate-500 mt-1">Posted on ${new Date(p.createdAt).toLocaleDateString()}</p>
                <p class="mt-3 text-slate-700">${p.description}</p>
            </div>
        `).join('');

        return `
            <div class="max-w-7xl mx-auto px-4 py-8 fade-in">
                <div class="mb-6 border-b border-slate-200">
                    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                        <a href="#/dashboard" class="border-brand-500 text-brand-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Browse Opportunities</a>
                    </nav>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-2">
                         <h3 class="text-lg font-medium text-slate-900 mb-4">Active Business Ideas</h3>
                         <div class="grid grid-cols-1 gap-6">${ideaCards}</div>
                    </div>
                    <div class="md:col-span-1">
                        <div class="bg-white p-6 rounded-lg shadow mb-6 border-t-4 border-brand-500">
                             <h3 class="text-lg font-bold mb-4">Post Investment Intent</h3>
                             <form id="form-post-proposal" class="space-y-4">
                                <input type="text" name="title" placeholder="Headline (e.g. SaaS Funding)" required class="w-full border p-2 rounded text-sm">
                                <input type="text" name="investmentRange" placeholder="Range (e.g. ₹10k-₹50k)" required class="w-full border p-2 rounded text-sm">
                                <textarea name="description" placeholder="Details..." required class="w-full border p-2 rounded text-sm" rows="3"></textarea>
                                <button type="submit" class="w-full bg-brand-600 text-white py-2 rounded hover:bg-brand-700">Post</button>
                             </form>
                        </div>
                        <h3 class="text-lg font-medium text-slate-900 mb-4">My Proposals</h3>
                        <div>${proposalList || '<div class="bg-slate-50 p-4 rounded text-center text-slate-500 text-sm">No proposals yet.</div>'}</div>
                    </div>
                </div>
            </div>
        `;
    },

    dashboardBanker(loans) {
        let loanList;
        if (loans.length === 0) {
            loanList = `
                <div class="col-span-full bg-white p-12 rounded-lg border border-slate-200 border-dashed text-center">
                    <i class="fa-solid fa-building-columns text-slate-300 text-5xl mb-4"></i>
                    <h3 class="text-lg font-medium text-slate-900">No loan offers yet</h3>
                    <p class="text-slate-500">Create your first loan scheme above.</p>
                </div>
            `;
        } else {
            loanList = loans.map(loan => `
                 <div class="bg-white border border-slate-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i class="fa-solid fa-building-columns text-6xl text-blue-900"></i>
                    </div>
                    <div class="relative z-10">
                        <div class="flex items-center gap-2 mb-3">
                            <span class="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wide">
                                ${loan.bankName}
                            </span>
                        </div>
                        <h3 class="text-xl font-bold text-slate-900 mb-2">${loan.title}</h3>
                        <p class="text-slate-600 text-sm mb-4 line-clamp-2">${loan.description}</p>
                        
                        <div class="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-4">
                            <div>
                                <div class="text-xs text-slate-500 uppercase font-semibold">Interest</div>
                                <div class="font-bold text-blue-700">${loan.interestRate}%</div>
                            </div>
                             <div>
                                <div class="text-xs text-slate-500 uppercase font-semibold">Tenure</div>
                                <div class="font-bold text-slate-700">${loan.tenureMonths}m</div>
                            </div>
                             <div>
                                <div class="text-xs text-slate-500 uppercase font-semibold">Max Cap</div>
                                <div class="font-bold text-slate-700">${formatMoney(loan.maxAmount).replace('₹', '')}</div>
                            </div>
                        </div>
                    </div>
                 </div>
            `).join('');
        }

        return `
             <div class="max-w-7xl mx-auto px-4 py-8 fade-in space-y-8">
                <!-- Post Loan Section (Wide) -->
                <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div class="p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white flex items-center gap-3">
                        <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <i class="fa-solid fa-sack-dollar"></i>
                        </div>
                        <div>
                            <h2 class="text-blue-900 font-bold text-lg">Post Loan Scheme</h2>
                            <p class="text-xs text-blue-600">Create new financing options for entrepreneurs</p>
                        </div>
                    </div>
                    <div class="p-6">
                        <form id="form-post-loan">
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div class="md:col-span-2">
                                    <label class="block text-slate-700 text-sm font-semibold mb-1">Scheme Name</label>
                                    <input type="text" name="title" required class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5" placeholder="e.g. MSME Rapid Growth Fund">
                                </div>
                                <div class="md:col-span-1">
                                    <label class="block text-slate-700 text-sm font-semibold mb-1">Interest Rate (%)</label>
                                    <input type="number" step="0.1" name="interestRate" required class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5" placeholder="8.5">
                                </div>
                                <div class="md:col-span-1">
                                    <label class="block text-slate-700 text-sm font-semibold mb-1">Tenure (Months)</label>
                                    <input type="number" name="tenureMonths" required class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5" placeholder="36">
                                </div>
                                <div class="md:col-span-1">
                                    <label class="block text-slate-700 text-sm font-semibold mb-1">Max Amount (₹)</label>
                                    <input type="number" name="maxAmount" required class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5" placeholder="5000000">
                                </div>
                                <div class="md:col-span-3">
                                    <label class="block text-slate-700 text-sm font-semibold mb-1">Eligibility & Details</label>
                                    <textarea name="description" rows="1" required class="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2.5" placeholder="Briefly describe criteria and benefits..."></textarea>
                                </div>
                            </div>
                            <div class="flex justify-end border-t border-slate-100 pt-4">
                                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md shadow-sm transition-colors flex items-center gap-2">
                                    <i class="fa-solid fa-plus"></i> Publish Offer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- List Section -->
                <div>
                     <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div class="bg-blue-50 p-1.5 rounded text-blue-600"><i class="fa-solid fa-list-check"></i></div>
                        Active Loan Offers
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${loanList}
                    </div>
                </div>
             </div>
        `;
    },

    dashboardAdvisor(posts, queries = []) {
        // --- ADVISORY POSTS ---
        let postList;
        if (posts.length === 0) {
            postList = `<div class="p-8 text-center text-slate-500 bg-white shadow rounded-lg border border-dashed border-slate-300">No advisory posts yet.</div>`;
        } else {
            postList = posts.map(post => `
                <div class="bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg p-6 border border-slate-200">
                    <div class="flex justify-between items-start mb-3">
                       <div class="flex items-center gap-2">
                           <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <i class="fa-solid fa-user-tie"></i>
                           </div>
                           <div>
                               <h4 class="text-lg font-bold text-slate-900 leading-tight">${post.title}</h4>
                               <p class="text-xs text-slate-500">By ${post.authorName} • ${new Date(post.createdAt).toLocaleDateString()}</p>
                           </div>
                       </div>
                    </div>
                    <div class="text-slate-700 prose prose-sm max-w-none">${post.content}</div>
                </div>
            `).join('');
        }

        // --- QUERIES & SOLUTIONS ---
        let queryList;
        if (queries.length === 0) {
            queryList = `<div class="p-8 text-center text-slate-400 bg-slate-50 rounded-lg text-sm border border-dashed border-slate-300">No client queries pending.</div>`;
        } else {
            queryList = queries.map(q => {
                const existingSolutions = (q.solutions || []).map(s => `
                    <div class="ml-4 mt-2 p-3 bg-green-50 border-l-2 border-green-500 rounded text-sm text-slate-700">
                        <div class="text-xs font-bold text-green-800 mb-1">${s.authorName} answered:</div>
                        ${s.content}
                    </div>
                `).join('');

                return `
                <div class="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-4">
                    <div class="flex justify-between items-start">
                        <div>
                             <span class="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">QUERY</span>
                             <h4 class="font-bold text-slate-900 mt-1">${q.title}</h4>
                             <p class="text-xs text-slate-500">Asked by ${q.authorName}</p>
                        </div>
                    </div>
                    <p class="text-slate-700 text-sm mt-2 mb-3 bg-slate-50 p-2 rounded border border-slate-100">${q.content}</p>
                    
                    ${existingSolutions}

                    <!-- Post Solution Form -->
                    <div class="mt-4 pt-3 border-t border-slate-100">
                        <form class="form-post-solution flex gap-2">
                            <input type="hidden" name="queryId" value="${q.id}">
                            <input type="text" name="solution" placeholder="Type a solution..." required class="flex-grow text-sm border-slate-300 rounded px-2 py-1.5 border focus:ring-purple-500 focus:border-purple-500">
                            <button type="submit" class="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded">Post</button>
                        </form>
                    </div>
                </div>
            `}).join('');
        }

        return `
            <div class="max-w-7xl mx-auto px-4 py-8 fade-in">
                
                <!-- Share Knowledge Section (Moved to Top & Full Width) -->
                <div class="mb-10">
                    <div class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                        <div class="p-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-white flex items-center gap-2">
                             <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <i class="fa-solid fa-pen-nib"></i>
                             </div>
                             <div>
                                <h2 class="text-purple-900 font-bold text-lg">Share Knowledge</h2>
                                <p class="text-xs text-purple-600">Post articles and insights for the community</p>
                             </div>
                        </div>
                        <div class="p-6">
                            <form id="form-post-advisory" class="space-y-4">
                                <div>
                                    <label class="block text-slate-700 text-sm font-semibold mb-1">Topic / Title</label>
                                    <input type="text" name="title" required class="w-full rounded-md border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2.5" placeholder="e.g. 5 Investment Trends for 2024">
                                </div>
                                <div>
                                    <label class="block text-slate-700 text-sm font-semibold mb-1">Article Content</label>
                                    <textarea name="content" required rows="4" class="w-full rounded-md border-slate-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2.5" placeholder="Share your expertise..."></textarea>
                                </div>
                                <div class="flex justify-end pt-2">
                                    <button class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-8 rounded-md shadow-sm transition-colors flex items-center gap-2" type="submit">
                                        <i class="fa-solid fa-paper-plane"></i> Post Article
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <!-- Client Inquiries Section -->
                    <div id="section-queries">
                        <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div class="bg-orange-100 p-1.5 rounded text-orange-600"><i class="fa-solid fa-circle-question"></i></div>
                            Client Inquiries
                        </h3>
                        <div class="space-y-4">
                            ${queryList}
                        </div>
                    </div>

                    <!-- Recent Posts Section -->
                    <div id="section-posts">
                        <h3 class="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div class="bg-blue-100 p-1.5 rounded text-blue-600"><i class="fa-solid fa-newspaper"></i></div>
                            Recent Advisory Posts
                        </h3>
                        <div class="space-y-6">
                            ${postList}
                        </div>
                    </div>

                </div>
            </div>
        `;
    }
};
