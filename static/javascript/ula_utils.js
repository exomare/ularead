/* jshint esversion: 8 */
// release 19-04-22

var Notify = {
  element: null,
  timeout: 5000,
  wx: 0,
  wy: 0,
  center: function () {
    let w = window.innerWidth;
    this.wx = w / 2 - 100;
    let h = window.innerHeight;
    this.wy = h / 2 - 100;
    return this;
  },
  link_id: function (p_id, id, dx, dy) {
    const p = document.getElementById(p_id);
    let e = document.getElementById(id);
    this.link_element(p, e, dx, dy);
    return this;
  },
  link_element: function (p, e, dx, dy) {
    this.wx = e.offsetLeft + dx;
    const top = p.scrollTop;
    const y = e.offsetTop + dy - top;
    if (y > 0) this.wy = y;
    else this.wy = 80;
    return this;
  },
  at: function (x, y) {
    this.wx = x;
    this.wy = y;
    return this;
  },
  wait: function (t) {
    this.timeout = t;
    return this;
  },
  show: function (...args) {
    this.hide();
    let msg = args.join("<br/>");
    this.display(msg);
    if (this.timeout > 0) {
      setTimeout(() => {
        this.hide();
      }, this.timeout);
    }
    this.timeout = 0;
  },
  display: function (msg) {
    this.element = document.createElement("div");
    let e = this.element;
    let h = "<div class='msg'>" + msg + "</div>";
    e.innerHTML = h;
    e.style.cssText = `
    position:fixed;
    top:${this.wy}px;
    left:${this.wx}px;
    `;
    document.body.appendChild(e);
    e.addEventListener("mouseenter", () => {
      this.hide();
      this.timeout = 0;
    },
      false
    );
  },
  hide: function () {
    if (!this.element) return;
    this.element.parentNode.removeChild(this.element);
    this.element = null;
  },
};

var Help = {
  id: "help_id_",
  top: 70,
  left: 50,
  toggle: async function (url) {
    let w = UaWindowAdm.get(this.id);
    if (!w) {
      w = UaWindowAdm.create(this.id);
    }
    this.wnd = w;
    const resp = await fetch(url, {
      method: 'GET',
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      cache: 'default'
    });
    if (!resp.ok) {
      alert("ERROR Help()" + resp.status);
      return;
    }
    let text = await resp.text();
    let html = `<div class="top_bar">
    <a href="javascript:Help.close();">X</a></div>${text}`;
    w.setHtml(html);
    w.addClassStyle("help");
    w.setXY(Help.left, Help.top).drag();
    w.toggle();
  },
  close: function () {
    this.wnd.close();
  },
};

var UlaInfo = {
  wnd: null,
  open: function (text, x = 70, y = 50) {
    this.wnd = UaWindowAdm.get("ulainfo_id_");
    if (!this.wnd) {
      this.wnd = UaWindowAdm.create("ulainfo_id_", "lpmx_id");
      this.wnd.setXY(x, y, -1);
      this.wnd.drag();
    }
    let html = `<div class="top_bar">
    <a href="javascript:UlaInfo.close();">X</a>
    </div><div class="text">${text}</div>`;
    this.wnd.setHtml(html);
    this.wnd.addClassStyle("help");
    this.wnd.show();
  },
  close: function () {
    this.wnd.close();
  },
};

var RowsInput = {
  p_id: null,
  id: null,
  css_class: "ula_input",
  html: "",
  data: {},
  wnd: null,
  call: null,
  open: function (p_id_, id_, html_, data_, call_) {
    this.p_id = p_id_;
    this.id = id_;
    this.html = html_;
    this.data = data_;
    this.call = call_;
    this.wnd = UaWindowAdm.get(this.id);
    if (!this.wnd) {
      this.wnd = UaWindowAdm.create(this.id, this.p_id);
    }
    this.wnd.setCenterY(200, -1);
    this.wnd.drag();
    this.wnd.addClassStyle(this.css_class);
    let jt = UaJt();
    let cmd = `
    <div class="cmd">
      <div class="y" >Confirm</div>
      <div class="n" >Close</div>
    </div>
    `;
    jt.append(cmd);
    jt.append(this.html, this.data);
    let h = jt.html();
    this.wnd.setHtml(h);
    this.bind_cmd();
    return this;
  },
  bind_cmd: function () {
    const elm = document.getElementById(this.id);
    elm.querySelector("div.n").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.wnd.hide();
    });
    elm.querySelector("div.y").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      this.ok();
    });
    elm.addEventListener("keyup", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      const t = e.target;
      if (t.tagName.toLowerCase() != "input")
        return;
      let key = e.which || e.keyCode || 0;
      if (e.ctrlKey) {
        if (key == 88) {
          e.target.value = "";
          e.preventDefault();
        }
        e.stopPropagation();
        return;
      }
      if (key == "13") {
        e.preventDefault();
        e.stopImmediatePropagation();
        this.ok();
      }
    });
  },
  at: function (x, y, p = -1) {
    this.wnd.setXY(x, y, p);
    return this;
  },
  show: function () {
    this.wnd.show();
    document.querySelector("#" + this.id + " input").focus();
  },
  ok: function () {
    let root = document.getElementById(this.id);
    let inp_lst = root.querySelectorAll("input");
    let js = {};
    inp_lst.forEach(function (inp) {
      let name = inp.getAttribute("name");
      let val = inp.value;
      js[name] = val;
    });
    this.wnd.hide();
    this.call(js);
  }
};
