/* jshint esversion: 8 */
// release 25-04-22

var PosMsdJson = {
  pmjs: {},
  read: async function () {
    const url = "cfg/pos_msd.json";
    const resp = await fetch(url, {
      method: 'GET',
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      cache: 'default'
    });
    if (resp.ok) {
      this.pmjs = await resp.json();
    } else {
      alert("pos_msd.json Not Found.");
    }
  },
  pos_sign_list: function () {
    let ks = [];
    for (let k in this.pmjs) ks.push(k);
    return ks;
  },
  get_poas_name(key) {
    return this.pmjs[key].pos_name;
  },
  get_msd_list(key) {
    let js = this.pmjs[key];
    let msd_list = js.msd_list || [];
    let le = msd_list.length;
    let rows = [];
    if (le == 0) {
      rows[0] = {
        "msd_name": "",
        "msd_attrs": "",
        "attrs": []
      };
      return rows;
    }
    for (let i = 0; i < le; i++) {
      let msd = msd_list[i];
      let row = {
        "msd_name": msd.msd_name,
        "msd_attrs": msd.attrs.join(','),
        "attrs": msd.attrs
      };
      rows.push(row);
    }

    return rows;
  }
};


var PosMsd = {
  id: 'lpmx_pos_id',
  wind: null,
  pos_selected: "",
  show: function (url) {
    if (!this.wind) return;
    this.wind.show();
  },
  hide: function () {
    if (!this.wind) return;
    this.wind.hide(this.id);
  },
  setXY: function () {
    let p = $("#lpmx_rows_head_id").offset();
    let lp_wd = $("#lpmx_rows_head_id").width();
    lp_wd = lp_wd > 500 ? lp_wd : 1060;
    const left = lp_wd + p.left + 20;
    this.wind.setXY(left, 10, -1).show();
  },
  resetXY: function () {
    this.wind.reset();
    this.setXY();
  },
  open: async function () {
    await PosMsdJson.read();
    let pos_sign_list = PosMsdJson.pos_sign_list();
    let rs = [];
    for (let pos_sign of pos_sign_list) {
      let r = ` 
  <tr class='data'> 
  <td>${pos_sign}</td> 
  </tr> 
      `;
      rs.push(r);
    }
    let html = `
<table>
<tr class='h'><td>POS</td></tr>
${rs.join("")}
</table>
     `.replace(/\s+|\[rn]/g, ' ');
    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "lpmx_id");
      this.setXY();
      this.wind.drag();
    }
    this.wind.setHtml(html);
    this.bind_pos();
    this.show();
    let td = $("#lpmx_pos_id tr.data td").first();
    this.show_msd(td);
  },
  show_msd: function (td) {
    let pos_sign = $(td).html();
    Msd.open(pos_sign);
  },
  bind_pos: function () {
    $("#lpmx_pos_id").off("click");
    $("#lpmx_pos_id").on("click ", "table tr.data td", {}, function (e) {
      $("#lpmx_pos_id tr.data td").removeClass("select");
      $(this).addClass("select");
      PosMsd.pos_selected = this.innerHTML;
      PosMsd.show_msd(this);
      Msd.toggle();
    });
    $("#lpmx_pos_id").off("mouseenter");
    $("#lpmx_pos_id")
      .on("mouseenter", "tr.data td", {}, function (event) {
        event.preventDefault();
        if (Msd.is_active)
          return;
        PosMsd.show_msd(this);
        $("#lpmx_pos_id tr.data td").removeClass("select");
      });
  }
};

var Msd = {
  id: 'lpmx_msd_id',
  wind: null,
  is_active: false,
  msd_attrs: [],
  show: function () {
    if (!this.wind) return;
    this.wind.show();
  },
  hide: function () {
    if (!this.wind) return;
    this.wind.hide(this.id);
  },
  resetXY: function () {
    this.wind.reset();
    this.setXY();
  },
  setXY: function () {
    var p = $("#lpmx_rows_head_id").offset();
    let left = $("#lpmx_rows_head_id").width() + p.left + 20;
    let top = $("#lpmx_pos_id").height() + 30;
    this.wind.setXY(left, top, -1).show();
  },
  open(pos_sign) {
    let rows = PosMsdJson.get_msd_list(pos_sign);
    let max_attr = 0;
    for (let row of rows) {
      let na = row.attrs.length;
      max_attr = Math.max(max_attr, na);
    }
    let jt = UaJt();
    let head = `
<table>
<thead>
<tr>
<th colspan="{max_attr}">
<span class="a" >{pos_name}</span>
<a href="#">Confirm</a>
</th>
</tr>
</thead>
<tbody class="nodrag">
`;
    let pos_name = PosMsdJson.get_poas_name(pos_sign);
    let data = {
      "pos_name": pos_name,
      "pos_sign": pos_sign,
      "max_attr": max_attr
    };
    jt.append(head, data);
    let i = 0;
    for (let row of rows) {
      let data = {
        "i": i,
        "msd_name": row.msd_name
      };
      let tr = '<tr n="{i}" name="{msd_name}">';
      jt.append(tr, data);
      for (let attr of row.attrs) {
        let data = { "attr": attr };
        let td = '<td name="{attr}">{attr}</td>';
        jt.append(td, data);
      }
      jt.append("</tr>");
      i++;
    }
    jt.append('</tbody></table>');
    let html = jt.html();
    if (!this.wind) {
      this.wind = UaWindowAdm.create(this.id, "lpmx_id");
      this.setXY();
      this.wind.drag();
    }
    this.wind.setHtml(html);
    this.show();
    this.bind_msd();
  },
  bind_msd: function () {
    $("#lpmx_msd_id").off("click");
    $("#lpmx_msd_id")
      .on("click", "table thead tr th a", {}, function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        Msd.set_pos_msd();
      })
      .on("click", "table tbody tr td", {}, function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        let td = $(e.currentTarget);
        let tr = td.parents('tr').first();
        let msd_name = tr.attr("name");
        let attr = td.attr("name");
        Msd.set_attr(msd_name, attr);
      });
  },
  toggle: function () {
    if (this.is_active)
      this.deactivate();
    else
      this.activate();
  },
  activate: function () {
    this.is_active = true;
    $("#lpmx_msd_id table thead tr").addClass("select");
  },
  deactivate: function () {
    this.is_active = false;
    $("#lpmx_msd_id table thead tr").removeClass("select");
    Msd.msd_attrs = [];
  },
  set_pos_msd: function () {
    if (!this.is_active)
      return;
    let pos = PosMsd.pos_selected;
    const attrs = Msd.msd_attrs.filter((x) => !!x);
    const h = attrs.join(',');
    FormLpmx.set_pos_msd(pos, h);
    this.deactivate();
  },
  set_attr: function (msd_name, attr) {
    if (!this.is_active)
      return;
    let tr = document.querySelector("#lpmx_msd_id tbody tr[name=" + msd_name + "]");
    let tr_row = tr.getAttribute('n');
    tr_row = parseInt(tr_row);
    let td = tr.querySelector("td[name='" + attr + "']");
    let td_old = tr.querySelector("td.select");
    if (!!td_old) {
      td_old.classList.remove("select");
      if (td == td_old) {
        this.msd_attrs[tr_row] = null;
        return;
      }
    }
    td.classList.add("select");
    this.msd_attrs[tr_row] = attr;
  }
};
