/*

thank u Joe Hohertz (https://github.com/jhohertz)
..for writing this emulator 6510 - saved me alot of time!

https://github.com/jhohertz/jsSID/blob/develop/js/jssid.mos6510.js

*/

let MOS6510 = function (mem) {

    // other internal values
    this.cycles = 0;
    this.bval = 0;
    this.wval = 0;

    this.mem = [...mem];

    this.cpuReset();
}

MOS6510.prototype.getmem = function (addr) {
    return this.mem[addr];
};

MOS6510.prototype.setmem = function (addr, value) {
    this.mem[addr] = value;
};

// just like pc++, but with bound check on pc after
MOS6510.prototype.pcinc = function () {
    var pc = this.pc++;
    this.pc &= 0xffff;
    return pc;
};

MOS6510.prototype.getaddr = function (mode) {

    var ad, ad2;
    switch (mode) {
        case MOS6510.mode.imp:
            this.cycles += 2;
            return 0;
        case MOS6510.mode.imm:
            this.cycles += 2;
            return this.getmem(this.pcinc());
        case MOS6510.mode.abs:
            this.cycles += 4;
            ad = this.getmem(this.pcinc());
            ad |= this.getmem(this.pcinc()) << 8;
            return this.getmem(ad);
        case MOS6510.mode.absx:
            this.cycles += 4;
            ad = this.getmem(this.pcinc());
            ad |= 256 * this.getmem(this.pcinc());
            ad2 = ad + this.x;
            ad2 &= 0xffff;
            if ((ad2 & 0xff00) != (ad & 0xff00)) this.cycles++;
            return this.getmem(ad2);
        case MOS6510.mode.absy:
            this.cycles += 4;
            ad = this.getmem(this.pcinc());
            ad |= 256 * this.getmem(this.pcinc());
            ad2 = ad + this.y;
            ad2 &= 0xffff;
            if ((ad2 & 0xff00) != (ad & 0xff00)) this.cycles++;
            return this.getmem(ad2);
        case MOS6510.mode.zp:
            this.cycles += 3;
            ad = this.getmem(this.pcinc());
            return this.getmem(ad);
        case MOS6510.mode.zpx:
            this.cycles += 4;
            ad = this.getmem(this.pcinc());
            ad += this.x;
            return this.getmem(ad & 0xff);
        case MOS6510.mode.zpy:
            this.cycles += 4;
            ad = this.getmem(this.pcinc());
            ad += this.y;
            return this.getmem(ad & 0xff);
        case MOS6510.mode.indx:
            this.cycles += 6;
            ad = this.getmem(this.pcinc());
            ad += this.x;
            ad2 = this.getmem(ad & 0xff);
            ad++;
            ad2 |= this.getmem(ad & 0xff) << 8;
            return this.getmem(ad2);
        case MOS6510.mode.indy:
            this.cycles += 5;
            ad = this.getmem(this.pcinc());
            ad2 = this.getmem(ad);
            ad2 |= this.getmem((ad + 1) & 0xff) << 8;
            ad = ad2 + this.y;
            ad &= 0xffff;
            if ((ad2 & 0xff00) != (ad & 0xff00)) this.cycles++;
            return this.getmem(ad);
        case MOS6510.mode.acc:
            this.cycles += 2;
            return this.a;
    }
    console.log("getaddr: attempted unhandled mode");
    return 0;

};

MOS6510.prototype.setaddr = function (mode, val) {
    var ad, ad2;
    // FIXME: not checking pc addresses as all should be relative to a valid instruction
    switch (mode) {
        case MOS6510.mode.abs:
            this.cycles += 2;
            ad = this.getmem(this.pc - 2);
            ad |= 256 * this.getmem(this.pc - 1);
            this.setmem(ad, val);
            return;
        case MOS6510.mode.absx:
            this.cycles += 3;
            ad = this.getmem(this.pc - 2);
            ad |= 256 * this.getmem(this.pc - 1);
            ad2 = ad + this.x;
            ad2 &= 0xffff;
            if ((ad2 & 0xff00) != (ad & 0xff00)) this.cycles--;
            this.setmem(ad2, val);
            return;
        case MOS6510.mode.zp:
            this.cycles += 2;
            ad = this.getmem(this.pc - 1);
            this.setmem(ad, val);
            return;
        case MOS6510.mode.zpx:
            this.cycles += 2;
            ad = this.getmem(this.pc - 1);
            ad += this.x;
            this.setmem(ad & 0xff, val);
            return;
        case MOS6510.mode.acc:
            this.a = val;
            return;
    }
    console.log("setaddr: attempted unhandled mode");
};

