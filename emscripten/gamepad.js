function setVirtualGamepad() {
  window.__virtualGamepad = document.createElement("div");
  window.__toggleVirtualGamepad = (show) => {
    window.__virtualGamepad.style.display = show ? "" : "none";
  }
  window.__virtualGamepad.classList.add("ejs_virtualGamepad_parent");
  document.body.appendChild(window.__virtualGamepad);

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

  const simulateInput = (keyCode, isPress) => {
    document.dispatchEvent(new KeyboardEvent(isPress ? 'keydown': 'keyup', {
      keyCode,
      bubbles: true,
      code: keyCode,
    }));
  }

  let info = [
    {
      "type": "button",
      "text": "△",
      "id": "🞨",
      "location": "right",
      "left": 40,
      "bold": true,
      "input_value": 83, // S
      // "fontSize": 46,
    },
    {
      "type": "button",
      "text": "□",
      "id": "y",
      "location": "right",
      "top": 40,
      "bold": true,
      "input_value": 82, // R
      // "fontSize": 42
    },
    {
      "type": "button",
      "text": "○",
      "id": "a",
      "location": "right",
      "left": 81,
      "top": 40,
      "bold": true,
      "input_value": 32, // Space
      // "fontSize": 46
    },
    {
      "type": "button",
      "text": "🞨",
      "id": "b",
      "location": "right",
      "left": 40,
      "top": 80,
      "bold": false,
      "input_value": 27, // Esc
    },
    {
      "type": "dpad",
      "location": "left",
      "left": "50%",
      "top": "50%",
      "joystickInput": false,
      "inputValues": [38, 40, 37, 39]
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
    if (!info[i].bold) {
      style += 'font-weight:normal;';
    } else if (info[i].bold) {
      style += 'font-weight:bold;';
    }
    info[i].fontSize = info[i].fontSize || 28;
    style += 'font-size:' + info[i].fontSize + 'px;';
    style += 'font-family: serif !important;';
    if (info[i].block) {
      style += blockCSS;
    }
    if (['top', 'center', 'left', 'right'].includes(info[i].location)) {
      const button = document.createElement("div");
      button.style = style;
      button.innerText = info[i].text;
      button.classList.add("ejs_virtualGamepad_button");
      elems[info[i].location].appendChild(button);
      const value = info[i].input_new_cores || info[i].input_value;
      addEventListener(button, "touchstart touchend touchcancel", (e) => {
        e.preventDefault();
        if (e.type === 'touchend' || e.type === 'touchcancel') {
          e.target.classList.remove("ejs_virtualGamepad_button_down");
          window.setTimeout(() => {
            simulateInput(value, 0);
          })
        } else {
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


  info.forEach((zone, index) => {
    if (zone.type !== 'zone') return;
    if (leftHandedMode && ['left', 'right'].includes(zone.location)) {
      zone.location = (zone.location === 'left') ? 'right' : 'left';
      const amnt = JSON.parse(JSON.stringify(zone));
      if (amnt.left) {
        zone.right = amnt.left;
      }
      if (amnt.right) {
        zone.left = amnt.right;
      }
    }
    const elem = document.createElement("div");
    addEventListener(elem, "touchstart touchmove touchend touchcancel", (e) => {
      e.preventDefault();
    });
    elems[zone.location].appendChild(elem);
    const zoneObj = nipplejs.create({
      'zone': elem,
      'mode': 'static',
      'position': {
        'left': zone.left,
        'top': zone.top
      },
      'color': zone.color || 'red'
    });
    zoneObj.on('end', () => {
      simulateInput(zone.inputValues[0], 0);
      simulateInput(zone.inputValues[1], 0);
      simulateInput(zone.inputValues[2], 0);
      simulateInput(zone.inputValues[3], 0);
    });
    zoneObj.on('move', (e, info) => {
      const degree = info.angle.degree;
      const distance = info.distance;
      if (zone.joystickInput === true) {
        let x = 0, y = 0;
        if (degree > 0 && degree <= 45) {
          x = distance / 50;
          y = -0.022222222222222223 * degree * distance / 50;
        }
        if (degree > 45 && degree <= 90) {
          x = 0.022222222222222223 * (90 - degree) * distance / 50;
          y = -distance / 50;
        }
        if (degree > 90 && degree <= 135) {
          x = 0.022222222222222223 * (90 - degree) * distance / 50;
          y = -distance / 50;
        }
        if (degree > 135 && degree <= 180) {
          x = -distance / 50;
          y = -0.022222222222222223 * (180 - degree) * distance / 50;
        }
        if (degree > 135 && degree <= 225) {
          x = -distance / 50;
          y = -0.022222222222222223 * (180 - degree) * distance / 50;
        }
        if (degree > 225 && degree <= 270) {
          x = -0.022222222222222223 * (270 - degree) * distance / 50;
          y = distance / 50;
        }
        if (degree > 270 && degree <= 315) {
          x = -0.022222222222222223 * (270 - degree) * distance / 50;
          y = distance / 50;
        }
        if (degree > 315 && degree <= 359.9) {
          x = distance / 50;
          y = 0.022222222222222223 * (360 - degree) * distance / 50;
        }
        if (x > 0) {
          simulateInput(zone.inputValues[0], 0x7fff * x);
          simulateInput(zone.inputValues[1], 0);
        } else {
          simulateInput(zone.inputValues[1], 0x7fff * -x);
          simulateInput(zone.inputValues[0], 0);
        }
        if (y > 0) {
          simulateInput(zone.inputValues[2], 0x7fff * y);
          simulateInput(zone.inputValues[3], 0);
        } else {
          simulateInput(zone.inputValues[3], 0x7fff * -y);
          simulateInput(zone.inputValues[2], 0);
        }

      } else {
        if (degree >= 30 && degree < 150) {
          simulateInput(zone.inputValues[0], 1);
        } else {
          window.setTimeout(() => {
            simulateInput(zone.inputValues[0], 0);
          }, 30);
        }
        if (degree >= 210 && degree < 330) {
          simulateInput(zone.inputValues[1], 1);
        } else {
          window.setTimeout(() => {
            simulateInput(zone.inputValues[1], 0);
          }, 30);
        }
        if (degree >= 120 && degree < 240) {
          simulateInput(zone.inputValues[2], 1);
        } else {
          window.setTimeout(() => {
            simulateInput(zone.inputValues[2], 0);
          }, 30);
        }
        if (degree >= 300 || degree >= 0 && degree < 60) {
          simulateInput(zone.inputValues[3], 1);
        } else {
          window.setTimeout(() => {
            simulateInput(zone.inputValues[3], 0);
          }, 30);
        }
      }
    });
  })
}