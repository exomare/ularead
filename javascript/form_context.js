/* jshint esversion: 8 */

var FormContext = {
    //id: "lpmx_context_id",
    top: 140,
    left: 400,
    wind: null,
    context_size: 5,
    is_context_active: true,
    key_selected: '',
    form: null,
    formkey: null,
    exe: function (cmd, arg = '') {
        switch (cmd) {
            case "unselect_tokens":
                this.unselect_tokens();
                break;
            case "add_formakey":
                if (this.is_context_active)
                    this.add_formakey(arg);
                else
                    alert("change context f/k");
                break;
            case "del_formakey":
                if (this.is_context_active)
                    this.del_formakey();
                else
                    alert("change context f/k");
                break;
            case "set_size":
                this.set_size(arg);
                break;
            case "set_context_fk":
                this.set_context_fk();
                break;
            case "close":
                this.hide();
                break;
            default:
                alert(cmd + " command not found. ");
        }
    },
    show: function () {
        if (!this.wind) return;
        this.wind.show();
    },
    hide: function () {
        FormOmogr.hide();
        if (!this.wind) return;
        this.wind.hide();
    },
    open: function (form_idx, forma, formakey) {
        FormOmogr.hide();
        this.form_idx = form_idx;
        this.form = forma;
        this.formkey = formakey;
        this.key_selected = forma == formakey ? 0 : formakey.slice(forma.length);
        this.is_context_active = true;
        this.show_html();
        FormOmogr.open(this.form);
    },
    show_html: function () {
        const cmd_html = `
        <div class="cmd" >              
        <div class="title">{fk}</div>
        <div> 
            <a cmd="unselect_tokens" class="tipb" href="#">Unselect 
            <span class="tiptextb">Unselecb Selected Tokens</span> 
        </a> 
        </div>
            <div class="add">
            <span class="tipb">Add
                <span class="tiptextb">Add new Forma</span>
            </span>
            <select name="add_formakey" cmd="add_formakey">{option_list}</select>
        </div> 
        <div class="del"> 
        <a cmd="del_formakey" class="tipb" href="#">Delete 
        <span class="tiptextb">Delete Current Forma</span> 
        </a> 
        </div>
         <div class="size">
            <span class="tipb">Size
                <span class="tiptextb">Set Size Context</span>
            </span>
            <select name="set_size" cmd="set_size">{size_list}</select>
        </div>
        <div class="fk"> 
            <a cmd="set_context_fk" class="tipb" href="#">f/k
            <span class="tiptextb">Context Forma / Formak </span> 
            </a> 
        </div>
        <div> 
            <a cmd="close" class="last" href="#">Close</a> </div>
        </div>
        `;
        // selezione dimensioni contesto
        const size = this.context_size;
        const sizes = [3, 5, 7, 9];
        const get_size_list = () => {
            let s = "<option value=''></option>";
            for (let sz of sizes)
                if (sz != size)
                    s = s + `<option value="${sz}">${sz}</option>`;
            return s;
        };

        //lista delle estensioni (key) per forme omografe
        const key = Number(this.key_selected);
        const ks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const get_fk_list = () => {
            let s = "<option value=''></option>";
            for (const k of ks)
                if (k != key)
                    s = s + `<option value="${k}">${k}</option>`;
            return s;
        };

        let jt = UaJt();
        let jtsp = UaJt();
        jt.append("<div>");
        let opt_lst = get_fk_list();
        let size_lst = get_size_list();
        jt.append(cmd_html, {
            "idx": this.form_idx,
            "fr": this.form,
            "fk": this.formkey,
            "option_list": opt_lst,
            "size_list": size_lst
        });
        jt.append('<div class="rows">');

        if (this.is_context_active) {
            // seleziona contesto con formakey e operazioni attive
            const rows = DbFormLpmx.get_formakey_context(this.formkey, this.context_size);
            for (let row of rows) {
                for (let t of row) {
                    let fk = t[1];
                    let n = t[2]; //  token_idx
                    if (fk == this.formkey) {
                        const d = { "n": n, "fk": fk };
                        jtsp.append('<span n="{n}" class="form nodrag" >{fk}</span>', d);
                    }
                    else {
                        const d = { "n": n, "fk": fk };
                        jtsp.append('<span class="token">{fk}</span>', d);
                    }
                }
                let rh = jtsp.text();
                jtsp.reset();
                jt.append('<div class="row" >{r}</div>', { "r": rh });
            }
        }
        else {
            // seleziona contesto com forma  (esteso)  e qoperazioni disattivate
            const rows = DbFormLpmx.get_forma_context(this.form, this.context_size);
            for (let row of rows) {
                for (let t of row) {
                    let fr = t[0];
                    let fk = t[1];
                    let n = t[2]; //token idx
                    if (fr == this.form) {
                        const d = { "n": n, "fk": fk };
                        jtsp.append('<span n="{n}" class="form nodrag" >{fk}</span>', d);
                    }
                    else {
                        const d = { "fk": fk };
                        jtsp.append('<span class="token">{fk}</span>', d);
                    }
                }
                let rh = jtsp.text();
                jtsp.reset();
                jt.append('<div class="row" >{r}</div>', { "r": rh });
            }
        }
        jt.append('</div></div>');
        let html = jt.html();
        if (!this.wind) {
            this.wind = UaWindowAdm.create("lpmx_context_id", "lpmx_id");
            this.wind.setXY(this.left, this.top, -1);
            this.wind.drag();
        }
        this.wind.setHtml(html);
        this.wind.show();
        this.bind_form();
    },
    bind_form: function () {
        const div_cmd = document.querySelector("#lpmx_context_id div.cmd");
        div_cmd.addEventListener("click", (ev) => {
            // ev.preventDefault();
            // ev.stopImmediatePropagation();
            const t = ev.target;
            if (t.tagName == 'A') {
                const cmd = t.getAttribute("cmd");
                this.exe(cmd, t.value);
            }
        });
        div_cmd.addEventListener("change", (ev) => {
            const t = ev.target;
            if (t.tagName == 'SELECT') {
                const cmd = t.getAttribute("cmd");
                this.exe(cmd, t.value);
            }
        });
        const span_row = document.querySelector("#lpmx_context_id div.rows");
        span_row.addEventListener("click", (ev) => {
            // ev.preventDefault();
            // ev.stopImmediatePropagation();
            const t = ev.target;
            if (t.tagName == "SPAN" && t.classList.contains("form")) {
                const tf = t.classList.contains("select");
                t.classList.toggle("select", !tf);
            }
        });
    },
    set_size: function (size) {
        this.context_size = Number(size);
        this.show_html();
    },
    set_context_fk: function () {
        this.is_context_active = !this.is_context_active;
        this.show_html();
        if (!this.is_context_active)
            $("#lpmx_context_id div.cmd div").addClass("inactive");
        else
            $("#lpmx_context_id div.cmd div").removeClass("inactive");
    },
    //deseleziona tutti i token selezionati
    unselect_tokens: function () {
        $("#lpmx_context_id div.rows div.row span.select").removeClass("select");
    },
    add_formakey: function (key) {
        let ks = key.toString();
        let key2 = ks == '0' ? '' : ks;
        let idx = this.form_idx;
        let item = DbFormLpmx.form_lst[idx];
        let form = item[0];
        let formkey = item[1];
        let formkey2 = form + key2;
        let formkey_new = false;
        if (formkey == formkey2) {
            alert(`select another extension`);
            return;
        }
        // controlla se esiste una formkey2
        let idx2 = DbFormLpmx.form_lst.findIndex(tk => tk[1] == formkey2);
        if (idx2 < 0) {
            //non  esiste
            if (!confirm(`add ${formkey2}\nmove tokens selected to ${formkey2}`))
                return;
            formkey_new = true;
            let item2 = Array(item.length).fill("");
            item2[0] = form;
            item2[1] = formkey2;
            //setta la form corrente con un omografo
            let item_omogr = FormOmogr.omogr_lst.find(e => e[1] == formkey2);
            if (!!item_omogr)
                item2 = item_omogr;
            DbFormLpmx.form_lst.splice(idx + 1, 0, item2);
            DbFormLpmx.sort_form_lst();
        }

        //formkey2 esiste
        if (!formkey_new)
            if (!confirm(`nmove tokens selected to ${formkey2}`))
                return;

        //lista degli idx dei token selezionati
        const get_tokens_selected = function () {
            let lst = document.querySelectorAll("#lpmx_context_id div.rows span.select");
            let idxs = [];
            for (let e of lst) {
                let idx = e.getAttribute('n');
                idxs.push(idx);
            }
            return idxs;
        };
        let idx_lst = get_tokens_selected();
        // setta estensione nei token selezionati
        for (let i of idx_lst) {
            let item = DbFormLpmx.token_lst[i];
            DbFormLpmx.token_lst[i][1] = item[0] + key2;
        }
        if (!formkey_new) {
            FormLpmx.form_lst2html();
            DbFormLpmx.set_store();
            //XXX this.hide(); 
            this.show_html();
            return;
        }
        FormLpmx.form_lst2html();
        // this.hide();
        DbFormLpmx.set_store();
        this.show_html();
    },
    //cancella la form corrente e sposta i tokens sulla prima form omografa
    del_formakey: function () {
        let idx = this.form_idx;
        const forma = DbFormLpmx.form_lst[idx][0];
        const is_unic = (f) => {
            const lst = DbFormLpmx.form_lst.filter((item) => item[0] == f);
            return lst.length == 1;
        };
        if (is_unic(forma)) {
            alert(`${forma} is unic, it cannot be deleted`);
            return;
        }
        const formakey = DbFormLpmx.form_lst[idx][1];
        //prima form con formakey diversa da quella corrente
        const idx0 = DbFormLpmx.form_lst.findIndex((e) => e[0] == forma && e[1] != formakey);
        let formakey0 = DbFormLpmx.form_lst[idx0][1];
        if (!confirm(`delete  ${formakey}  and move tokens to ${formakey0}`)) {
            return;
        }
        DbFormLpmx.form_lst.splice(idx, 1);
        DbFormLpmx.sort_form_lst();
        //sposta tutti i token dalla form corrente alla prima form equivalente
        DbFormLpmx.token_lst.forEach((item, index, array) => {
            if (item[1] == formakey) {
                array[index][1] = formakey0;
            }
        });
        FormLpmx.form_lst2html();
        this.hide();
        DbFormLpmx.set_store();
    },
    resetXY: function () {
        if (!this.wind) return;
        this.wind.reset();
        if (this.wind.isVisible)
            this.wind.show();
    }
};