MOS6510.prototype.putaddr = function (mode, val) {
    var ad, ad2;
    switch (mode) {
        case MOS6510.mode.abs:
            this.cycles += 4;
            ad = this.getmem(this.pcinc());
            ad |= this.getmem(this.pcinc()) << 8;
            this.setmem(ad, val);
            return;
        case MOS6510.mode.absx:
            this.cycles += 4;
            ad = this.getmem(this.pcinc());
            ad |= this.getmem(this.pcinc()) << 8;
            ad2 = ad + this.x;
            ad2 &= 0xffff;
            this.setmem(ad2, val);
            return;
        case MOS6510.mode.absy:
            this.cycles += 4;
            ad = this.getmem(this.pcinc());
            ad |= this.getmem(this.pcinc()) << 8;
            ad2 = ad + this.y;
            ad2 &= 0xffff;
            if ((ad2 & 0xff00) != (ad & 0xff00)) this.cycles++;
            this.setmem(ad2, val);
            return;
        case MOS6510.mode.zp:
            this.cycles += 3;
            ad = this.getmem(this.pcinc());
            this.setmem(ad, val);
            return;
        case MOS6510.mode.zpx:
            this.cycles += 4;
            ad = this.getmem(this.pcinc());
            ad += this.x;
            this.setmem(ad & 0xff, val);
            return;
        case MOS6510.mode.zpy:
            this.cycles += 4;
            ad = this.getmem(this.pcinc());
            ad += this.y;
            this.setmem(ad & 0xff, val);
            return;
        case MOS6510.mode.indx:
            this.cycles += 6;
            ad = this.getmem(this.pcinc());
            ad += this.x;
            ad2 = this.getmem(ad & 0xff);
            ad++;
            ad2 |= this.getmem(ad & 0xff) << 8;
            this.setmem(ad2, val);
            return;
        case MOS6510.mode.indy:
            this.cycles += 5;
            ad = this.getmem(this.pcinc());
            ad2 = this.getmem(ad);
            ad2 |= this.getmem((ad + 1) & 0xff) << 8;
            ad = ad2 + this.y;
            ad &= 0xffff;
            this.setmem(ad, val);
            return;
        case MOS6510.mode.acc:
            this.cycles += 2;
            this.a = val;
            return;
    }
    console.log("putaddr: attempted unhandled mode");
};

MOS6510.prototype.setflags = function (flag, cond) {
    if (cond) {
        this.p |= flag;
    } else {
        this.p &= ~flag & 0xff;
    }
};

MOS6510.prototype.push = function (val) {
    this.setmem(0x100 + this.s, val);
    if (this.s) this.s--;
};

MOS6510.prototype.pop = function () {
    if (this.s < 0xff) this.s++;
    return this.getmem(0x100 + this.s);
};

MOS6510.prototype.branch = function (flag) {
    var dist = this.getaddr(MOS6510.mode.imm);
    // FIXME: while this was checked out, it still seems too complicated
    // make signed
    if (dist & 0x80) {
        dist = 0 - ((~dist & 0xff) + 1);
    }

    // this here needs to be extracted for general 16-bit rounding needs
    this.wval = this.pc + dist;
    // FIXME: added boundary checks to wrap around. Not sure this is whats needed
    if (this.wval < 0) this.wval += 65536;
    this.wval &= 0xffff;
    if (flag) {
        this.cycles += ((this.pc & 0x100) != (this.wval & 0x100)) ? 2 : 1;
        this.pc = this.wval;
    }
};

MOS6510.prototype.cpuReset = function () {
    this.a = 0;
    this.x = 0;
    this.y = 0;
    this.p = 0;
    this.s = 255;
    this.pc = this.getmem(0xfffc);
    this.pc |= 256 * this.getmem(0xfffd);
};

MOS6510.prototype.cpuResetTo = function (npc, na) {
    this.a = na || 0;
    this.x = 0;
    this.y = 0;
    this.p = 0;
    this.s = 255;
    this.pc = npc;
};

