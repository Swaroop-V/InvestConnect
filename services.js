
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, setDoc, doc, getDoc, updateDoc, arrayUnion, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import log from "https://cdn.jsdelivr.net/npm/loglevel@1.9.1/+esm";

/**
 * --- LOGGING CONFIGURATION ---
 * using loglevel library
 */
log.setLevel("info");
log.info("🚀 [System] Services module loaded.");

/**
 * --- FIREBASE CONFIGURATION ---
 */
const storedKey = localStorage.getItem('investconnect_api_key');

const firebaseConfig = {
    apiKey: storedKey || "AIzaSyCK6iGNb8Pw_Ccn62cVkl_ilJoM9UTPKqM", // Default placeholder
    authDomain: "invest-connect-159bb.firebaseapp.com",
    projectId: "invest-connect-159bb",
    storageBucket: "invest-connect-159bb.firebasestorage.app",
    messagingSenderId: "444618131883",
    appId: "1:444618131883:web:1ccba56820e0511767aaee"
};

// --- INITIALIZATION ---
let app, db, auth;

try {
    log.info("🔥 [Firebase] Initializing...");
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    log.info("✅ [Firebase] Initialized successfully.");
} catch (e) {
    log.error("❌ [Firebase] Initialization Error:", e);
}

/**
 * --- OPTIMIZATION: IN-MEMORY CACHE ---
 * Reduces Firestore reads and improves load times for frequent navigations.
 */
const CACHE_TTL = 5 * 60 * 1000; // 5 Minutes
const _cache = {
    ideas: { data: null, timestamp: 0 },
    proposals: { data: null, timestamp: 0 },
    loans: { data: null, timestamp: 0 },
    advisories: { data: null, timestamp: 0 },
    queries: { data: null, timestamp: 0 }
};

const getCached = (key) => {
    const item = _cache[key];
    const now = Date.now();
    if (item.data && (now - item.timestamp < CACHE_TTL)) {
        log.info(`⚡ [Cache] Serving '${key}' from memory.`);
        return item.data;
    }
    return null;
};

const setCache = (key, data) => {
    _cache[key] = {
        data: data,
        timestamp: Date.now()
    };
};

// Clear specific cache when a new item is posted
const invalidateCache = (key) => {
    if (_cache[key]) _cache[key].timestamp = 0;
};

export const services = {
    isLive() { return true; },

    updateApiKey(newKey) {
        if (!newKey) return;
        log.warn("🔑 [Auth] Updating API Key manually.");
        localStorage.setItem('investconnect_api_key', newKey.trim());
        window.location.reload();
    },

    resetApiKey() {
        log.warn("🔑 [Auth] Resetting API Key.");
        localStorage.removeItem('investconnect_api_key');
        window.location.reload();
    },

    /**
     * AUTHENTICATION
     */
    async signup({ name, email, password, role }) {
        log.info(`👤 [Auth] Signup attempt for email: ${email}, role: ${role}`);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        
        const userData = {
            uid: user.uid,
            name, 
            email, 
            role, 
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "users", user.uid), userData);
        log.info("✅ [Auth] Signup successful. UID:", user.uid);
        return { id: user.uid, ...userData };
    },

    async login(email, password) {
        log.info(`👤 [Auth] Login attempt for email: ${email}`);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        let role = 'ENTREPRENEUR';
        let name = user.displayName || 'User';

        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                role = data.role || role;
                name = data.name || name;
            } else {
                const q = query(collection(db, "users"), where("email", "==", email));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    role = data.role || role;
                    name = data.name || name;
                }
            }
        } catch (err) {
            log.error("❌ [Auth] Error fetching user profile:", err);
        }

        return { id: user.uid, name, email: user.email, role };
    },

    async logout() {
        log.info("👋 [Auth] Logging out...");
        await signOut(auth);
    },

    /**
     * FIRESTORE DATA METHODS (Optimized with Cache)
     */

    async getIdeas() {
        const cached = getCached('ideas');
        if (cached) return cached;

        log.info("📥 [DB] Fetching Ideas from Firestore...");
        const q = query(collection(db, "ideas"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setCache('ideas', data);
        return data;
    },

    async getIdeasByCategory(category) {
        // We can optimize this by filtering the already cached full list if available
        const cachedAll = getCached('ideas');
        if (cachedAll) {
            log.info(`⚡ [Cache] Filtering category '${category}' from cached ideas.`);
            return cachedAll.filter(idea => idea.category === category);
        }

        log.info(`📥 [DB] Fetching Ideas for category: ${category}...`);
        const q = query(collection(db, "ideas"), where("category", "==", category));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getIdeaById(id) {
        // Try to find in cache first
        const cachedAll = getCached('ideas');
        if (cachedAll) {
            const found = cachedAll.find(i => i.id === id);
            if (found) {
                log.info("⚡ [Cache] Found idea details in memory.");
                return found;
            }
        }

        log.info(`📥 [DB] Fetching Idea ID: ${id}...`);
        const docRef = doc(db, "ideas", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    },

    async postIdea(idea) {
        log.info("📤 [DB] Posting new Idea...", idea.title);
        const data = { ...idea, createdAt: new Date().toISOString() };
        const docRef = await addDoc(collection(db, "ideas"), data);
        invalidateCache('ideas'); // Clear cache to force refetch next time
        return { id: docRef.id, ...data };
    },

    async getProposals() {
        const cached = getCached('proposals');
        if (cached) return cached;

        log.info("📥 [DB] Fetching Proposals...");
        const q = query(collection(db, "proposals"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCache('proposals', data);
        return data;
    },

    async postProposal(proposal) {
        log.info("📤 [DB] Posting new Proposal...", proposal.title);
        const data = { ...proposal, createdAt: new Date().toISOString() };
        await addDoc(collection(db, "proposals"), data);
        invalidateCache('proposals');
        return data;
    },

    async getLoans() {
        const cached = getCached('loans');
        if (cached) return cached;

        log.info("📥 [DB] Fetching Loan Schemes...");
        const q = query(collection(db, "loans"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCache('loans', data);
        return data;
    },

    async postLoan(loan) {
        const data = { ...loan, createdAt: new Date().toISOString() };
        await addDoc(collection(db, "loans"), data);
        invalidateCache('loans');
        return data;
    },

    async getAdvisories() {
        const cached = getCached('advisories');
        if (cached) return cached;

        log.info("📥 [DB] Fetching Advisory Posts...");
        const q = query(collection(db, "advisories"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCache('advisories', data);
        return data;
    },

    async postAdvisory(post) {
        const data = { ...post, createdAt: new Date().toISOString() };
        await addDoc(collection(db, "advisories"), data);
        invalidateCache('advisories');
        return data;
    },

    async getQueries() {
        const cached = getCached('queries');
        if (cached) return cached;

        log.info("📥 [DB] Fetching Queries...");
        const q = query(collection(db, "queries"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCache('queries', data);
        return data;
    },

    async postQuery(queryData) {
        const data = { ...queryData, solutions: [], createdAt: new Date().toISOString() };
        await addDoc(collection(db, "queries"), data);
        invalidateCache('queries');
        return data;
    },

    async postSolution(queryId, solutionData) {
        const solution = { ...solutionData, createdAt: new Date().toISOString() };
        const qRef = doc(db, "queries", queryId);
        await updateDoc(qRef, {
            solutions: arrayUnion(solution)
        });
        invalidateCache('queries');
        return solution;
    }
};
