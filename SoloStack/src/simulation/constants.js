// ─── SoloStack Game Constants ───────────────────────────────────────────────
// Tune these to adjust game feel without touching logic

export const GAME_TICK_MS = 8000;         // Real-time ms per in-game month
export const BASE_ENERGY = 60;            // Total energy pool
export const STARTING_MONEY = 5000;       // Starting dollars
export const STARTING_FANS = 100;         // Starting fanbase

// Rating calculation weights
export const RATING_QUALITY_WEIGHT = 0.45;
export const RATING_INNOVATION_WEIGHT = 0.25;
export const RATING_TREND_WEIGHT = 0.20;
export const RATING_MARKETING_WEIGHT = 0.10;

// Revenue scaling
export const BASE_REVENUE_PER_RATING = 200;   // $/month per rating point
export const FANBASE_REVENUE_MULTIPLIER = 0.0003; // multiplicative per fan
export const REVENUE_DECAY_RATE = 0.88;          // monthly multiplier (12% decay)
export const MAX_PRODUCT_LIFESPAN = 24;          // months before product dies

// Viral system
export const VIRAL_BASE_CHANCE = 0.08;    // 8% base viral chance
export const VIRAL_MULTIPLIER = 3.5;     // revenue x3.5 on viral month
export const SEVERE_FAIL_CHANCE = 0.05;  // 5% base severe failure chance

// Fanbase growth
export const FAN_BASE_MULTIPLIER = 50;   // fans per rating point on release
export const FAN_VIRAL_BONUS = 500;      // extra fans if viral
export const FAN_TREND_BONUS = 1.4;      // multiplier if trending

// Market share
export const CORP_AGGRESSION = 0.015;    // how fast corps steal share per month
export const PLAYER_SHARE_GAIN = 0.02;   // share gained per product release

// Energy costs
export const PRODUCT_PASSIVE_ENERGY = 2;  // energy per active product

// Win conditions
export const WIN_REVENUE = 500_000;        // lifetime revenue to win
export const WIN_MARKET_SHARE = 0.45;      // 45% overall market share
export const WIN_CATEGORY_DOMINATION = 3;  // dominate 3 categories
