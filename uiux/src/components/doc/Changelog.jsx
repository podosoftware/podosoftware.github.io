/**
 * 변경 이력
 *
 * items: [{ version: 'v4.0', date: '2026-11', tags: ['feat', 'break'], desc: <>…</> }]
 * tags : fix | feat | break
 */
const TAG_LABELS = {
    fix: 'FIX',
    feat: 'FEAT',
    break: 'BREAK',
};

export default function Changelog({ items }) {
    return (
        <div className="g-changelog">
            {items.map((item) => (
                <div className="g-changelog__item" key={item.version}>
                    <div className="g-changelog__ver">{item.version}</div>
                    <div>
                        <div className="g-changelog__date">{item.date}</div>
                        <div className="g-changelog__tags">
                            {item.tags.map((tag) => (
                                <span key={tag} className={`g-changelog__tag g-changelog__tag--${tag}`}>
                                    {TAG_LABELS[tag] || tag}
                                </span>
                            ))}
                        </div>
                        <div className="g-changelog__desc">{item.desc}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}