MOS6510.prototype.cpuParse = function () {
    var c;
    this.cycles = 0;

    var opc = this.getmem(this.pcinc());
    var cmd = MOS6510.opcodes[opc][0];
    var addr = MOS6510.opcodes[opc][1];

    switch (cmd) {
        case MOS6510.inst.adc:
            this.wval = this.a + this.getaddr(addr) + ((this.p & MOS6510.flag.C) ? 1 : 0);
            this.setflags(MOS6510.flag.C, this.wval & 0x100);
            this.a = this.wval & 0xff;
            this.setflags(MOS6510.flag.Z, !this.a);
            this.setflags(MOS6510.flag.N, this.a & 0x80);
            this.setflags(MOS6510.flag.V, ((this.p & MOS6510.flag.C) ? 1 : 0) ^ ((this.p & MOS6510.flag.N) ? 1 : 0));
            break;
        case MOS6510.inst.and:
            this.bval = this.getaddr(addr);
            this.a &= this.bval;
            this.setflags(MOS6510.flag.Z, !this.a);
            this.setflags(MOS6510.flag.N, this.a & 0x80);
            break;
        case MOS6510.inst.asl:
            this.wval = this.getaddr(addr);
            this.wval <<= 1;
            this.setaddr(addr, this.wval & 0xff);
            this.setflags(MOS6510.flag.Z, !this.wval);
            this.setflags(MOS6510.flag.N, this.wval & 0x80);
            this.setflags(MOS6510.flag.C, this.wval & 0x100);
            break;
        case MOS6510.inst.bcc:
            this.branch(!(this.p & MOS6510.flag.C));
            break;
        case MOS6510.inst.bcs:
            this.branch(this.p & MOS6510.flag.C);
            break;
        case MOS6510.inst.bne:
            this.branch(!(this.p & MOS6510.flag.Z));
            break;
        case MOS6510.inst.beq:
            this.branch(this.p & MOS6510.flag.Z);
            break;
        case MOS6510.inst.bpl:
            this.branch(!(this.p & MOS6510.flag.N));
            break;
        case MOS6510.inst.bmi:
            this.branch(this.p & MOS6510.flag.N);
            break;
        case MOS6510.inst.bvc:
            this.branch(!(this.p & MOS6510.flag.V));
            break;
        case MOS6510.inst.bvs:
            this.branch(this.p & MOS6510.flag.V);
            break;
        case MOS6510.inst.bit:
            this.bval = this.getaddr(addr);
            this.setflags(MOS6510.flag.Z, !(this.a & this.bval));
            this.setflags(MOS6510.flag.N, this.bval & 0x80);
            this.setflags(MOS6510.flag.V, this.bval & 0x40);
            break;
        case MOS6510.inst.brk:
            this.pc = 0;	// just quit per rockbox
            break;
        case MOS6510.inst.clc:
            this.cycles += 2;
            this.setflags(MOS6510.flag.C, 0);
            break;
        case MOS6510.inst.cld:
            this.cycles += 2;
            this.setflags(MOS6510.flag.D, 0);
            break;
        case MOS6510.inst.cli:
            this.cycles += 2;
            this.setflags(MOS6510.flag.I, 0);
            break;
        case MOS6510.inst.clv:
            this.cycles += 2;
            this.setflags(MOS6510.flag.V, 0);
            break;
        case MOS6510.inst.cmp:
            this.bval = this.getaddr(addr);
            this.wval = this.a - this.bval;
            // FIXME: may not actually be needed (yay 2's complement)
            if (this.wval < 0) this.wval += 256;
            this.setflags(MOS6510.flag.Z, !this.wval);
            this.setflags(MOS6510.flag.N, this.wval & 0x80);
            this.setflags(MOS6510.flag.C, this.a >= this.bval);
            break;
        case MOS6510.inst.cpx:
            this.bval = this.getaddr(addr);
            this.wval = this.x - this.bval;
            // FIXME: may not actually be needed (yay 2's complement)
            if (this.wval < 0) this.wval += 256;
            this.setflags(MOS6510.flag.Z, !this.wval);
            this.setflags(MOS6510.flag.N, this.wval & 0x80);
            this.setflags(MOS6510.flag.C, this.x >= this.bval);
            break;
        case MOS6510.inst.cpy:
            this.bval = this.getaddr(addr);
            this.wval = this.y - this.bval;
            // FIXME: may not actually be needed (yay 2's complement)
            if (this.wval < 0) this.wval += 256;
            this.setflags(MOS6510.flag.Z, !this.wval);
            this.setflags(MOS6510.flag.N, this.wval & 0x80);
            this.setflags(MOS6510.flag.C, this.y >= this.bval);
            break;
        case MOS6510.inst.dec:
            this.bval = this.getaddr(addr);
            this.bval--;
            // FIXME: may be able to just mask this (yay 2's complement)
            if (this.bval < 0) this.bval += 256;
            this.setaddr(addr, this.bval);
            this.setflags(MOS6510.flag.Z, !this.bval);
            this.setflags(MOS6510.flag.N, this.bval & 0x80);
            break;
        case MOS6510.inst.dex:
            this.cycles += 2;
            this.x--;
            // FIXME: may be able to just mask this (yay 2's complement)
            if (this.x < 0) this.x += 256;
            this.setflags(MOS6510.flag.Z, !this.x);
            this.setflags(MOS6510.flag.N, this.x & 0x80);
            break;
        case MOS6510.inst.dey:
            this.cycles += 2;
            this.y--;
            // FIXME: may be able to just mask this (yay 2's complement)
            if (this.y < 0) this.y += 256;
            this.setflags(MOS6510.flag.Z, !this.y);
            this.setflags(MOS6510.flag.N, this.y & 0x80);
            break;
        case MOS6510.inst.eor:
            this.bval = this.getaddr(addr);
            this.a ^= this.bval;
            this.setflags(MOS6510.flag.Z, !this.a);
            this.setflags(MOS6510.flag.N, this.a & 0x80);
            break;
        case MOS6510.inst.inc:
            this.bval = this.getaddr(addr);
            this.bval++;
            this.bval &= 0xff;
            this.setaddr(addr, this.bval);
            this.setflags(MOS6510.flag.Z, !this.bval);
            this.setflags(MOS6510.flag.N, this.bval & 0x80);
            break;
        case MOS6510.inst.inx:
            this.cycles += 2;
            this.x++;
            this.x &= 0xff;
            this.setflags(MOS6510.flag.Z, !this.x);
            this.setflags(MOS6510.flag.N, this.x & 0x80);
            break;
        case MOS6510.inst.iny:
            this.cycles += 2;
            this.y++;
            this.y &= 0xff;
            this.setflags(MOS6510.flag.Z, !this.y);
            this.setflags(MOS6510.flag.N, this.y & 0x80);
            break;
        case MOS6510.inst.jmp:
            this.cycles += 3;
            this.wval = this.getmem(this.pcinc());
            this.wval |= 256 * this.getmem(this.pcinc());
            switch (addr) {
                case MOS6510.mode.abs:
                    this.pc = this.wval;
                    break;
                case MOS6510.mode.ind:
                    this.pc = this.getmem(this.wval);
                    this.pc |= 256 * this.getmem((this.wval + 1) & 0xffff);
                    this.cycles += 2;
                    break;
            }
            break;
        case MOS6510.inst.jsr:
            this.cycles += 6;
            this.push(((this.pc + 1) & 0xffff) >> 8);
            this.push((this.pc + 1) & 0xff);
            this.wval = this.getmem(this.pcinc());
            this.wval |= 256 * this.getmem(this.pcinc());
            this.pc = this.wval;
            break;
        case MOS6510.inst.lda:
            this.a = this.getaddr(addr);
            this.setflags(MOS6510.flag.Z, !this.a);
            this.setflags(MOS6510.flag.N, this.a & 0x80);
            break;
        case MOS6510.inst.ldx:
            this.x = this.getaddr(addr);
            this.setflags(MOS6510.flag.Z, !this.x);
            this.setflags(MOS6510.flag.N, this.x & 0x80);
            break;
        case MOS6510.inst.ldy:
            this.y = this.getaddr(addr);
            this.setflags(MOS6510.flag.Z, !this.y);
            this.setflags(MOS6510.flag.N, this.y & 0x80);
            break;
        case MOS6510.inst.lsr:
            this.bval = this.getaddr(addr);
            this.wval = this.bval;
            this.wval >>= 1;
            this.setaddr(addr, this.wval & 0xff);
            this.setflags(MOS6510.flag.Z, !this.wval);
            this.setflags(MOS6510.flag.N, this.wval & 0x80);
            this.setflags(MOS6510.flag.C, this.bval & 1);
            break;
        case MOS6510.inst.nop:
            this.cycles += 2;
            break;
        case MOS6510.inst.ora:
            this.bval = this.getaddr(addr);
            this.a |= this.bval;
            this.setflags(MOS6510.flag.Z, !this.a);
            this.setflags(MOS6510.flag.N, this.a & 0x80);
            break;
        case MOS6510.inst.pha:
            this.push(this.a);
            this.cycles += 3;
            break;
        case MOS6510.inst.php:
            this.push(this.p);
            this.cycles += 3;
            break;
        case MOS6510.inst.pla:
            this.a = this.pop();
            this.setflags(MOS6510.flag.Z, !this.a);
            this.setflags(MOS6510.flag.N, this.a & 0x80);
            this.cycles += 4;
            break;
        case MOS6510.inst.plp:
            this.p = this.pop();
            this.cycles += 4;
            break;
        case MOS6510.inst.rol:
            this.bval = this.getaddr(addr);
            c = (this.p & MOS6510.flag.C) ? 1 : 0;
            this.setflags(MOS6510.flag.C, this.bval & 0x80);
            this.bval <<= 1;
            this.bval |= c;
            this.bval &= 0xff;
            this.setaddr(addr, this.bval);
            this.setflags(MOS6510.flag.N, this.bval & 0x80);
            this.setflags(MOS6510.flag.Z, !this.bval);
            break;
        case MOS6510.inst.ror:
            this.bval = this.getaddr(addr);
            c = (this.p & MOS6510.flag.C) ? 128 : 0;
            this.setflags(MOS6510.flag.C, this.bval & 1);
            this.bval >>= 1;
            this.bval |= c;
            this.setaddr(addr, this.bval);
            this.setflags(MOS6510.flag.N, this.bval & 0x80);
            this.setflags(MOS6510.flag.Z, !this.bval);
            break;
        case MOS6510.inst.rti:
            throw Error('rti not supported');
        // treat like RTS
        case MOS6510.inst.rts:
            this.wval = this.pop();
            this.wval |= 256 * this.pop();
            this.pc = this.wval + 1;
            this.cycles += 6;
            break;
        case MOS6510.inst.sbc:
            this.bval = this.getaddr(addr) ^ 0xff;
            this.wval = this.a + this.bval + ((this.p & MOS6510.flag.C) ? 1 : 0);
            this.setflags(MOS6510.flag.C, this.wval & 0x100);
            this.a = this.wval & 0xff;
            this.setflags(MOS6510.flag.Z, !this.a);
            this.setflags(MOS6510.flag.N, this.a > 127);
            this.setflags(MOS6510.flag.V, ((this.p & MOS6510.flag.C) ? 1 : 0) ^ ((this.p & MOS6510.flag.N) ? 1 : 0));
            break;
        case MOS6510.inst.sec:
            this.cycles += 2;
            this.setflags(MOS6510.flag.C, 1);
            break;
        case MOS6510.inst.sed:
            this.cycles += 2;
            this.setflags(MOS6510.flag.D, 1);
            break;
        case MOS6510.inst.sei:
            this.cycles += 2;
            this.setflags(MOS6510.flag.I, 1);
            break;
        case MOS6510.inst.sta:
            this.putaddr(addr, this.a);
            break;
        case MOS6510.inst.stx:
            this.putaddr(addr, this.x);
            break;
        case MOS6510.inst.sty:
            this.putaddr(addr, this.y);
            break;
        case MOS6510.inst.tax:
            this.cycles += 2;
            this.x = this.a;
            this.setflags(MOS6510.flag.Z, !this.x);
            this.setflags(MOS6510.flag.N, this.x & 0x80);
            break;
        case MOS6510.inst.tay:
            this.cycles += 2;
            this.y = this.a;
            this.setflags(MOS6510.flag.Z, !this.y);
            this.setflags(MOS6510.flag.N, this.y & 0x80);
            break;
        case MOS6510.inst.tsx:
            this.cycles += 2;
            this.x = this.s;
            this.setflags(MOS6510.flag.Z, !this.x);
            this.setflags(MOS6510.flag.N, this.x & 0x80);
            break;
        case MOS6510.inst.txa:
            this.cycles += 2;
            this.a = this.x;
            this.setflags(MOS6510.flag.Z, !this.a);
            this.setflags(MOS6510.flag.N, this.a & 0x80);
            break;
        case MOS6510.inst.txs:
            this.cycles += 2;
            this.s = this.x;
            break;
        case MOS6510.inst.tya:
            this.cycles += 2;
            this.a = this.y;
            this.setflags(MOS6510.flag.Z, !this.a);
            this.setflags(MOS6510.flag.N, this.a & 0x80);
            break;
        default:
            console.log("cpuParse: attempted unhandled instruction, opcode: ", opc);
    }

    return this.cycles;

};

