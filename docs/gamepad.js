function setVirtualGamepad() {
  window.__virtualGamepad = document.createElement("div");
  window.__toggleVirtualGamepad = (show) => {
    window.__virtualGamepad.style.display = show ? "" : "none";
  }
  window.__virtualGamepad.classList.add("ejs_virtualGamepad_parent");
  document.body.appendChild(window.__virtualGamepad);

  window.__gamePadVibration = 0;

  const gamePadVibrationStatus = ['关', '弱', '强'];

  window.__use4DirectionDPad = true;

  const vibrate = () => {
    if (window.__gamePadVibration !== 0) {
      window.navigator.vibrate([0, 10, 50][__gamePadVibration]);
    }
  }

  const addEventListener = (element, listener, callback) => {
    const listeners = listener.split(" ");
    let rv = [];
    for (let i = 0; i < listeners.length; i++) {
      element.addEventListener(listeners[i], callback);
      const data = { cb: callback, elem: element, listener: listeners[i] };
      rv.push(data);
    }
    return rv;
  }

  const _simulateInput = (keyCode, isPress) => {
    document.dispatchEvent(new KeyboardEvent(isPress ? 'keydown': 'keyup', {
      keyCode,
      bubbles: true,
      code: keyCode,
    }));
  }

  const simulateInput = (keyCode, isPress) => {
    if (isPress) {
      _simulateInput(keyCode, isPress);
    } else {
      setTimeout(() => {
        _simulateInput(keyCode, isPress);
      }, 50);
    }
  }

  const addIcon = (data, size) => {
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'center'
    div.style.alignItems = 'center';
    div.style.height = '100%';
    div.style.pointerEvents = 'none';
    div.innerHTML= data;
    const svg = div.querySelector('svg');
    svg.style.width = `${size}px`;
    svg.style.height = `${size}px`;
    svg.style.background = 'transparent';
    return div;
  }

  let info = [
    {
      "type": "button",
      "icon": '<svg class="ps_button" width="18" height="18" viewBox="-1.5 0 18 18"><path fill="#78787888" d="M15.998,14.727L7.504,0.204l-8.486,14.521L15.998,14.727z M7.48,4.057l4.889,8.569H2.637L7.48,4.057z"/></svg>',
      "id": "🞨",
      "location": "right",
      "left": 40,
      "bold": true,
      "input_value": 83, // S
      "size": 36,
    },
    {
      "type": "button",
      "icon": '<svg class="ps_button" width="15" height="15" viewBox="0 0 15 15"><rect x="1" y="1" style="fill-opacity: 0; stroke: rgba(120, 120, 120, 0.5); stroke-width: 2;" width="12" height="12"/></svg>',
      "id": "y",
      "location": "right",
      "top": 40,
      "bold": true,
      "input_value": 82, // R
      "size": 33,
    },
    {
      "type": "button",
      "icon": '<svg class="ps_button" width="15" height="15" viewBox="0 0 15 15"><circle xmlns="http://www.w3.org/2000/svg" style="fill: none; stroke: rgba(120, 120, 120, 0.5); stroke-width: 2;" cx="7.5" cy="7.5" r="6.25"/></svg>',
      "id": "a",
      "location": "right",
      "left": 81,
      "top": 40,
      "bold": true,
      "input_value": 32, // Space
      "size": 36,
    },
    {
      "type": "button",
      "icon": '<svg class="ps_button" width="15" height="15" viewBox="0 0 15 15"><g><line style="fill: none; stroke: rgba(120, 120, 120, 0.5); stroke-width: 2;" x1="1" y1="1" x2="14" y2="14"/><line style="fill: none; stroke: rgba(120, 120, 120, 0.5); stroke-width: 2;" x1="14" y1="1" x2="1" y2="14"/></g></svg>',
      "id": "b",
      "location": "right",
      "left": 40,
      "top": 80,
      "bold": false,
      "input_value": 27, // Esc
      "size": 32,
    },
    {
      "type": "dpad",
      "location": "left",
      "left": "50%",
      "top": "50%",
      "joystickInput": false,
      "inputValues": [38, 40, 37, 39]
    },
    {
      "type":"button",
      "text":"震动关",
      "id":"vibration",
      "location":"center",
      "left":32,
      "top":50,
      "fontSize":15,
      "block":true,
      "input_value":-1
    },
  ];

  info = JSON.parse(JSON.stringify(info));


  const up = document.createElement("div");
  up.classList.add("ejs_virtualGamepad_top");
  const down = document.createElement("div");
  down.classList.add("ejs_virtualGamepad_bottom");
  const left = document.createElement("div");
  left.classList.add("ejs_virtualGamepad_left");
  const right = document.createElement("div");
  right.classList.add("ejs_virtualGamepad_right");
  const elems = { top: up, center: down, left, right };

  window.__virtualGamepad.appendChild(up);
  window.__virtualGamepad.appendChild(down);
  window.__virtualGamepad.appendChild(left);
  window.__virtualGamepad.appendChild(right);

  window.__toggleVirtualGamepadLeftHanded = (enabled) => {
    left.classList.toggle("ejs_virtualGamepad_left", !enabled);
    right.classList.toggle("ejs_virtualGamepad_right", !enabled);
    left.classList.toggle("ejs_virtualGamepad_right", enabled);
    right.classList.toggle("ejs_virtualGamepad_left", enabled);
  }

  const leftHandedMode = false;
  const blockCSS = 'height:31px;text-align:center;border:1px solid #ccc;border-radius:5px;line-height:31px;';

  for (let i = 0; i < info.length; i++) {
    if (info[i].type !== 'button') continue;
    if (leftHandedMode && ['left', 'right'].includes(info[i].location)) {
      info[i].location = (info[i].location === 'left') ? 'right' : 'left';
      const amnt = JSON.parse(JSON.stringify(info[i]));
      if (amnt.left) {
        info[i].right = amnt.left;
      }
      if (amnt.right) {
        info[i].left = amnt.right;
      }
    }
    let style = '';
    if (info[i].left) {
      style += 'left:' + info[i].left + (typeof info[i].left === 'number' ? 'px' : '') + ';';
    }
    if (info[i].right) {
      style += 'right:' + info[i].right + (typeof info[i].right === 'number' ? 'px' : '') + ';';
    }
    if (info[i].top) {
      style += 'top:' + info[i].top + (typeof info[i].top === 'number' ? 'px' : '') + ';';
    }
    if (info[i].block) {
      style += blockCSS;
    }
    if (info[i].fontSize) {
      style += 'font-size:'+info[i].fontSize+'px;';
    }
    if (['top', 'center', 'left', 'right'].includes(info[i].location)) {
      const button = document.createElement("div");
      button.style = style;
      if (info[i].icon) {
        button.appendChild(addIcon(info[i].icon, info[i].size));
      } else {
        button.innerText = info[i].text;

      }
      button.classList.add("ejs_virtualGamepad_button");
      elems[info[i].location].appendChild(button);
      const value = info[i].input_new_cores || info[i].input_value;
      if (info[i].id === 'vibration') {
        button.id = 'btnVibration';
        if ('vibrate' in window.navigator) {
          button.addEventListener("touchend", (e) => {
            e.preventDefault();
            window.__gamePadVibration = (window.__gamePadVibration + 1);
            if (window.__gamePadVibration === 3) {
              window.__gamePadVibration = 0;
            }
            button.innerText = `震动${gamePadVibrationStatus[window.__gamePadVibration]}`;
          });
        } else {
          button.style.display = 'none';
        }
        continue;
      }
      addEventListener(button, "touchstart touchend touchcancel", (e) => {
        e.preventDefault();
        if (e.type === 'touchend' || e.type === 'touchcancel') {
          e.target.classList.remove("ejs_virtualGamepad_button_down");
          window.setTimeout(() => {
            simulateInput(value, 0);
          })
        } else {
          vibrate();
          e.target.classList.add("ejs_virtualGamepad_button_down");
          simulateInput(value, 1);
        }
      })
    }
  }

  const createDPad = (opts) => {
    const container = opts.container;
    const callback = opts.event;
    const dpadMain = document.createElement("div");
    dpadMain.classList.add("ejs_dpad_main");
    const vertical = document.createElement("div");
    vertical.classList.add("ejs_dpad_vertical");
    const horizontal = document.createElement("div");
    horizontal.classList.add("ejs_dpad_horizontal");
    const bar1 = document.createElement("div");
    bar1.classList.add("ejs_dpad_bar");
    const bar2 = document.createElement("div");
    bar2.classList.add("ejs_dpad_bar");

    horizontal.appendChild(bar1);
    vertical.appendChild(bar2);
    dpadMain.appendChild(vertical);
    dpadMain.appendChild(horizontal);

    const updateCb = (e) => {
      if (e.type === 'touchstart') {
        vibrate();
      }
      e.preventDefault();
      const touch = e.targetTouches[0];
      if (!touch) return;
      const rect = dpadMain.getBoundingClientRect();
      const x = touch.clientX - rect.left - dpadMain.clientWidth / 2;
      const y = touch.clientY - rect.top - dpadMain.clientHeight / 2;
      let up = 0,
        down = 0,
        left = 0,
        right = 0,
        angle = Math.atan(x / y) / (Math.PI / 180);

      if (window.__use4DirectionDPad) {
        if (Math.abs(x) < 10 && Math.abs(y) < 10) {
          return;
        }
        if (Math.abs(x) > Math.abs(y)) {
          if (x > 0) {
            right = 1;
          } else {
            left = 1;
          }
        } else {
          if (y > 0) {
            down = 1;
          } else {
            up = 1;
          }
        }
      } else {
        if (y <= -10) {
          up = 1;
        }
        if (y >= 10) {
          down = 1;
        }

        if (x >= 10) {
          right = 1;
          left = 0;
          if (angle < 0 && angle >= -35 || angle > 0 && angle <= 35) {
            right = 0;
          }
          up = (angle < 0 && angle >= -55 ? 1 : 0);
          down = (angle > 0 && angle <= 55 ? 1 : 0);
        }

        if (x <= -10) {
          right = 0;
          left = 1;
          if (angle < 0 && angle >= -35 || angle > 0 && angle <= 35) {
            left = 0;
          }
          up = (angle > 0 && angle <= 55 ? 1 : 0);
          down = (angle < 0 && angle >= -55 ? 1 : 0);
        }
      }

      dpadMain.classList.toggle("ejs_dpad_up_pressed", up);
      dpadMain.classList.toggle("ejs_dpad_down_pressed", down);
      dpadMain.classList.toggle("ejs_dpad_right_pressed", right);
      dpadMain.classList.toggle("ejs_dpad_left_pressed", left);

      callback(up, down, left, right);
    }
    const cancelCb = (e) => {
      e.preventDefault();
      dpadMain.classList.remove("ejs_dpad_up_pressed");
      dpadMain.classList.remove("ejs_dpad_down_pressed");
      dpadMain.classList.remove("ejs_dpad_right_pressed");
      dpadMain.classList.remove("ejs_dpad_left_pressed");

      callback(0, 0, 0, 0);
    }

    addEventListener(dpadMain, 'touchstart touchmove', updateCb);
    addEventListener(dpadMain, 'touchend touchcancel', cancelCb);


    container.appendChild(dpadMain);
  }

  info.forEach((dpad, index) => {
    if (dpad.type !== 'dpad') return;
    if (leftHandedMode && ['left', 'right'].includes(dpad.location)) {
      dpad.location = (dpad.location === 'left') ? 'right' : 'left';
      const amnt = JSON.parse(JSON.stringify(dpad));
      if (amnt.left) {
        dpad.right = amnt.left;
      }
      if (amnt.right) {
        dpad.left = amnt.right;
      }
    }
    const elem = document.createElement("div");
    let style = '';
    if (dpad.left) {
      style += 'left:' + dpad.left + ';';
    }
    if (dpad.right) {
      style += 'right:' + dpad.right + ';';
    }
    if (dpad.top) {
      style += 'top:' + dpad.top + ';';
    }
    elem.style = style;
    elems[dpad.location].appendChild(elem);
    createDPad({
      container: elem, event: (up, down, left, right) => {
        if (dpad.joystickInput) {
          if (up === 1) up = 0x7fff;
          if (down === 1) down = 0x7fff;
          if (left === 1) left = 0x7fff;
          if (right === 1) right = 0x7fff;
        }
        simulateInput(dpad.inputValues[0], up);
        simulateInput(dpad.inputValues[1], down);
        simulateInput(dpad.inputValues[2], left);
        simulateInput(dpad.inputValues[3], right);
      }
    });
  })
}