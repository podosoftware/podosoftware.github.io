import './contentButton.css';

export const createButton = ({
         label,
         className = "",
         onClick,
        disabled = false,
     }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerText = label;
    btn.disabled = disabled;
    btn.addEventListener('click', onClick);

    btn.className = [className].join(' ');

    return btn;
};

// 버튼 여러개 일 경우
export const createButtonGroup = ({
      buttons = [],
      direction = 'horizontal', // horizontal or vertical
      gap = '8px',
  }) => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = direction === 'vertical' ? 'column' : 'row';
    wrapper.style.gap = gap;

    buttons.forEach((btnConfig) => {
        const btn = createButton(btnConfig);
        wrapper.appendChild(btn);
    });

    return wrapper;
};