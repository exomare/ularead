// jshint esversion: 8

var UaJth = function () {
    return {
        lines: [],
        reset: function () {
            this.lines = [];
            return this;
        },
        insert: function (fn, data,num) {
            const t = (!data) ? fn : fn(data,num);
            this.lines.unshift(t);
            return this;
        },
        append: function (fn, data, num) {
            const t = (!data) ? fn : fn(data,num);
            this.lines.push(t);
            return this;
        },
        text: function (linesep) {
            const sep = linesep || "";
            return this.lines.join(sep);
        },
        html: function (linesep) {
            const s = this.text(linesep);
            return s.replace(/\s+|\[rn]/g, ' ');
        }
    };
};
