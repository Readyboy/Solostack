import React, { useState } from 'react';
import useGameStore from '../store/gameStore.js';
import { SOFTWARE_TYPES, getSoftwareTypeById } from '../simulation/softwareTypes.js';
import { COMPONENTS, detectSynergies, getActiveComponents, PILLAR_CAPACITY } from '../simulation/components.js';

// ─── Builder: Horizontal Pipeline Flow ───────────────────────────────────────
// Steps: IDEATION → DESIGN → DEVELOPMENT → MARKETING → REVIEW
// Support capacity-based multi-selection per pillar.

const STEPS = ['IDEATION', 'DESIGN', 'DEVELOPMENT', 'MARKETING', 'REVIEW'];

const STEP_META = {
    IDEATION: {
        pillar: 'Ideation',
        label: 'Ideation',
        icon: '💡',
        question: 'What are you building?',
        hint: 'Define your vision. (2 Slots)',
        accentVar: '--accent-amber',
    },
    DESIGN: {
        pillar: 'Design',
        label: 'Design',
        icon: '🎨',
        question: 'How will it feel?',
        hint: 'Craft the experience. (3 Slots)',
        accentVar: '--accent-pink',
    },
    DEVELOPMENT: {
        pillar: 'Development',
        label: 'Build',
        icon: '⚙️',
        question: 'How strong is the tech?',
        hint: 'Solid foundation vs cutting edge. (3 Slots)',
        accentVar: '--accent-blue',
    },
    MARKETING: {
        pillar: 'Marketing',
        label: 'Market',
        icon: '📣',
        question: 'Will anyone notice?',
        hint: 'Drive the hype. (2 Slots)',
        accentVar: '--accent-green',
    },
    REVIEW: {
        label: 'Review',
        icon: '🚀',
        question: 'Ready to ship?',
        hint: 'Your project summary before development begins.',
        accentVar: '--accent-purple',
    },
};

function formatMoney(n) {
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
    return `$${n}`;
}

