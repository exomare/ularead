/* jshint esversion: 8 */

let T0 = {};
var start_performance = function (k) {
  T0.k = performance.now();
};
var log_performance = function (k, msg = '') {
  const t1 = performance.now();
  const d = t1 - T0.k;
  console.log(msg, d);
  T0.k = t1;
  return d;
};

var cmd_close = function () {
  if (confirm("Chiudi Applicazione ?")) window.close();
};

var cmd_log_toggle = function () {
  UaLog.toggle();
};

var cmd_log = function (...args) {
  UaLog.log(...args);
};

var cmd_log_show = (...args) => {
  UaLog.log_show(...args);
};


var cmd_wait_start = function () {
  document.querySelector("body").classList.add("wait");
};

var cmd_wait_stop = function () {
  document.querySelector("body").classList.remove("wait");
};

// var cmd_notify_link = function (p, e, dx, dy, ...args) {
//   Notify.link_element(p, e, dx, dy).wait(5000).show(...args);
// };

// var cmd_notify_at = function (x, y, ...args) {
//   Notify.at(x, y).wait(5000).show(...args);
// };

// var cmd_notify = function (...args) {
//   Notify.center().wait(5000).show(...args);
// };

// var cmd_notify_hide = function () {
//   Notify.hide();
// };

var get_time = function () {
  const today = new Date();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  return time;
};

var sleep = function (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

var relocate = () => {
  PosMsd.resetXY();
  Msd.resetXY();
  Phon.resetXY();
  Funct.resetXY();
  FormContext.resetXY();
  FormOmogr.resetXY();
};

let LPMX_ID = null;
let TEXT_ID = null;

var Ula = {
  open: async function () {
    cmd_wait_start();
    LPMX_ID = document.getElementById("lpmx_id");
    TEXT_ID = document.getElementById("text_id");
    UaLog.setXY(-300, 0).setZ(11).new();
    let text_name = DbFormLpmx.get_text_name();
    if (!text_name) {
      // se text_name null prende il primo della lista
      DbFormLpmx.clear_store();
      const lst = await DbFormLpmx.load_text_list();
      const name = (lst.length > 0) ? lst[0] : "";
      text_name = name;
    }
    DbFormLpmx.set_text_name(text_name);
    let ok = DbFormLpmx.get_store();
    if (!ok) {
      ok = await DbFormLpmx.load_data();
      if (!ok)
        alert(text_name + "  Not Found.");
    }
    TEXT_ID.style.display = 'none';
    await FormLpmx.open();
    await PosMsd.open();
    await Phon.open();
    await Funct.open();
    await FormText.open();
    cmd_wait_stop();
    relocate();
    FormLpmx.scroll_top();
  },
  show_lpmx: async function () {
    TEXT_ID.style.display = 'none';
    LPMX_ID.style.display = 'block';
  },
  show_text: async function () {
    LPMX_ID.style.display = 'none';
    TEXT_ID.style.display = 'block';
  },
};