MOS6510.prototype.cpuJSR = function (npc, na) {
    var ccl = 0;

    this.a = na;
    this.x = 0;
    this.y = 0;
    this.p = 0;
    this.s = 255;
    this.pc = npc;
    this.push(0);
    this.push(0);

    while (this.pc > 1) {
        ccl += this.cpuParse();
    }
    return ccl;
};

// Flags Enum
MOS6510.flag = Object.freeze({
    N: 128, V: 64, B: 16, D: 8, I: 4, Z: 2, C: 1
});


// Opcodes Enum
MOS6510.inst = Object.freeze({
    adc: {}, and: {}, asl: {}, bcc: {}, bcs: {}, beq: {}, bit: {}, bmi: {}, bne: {}, bpl: {}, brk: {}, bvc: {}, bvs: {}, clc: {},
    cld: {}, cli: {}, clv: {}, cmp: {}, cpx: {}, cpy: {}, dec: {}, dex: {}, dey: {}, eor: {}, inc: {}, inx: {}, iny: {}, jmp: {},
    jsr: {}, lda: {}, ldx: {}, ldy: {}, lsr: {}, nop: {}, ora: {}, pha: {}, php: {}, pla: {}, plp: {}, rol: {}, ror: {}, rti: {},
    rts: {}, sbc: {}, sec: {}, sed: {}, sei: {}, sta: {}, stx: {}, sty: {}, tax: {}, tay: {}, tsx: {}, txa: {}, txs: {}, tya: {},
    xxx: {}
});