// ── Component Selectable Card ──────────────────────────────────────────────────
function ComponentCard({ comp, isSelected, isUnlocked, isExclusiveMatch, capacityFull, onClick, accentVar }) {
    const accent = `var(${accentVar})`;
    const disabled = !isUnlocked || (!isExclusiveMatch && comp.exclusiveTo);
    // Allow clicking if already selected (to deselect) even if capacity full
    const clickable = !disabled && (isSelected || !capacityFull);

    const opacity = disabled ? 0.45 : (clickable ? 1 : 0.6);
    const cursor = clickable ? 'pointer' : 'not-allowed';

    return (
        <div
            className="card"
            onClick={() => clickable && onClick(comp.id)}
            style={{
                cursor, opacity,
                border: isSelected ? `1px solid ${accent}` : undefined,
                background: isSelected ? `color-mix(in srgb, ${accent} 12%, transparent)` : undefined,
                transition: 'all 0.1s ease',
                userSelect: 'none',
                position: 'relative',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                {/* Checkbox indicator */}
                <div style={{
                    marginTop: 2, flexShrink: 0,
                    width: 16, height: 16, borderRadius: 4,
                    border: `2px solid ${isSelected ? accent : 'var(--border-strong)'}`,
                    background: isSelected ? accent : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s ease',
                }}>
                    {isSelected && <div style={{ fontSize: 10, color: 'white', fontWeight: 800 }}>✓</div>}
                </div>

                <span style={{ fontSize: 20, flexShrink: 0 }}>{comp.icon}</span>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{comp.name}</span>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {!isExclusiveMatch && comp.exclusiveTo && (
                                <span className="tag" style={{ fontSize: 9, background: 'var(--bg-glass)', color: 'var(--text-muted)' }}>
                                    Only for {comp.exclusiveTo.replace('_', ' ')}
                                </span>
                            )}
                            {!isUnlocked && (
                                <span className="tag" style={{ fontSize: 9 }}>
                                    {comp.unlockCondition.type === 'mastery'
                                        ? `🔒 ${comp.unlockCondition.releases} releases`
                                        : comp.unlockCondition.type === 'fanbase'
                                            ? `🔒 ${(comp.unlockCondition.amount / 1000)}k fans`
                                            : comp.unlockCondition.type === 'trend'
                                                ? `🔒 Trend: ${comp.unlockCondition.trendId}`
                                                : `🔒 ${formatMoney(comp.unlockCondition.amount)}`}
                                </span>
                            )}
                            {comp.capacityCost > 1 && (
                                <span className="tag" style={{ fontSize: 9, color: 'var(--accent-amber)' }}>
                                    ⚡{comp.capacityCost} slots
                                </span>
                            )}
                        </div>
                    </div>

                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>
                        {comp.description}
                    </div>

                    {/* Stat pills */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                        {comp.quality > 0 && <StatPill label="Quality" val={comp.quality} color="var(--accent-blue)" />}
                        {comp.innovation > 0 && <StatPill label="Innov" val={comp.innovation} color="var(--accent-purple)" />}
                        {comp.retention > 0 && <StatPill label="Ret" val={comp.retention} color="var(--accent-green)" />}
                        {comp.marketingPower > 0 && <StatPill label="Mkt" val={comp.marketingPower} color="var(--accent-amber)" />}
                        {comp.risk > 0 && <StatPill label="Risk" val={`+${comp.risk}`} color="var(--accent-pink)" />}
                        {comp.risk < 0 && <StatPill label="Risk" val={comp.risk} color="var(--accent-green)" />}
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <span style={{ fontSize: 10, color: 'var(--accent-green)', fontWeight: 600 }}>
                            ${comp.cost.toLocaleString()}
                        </span>
                        {comp.devTime > 0 && (
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>+{comp.devTime}mo</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatPill({ label, val, color }) {
    return (
        <span style={{
            fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 20,
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            color, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        }}>
            {label} {val}
        </span>
    );
}

// ── Step Tab Bar ──────────────────────────────────────────────────────────────
function StepTabs({ currentStep, completedSteps, onStepClick }) {
    return (
        <div style={{
            display: 'flex', gap: 0, marginBottom: 20,
            borderBottom: '1px solid var(--border)',
            overflow: 'hidden',
        }}>
            {STEPS.map((step, i) => {
                const meta = STEP_META[step];
                const isDone = completedSteps.includes(step);
                const isCurrent = step === currentStep;
                const isClickable = isDone || isCurrent;
                const accent = `var(${meta.accentVar})`;
                return (
                    <button
                        key={step}
                        onClick={() => isClickable && onStepClick(step)}
                        disabled={!isClickable}
                        style={{
                            flex: 1, padding: '10px 4px', border: 'none',
                            background: 'transparent',
                            borderBottom: isCurrent ? `2px solid ${accent}` : '2px solid transparent',
                            color: isCurrent ? accent : isDone ? 'var(--text-secondary)' : 'var(--text-muted)',
                            cursor: isClickable ? 'pointer' : 'not-allowed',
                            fontFamily: 'var(--font)', fontSize: 10, fontWeight: 600,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                            transition: 'all 0.15s ease',
                            opacity: isClickable ? 1 : 0.4,
                            marginBottom: -1,
                        }}
                    >
                        <span style={{ fontSize: 16 }}>{isDone && !isCurrent ? '✓' : meta.icon}</span>
                        {meta.label}
                    </button>
                );
            })}
        </div>
    );
}

// ── Main BuilderWindow ────────────────────────────────────────────────────────
export default function BuilderWindow() {
    const money = useGameStore(s => s.money);
    const unlockedComponents = useGameStore(s => s.unlockedComponents);
    const startProject = useGameStore(s => s.startProject);
    const openWindow = useGameStore(s => s.openWindow);
    const projects = useGameStore(s => s.projects);
    const products = useGameStore(s => s.products);
    const trend = useGameStore(s => s.trend.data);
    const pillarSlots = useGameStore(s => s.pillarSlots);
    const pendingSlotChoice = useGameStore(s => s.pendingSlotChoice);
    const chooseSlotBonus = useGameStore(s => s.chooseSlotBonus);

    const [step, setStep] = useState('IDEATION');
    // Selections are now arrays of IDs per pillar
    const [selections, setSelections] = useState({
        ideation: [], design: [], development: [], marketing: [],
    });
    const [softwareTypeId, setSoftwareTypeId] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [error, setError] = useState('');

    const completedSteps = STEPS.filter((s, i) => {
        const idx = STEPS.indexOf(step);
        return i < idx;
    });

    const pillarKeys = { IDEATION: 'ideation', DESIGN: 'design', DEVELOPMENT: 'development', MARKETING: 'marketing' };
    const pillarKey = pillarKeys[step];

    // Capacity calculation
    const getUsedCapacity = (key) => {
        return selections[key].reduce((sum, id) => {
            const c = getActiveComponents([id])[0];
            return sum + (c?.capacityCost || 1);
        }, 0);
    };

    const currentCapacity = pillarKey ? getUsedCapacity(pillarKey) : 0;
    const maxCapacity = pillarKey ? (pillarSlots[STEP_META[step].pillar] || PILLAR_CAPACITY[STEP_META[step].pillar]) : 0;
    const capacityFull = currentCapacity >= maxCapacity;

    // Energy
    const energyCosts = { productivity: 8, mobile_game: 10, saas_tool: 12, browser_ext: 5 };
    const safeProjects = projects || [];
    const safeProducts = products || [];
    const energyUsed = safeProjects.reduce((s, p) => s + (energyCosts[p.softwareTypeId] || 8), 0)
        + safeProducts.length * 2; // Increased passive energy slightly to encourage archiving
    const energyLeft = Math.max(0, 60 - energyUsed);

    const toggleComponent = (key, id) => {
        setSelections(prev => {
            const current = prev[key];
            const isSelected = current.includes(id);

            if (isSelected) {
                return { ...prev, [key]: current.filter(c => c !== id) };
            }

            const comp = getActiveComponents([id])[0];
            const cost = comp?.capacityCost || 1;

            const pillarName = STEP_META[step].pillar;
            const currentMax = pillarSlots[pillarName] || PILLAR_CAPACITY[pillarName];

            if (getUsedCapacity(key) + cost > currentMax) {
                return prev; // Over capacity
            }

            return { ...prev, [key]: [...current, id] };
        });
        setError('');
    };

    const allSelectedIds = Object.values(selections).flat();
    const selectedComps = getActiveComponents(allSelectedIds);
    const totalCost = selectedComps.reduce((s, c) => s + c.cost, 0);
    const totalDevTime = Math.max(1, Math.ceil(selectedComps.reduce((s, c) => s + c.devTime, 0)));
    const synergies = detectSynergies(allSelectedIds);
    const softType = getSoftwareTypeById(softwareTypeId);

    const goNext = () => {
        if (step === 'IDEATION' && !softwareTypeId) { setError('Select a software type first!'); return; }

        if (step !== 'REVIEW') {
            const idx = STEPS.indexOf(step);
            setStep(STEPS[idx + 1]);
            setError('');
        }
    };

    const handleLaunch = () => {
        if (!projectName.trim()) { setError('Name your project!'); return; }
        if (!softwareTypeId) { setError('Select a software type!'); return; }

        const type = getSoftwareTypeById(softwareTypeId);
        if (allSelectedIds.length < (type.minimumComponents || 1)) {
            setError(`This type requires at least ${type.minimumComponents} components!`);
            return;
        }

        if (money < totalCost) { setError('Not enough money!'); return; }
        if (energyLeft < type.energyCost) {
            setError(`Need ${type.energyCost} energy! Archive products to free energy.`); return;
        }

        const result = startProject({ name: projectName.trim(), softwareTypeId, componentIds: allSelectedIds });
        if (result?.error) { setError(result.error); return; }

        // Reset
        setStep('IDEATION');
        setSelections({ ideation: [], design: [], development: [], marketing: [] });
        setSoftwareTypeId(null);
        setProjectName('');
        setError('');
        openWindow('projects');
    };

    const meta = STEP_META[step];
    const accent = `var(${meta.accentVar})`;
    const pillarComps = step !== 'REVIEW'
        ? COMPONENTS.filter(c => c.pillar === meta.pillar)
        : [];

    // Dynamic hint for slots
    const slotHint = meta.pillar ? `(${pillarSlots[meta.pillar] || PILLAR_CAPACITY[meta.pillar]} Slots)` : meta.hint;

    return (
        <div>
            <StepTabs
                currentStep={step}
                completedSteps={completedSteps}
                onStepClick={setStep}
            />

            {/* V3: Slot Choice UI */}
            {pendingSlotChoice && (
                <div style={{
                    padding: '16px', marginBottom: 20, borderRadius: 'var(--radius)',
                    background: 'var(--accent-purple-dim)', border: '1px solid var(--accent-purple)',
                    textAlign: 'center', animation: 'scaleIn 0.3s ease'
                }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                        ✨ Pillar Upgrade Available! (+1 Slot)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {['Ideation', 'Design', 'Development', 'Marketing'].map(p => (
                            <button key={p} className="btn btn-primary btn-sm" onClick={() => chooseSlotBonus(p)}>
                                {p} (now {pillarSlots[p]})
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Step header */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ fontSize: 11, color: accent, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                            {meta.icon} {meta.label}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{meta.question}</div>
                    </div>
                    {/* Capacity meter */}
                    {step !== 'REVIEW' && (
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                                Capacity
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: capacityFull ? 'var(--accent-pink)' : accent }}>
                                {currentCapacity} <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>/ {maxCapacity}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {meta.pillar ? `${meta.hint.split('(')[0]} ${slotHint}` : meta.hint}
                </div>
            </div>

            {/* ── IDEATION / DESIGN / DEVELOPMENT / MARKETING ─────────────────────── */}
            {step !== 'REVIEW' && (
                <div>
                    {/* Software type on Ideation tab */}
                    {step === 'IDEATION' && (
                        <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                                Software Type
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                {SOFTWARE_TYPES.map(type => {
                                    const canAfford = energyLeft >= type.energyCost;
                                    const isSelected = softwareTypeId === type.id;
                                    return (
                                        <div
                                            key={type.id}
                                            className="card"
                                            onClick={() => canAfford && setSoftwareTypeId(type.id)}
                                            style={{
                                                cursor: canAfford ? 'pointer' : 'not-allowed',
                                                opacity: canAfford ? 1 : 0.45,
                                                border: isSelected ? `1px solid ${type.color}` : undefined,
                                                background: isSelected ? `${type.color}18` : undefined,
                                                padding: '8px 10px',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 16 }}>{type.icon}</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontSize: 11, fontWeight: 700 }}>{type.name}</div>
                                                    <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                                                        Min: {type.minimumComponents} Components
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: 10, color: canAfford ? type.color : 'var(--accent-pink)', fontWeight: 800 }}>
                                                    ⚡{type.energyCost}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ marginTop: 14, borderTop: '1px solid var(--border)', paddingTop: 12, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
                                Components
                            </div>
                        </div>
                    )}

                    {/* Component list - Constrained height with scroll */}
                    <div style={{
                        flex: 1,
                        maxHeight: '380px',
                        overflowY: 'auto',
                        paddingRight: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                        scrollbarWidth: 'thin',
                        scrollbarColor: 'var(--border-strong) transparent'
                    }} className="custom-scroll">
                        {pillarComps.map(comp => (
                            <ComponentCard
                                key={comp.id}
                                comp={comp}
                                isSelected={selections[pillarKey].includes(comp.id)}
                                isUnlocked={
                                    unlockedComponents.includes(comp.id) ||
                                    (comp.unlockCondition.type === 'trend' && trend.id === comp.unlockCondition.trendId)
                                }
                                isExclusiveMatch={!comp.exclusiveTo || comp.exclusiveTo === softwareTypeId}
                                capacityFull={currentCapacity + (comp.capacityCost || 1) > maxCapacity}
                                onClick={(id) => toggleComponent(pillarKey, id)}
                                accentVar={meta.accentVar}
                            />
                        ))}
                    </div>

                    {error && (
                        <div style={{ color: 'var(--accent-pink)', fontSize: 11, marginTop: 8, padding: '6px 10px', background: 'var(--accent-pink-dim)', borderRadius: 'var(--radius-sm)' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                        {step !== 'IDEATION' && (
                            <button className="btn btn-sm" onClick={() => setStep(STEPS[STEPS.indexOf(step) - 1])}>
                                ← Back
                            </button>
                        )}
                        <button
                            className="btn btn-primary w-full"
                            onClick={goNext}
                            disabled={step === 'IDEATION' && !softwareTypeId}
                        >
                            {step === 'MARKETING' ? 'Review & Plan' : `Next: ${STEP_META[STEPS[STEPS.indexOf(step) + 1]]?.label} →`}
                        </button>
                    </div>
                </div>
            )}

            {/* ── REVIEW TAB ─────────────────────────────────────────────────────── */}
            {step === 'REVIEW' && (
                <div>
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 6 }}>
                            Project Name
                        </div>
                        <input
                            type="text"
                            placeholder="Project Name..."
                            value={projectName}
                            onChange={e => { setProjectName(e.target.value); setError(''); }}
                            maxLength={32}
                            autoFocus
                            onKeyDown={e => e.key === 'Enter' && handleLaunch()}
                        />
                    </div>

                    <div style={{
                        padding: '14px 16px', borderRadius: 'var(--radius)',
                        background: 'var(--accent-purple-dim)', border: '1px solid var(--border-accent)',
                        marginBottom: 14,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                            Build Summary
                        </div>

                        {softType && (
                            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Software Type</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color: softType.color }}>
                                    {softType.icon} {softType.name}
                                </span>
                            </div>
                        )}

                        {synergies.length > 0 && (
                            <div style={{ marginBottom: 12, padding: '8px 10px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                                <div style={{ fontSize: 10, color: 'var(--accent-purple)', fontWeight: 800, marginBottom: 4 }}>
                                    ✨ SYNERGIES DETECTED
                                </div>
                                {synergies.map(s => (
                                    <div key={s.id} style={{ fontSize: 11, color: 'var(--text-primary)', marginBottom: 2 }}>
                                        • {s.label}
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                            {[
                                { label: 'Effort', value: `${totalDevTime} mo`, icon: '📅' },
                                { label: 'Budget', value: `$${totalCost.toLocaleString()}`, icon: '💸', color: money < totalCost ? 'var(--accent-pink)' : 'var(--accent-green)' },
                                { label: 'Energy', value: `⚡${softType?.energyCost ?? '—'}`, icon: '⚡', color: softType && energyLeft < softType.energyCost ? 'var(--accent-pink)' : undefined },
                                { label: 'Total Comps', value: `${allSelectedIds.length} / ${softType?.minimumComponents || 1}+`, icon: '🧩', color: (allSelectedIds.length < (softType?.minimumComponents || 1)) ? 'var(--accent-pink)' : undefined },
                            ].map(({ label, value, icon, color }) => (
                                <div key={label} style={{ padding: '7px 10px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)' }}>
                                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600 }}>{label}</div>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: color || 'var(--text-primary)', marginTop: 2 }}>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div style={{ color: 'var(--accent-pink)', fontSize: 11, marginBottom: 10, padding: '6px 10px', background: 'var(--accent-pink-dim)', borderRadius: 'var(--radius-sm)' }}>
                            ⚠️ {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-sm" onClick={() => setStep('MARKETING')}>← Edit</button>
                        <button
                            className="btn btn-success w-full"
                            onClick={handleLaunch}
                            disabled={money < totalCost || (softType && allSelectedIds.length < softType.minimumComponents)}
                        >
                            🚀 Begin Build
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
