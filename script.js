(async () => {
  const wait = (ms) => new Promise(res => setTimeout(res, ms));
  const getElements = () => Array.from(document.querySelectorAll('.item'));
  const getClearButton = () => [...document.querySelectorAll('button')].find(btn => btn.textContent.trim().toLowerCase() === 'clear');

  const getCenterCoords = () => {
    const canvas = document.querySelector('canvas');
    const rect = canvas.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const simulateDropAtCenter = async (el) => {
    const rect = el.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    const { x: centerX, y: centerY } = getCenterCoords();

    el.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX: startX,
      clientY: startY
    }));

    document.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      clientX: centerX,
      clientY: centerY
    }));

    document.dispatchEvent(new MouseEvent('mouseup', {
      bubbles: true,
      clientX: centerX,
      clientY: centerY
    }));
  };

  const pickTwoRandom = (arr) => {
    const i = Math.floor(Math.random() * arr.length);
    let j;
    do {
      j = Math.floor(Math.random() * arr.length);
    } while (j === i);
    return [arr[i], arr[j]];
  };

  let comboCount = 0;
  let nextClear = Math.floor(Math.random() * 10) + 10;

  while (true) {
    const elements = getElements();
    if (elements.length < 2) {
      await wait(500);
      continue;
    }

    const [el1, el2] = pickTwoRandom(elements);

    // Drop both in the center one after the other
    await simulateDropAtCenter(el1);
    await wait(30); // Short pause for realism/sync
    await simulateDropAtCenter(el2);

    comboCount++;
    if (comboCount >= nextClear) {
      const clearBtn = getClearButton();
      if (clearBtn) {
        clearBtn.click();
        console.log(`🧹 Cleared after ${comboCount} combos`);
        await wait(150);
      }
      comboCount = 0;
      nextClear = Math.floor(Math.random() * 10) + 10;
    }

    await wait(80); // fast loop, adjust if it skips combos
  }
})();
