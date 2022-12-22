/* jshint esversion: 8 */

const cmd_h = `
<div class="cmd" >  
<button type="button" class="tipt" cmd="enable">Enable
<span class="tiptextt">Abilita apertura automatica</span>
</button>
<button type="button" class="tipt" cmd="disable">Disable
<span class="tiptextt">Disabilita apertura automatica</span>
</button>
<button type="button" cmd="close">Close</button>
</div>

<table row_text_num="{row_text_num}">
<tr class="h">
<th class="to">F</th>
<th class="to">C</th>
<th class="f">form</th>
<th>form</th>
<th>lemma</th>
<th>etimo</th>
<th>lang</th>
<th>POS</th>
<th>func</th>
<th>MSD</th>
</tr>
`;

var FormTextRow = {
  id: "text_row_id",
  top: 50,
  left: 300,
  wind: null,
  word_lst: [],
  row_text_num: null,
  exe: function (cmd) {
    switch (cmd) {
      case "disable":
        FormText.disable_row();
        break;
      case "enable":
        FormText.enable_row();
        break;
      case "close":
        this.hide();
        break;
      default:
        alert("command not found.");
    }
  },
  toggle: function () {
    if (!this.wind) return;
    this.wind.toggle();
  },
  show: function () {
    if (!this.wind) return;
    this.wind.show();
  },
  hide: function () {
    if (!this.wind) return;
    this.wind.hide();
  },
  open: function (row_text_num, w_lst) {
    this.row_text_num = row_text_num;
    let jt = UaJt();
    let d = {
      row_text_num: row_text_num,
    };
    jt.append(cmd_h, d);
    // css class find per evidenziare token selezionati
    const tr_h = `
    <tr class='data'>
      <td class='tofk' name='{tk}'>f</td>
      <td class='tocn' name='{tk}'>c</td>
      <td class='t'>{t}</td>
      <td class='tk'>{tk}</td>
      <td class='f'>{f}</td>
      <td class='fk {find}'>{fk}</td>
      <td class='l'>{l}</td>
      <td class='e'>{e}</td>
      <td class='ph'>{ph} </td>
      <td class='p' >{p}</td>
      <td class='fn' >{fn}</td>
      <td class='m' >{m}</td>
    </tr>
    `;
    for (let w of w_lst) {
      let d = {
        t: w.t,
        tk: w.tk,
        f: w.f,
        fk: w.fk,
        l: w.l,
        e: w.e,
        ph: w.ph,
        p: w.pm,
        fn: w.fn,
        m: w.m,
        find: w.find || "",
      };
      jt.append(tr_h, d);
    }
    jt.append("</table>");
    let html = jt.html();

    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "text_id");
      this.wind.setXY(this.left, this.top, -1).show();
      this.wind.drag();
    }
    this.wind.setHtml(html);
    this.wind.show();
    this.bind();
  },
  bind: function () {
    $("#" + this.id).off("click");
    $("#" + this.id)
      .on("click", "div.cmd button", {}, (e) => {
        // e.preventDefault();
        e.stopImmediatePropagation();
        let t = e.currentTarget;
        let cmd = t.getAttribute("cmd");
        this.exe(cmd);
      })
      .on("click", "td.tofk", {}, (e) => {
        e.stopImmediatePropagation();
        const t = e.currentTarget;
        const fk = t.getAttribute("name");
        (async (x) => {
          await Ula.show_lpmx();
          FormLpmx.scroll2form(x, 10);
        })(fk);
      })
      .on("click", "td.tocn", {}, (e) => {
        e.stopImmediatePropagation();
        const t = e.currentTarget;
        const fk = t.getAttribute("name");
        const tr_focus = $(e.target).parents("tr");
        let form = tr_focus.find("td.f").html();
        let formkey = tr_focus.find("td.fk").html();
        (async () => {
          await Ula.show_lpmx();
          const form_idx=FormLpmx.scroll2form(fk, 10);
          FormLpmx.open_context(form_idx, form, formkey);
        })();
      });
  },
  resetXY: function () {
    if (!this.wind) return;
    this.wind.reset();
    if (this.wind.isVisible) this.wind.show();
  },
};
