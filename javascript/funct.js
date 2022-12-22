/* jshint esversion: 8 */

var Funct = {
    id: 'lpmx_funct_id',
    url: "cfg/funct.csv",
    wind: null,
    left: 0,
    top: 0,
    show: function (url) {
        if (!this.wind) return;
        this.wind.show();
    },
    hide: function () {
        if (!this.wind) return;
        this.wind.hide(this.id);
    },
    setXY: function () {
        this.wind.setXY(this.left, this.top, -1).show();
    },
    resetXY: function () {
        this.wind.reset();
        this.setXY();
    },
    read: async function () {
        let url = this.url;
        const resp = await fetch(url, {
            method: 'GET',
            headers: { "Content-Type": "text/plain;charset=UTF-8" },
            cache: 'default'
        });
        if (resp.ok) {
            let csv_data = await resp.text();
            let rows = csv_data.trim().split("\n");
            return rows;
        }
        else {
            alert(`${url} Not Found.`);
            return [];
        }
    },
    open: async function () {
        let rows = await this.read();
        let rs = [];
        for (let row of rows) {
            let r = `<tr class="d"> <td>${row}</td> </tr> `;
            rs.push(r);
        }
        let html = `
<table>
<tr class='h'><td>FUNCT</td></tr>
${rs.join("")}
</table>
     `.replace(/\s+|\[rn]/g, ' ');
        if (!this.wind) {
            this.wind = UaWindowAdm.create(this.id, "lpmx_id");
            this.wind.linkToId("lpmx_phon_id", 10, 0, -1);
            this.wind.drag();
        }
        this.wind.setHtml(html);
        this.bind_funct();
        this.show();
        const p = $("#" + this.id).offset();
        this.left = p.left;
        this.top = p.top;
    },
    bind_funct: function () {
        $("#lpmx_funct_id").off("click");
        $("#lpmx_funct_id").on("click ", "table tr.d td", {}, function (e) {
            let funct = $(this).html();
            FormLpmx.set_funct(funct);
        });
    }
};

