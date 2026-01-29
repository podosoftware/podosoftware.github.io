import './tabStyle.css';

export const PopupTab = () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div id="tabstrip">
      <ul>
        <li class="k-state-active">Tab 1</li>
        <li>Tab 2</li>
        <li>Tab 3</li>
      </ul>
      <div><p>Content for Tab 1</p></div>
      <div><p>Content for Tab 2</p></div>
      <div><p>Content for Tab 3</p></div>
    </div>
  `;

    // Kendo 초기화는 DOM 렌더 후 실행
    setTimeout(() => {
        if (window.jQuery && window.kendo) {
            window.jQuery("#tabstrip").kendoTabStrip({
                animation: { open: { effects: "fadeIn" } }
            });
        } else {
            console.warn("Kendo or jQuery not loaded");
        }
    }, 500);

    return wrapper;
};