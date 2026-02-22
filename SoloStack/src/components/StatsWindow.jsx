import useGameStore from '../store/gameStore.js';
import { SOFTWARE_TYPES } from '../simulation/softwareTypes.js';
import { SYNERGIES } from '../simulation/components.js';
import { WIN_REVENUE, WIN_MARKET_SHARE, WIN_CATEGORY_DOMINATION } from '../simulation/constants.js';

function formatMoney(n) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${Math.round(n)}`;
}
function formatFans(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

function Stat({ label, value, color }) {
    return (
        <div style={{ padding: '14px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: color || 'var(--text-primary)', fontFamily: 'var(--font-numeric)' }}>{value}</div>
        </div>
    );
}

export default function StatsWindow() {
    const money = useGameStore(s => s.money);
    const fanbase = useGameStore(s => s.fanbase);
    const marketShare = useGameStore(s => s.marketShare);
    const lifetimeRevenue = useGameStore(s => s.lifetimeRevenue);
    const totalReleases = useGameStore(s => s.totalReleases);
    const products = useGameStore(s => s.products);
    const archive = useGameStore(s => s.archive);
    const month = useGameStore(s => s.month);
    const categoryLegacy = useGameStore(s => s.categoryLegacy);
    const discoveredSynergies = useGameStore(s => s.discoveredSynergies);

    const topProduct = [...products, ...archive].sort((a, b) => b.rating - a.rating)[0];

    // Win progress
    const revenueProgress = Math.min(1, lifetimeRevenue / WIN_REVENUE);
    const shareProgress = Math.min(1, marketShare / WIN_MARKET_SHARE);
    const dominatedCats = SOFTWARE_TYPES.filter(type =>
        products.some(p => p.softwareTypeId === type.id && p.rating >= 8)
    ).length;
    const domProgress = dominatedCats / WIN_CATEGORY_DOMINATION;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Key stats grid */}
            <div className="grid-2">
                <Stat label="💰 Total Worth" value={formatMoney(money)} color="var(--accent-green)" />
                <Stat label="👥 Fanbase" value={formatFans(fanbase)} color="var(--accent-purple)" />
                <Stat label="📦 Total Releases" value={totalReleases} />
                <Stat label="📅 Month" value={month} />
                <Stat label="💵 Lifetime Revenue" value={formatMoney(lifetimeRevenue)} color="var(--accent-amber)" />
                <Stat label="📊 Market Share" value={`${(marketShare * 100).toFixed(1)}%`} color="var(--accent-blue)" />
            </div>

            {topProduct && (
                <div style={{ padding: '16px 18px', background: 'var(--accent-warm-dim)', borderRadius: 'var(--radius)', border: '1px solid var(--accent-warm-dim)' }}>
                    <div className="section-header" style={{ color: 'var(--accent-warm)', marginBottom: 8 }}>🏆 Personal Best</div>
                    <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>{topProduct.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, opacity: 0.9 }}>
                        Rated <span style={{ color: 'var(--accent-amber)', fontWeight: 600, fontFamily: 'var(--font-numeric)' }}>{topProduct.rating.toFixed(1)}</span> · <span style={{ fontFamily: 'var(--font-numeric)' }}>{formatMoney(topProduct.lifetimeRevenue)}</span> lifetime revenue
                    </div>
                </div>
            )}

            {/* Category Mastery */}
            <div>
                <p className="section-header" style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: 1.2 }}>📜 Category Mastery</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {SOFTWARE_TYPES.map(type => {
                        const points = categoryLegacy[type.id] || 0;
                        const bonus = Math.min(1.5, points * 0.15);
                        return (
                            <div key={type.id} style={{
                                padding: '10px 12px', background: 'var(--bg-glass)',
                                border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                                opacity: points > 0 ? 1 : 0.5
                            }}>
                                <div style={{ fontSize: 10, fontWeight: 700, color: type.color }}>{type.icon} {type.name}</div>
                                <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4 }}>
                                    +{bonus.toFixed(2)} <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 400 }}>Rating</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Technical Discovery */}
            <div>
                <p className="section-header" style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent-green)', textTransform: 'uppercase', letterSpacing: 1.2 }}>🧬 Technical Library</p>
                <div style={{ padding: '12px 14px', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>Discovered Techniques</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--accent-green)' }}>{discoveredSynergies.length} / {SYNERGIES.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {discoveredSynergies.length === 0 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>No special techniques discovered yet... keep experimenting!</span>}
                        {discoveredSynergies.map(id => {
                            const dyn = SYNERGIES.find(s => s.id === id);
                            return (
                                <span key={id} className="tag purple" style={{ fontSize: 9 }}>
                                    {dyn?.label || id}
                                </span>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Win Condition Progress */}
            <div style={{ marginTop: 12 }}>
                <p className="section-header" style={{ color: 'var(--accent-purple)' }}>⭐ Your Legacy</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                        { label: 'Total Revenue', desc: `${formatMoney(lifetimeRevenue)} / ${formatMoney(WIN_REVENUE)}`, progress: revenueProgress, color: 'var(--accent-green)' },
                        { label: 'Market Dominance', desc: `${(marketShare * 100).toFixed(1)}% / ${WIN_MARKET_SHARE * 100}%`, progress: shareProgress, color: 'var(--accent-purple)' },
                        { label: 'Category Mastery', desc: `${dominatedCats}/${WIN_CATEGORY_DOMINATION} categories mastered`, progress: domProgress, color: 'var(--accent-amber)' },
                    ].map(({ label, desc, progress, color }) => (
                        <div key={label}>
                            <div className="flex justify-between text-sm" style={{ marginBottom: 6 }}>
                                <span style={{ fontSize: 12, fontWeight: 500 }}>{label}</span>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-numeric)' }}>{desc}</span>
                            </div>
                            <div className="progress-bar" style={{ height: 8 }}>
                                <div style={{ height: '100%', borderRadius: 4, transition: 'width 0.6s ease', width: `${progress * 100}%`, background: color }} />
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', opacity: 0.8 }}>
                    Tip: Categories are mastered by having a product with rating ≥8 there.
                </div>
            </div>
        </div>
    );
}
