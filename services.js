
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
 * 
 * NOTE: The API Key below is a placeholder. 
 * If you see "auth/api-key-not-valid", the app will prompt you to enter your own key.
 * You can find it in Firebase Console -> Project Settings -> General.
 */

// Check if user has provided a custom key via the UI prompt
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
    // Continue execution so we can catch specific errors later (like invalid key)
}

export const services = {
    // Helper to check status
    isLive() {
        return true;
    },

    // NEW: Method to update API Key from UI
    updateApiKey(newKey) {
        if (!newKey) return;
        log.warn("🔑 [Auth] Updating API Key manually.");
        localStorage.setItem('investconnect_api_key', newKey.trim());
        window.location.reload();
    },

    // NEW: Method to clear API Key
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
        // 1. Create Authentication User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // 2. Update Auth Profile
        await updateProfile(user, { displayName: name });
        
        // 3. Create User Document in Firestore (To store Role)
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
        // 1. Authenticate with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Default values
        let role = 'ENTREPRENEUR';
        let name = user.displayName || 'User';
        let foundProfile = false;

        try {
            // 2. Fetch User Role from Firestore (Try UID match first)
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                role = data.role || role;
                name = data.name || name;
                foundProfile = true;
                log.debug("📄 [Auth] User profile retrieved from Firestore.");
            } else {
                // 3. Fallback: Try fetching by Email (In case of manual DB entry mismatch)
                log.warn("⚠️ [Auth] No document with UID found. Searching by email...");
                const q = query(collection(db, "users"), where("email", "==", email));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const data = querySnapshot.docs[0].data();
                    role = data.role || role;
                    name = data.name || name;
                    foundProfile = true;
                    log.info(`✅ [Auth] Found profile by email. Role: ${role}`);
                } else {
                    log.warn("⚠️ [Auth] User profile not found in Firestore. Defaulting to ENTREPRENEUR.");
                }
            }
        } catch (err) {
            log.error("❌ [Auth] Error fetching user profile:", err);
            // If this fails (e.g. permission denied), we still log the user in, 
            // but they might have the wrong role. 
        }

        log.info("✅ [Auth] Login successful.");
        return { id: user.uid, name, email: user.email, role };
    },

    async logout() {
        log.info("👋 [Auth] Logging out...");
        await signOut(auth);
        log.info("✅ [Auth] Logged out successfully.");
    },

    /**
     * FIRESTORE DATA METHODS
     */

    async getIdeas() {
        log.info("📥 [DB] Fetching Ideas...");
        const q = query(collection(db, "ideas"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        log.info(`✅ [DB] Retrieved ${snapshot.size} ideas.`);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getIdeasByCategory(category) {
        log.info(`📥 [DB] Fetching Ideas for category: ${category}...`);
        const q = query(collection(db, "ideas"), where("category", "==", category));
        const snapshot = await getDocs(q);
        log.info(`✅ [DB] Retrieved ${snapshot.size} ideas for ${category}.`);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async getIdeaById(id) {
        log.info(`📥 [DB] Fetching Idea ID: ${id}...`);
        const docRef = doc(db, "ideas", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            log.info("✅ [DB] Idea retrieved.");
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            log.warn("⚠️ [DB] Idea not found.");
            return null;
        }
    },

    async postIdea(idea) {
        log.info("📤 [DB] Posting new Idea...", idea.title);
        const data = { ...idea, createdAt: new Date().toISOString() };
        const docRef = await addDoc(collection(db, "ideas"), data);
        log.info("✅ [DB] Idea posted. ID:", docRef.id);
        return { id: docRef.id, ...data };
    },

    async getProposals() {
        log.info("📥 [DB] Fetching Proposals...");
        const q = query(collection(db, "proposals"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        log.info(`✅ [DB] Retrieved ${snapshot.size} proposals.`);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async postProposal(proposal) {
        log.info("📤 [DB] Posting new Proposal...", proposal.title);
        const data = { ...proposal, createdAt: new Date().toISOString() };
        await addDoc(collection(db, "proposals"), data);
        log.info("✅ [DB] Proposal posted.");
        return data;
    },

    async getLoans() {
        log.info("📥 [DB] Fetching Loan Schemes...");
        const q = query(collection(db, "loans"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        log.info(`✅ [DB] Retrieved ${snapshot.size} loans.`);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async postLoan(loan) {
        log.info("📤 [DB] Posting new Loan Scheme...", loan.title);
        const data = { ...loan, createdAt: new Date().toISOString() };
        await addDoc(collection(db, "loans"), data);
        log.info("✅ [DB] Loan Scheme posted.");
        return data;
    },

    async getAdvisories() {
        log.info("📥 [DB] Fetching Advisory Posts...");
        const q = query(collection(db, "advisories"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        log.info(`✅ [DB] Retrieved ${snapshot.size} advisory posts.`);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async postAdvisory(post) {
        log.info("📤 [DB] Posting new Advisory Article...", post.title);
        const data = { ...post, createdAt: new Date().toISOString() };
        await addDoc(collection(db, "advisories"), data);
        log.info("✅ [DB] Advisory Article posted.");
        return data;
    },

    async getQueries() {
        log.info("📥 [DB] Fetching Queries...");
        const q = query(collection(db, "queries"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        log.info(`✅ [DB] Retrieved ${snapshot.size} queries.`);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async postQuery(queryData) {
        log.info("📤 [DB] Posting new Query...", queryData.title);
        const data = { ...queryData, solutions: [], createdAt: new Date().toISOString() };
        await addDoc(collection(db, "queries"), data);
        log.info("✅ [DB] Query posted.");
        return data;
    },

    async postSolution(queryId, solutionData) {
        log.info(`📤 [DB] Posting solution for Query ID: ${queryId}`);
        const solution = { ...solutionData, createdAt: new Date().toISOString() };
        const qRef = doc(db, "queries", queryId);
        await updateDoc(qRef, {
            solutions: arrayUnion(solution)
        });
        log.info("✅ [DB] Solution added.");
        return solution;
    }
};
