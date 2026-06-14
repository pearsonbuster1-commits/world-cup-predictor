import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, collection, setDoc, addDoc, updateDoc, onSnapshot, getDocs, writeBatch } from 'firebase/firestore';
import { Trophy, ShieldCheck, ListTodo, UserPlus, Users, RotateCcw, Save, Trash2, ShieldAlert, Zap, Compass, CheckCircle2, AlertCircle } from 'lucide-react';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyABdGCDj_W0ihlCAnTlbqhcSlLz2hHIFbA",
  authDomain: "world-cup-predictor-80f93.firebaseapp.com",
  projectId: "world-cup-predictor-80f93",
  storageBucket: "world-cup-predictor-80f93.firebasestorage.app",
  messagingSenderId: "159280600500",
  appId: "1:159280600500:web:3b2d2e13c5a9013e4d0ee1"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'world-cup-2026-predictor';

// Seed initial World Cup 2026 matches
const INITIAL_MATCHES = [
  { id: 'm1', homeTeam: 'Mexico', awayTeam: 'South Africa', group: 'Group A', date: '2026-06-11', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm2', homeTeam: 'South Korea', awayTeam: 'Czechia', group: 'Group A', date: '2026-06-11', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm3', homeTeam: 'Canada', awayTeam: 'Bosnia and Herzegovina', group: 'Group B', date: '2026-06-12', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm4', homeTeam: 'United States', awayTeam: 'Paraguay', group: 'Group D', date: '2026-06-12', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm5', homeTeam: 'Qatar', awayTeam: 'Switzerland', group: 'Group B', date: '2026-06-13', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm6', homeTeam: 'Brazil', awayTeam: 'Morocco', group: 'Group C', date: '2026-06-13', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm7', homeTeam: 'Haiti', awayTeam: 'Scotland', group: 'Group C', date: '2026-06-13', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm8', homeTeam: 'Australia', awayTeam: 'Türkiye', group: 'Group D', date: '2026-06-13', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm9', homeTeam: 'Germany', awayTeam: 'Curaçao', group: 'Group E', date: '2026-06-14', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm10', homeTeam: 'Netherlands', awayTeam: 'Japan', group: 'Group F', date: '2026-06-14', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm11', homeTeam: "Côte d'Ivoire", awayTeam: 'Ecuador', group: 'Group E', date: '2026-06-14', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm12', homeTeam: 'Sweden', awayTeam: 'Tunisia', group: 'Group F', date: '2026-06-14', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm13', homeTeam: 'Spain', awayTeam: 'Cabo Verde', group: 'Group H', date: '2026-06-15', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm14', homeTeam: 'Belgium', awayTeam: 'Egypt', group: 'Group G', date: '2026-06-15', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm15', homeTeam: 'Saudi Arabia', awayTeam: 'Uruguay', group: 'Group H', date: '2026-06-15', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm16', homeTeam: 'Iran', awayTeam: 'New Zealand', group: 'Group G', date: '2026-06-15', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm17', homeTeam: 'France', awayTeam: 'Senegal', group: 'Group I', date: '2026-06-16', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm18', homeTeam: 'Iraq', awayTeam: 'Norway', group: 'Group I', date: '2026-06-16', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm19', homeTeam: 'Argentina', awayTeam: 'Algeria', group: 'Group J', date: '2026-06-16', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm20', homeTeam: 'Austria', awayTeam: 'Jordan', group: 'Group J', date: '2026-06-16', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm21', homeTeam: 'Portugal', awayTeam: 'DR Congo', group: 'Group K', date: '2026-06-17', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm22', homeTeam: 'England', awayTeam: 'Croatia', group: 'Group L', date: '2026-06-17', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm23', homeTeam: 'Ghana', awayTeam: 'Panama', group: 'Group L', date: '2026-06-17', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm24', homeTeam: 'Uzbekistan', awayTeam: 'Colombia', group: 'Group K', date: '2026-06-17', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm25', homeTeam: 'Czechia', awayTeam: 'South Africa', group: 'Group A', date: '2026-06-18', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm26', homeTeam: 'Switzerland', awayTeam: 'Bosnia and Herzegovina', group: 'Group B', date: '2026-06-18', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm27', homeTeam: 'Canada', awayTeam: 'Qatar', group: 'Group B', date: '2026-06-18', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm28', homeTeam: 'Mexico', awayTeam: 'South Korea', group: 'Group A', date: '2026-06-18', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm29', homeTeam: 'United States', awayTeam: 'Australia', group: 'Group D', date: '2026-06-19', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm30', homeTeam: 'Scotland', awayTeam: 'Morocco', group: 'Group C', date: '2026-06-19', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm31', homeTeam: 'Brazil', awayTeam: 'Haiti', group: 'Group C', date: '2026-06-19', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm32', homeTeam: 'Türkiye', awayTeam: 'Paraguay', group: 'Group D', date: '2026-06-19', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm33', homeTeam: 'Netherlands', awayTeam: 'Sweden', group: 'Group F', date: '2026-06-20', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm34', homeTeam: 'Germany', awayTeam: 'Ivory Coast', group: 'Group E', date: '2026-06-20', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm35', homeTeam: 'Ecuador', awayTeam: 'Curaçao', group: 'Group E', date: '2026-06-20', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm36', homeTeam: 'Tunisia', awayTeam: 'Japan', group: 'Group F', date: '2026-06-20', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm37', homeTeam: 'Spain', awayTeam: 'Saudi Arabia', group: 'Group H', date: '2026-06-21', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm38', homeTeam: 'Belgium', awayTeam: 'Iran', group: 'Group G', date: '2026-06-21', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm39', homeTeam: 'Uruguay', awayTeam: 'Cape Verde', group: 'Group H', date: '2026-06-21', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm40', homeTeam: 'New Zealand', awayTeam: 'Egypt', group: 'Group G', date: '2026-06-21', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm41', homeTeam: 'Argentina', awayTeam: 'Austria', group: 'Group J', date: '2026-06-22', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm42', homeTeam: 'Iraq', awayTeam: 'France', group: 'Group I', date: '2026-06-22', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm43', homeTeam: 'Norway', awayTeam: 'Senegal', group: 'Group I', date: '2026-06-22', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm44', homeTeam: 'Jordan', awayTeam: 'Algeria', group: 'Group J', date: '2026-06-22', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm45', homeTeam: 'Portugal', awayTeam: 'Uzbekistan', group: 'Group K', date: '2026-06-23', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm46', homeTeam: 'England', awayTeam: 'Ghana', group: 'Group L', date: '2026-06-23', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm47', homeTeam: 'Panama', awayTeam: 'Croatia', group: 'Group L', date: '2026-06-23', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm48', homeTeam: 'Colombia', awayTeam: 'DR Congo', group: 'Group K', date: '2026-06-23', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm49', homeTeam: 'Czechia', awayTeam: 'Mexico', group: 'Group A', date: '2026-06-24', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm50', homeTeam: 'South Africa', awayTeam: 'South Korea', group: 'Group A', date: '2026-06-24', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm51', homeTeam: 'Switzerland', awayTeam: 'Canada', group: 'Group B', date: '2026-06-24', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm52', homeTeam: 'Bosnia and Herzegovina', awayTeam: 'Qatar', group: 'Group B', date: '2026-06-24', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm53', homeTeam: 'Scotland', awayTeam: 'Brazil', group: 'Group C', date: '2026-06-24', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm54', homeTeam: 'Morocco', awayTeam: 'Haiti', group: 'Group C', date: '2026-06-24', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm55', homeTeam: 'Australia', awayTeam: 'United States', group: 'Group D', date: '2026-06-25', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm56', homeTeam: 'Paraguay', awayTeam: 'Türkiye', group: 'Group D', date: '2026-06-25', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm57', homeTeam: 'Ecuador', awayTeam: 'Germany', group: 'Group E', date: '2026-06-25', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm58', homeTeam: 'Curaçao', awayTeam: 'Ivory Coast', group: 'Group E', date: '2026-06-25', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm59', homeTeam: 'Tunisia', awayTeam: 'Netherlands', group: 'Group F', date: '2026-06-25', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm60', homeTeam: 'Japan', awayTeam: 'Sweden', group: 'Group F', date: '2026-06-25', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm61', homeTeam: 'Iran', awayTeam: 'Belgium', group: 'Group G', date: '2026-06-26', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm62', homeTeam: 'New Zealand', awayTeam: 'Egypt', group: 'Group G', date: '2026-06-26', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm63', homeTeam: 'Uruguay', awayTeam: 'Spain', group: 'Group H', date: '2026-06-26', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm64', homeTeam: 'Cape Verde', awayTeam: 'Saudi Arabia', group: 'Group H', date: '2026-06-26', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm65', homeTeam: 'France', awayTeam: 'Norway', group: 'Group I', date: '2026-06-26', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm66', homeTeam: 'Iraq', awayTeam: 'Senegal', group: 'Group I', date: '2026-06-26', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm67', homeTeam: 'Panama', awayTeam: 'England', group: 'Group L', date: '2026-06-27', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm68', homeTeam: 'Croatia', awayTeam: 'Ghana', group: 'Group L', date: '2026-06-27', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm69', homeTeam: 'Algeria', awayTeam: 'Austria', group: 'Group J', date: '2026-06-27', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm70', homeTeam: 'Jordan', awayTeam: 'Argentina', group: 'Group J', date: '2026-06-27', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm71', homeTeam: 'Colombia', awayTeam: 'Portugal', group: 'Group K', date: '2026-06-27', status: 'scheduled', actualHomeScore: null, actualAwayScore: null },
  { id: 'm72', homeTeam: 'DR Congo', awayTeam: 'Uzbekistan', group: 'Group K', date: '2026-06-27', status: 'scheduled', actualHomeScore: null, actualAwayScore: null }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('predictions'); // predictions, results, leaderboard
  const [groupId, setGroupId] = useState('friends');
  const [players, setPlayers] = useState([]);
  const [currentPlayerId, setCurrentPlayerId] = useState(() => localStorage.getItem('wc_player_id') || '');
  const [matches, setMatches] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [tempPredictions, setTempPredictions] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Store admin score updates for matches in a single state object rather than calling useState inside loops
  const [adminScores, setAdminScores] = useState({});

  // Custom match creator form state (Admin Screen)
  const [newMatch, setNewMatch] = useState({
    homeTeam: '',
    awayTeam: '',
    group: 'Group A',
    date: new Date().toISOString().split('T')[0]
  });

  // 1. Initial Authentication & Loading Setup
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth failed:", err);
        showFeedback('error', 'Database connection error. Try reloading.');
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Load and Sync Database once authenticated
  useEffect(() => {
    if (!user) return;

    // Database collections paths matching Rule 1
    const playersRef = collection(db, 'artifacts', appId, 'public', 'data', 'players');
    const matchesRef = collection(db, 'artifacts', appId, 'public', 'data', 'matches');
    const predictionsRef = collection(db, 'artifacts', appId, 'public', 'data', 'predictions');

    // Subscribe to Players
    const unsubPlayers = onSnapshot(playersRef, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlayers(list);
    }, (err) => console.error("Players load error:", err));

    // Subscribe to Matches
    const unsubMatches = onSnapshot(matchesRef, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (list.length === 0) {
        // Run seed function if database is fresh
        seedInitialMatches();
      } else {
        // Sort matches chronologically
        const sorted = list.sort((a, b) => new Date(a.date) - new Date(b.date));
        setMatches(sorted);

        // Pre-fill admin score editing fields safely outside maps
        const initialAdminScores = {};
        sorted.forEach(m => {
          initialAdminScores[m.id] = {
            home: m.actualHomeScore !== null ? m.actualHomeScore : 0,
            away: m.actualAwayScore !== null ? m.actualAwayScore : 0
          };
        });
        setAdminScores(prev => ({ ...initialAdminScores, ...prev }));
      }
    }, (err) => console.error("Matches load error:", err));

    // Subscribe to All Predictions
    const unsubPredictions = onSnapshot(predictionsRef, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPredictions(list);
    }, (err) => console.error("Predictions load error:", err));

    return () => {
      unsubPlayers();
      unsubMatches();
      unsubPredictions();
    };
  }, [user]);

  // Sync current player selection to LocalStorage for device convenience
  useEffect(() => {
    if (currentPlayerId) {
      localStorage.setItem('wc_player_id', currentPlayerId);
    }
  }, [currentPlayerId]);

  // Seed Initial Match Schedule to Database
  const seedInitialMatches = async () => {
    try {
      const batch = writeBatch(db);
      INITIAL_MATCHES.forEach((m) => {
        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'matches', m.id);
        batch.set(docRef, m);
      });
      await batch.commit();
    } catch (err) {
      console.error("Failed to seed match schedule:", err);
    }
  };

  // UI Feedback Helper
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  // Register a new player
  const handleAddPlayer = async (e) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    try {
      const playerId = crypto.randomUUID();
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'players', playerId);
      await setDoc(docRef, {
      id: playerId,
     name: newPlayerName.trim(),
      groupId: groupId,   // ✅ ADD THIS LINE
     createdAt: new Date().toISOString()
});
      setCurrentPlayerId(playerId);
      setNewPlayerName('');
      showFeedback('success', `Created profile for ${newPlayerName.trim()}!`);
    } catch (err) {
      console.error("Failed to register player:", err);
      showFeedback('error', 'Could not create player. Try again.');
    }
  };

  // Handler for temporary score changes in UI
  const handleTempPredChange = (matchId, side, value) => {
    const val = value === '' ? '' : parseInt(value, 10);
    setTempPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [side]: val
      }
    }));
  };

  // Handler for score keeper form updates safely
  const handleAdminScoreChange = (matchId, side, value) => {
    const val = value === '' ? 0 : parseInt(value, 10);
    setAdminScores(prev => ({
      ...prev,
      [matchId]: {
        ...(prev[matchId] || { home: 0, away: 0 }),
        [side]: val
      }
    }));
  };

  // Save single match prediction
  const savePrediction = async (matchId) => {
    if (!currentPlayerId) {
      showFeedback('error', 'Please select or create your player profile first!');
      return;
    }

    const matchPred = tempPredictions[matchId];
    if (matchPred === undefined || matchPred.home === undefined || matchPred.away === undefined || matchPred.home === '' || matchPred.away === '') {
      showFeedback('error', 'Please enter goals for both teams!');
      return;
    }

    try {
      const predId = `${currentPlayerId}_${matchId}`;
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'predictions', predId);
      await setDoc(docRef, {
        id: predId,
        playerId: currentPlayerId,
        matchId: matchId,
        predictedHomeScore: matchPred.home,
        predictedAwayScore: matchPred.away,
        updatedAt: new Date().toISOString()
      });
      showFeedback('success', 'Prediction saved successfully!');
    } catch (err) {
      console.error("Save prediction failed:", err);
      showFeedback('error', 'Failed to save to database.');
    }
  };

  // Admin: Update Match Score Keepers
  const saveActualScore = async (matchId, homeScore, awayScore, isCompleted) => {
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'matches', matchId);
      await updateDoc(docRef, {
        actualHomeScore: isCompleted ? parseInt(homeScore, 10) : null,
        actualAwayScore: isCompleted ? parseInt(awayScore, 10) : null,
        status: isCompleted ? 'completed' : 'scheduled'
      });
      showFeedback('success', 'Match results updated!');
    } catch (err) {
      console.error("Update match status failed:", err);
      showFeedback('error', 'Failed to update match data.');
    }
  };

  // Admin: Create custom extra match
  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!newMatch.homeTeam.trim() || !newMatch.awayTeam.trim()) {
      showFeedback('error', 'Both team names are required.');
      return;
    }
    try {
      const matchId = 'm_' + Date.now();
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'matches', matchId);
      await setDoc(docRef, {
        id: matchId,
        homeTeam: newMatch.homeTeam.trim(),
        awayTeam: newMatch.awayTeam.trim(),
        group: newMatch.group,
        date: newMatch.date,
        status: 'scheduled',
        actualHomeScore: null,
        actualAwayScore: null
      });
      setNewMatch({ homeTeam: '', awayTeam: '', group: 'Group A', date: new Date().toISOString().split('T')[0] });
      showFeedback('success', 'Added a new fixture!');
    } catch (err) {
      console.error("Error creating match:", err);
      showFeedback('error', 'Could not create fixture.');
    }
  };

  // Reset entire database tournament configuration
  const handleResetTournament = async () => {
    if (!window.confirm("Are you sure you want to restore default World Cup 2026 fixtures? This resets actual scores (your predictions remain).")) return;
    try {
      await seedInitialMatches();
      showFeedback('success', 'Fixtures restored to default.');
    } catch (err) {
      console.error(err);
    }
  };

  // Core Scoring Logic Function
  const calculatePoints = (pred, actual) => {
    if (actual.status !== 'completed') return { points: 0, type: 'pending' };

    const pH = pred.predictedHomeScore;
    const pA = pred.predictedAwayScore;
    const aH = actual.actualHomeScore;
    const aY = actual.actualAwayScore;

    // Exact Match Logic
    if (pH === aH && pA === aY) {
      return { points: 3, type: 'exact' };
    }

    // Outcome Check Logic
    const predictedOutcome = Math.sign(pH - pA);
    const actualOutcome = Math.sign(aH - aY);

    if (predictedOutcome === actualOutcome) {
      return { points: 1, type: 'outcome' };
    }

    return { points: 0, type: 'incorrect' };
  };

  // Helper to compile leaderboard scores in local memory
  const getLeaderboard = () => {
    const groupPlayers = players.filter(p => p.groupId === groupId);
     return groupPlayers.map(p => {
      let score = 0;
      let exactCount = 0;
      let outcomeCount = 0;
      let playedCount = 0;

      // Get predictions for this player
      const pPreds = predictions.filter(pred => pred.playerId === p.id);

      pPreds.forEach(pred => {
        const match = matches.find(m => m.id === pred.matchId);
        if (match && match.status === 'completed') {
          const result = calculatePoints(pred, match);
          score += result.points;
          playedCount++;
          if (result.type === 'exact') exactCount++;
          if (result.type === 'outcome') outcomeCount++;
        }
      });

      return {
        ...p,
        totalPoints: score,
        exactCount,
        outcomeCount,
        playedCount
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints || b.exactCount - a.exactCount);
  };

  const leaderboard = getLeaderboard();
  const currentPlayer = players.find(p => p.id === currentPlayerId);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased">
      {/* Dynamic Alert Banner */}
      {feedback.message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 border transition-all duration-300 transform scale-100 ${
          feedback.type === 'success' ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200' : 'bg-rose-950/90 border-rose-500 text-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800 via-teal-950 to-slate-900 border-b border-teal-800/40 sticky top-0 z-40 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl shadow-md transform rotate-3">
              <Trophy className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                FIFA 2026 <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-amber-300">PREDICTOR</span>
              </h1>
              <p className="text-xs text-teal-200/80 font-medium">Head-to-Head Friendly Challenge Dashboard</p>
            </div>
          </div>

          {/* Quick Player Profile Selector */}
          <div className="flex items-center gap-3 bg-slate-800/80 p-2 rounded-xl border border-teal-800/30 w-full md:w-auto">

          <Users className="w-5 h-5 text-teal-400 flex-shrink-0" />

         {/* Player selector */}
          <select
          className="bg-transparent text-slate-100 text-sm font-semibold focus:outline-none"
          value={currentPlayerId}
         onChange={(e) => setCurrentPlayerId(e.target.value)}
          >
         <option value="" className="text-slate-900">Select Player Profile...</option>
         {players
         .filter(p => p.groupId === groupId)
          .map(p => (
         <option key={p.id} value={p.id} className="text-slate-900">
        ⚽ {p.name}
         </option>
))}
        </select>

      {/* Group selector */}
      <select
       value={groupId}
       onChange={(e) => setGroupId(e.target.value)}
       className="bg-transparent text-slate-100 text-sm font-semibold focus:outline-none"
       >
       <option value="friends">👬 Friends</option>
        <option value="family">👨‍👩‍👧 Family</option>
        </select>
        </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 flex flex-col gap-6">
        
        {/* Onboarding Profile Step if no current player exists */}
        {!currentPlayer && (
          <div className="bg-gradient-to-br from-teal-950/80 to-slate-900 p-8 rounded-3xl border border-teal-500/30 shadow-2xl flex flex-col items-center justify-center max-w-lg mx-auto my-12 text-center">
            <div className="w-16 h-16 bg-teal-500/10 rounded-full flex items-center justify-center mb-4 border border-teal-500/20">
              <UserPlus className="w-8 h-8 text-teal-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Create Your Cup Identity</h2>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Welcome! Register your profile so you can start predicting and compete synchronously. Tell your friend to join using this exact link.
            </p>
            <form onSubmit={handleAddPlayer} className="w-full flex flex-col gap-3">
              <input
                type="text"
                placeholder="Enter your name (e.g., Alex, Jordan)"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                maxLength={20}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-slate-100 outline-none text-center font-medium"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 font-bold rounded-xl shadow-lg shadow-teal-500/20 transition-all text-slate-950"
              >
                Let's Play Predictor!
              </button>
            </form>

            {players.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-800 w-full">
                <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-bold">Or select an existing player</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {players.map(p => (
                    <button
                      key={p.id}
                      onClick={() => setCurrentPlayerId(p.id)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-xl text-sm font-semibold transition"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Game Content Dashboard */}
        {currentPlayer && (
          <div className="flex flex-col gap-6">
            
            {/* Quick Player Greeting Banner */}
            <div className="bg-gradient-to-r from-teal-950/40 to-emerald-950/20 px-5 py-3 rounded-2xl border border-teal-800/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-300">
                  Playing as: <strong className="text-teal-400 text-base">{currentPlayer.name}</strong>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Not you?</span>
                <button
                  onClick={() => setCurrentPlayerId('')}
                  className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold flex items-center gap-1 transition"
                >
                  Change Profile
                </button>
              </div>
            </div>

            {/* Desktop and Mobile Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('predictions')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all duration-200 ${
                  activeTab === 'predictions'
                    ? 'bg-gradient-to-r from-teal-800/80 to-teal-900/80 text-teal-200 border border-teal-700/30 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <ListTodo className="w-4 h-4" />
                <span>1. Predict Matches</span>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all duration-200 ${
                  activeTab === 'results'
                    ? 'bg-gradient-to-r from-teal-800/80 to-teal-900/80 text-teal-200 border border-teal-700/30 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>2. Match Center (Admin)</span>
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all duration-200 ${
                  activeTab === 'leaderboard'
                    ? 'bg-gradient-to-r from-teal-800/80 to-teal-900/80 text-teal-200 border border-teal-700/30 shadow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>3. Leaderboard & Stats</span>
              </button>
            </div>

            {/* SCREEN 1: PREDICTIONS PANEL */}
            {activeTab === 'predictions' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                      Make Your World Cup Predictions
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Predict final scores. Earn 3pts for exact predictions, 1pt for correctly choosing the match outcome (win/loss/draw).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matches.map(m => {
                    const myPred = predictions.find(p => p.playerId === currentPlayerId && p.matchId === m.id);
                    const isLocked = m.status === 'completed';
                    
                    const tempHome = tempPredictions[m.id]?.home !== undefined 
                      ? tempPredictions[m.id]?.home 
                      : (myPred ? myPred.predictedHomeScore : '');
                    
                    const tempAway = tempPredictions[m.id]?.away !== undefined 
                      ? tempPredictions[m.id]?.away 
                      : (myPred ? myPred.predictedAwayScore : '');

                    const hasChanges = (myPred?.predictedHomeScore !== tempHome || myPred?.predictedAwayScore !== tempAway) && tempHome !== '' && tempAway !== '';

                    return (
                      <div key={m.id} className={`bg-slate-800/60 p-5 rounded-2xl border transition shadow-sm ${
                        isLocked ? 'border-slate-800/90 opacity-90' : 'border-slate-700/40 hover:border-slate-700'
                      }`}>
                        {/* Match Meta */}
                        <div className="flex justify-between items-center text-xs text-slate-400 mb-3 font-semibold pb-2 border-b border-slate-700/30">
                          <span>📅 {m.date} • {m.group}</span>
                          {isLocked ? (
                            <span className="bg-slate-900 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                              Locked
                            </span>
                          ) : (
                            <span className="text-emerald-400 flex items-center gap-1 font-bold">
                              ● Open
                            </span>
                          )}
                        </div>

                        {/* Match Predictor Block */}
                        <div className="flex items-center justify-between gap-4 py-2">
                          
                          {/* Home Team */}
                          <div className="flex-1 text-center">
                            <span className="block text-sm font-black text-slate-200">{m.homeTeam}</span>
                          </div>

                          {/* Prediction Form Fields */}
                          <div className="flex items-center justify-center gap-2">
                            <input
                              type="number"
                              min="0"
                              disabled={isLocked}
                              placeholder="-"
                              value={tempHome}
                              onChange={(e) => handleTempPredChange(m.id, 'home', e.target.value)}
                              className="w-12 h-12 bg-slate-950 border border-slate-700 rounded-xl text-center text-xl font-bold focus:border-teal-500 text-slate-100 disabled:opacity-50 disabled:bg-slate-900 disabled:border-slate-800"
                            />
                            <span className="text-slate-500 font-bold text-sm">vs</span>
                            <input
                              type="number"
                              min="0"
                              disabled={isLocked}
                              placeholder="-"
                              value={tempAway}
                              onChange={(e) => handleTempPredChange(m.id, 'away', e.target.value)}
                              className="w-12 h-12 bg-slate-950 border border-slate-700 rounded-xl text-center text-xl font-bold focus:border-teal-500 text-slate-100 disabled:opacity-50 disabled:bg-slate-900 disabled:border-slate-800"
                            />
                          </div>

                          {/* Away Team */}
                          <div className="flex-1 text-center">
                            <span className="block text-sm font-black text-slate-200">{m.awayTeam}</span>
                          </div>

                        </div>

                        {/* Lock / Points Earned View */}
                        <div className="mt-4 pt-3 border-t border-slate-700/30 flex justify-between items-center text-xs">
                          <div>
                            {isLocked ? (
                              <div className="text-slate-300 font-medium">
                                Actual Result: <strong className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">{m.actualHomeScore} - {m.actualAwayScore}</strong>
                              </div>
                            ) : (
                              <span className="text-slate-400">
                                {myPred ? 'Prediction saved!' : 'Not predicted yet'}
                              </span>
                            )}
                          </div>

                          {/* Save Trigger / Points Info */}
                          {isLocked ? (
                            (() => {
                              if (!myPred) return <span className="text-rose-400 font-bold">No prediction</span>;
                              const res = calculatePoints(myPred, m);
                              return (
                                <span className={`px-2 py-1 rounded font-black text-xs ${
                                  res.points === 3 ? 'bg-amber-950 text-amber-300 border border-amber-500' :
                                  res.points === 1 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' :
                                  'bg-slate-900 text-slate-400'
                                }`}>
                                  ⭐ {res.points} Points Earned
                                </span>
                              );
                            })()
                          ) : (
                            <button
                              onClick={() => savePrediction(m.id)}
                              disabled={!hasChanges}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                hasChanges
                                  ? 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow shadow-teal-500/20'
                                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                              }`}
                            >
                              <Save className="w-3.5 h-3.5" />
                              Save
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SCREEN 2: MATCH CENTER / RESULTS SETTER */}
            {activeTab === 'results' && (
              <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-800/80 flex flex-col gap-6">
                
                {/* Admin Mode Lock warning */}
                <div className="bg-gradient-to-r from-amber-950/40 to-slate-900 p-4 rounded-2xl border border-amber-800/30 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-6 h-6 text-amber-500 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-sm text-amber-200">Official Score Keeper Controls</h3>
                      <p className="text-xs text-slate-400">Activate Keeper mode to declare final matches scores & calculate players predictions results.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAdmin(!isAdmin)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isAdmin 
                        ? 'bg-amber-500 text-slate-950 font-black shadow shadow-amber-500/20' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isAdmin ? '🔒 Lock Controls' : '🔓 Unlock Scores'}
                  </button>
                </div>

                {isAdmin ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel: Manage Existing Results */}
                    <div className="lg:col-span-2 flex flex-col gap-4">
                      <h3 className="font-bold text-slate-300 text-sm border-b border-slate-700/40 pb-2">Match List Score Keeper</h3>
                      
                      <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {matches.map(m => {
                          const currentHomeScore = adminScores[m.id]?.home !== undefined ? adminScores[m.id].home : (m.actualHomeScore ?? 0);
                          const currentAwayScore = adminScores[m.id]?.away !== undefined ? adminScores[m.id].away : (m.actualAwayScore ?? 0);

                          return (
                            <div key={m.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                              <div className="flex-1">
                                <span className="block text-xs font-bold text-slate-500">{m.date} • {m.group}</span>
                                <span className="text-sm font-bold text-slate-200">{m.homeTeam} vs {m.awayTeam}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <input
                                  type="number"
                                  min="0"
                                  value={currentHomeScore}
                                  onChange={(e) => handleAdminScoreChange(m.id, 'home', e.target.value)}
                                  className="w-12 h-10 bg-slate-800 text-center rounded font-bold text-sm text-slate-100"
                                />
                                <span className="text-slate-500 text-xs">to</span>
                                <input
                                  type="number"
                                  min="0"
                                  value={currentAwayScore}
                                  onChange={(e) => handleAdminScoreChange(m.id, 'away', e.target.value)}
                                  className="w-12 h-10 bg-slate-800 text-center rounded font-bold text-sm text-slate-100"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => saveActualScore(m.id, currentHomeScore, currentAwayScore, true)}
                                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-bold text-slate-950 transition"
                                >
                                  Save & Complete
                                </button>
                                {m.status === 'completed' && (
                                  <button
                                    onClick={() => saveActualScore(m.id, 0, 0, false)}
                                    className="p-2 bg-rose-950 hover:bg-rose-900 rounded text-rose-300 border border-rose-500/20"
                                    title="Mark match as not played yet"
                                  >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="pt-4 border-t border-slate-700/30 flex justify-between">
                        <button
                          onClick={handleResetTournament}
                          className="px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Restore Fixtures
                        </button>
                      </div>
                    </div>

                    {/* Right Panel: Add custom match */}
                    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                      <h3 className="font-bold text-slate-300 text-sm border-b border-slate-800 pb-3 mb-4">Add Custom Fixture</h3>
                      <form onSubmit={handleCreateMatch} className="flex flex-col gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1">Home Team</label>
                          <input
                            type="text"
                            placeholder="Home Country Name"
                            value={newMatch.homeTeam}
                            onChange={(e) => setNewMatch(prev => ({ ...prev, homeTeam: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-800 rounded border border-slate-700 text-sm focus:border-teal-500 outline-none text-slate-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-1">Away Team</label>
                          <input
                            type="text"
                            placeholder="Away Country Name"
                            value={newMatch.awayTeam}
                            onChange={(e) => setNewMatch(prev => ({ ...prev, awayTeam: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-800 rounded border border-slate-700 text-sm focus:border-teal-500 outline-none text-slate-100"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Group Stage</label>
                            <select
                              value={newMatch.group}
                              onChange={(e) => setNewMatch(prev => ({ ...prev, group: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-800 rounded border border-slate-700 text-sm focus:border-teal-500 outline-none text-slate-100"
                            >
                              {Array.from({ length: 12 }, (_, i) => String.fromCharCode(65 + i)).map(grp => (
                                <option key={grp} value={`Group ${grp}`} className="text-slate-900">{`Group ${grp}`}</option>
                              ))}
                              <option value="Round of 32" className="text-slate-900">Round of 32</option>
                              <option value="Round of 16" className="text-slate-900">Round of 16</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">Date</label>
                            <input
                              type="date"
                              value={newMatch.date}
                              onChange={(e) => setNewMatch(prev => ({ ...prev, date: e.target.value }))}
                              className="w-full px-3 py-2 bg-slate-800 rounded border border-slate-700 text-sm focus:border-teal-500 outline-none text-slate-100"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full mt-2 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-sm shadow transition-all"
                        >
                          Add Custom Game
                        </button>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8 border border-slate-800 rounded-2xl bg-slate-900/60 my-6">
                    <ShieldAlert className="w-12 h-12 text-slate-500 mb-3" />
                    <h3 className="font-bold text-slate-200">Admin Mode Locked</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Declare results on this screen. Click "Unlock Scores" above to add scores when games finish. Both friends share the updates in real time.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SCREEN 3: LEADERBOARD & STATS VIEW */}
            {activeTab === 'leaderboard' && (
              <div className="flex flex-col gap-6">
                
                {/* Score Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {leaderboard.map((p, idx) => (
                    <div key={p.id} className={`p-5 rounded-2xl border ${
                      idx === 0 
                        ? 'bg-gradient-to-br from-amber-950/30 to-slate-900 border-amber-500/30 shadow shadow-amber-500/5' 
                        : 'bg-slate-800/50 border-slate-800'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rank #{idx + 1}</span>
                        {idx === 0 && <Trophy className="w-4 h-4 text-amber-400 animate-bounce" />}
                      </div>
                      <h4 className="text-lg font-black text-slate-200">{p.name}</h4>
                      <div className="text-3xl font-black mt-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                        {p.totalPoints} <span className="text-sm font-medium text-slate-400">points</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800 text-center text-xs">
                        <div className="bg-slate-900/60 p-2 rounded-lg">
                          <span className="block text-amber-400 font-black">{p.exactCount}</span>
                          <span className="text-[10px] text-slate-500">Exact scores (3pt)</span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-lg">
                          <span className="block text-emerald-400 font-black">{p.outcomeCount}</span>
                          <span className="text-[10px] text-slate-500">Outcomes (1pt)</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Head-to-Head Predictions Comparison Grid */}
                <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-800/80">
                  <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-teal-400" />
                    <span>Head-to-Head Game Comparisons</span>
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                      <thead>
                        <tr className="border-b border-slate-800 text-xs uppercase text-slate-400 font-bold">
                          <th className="py-3 px-4">Match</th>
                          <th className="py-3 px-4 text-center">Actual Result</th>
                          {players.map(p => (
                            <th key={p.id} className="py-3 px-4 text-center">{p.name}'s Prediction</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {matches.map(m => {
                          const isCompleted = m.status === 'completed';

                          return (
                            <tr key={m.id} className="hover:bg-slate-800/20 transition-colors">
                              {/* Match Name */}
                              <td className="py-4 px-4 font-semibold text-slate-100">
                                <div className="text-xs text-slate-500 mb-0.5">{m.date} • {m.group}</div>
                                {m.homeTeam} vs {m.awayTeam}
                              </td>

                              {/* Official Score */}
                              <td className="py-4 px-4 text-center">
                                {isCompleted ? (
                                  <span className="bg-emerald-950/60 text-emerald-300 border border-emerald-500/20 px-3 py-1 rounded-xl font-black">
                                    {m.actualHomeScore} - {m.actualAwayScore}
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-xs italic">Pending</span>
                                )}
                              </td>

                              {/* Friend score comparisons */}
                              {players.map(p => {
                                const pred = predictions.find(pr => pr.playerId === p.id && pr.matchId === m.id);
                                let scorePoints = null;
                                if (pred && isCompleted) {
                                  scorePoints = calculatePoints(pred, m).points;
                                }

                                return (
                                  <td key={p.id} className="py-4 px-4 text-center">
                                    {pred ? (
                                      <div className="flex flex-col items-center gap-1">
                                        <span className="font-bold text-slate-200">
                                          {pred.predictedHomeScore} - {pred.predictedAwayScore}
                                        </span>
                                        {scorePoints !== null && (
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                            scorePoints === 3 
                                              ? 'bg-amber-950/80 text-amber-400 border border-amber-500/20' 
                                              : scorePoints === 1 
                                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/20' 
                                              : 'bg-slate-900 text-slate-500'
                                          }`}>
                                            +{scorePoints} pts
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-slate-500 text-xs italic">No prediction</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 bg-slate-950/50 border-t border-slate-800/40 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 FIFA World Cup™ Friend Match Predictor. Cloud Synced with Firebase.</p>
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> Live Synchronized</span>
            <span>Real-time Active Connection</span>
          </div>
        </div>
      </footer>
    </div>
  );
}