var FormOmogr = {
    //id: "lpmx_omogr_id",
    top: 50,
    left: 200,
    wind: null,
    forma: null,
    omogr_lst: [],
    show: function () {
        if (!this.wind) return;
        this.wind.show();
    },
    hide: function () {
        if (!this.wind) return;
        this.wind.hide();
    },
    open: function (forma) {
        this.forma = forma;
        const dupl_js = DbFormLpmx.omogr_json;
        if (!dupl_js || dupl_js == {})
            return;
        const rows = dupl_js[forma] || [];
        if (rows.length == 0)
            return;
        this.omogr_lst = rows;
        const cmd_dupl = `
        <div class="cmd" >       
        Homographs
        </div>
        `;
        let jt = UaJt();
        jt.append(cmd_dupl);
        //["amor", "amor", "lemma", "etimo", "it.", "NOUN", "Noun", "fem"],
        jt.append("<table>");
        const tr_h = `
        <tr class="data">
          <td class='f'>{f}</td>
          <td class='fk'>{fk}</td>
          <td class='l'>{l}</td>
          <td class='e'>{e}</td>
          <td class='ph'>{ph} </td>
          <td class='p' >{p}</td>
          <td class='fn' >{fn}</td>
          <td class='m' >{m}</td>
        </tr>
        `;
        for (let r of rows) {
            let d = {
                "f": r[0],
                "fk": r[1],
                "l": r[2],
                "e": r[3],
                "ph": r[4],
                "p": r[5],
                "fn": r[6],
                "m": r[7]
            };
            jt.append(tr_h, d);
        }
        jt.append('</table>');
        let html = jt.html();
        if (!this.wind) {
            this.wind = UaWindowAdm.create("lpmx_omogr_id", "lpmx_id");
            this.wind.drag();
        }
        this.setXY();
        this.wind.setHtml(html);
        this.wind.show();
        this.setXY();
    },
    setXY: function () {
        let rt = get_pos("#lpmx_context_id", "#lpmx_omogr_id");
        rt = check_over(rt);
        if (rt.over)
            this.wind.reset();
        this.wind.setXY(rt.left0, rt.top1, -1).show();
    },
    resetXY: function () {
        if (!this.wind) return;
        this.wind.reset();
        this.setXY();
        if (this.wind.isVisible)
            this.wind.show();
    }
};