// Modes Enum
MOS6510.mode = Object.freeze({
    imp: {}, imm: {}, abs: {}, absx: {}, absy: {}, zp: {}, zpx: {}, zpy: {}, ind: {}, indx: {}, indy: {}, acc: {}, rel: {}, xxx: {}
});


// 256 entries, each entry array pair of [inst, mode]
MOS6510.opcodes = new Array(
    [MOS6510.inst.brk, MOS6510.mode.imp],							// 0x00
    [MOS6510.inst.ora, MOS6510.mode.indx],							// 0x01
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x02
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x03
    [MOS6510.inst.xxx, MOS6510.mode.zp],							// 0x04
    [MOS6510.inst.ora, MOS6510.mode.zp],							// 0x05
    [MOS6510.inst.asl, MOS6510.mode.zp],							// 0x06
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x07
    [MOS6510.inst.php, MOS6510.mode.imp],							// 0x08
    [MOS6510.inst.ora, MOS6510.mode.imm],							// 0x09
    [MOS6510.inst.asl, MOS6510.mode.acc],							// 0x0a
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x0b
    [MOS6510.inst.xxx, MOS6510.mode.abs],							// 0x0c
    [MOS6510.inst.ora, MOS6510.mode.abs],							// 0x0d
    [MOS6510.inst.asl, MOS6510.mode.abs],							// 0x0e
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x0f

    [MOS6510.inst.bpl, MOS6510.mode.rel],							// 0x10
    [MOS6510.inst.ora, MOS6510.mode.indy],							// 0x11
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x12
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x13
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x14
    [MOS6510.inst.ora, MOS6510.mode.zpx],							// 0x15
    [MOS6510.inst.asl, MOS6510.mode.zpx],							// 0x16
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x17
    [MOS6510.inst.clc, MOS6510.mode.imp],							// 0x18
    [MOS6510.inst.ora, MOS6510.mode.absy],							// 0x19
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x1a
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x1b
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x1c
    [MOS6510.inst.ora, MOS6510.mode.absx],							// 0x1d
    [MOS6510.inst.asl, MOS6510.mode.absx],							// 0x1e
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x1f

    [MOS6510.inst.jsr, MOS6510.mode.abs],							// 0x20
    [MOS6510.inst.and, MOS6510.mode.indx],							// 0x21
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x22
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x23
    [MOS6510.inst.bit, MOS6510.mode.zp],							// 0x24
    [MOS6510.inst.and, MOS6510.mode.zp],							// 0x25
    [MOS6510.inst.rol, MOS6510.mode.zp],							// 0x26
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x27
    [MOS6510.inst.plp, MOS6510.mode.imp],							// 0x28
    [MOS6510.inst.and, MOS6510.mode.imm],							// 0x29
    [MOS6510.inst.rol, MOS6510.mode.acc],							// 0x2a
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x2b
    [MOS6510.inst.bit, MOS6510.mode.abs],							// 0x2c
    [MOS6510.inst.and, MOS6510.mode.abs],							// 0x2d
    [MOS6510.inst.rol, MOS6510.mode.abs],							// 0x2e
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x2f

    [MOS6510.inst.bmi, MOS6510.mode.rel],							// 0x30
    [MOS6510.inst.and, MOS6510.mode.indy],							// 0x31
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x32
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x33
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x34
    [MOS6510.inst.and, MOS6510.mode.zpx],							// 0x35
    [MOS6510.inst.rol, MOS6510.mode.zpx],							// 0x36
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x37
    [MOS6510.inst.sec, MOS6510.mode.imp],							// 0x38
    [MOS6510.inst.and, MOS6510.mode.absy],							// 0x39
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x3a
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x3b
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x3c
    [MOS6510.inst.and, MOS6510.mode.absx],							// 0x3d
    [MOS6510.inst.rol, MOS6510.mode.absx],							// 0x3e
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x3f

    [MOS6510.inst.rti, MOS6510.mode.imp],							// 0x40
    [MOS6510.inst.eor, MOS6510.mode.indx],							// 0x41
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x42
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x43
    [MOS6510.inst.xxx, MOS6510.mode.zp],							// 0x44
    [MOS6510.inst.eor, MOS6510.mode.zp],							// 0x45
    [MOS6510.inst.lsr, MOS6510.mode.zp],							// 0x46
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x47
    [MOS6510.inst.pha, MOS6510.mode.imp],							// 0x48
    [MOS6510.inst.eor, MOS6510.mode.imm],							// 0x49
    [MOS6510.inst.lsr, MOS6510.mode.acc],							// 0x4a
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x4b
    [MOS6510.inst.jmp, MOS6510.mode.abs],							// 0x4c
    [MOS6510.inst.eor, MOS6510.mode.abs],							// 0x4d
    [MOS6510.inst.lsr, MOS6510.mode.abs],							// 0x4e
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x4f

    [MOS6510.inst.bvc, MOS6510.mode.rel],							// 0x50
    [MOS6510.inst.eor, MOS6510.mode.indy],							// 0x51
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x52
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x53
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x54
    [MOS6510.inst.eor, MOS6510.mode.zpx],							// 0x55
    [MOS6510.inst.lsr, MOS6510.mode.zpx],							// 0x56
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x57
    [MOS6510.inst.cli, MOS6510.mode.imp],							// 0x58
    [MOS6510.inst.eor, MOS6510.mode.absy],							// 0x59
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x5a
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x5b
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x5c
    [MOS6510.inst.eor, MOS6510.mode.absx],							// 0x5d
    [MOS6510.inst.lsr, MOS6510.mode.absx],							// 0x5e
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x5f

    [MOS6510.inst.rts, MOS6510.mode.imp],							// 0x60
    [MOS6510.inst.adc, MOS6510.mode.indx],							// 0x61
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x62
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x63
    [MOS6510.inst.xxx, MOS6510.mode.zp],							// 0x64
    [MOS6510.inst.adc, MOS6510.mode.zp],							// 0x65
    [MOS6510.inst.ror, MOS6510.mode.zp],							// 0x66
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x67
    [MOS6510.inst.pla, MOS6510.mode.imp],							// 0x68
    [MOS6510.inst.adc, MOS6510.mode.imm],							// 0x69
    [MOS6510.inst.ror, MOS6510.mode.acc],							// 0x6a
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x6b
    [MOS6510.inst.jmp, MOS6510.mode.ind],							// 0x6c
    [MOS6510.inst.adc, MOS6510.mode.abs],							// 0x6d
    [MOS6510.inst.ror, MOS6510.mode.abs],							// 0x6e
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x6f

    [MOS6510.inst.bvs, MOS6510.mode.rel],							// 0x70
    [MOS6510.inst.adc, MOS6510.mode.indy],							// 0x71
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x72
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x73
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x74
    [MOS6510.inst.adc, MOS6510.mode.zpx],							// 0x75
    [MOS6510.inst.ror, MOS6510.mode.zpx],							// 0x76
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x77
    [MOS6510.inst.sei, MOS6510.mode.imp],							// 0x78
    [MOS6510.inst.adc, MOS6510.mode.absy],							// 0x79
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x7a
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x7b
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x7c
    [MOS6510.inst.adc, MOS6510.mode.absx],							// 0x7d
    [MOS6510.inst.ror, MOS6510.mode.absx],							// 0x7e
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x7f

    [MOS6510.inst.xxx, MOS6510.mode.imm],							// 0x80
    [MOS6510.inst.sta, MOS6510.mode.indx],							// 0x81
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x82
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x83
    [MOS6510.inst.sty, MOS6510.mode.zp],							// 0x84
    [MOS6510.inst.sta, MOS6510.mode.zp],							// 0x85
    [MOS6510.inst.stx, MOS6510.mode.zp],							// 0x86
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x87
    [MOS6510.inst.dey, MOS6510.mode.imp],							// 0x88
    [MOS6510.inst.xxx, MOS6510.mode.imm],							// 0x89
    [MOS6510.inst.txa, MOS6510.mode.acc],							// 0x8a
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x8b
    [MOS6510.inst.sty, MOS6510.mode.abs],							// 0x8c
    [MOS6510.inst.sta, MOS6510.mode.abs],							// 0x8d
    [MOS6510.inst.stx, MOS6510.mode.abs],							// 0x8e
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x8f

    [MOS6510.inst.bcc, MOS6510.mode.rel],							// 0x90
    [MOS6510.inst.sta, MOS6510.mode.indy],							// 0x91
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x92
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x93
    [MOS6510.inst.sty, MOS6510.mode.zpx],							// 0x94
    [MOS6510.inst.sta, MOS6510.mode.zpx],							// 0x95
    [MOS6510.inst.stx, MOS6510.mode.zpy],							// 0x96
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x97
    [MOS6510.inst.tya, MOS6510.mode.imp],							// 0x98
    [MOS6510.inst.sta, MOS6510.mode.absy],							// 0x99
    [MOS6510.inst.txs, MOS6510.mode.acc],							// 0x9a
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x9b
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x9c
    [MOS6510.inst.sta, MOS6510.mode.absx],							// 0x9d
    [MOS6510.inst.xxx, MOS6510.mode.absx],							// 0x9e
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0x9f

    [MOS6510.inst.ldy, MOS6510.mode.imm],							// 0xa0
    [MOS6510.inst.lda, MOS6510.mode.indx],							// 0xa1
    [MOS6510.inst.ldx, MOS6510.mode.imm],							// 0xa2
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xa3
    [MOS6510.inst.ldy, MOS6510.mode.zp],							// 0xa4
    [MOS6510.inst.lda, MOS6510.mode.zp],							// 0xa5
    [MOS6510.inst.ldx, MOS6510.mode.zp],							// 0xa6
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xa7
    [MOS6510.inst.tay, MOS6510.mode.imp],							// 0xa8
    [MOS6510.inst.lda, MOS6510.mode.imm],							// 0xa9
    [MOS6510.inst.tax, MOS6510.mode.acc],							// 0xaa
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xab
    [MOS6510.inst.ldy, MOS6510.mode.abs],							// 0xac
    [MOS6510.inst.lda, MOS6510.mode.abs],							// 0xad
    [MOS6510.inst.ldx, MOS6510.mode.abs],							// 0xae
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xaf

    [MOS6510.inst.bcs, MOS6510.mode.rel],							// 0xb0
    [MOS6510.inst.lda, MOS6510.mode.indy],							// 0xb1
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xb2
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xb3
    [MOS6510.inst.ldy, MOS6510.mode.zpx],							// 0xb4
    [MOS6510.inst.lda, MOS6510.mode.zpx],							// 0xb5
    [MOS6510.inst.ldx, MOS6510.mode.zpy],							// 0xb6
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xb7
    [MOS6510.inst.clv, MOS6510.mode.imp],							// 0xb8
    [MOS6510.inst.lda, MOS6510.mode.absy],							// 0xb9
    [MOS6510.inst.tsx, MOS6510.mode.acc],							// 0xba
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xbb
    [MOS6510.inst.ldy, MOS6510.mode.absx],							// 0xbc
    [MOS6510.inst.lda, MOS6510.mode.absx],							// 0xbd
    [MOS6510.inst.ldx, MOS6510.mode.absy],							// 0xbe
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xbf

    [MOS6510.inst.cpy, MOS6510.mode.imm],							// 0xc0
    [MOS6510.inst.cmp, MOS6510.mode.indx],							// 0xc1
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xc2
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xc3
    [MOS6510.inst.cpy, MOS6510.mode.zp],							// 0xc4
    [MOS6510.inst.cmp, MOS6510.mode.zp],							// 0xc5
    [MOS6510.inst.dec, MOS6510.mode.zp],							// 0xc6
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xc7
    [MOS6510.inst.iny, MOS6510.mode.imp],							// 0xc8
    [MOS6510.inst.cmp, MOS6510.mode.imm],							// 0xc9
    [MOS6510.inst.dex, MOS6510.mode.acc],							// 0xca
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xcb
    [MOS6510.inst.cpy, MOS6510.mode.abs],							// 0xcc
    [MOS6510.inst.cmp, MOS6510.mode.abs],							// 0xcd
    [MOS6510.inst.dec, MOS6510.mode.abs],							// 0xce
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xcf

    [MOS6510.inst.bne, MOS6510.mode.rel],							// 0xd0
    [MOS6510.inst.cmp, MOS6510.mode.indy],							// 0xd1
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xd2
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xd3
    [MOS6510.inst.xxx, MOS6510.mode.zpx],							// 0xd4
    [MOS6510.inst.cmp, MOS6510.mode.zpx],							// 0xd5
    [MOS6510.inst.dec, MOS6510.mode.zpx],							// 0xd6
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xd7
    [MOS6510.inst.cld, MOS6510.mode.imp],							// 0xd8
    [MOS6510.inst.cmp, MOS6510.mode.absy],							// 0xd9
    [MOS6510.inst.xxx, MOS6510.mode.acc],							// 0xda
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xdb
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xdc
    [MOS6510.inst.cmp, MOS6510.mode.absx],							// 0xdd
    [MOS6510.inst.dec, MOS6510.mode.absx],							// 0xde
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xdf

    [MOS6510.inst.cpx, MOS6510.mode.imm],							// 0xe0
    [MOS6510.inst.sbc, MOS6510.mode.indx],							// 0xe1
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xe2
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xe3
    [MOS6510.inst.cpx, MOS6510.mode.zp],							// 0xe4
    [MOS6510.inst.sbc, MOS6510.mode.zp],							// 0xe5
    [MOS6510.inst.inc, MOS6510.mode.zp],							// 0xe6
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xe7
    [MOS6510.inst.inx, MOS6510.mode.imp],							// 0xe8
    [MOS6510.inst.sbc, MOS6510.mode.imm],							// 0xe9
    [MOS6510.inst.nop, MOS6510.mode.acc],							// 0xea
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xeb
    [MOS6510.inst.cpx, MOS6510.mode.abs],							// 0xec
    [MOS6510.inst.sbc, MOS6510.mode.abs],							// 0xed
    [MOS6510.inst.inc, MOS6510.mode.abs],							// 0xee
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xef

    [MOS6510.inst.beq, MOS6510.mode.rel],							// 0xf0
    [MOS6510.inst.sbc, MOS6510.mode.indy],							// 0xf1
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xf2
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xf3
    [MOS6510.inst.xxx, MOS6510.mode.zpx],							// 0xf4
    [MOS6510.inst.sbc, MOS6510.mode.zpx],							// 0xf5
    [MOS6510.inst.inc, MOS6510.mode.zpx],							// 0xf6
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xf7
    [MOS6510.inst.sed, MOS6510.mode.imp],							// 0xf8
    [MOS6510.inst.sbc, MOS6510.mode.absy],							// 0xf9
    [MOS6510.inst.xxx, MOS6510.mode.acc],							// 0xfa
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xfb
    [MOS6510.inst.xxx, MOS6510.mode.xxx],							// 0xfc
    [MOS6510.inst.sbc, MOS6510.mode.absx],							// 0xfd
    [MOS6510.inst.inc, MOS6510.mode.absx],							// 0xfe
    [MOS6510.inst.xxx, MOS6510.mode.xxx]							// 0xff
);

export { MOS6510 };