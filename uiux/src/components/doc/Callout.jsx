import AdminIcon from '../../icons/AdminIcon.jsx';

const CALLOUT_ICONS = {
    info: 'info',
    warn: 'alert',
    tip: 'check-circle',
};

/**
 * 안내 박스
 *
 * <Callout type="warn" title="주의">본문</Callout>
 * type: info(기본) | warn | tip
 */
export default function Callout({ type = 'info', title, children }) {
    return (
        <div className={`g-callout g-callout--${type}`} role={type === 'warn' ? 'alert' : 'note'}>
            <AdminIcon name={CALLOUT_ICONS[type] || 'info'} size={16} />
            <div>
                {title && <strong>{title}</strong>}
                {children}
            </div>
        </div>
    );
}