var get_pos = function (id0, id1) {
    const e0 = $(id0);
    const p0 = e0.offset();
    const left0 = p0.left;
    const top0 = p0.top;
    const bot0 = top0 + e0.height();
    const e1 = $(id1);
    const p1 = e1.offset();
    const top1 = p1.top;
    const heg1 = e1.height();
    const bot1 = top1 + heg1;
    return {
        "left0": left0,
        "top0": Math.trunc(top0),
        "bot0": Math.trunc(bot0),
        "top1": Math.trunc(top1),
        "bot1": Math.trunc(bot1),
        "heg1": Math.trunc(heg1),
    };

};

var check_over = function (r) {
    let is_over = false;
    if (r.top1 == 0) {
        const d = r.heg1 + 5;
        r.top1 = r.top0 - d;
        r.over = is_over;
        return r;
    }
    const un = r.top1 - r.bot0 > 0; //sotto
    const ov = r.top0 - r.bot1 > 0; // sopra
    is_over = !(un || ov);
    if (is_over) {
        const d = r.heg1 + 5;
        r.top1 = r.top0 - d;
        r.bot1 = r.top1 + r.heg1;
        const un = r.top1 - r.bot0 > 0; //sotto
        const ov = r.top0 - r.bot1 > 0; // sopra
        if (!(un || ov) || r.top1 < 40)
            r.top1 = r.bot0 + 10;
    }
    r.over = is_over;
    return r;
};
