describe('Easing', function(){
    before(function(){
        enchant();
    });

    describe('LINEAR', function(){
        it('returns linear chage of value', function(){
            expect(enchant.Easing.LINEAR(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.LINEAR(1, 1, 10, 10)).to.equal(2);
            expect(enchant.Easing.LINEAR(5, 1, 10, 10)).to.equal(6);
            expect(enchant.Easing.LINEAR(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('SWING', function(){
        it('returns swinging change of value', function(){
            expect(enchant.Easing.SWING(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.SWING(3, 1, 10, 10)).to.within(3.06, 3.07);
            expect(enchant.Easing.SWING(7, 1, 10, 10)).to.within(8.93, 8.94);
            expect(enchant.Easing.SWING(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('QUAD_EASEIN', function(){
        it('returns calculated quad_easein value', function(){
            expect(enchant.Easing.QUAD_EASEIN(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.QUAD_EASEIN(3, 1, 10, 10)).to.equal(1.9);
            expect(enchant.Easing.QUAD_EASEIN(7, 1, 10, 10)).to.within(5.89, 5.90);
            expect(enchant.Easing.QUAD_EASEIN(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('QUAD_EASEOUT', function(){
        it('returns calculated quad_easeout value', function(){
            expect(enchant.Easing.QUAD_EASEOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.QUAD_EASEOUT(3, 1, 10, 10)).to.equal(6.1);
            expect(enchant.Easing.QUAD_EASEOUT(7, 1, 10, 10)).to.equal(10.1);
            expect(enchant.Easing.QUAD_EASEOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('QUAD_EASEINOUT', function(){
        it('returns calculated quad_easeinout value in case (t / d / 2) < 1', function(){
            expect(enchant.Easing.QUAD_EASEINOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.QUAD_EASEINOUT(3, 1, 10, 10)).to.equal(2.8);
            expect(enchant.Easing.QUAD_EASEINOUT(7, 1, 10, 10)).to.equal(9.2);
            expect(enchant.Easing.QUAD_EASEINOUT(10, 1, 10, 10)).to.equal(11);
        });

        it('returns calculated quad_easeinout value in case (t / d / 2) >= 1', function(){
            expect(enchant.Easing.QUAD_EASEINOUT(20, 1, 10, 10)).to.equal(-9);
            expect(enchant.Easing.QUAD_EASEINOUT(25, 1, 10, 10)).to.equal(-34);
        });
    });

    describe('CUBIC_EASEIN', function(){
        it('returns calculated cubic_easein value', function(){
            expect(enchant.Easing.CUBIC_EASEIN(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.CUBIC_EASEIN(3, 1, 10, 10)).to.equal(1.27);
            expect(enchant.Easing.CUBIC_EASEIN(7, 1, 10, 10)).to.equal(4.43);
            expect(enchant.Easing.CUBIC_EASEIN(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('CUBIC_EASEOUT', function(){
        it('returns calculated cubic_easeout value', function(){
            expect(enchant.Easing.CUBIC_EASEOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.CUBIC_EASEOUT(3, 1, 10, 10)).to.equal(7.57);
            expect(enchant.Easing.CUBIC_EASEOUT(7, 1, 10, 10)).to.equal(10.73);
            expect(enchant.Easing.CUBIC_EASEOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('CUBIC_EASEINOUT', function(){
        it('returns calculated cubic_easeinout value in case (t / d / 2) < 1', function(){
            expect(enchant.Easing.CUBIC_EASEINOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.CUBIC_EASEINOUT(3, 1, 10, 10)).to.equal(2.08);
            expect(enchant.Easing.CUBIC_EASEINOUT(7, 1, 10, 10)).to.within(9.91, 9.92);
            expect(enchant.Easing.CUBIC_EASEINOUT(10, 1, 10, 10)).to.equal(11);
        });

        it('returns calculated cubic_easeinout value in case (t / d / 2) >= 1', function(){
            expect(enchant.Easing.CUBIC_EASEINOUT(20, 1, 10, 10)).to.equal(51);
            expect(enchant.Easing.CUBIC_EASEINOUT(25, 1, 10, 10)).to.equal(146);
        });
    });

    describe('QUART_EASEIN', function(){
        it('returns calculated quart_easein value', function(){
            expect(enchant.Easing.QUART_EASEIN(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.QUART_EASEIN(3, 1, 10, 10)).to.equal(1.081);
            expect(enchant.Easing.QUART_EASEIN(7, 1, 10, 10)).to.within(3.40, 3.41);
            expect(enchant.Easing.QUART_EASEIN(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('QUART_EASEOUT', function(){
        it('returns calculated quart_easeout value', function(){
            expect(enchant.Easing.QUART_EASEOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.QUART_EASEOUT(3, 1, 10, 10)).to.equal(8.599);
            expect(enchant.Easing.QUART_EASEOUT(7, 1, 10, 10)).to.equal(10.919);
            expect(enchant.Easing.QUART_EASEOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('QUART_EASEINOUT', function(){
        it('returns calculated quart_easeinout value in case ( t / d / 2 ) < 1 ', function(){
            expect(enchant.Easing.QUART_EASEINOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.QUART_EASEINOUT(3, 1, 10, 10)).to.equal(1.648);
            expect(enchant.Easing.QUART_EASEINOUT(7, 1, 10, 10)).to.within(10.35, 10.36);
            expect(enchant.Easing.QUART_EASEINOUT(10, 1, 10, 10)).to.equal(11);
        });

        it('returns calculated quart_easeinout value in case ( t / d / 2 ) >= 1 ', function(){
            expect(enchant.Easing.QUART_EASEINOUT(20, 1, 10, 10)).to.equal(-69);
            expect(enchant.Easing.QUART_EASEINOUT(25, 1, 10, 10)).to.equal(-394);
        });
    });

    describe('QUINT_EASEIN', function(){
        it('returns calculated quint_easein value', function(){
            expect(enchant.Easing.QUINT_EASEIN(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.QUINT_EASEIN(3, 1, 10, 10)).to.equal(1.0243);
            expect(enchant.Easing.QUINT_EASEIN(7, 1, 10, 10)).to.within(2.68, 2.69);
            expect(enchant.Easing.QUINT_EASEIN(10, 1, 10, 10)).to.equal(11);

        });
    });

    describe('QUINT_EASEOUT', function(){
        it('returns calculated quint_easeout value', function(){
            expect(enchant.Easing.QUINT_EASEOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.QUINT_EASEOUT(3, 1, 10, 10)).to.equal(9.3193);
            expect(enchant.Easing.QUINT_EASEOUT(7, 1, 10, 10)).to.equal(10.9757);
            expect(enchant.Easing.QUINT_EASEOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('QUINT_EASEINOUT', function(){
        it('returns calculated quint_easeinout value in case ( t / d / 2 ) < 1', function(){
            expect(enchant.Easing.QUINT_EASEINOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.QUINT_EASEINOUT(3, 1, 10, 10)).to.within(1.38, 1.39);
            expect(enchant.Easing.QUINT_EASEINOUT(7, 1, 10, 10)).to.equal(10.6112);
            expect(enchant.Easing.QUINT_EASEINOUT(10, 1, 10, 10)).to.equal(11);
        });

        it('returns calculated quint_easeinout value in case ( t / d / 2 ) >= 1', function(){
            expect(enchant.Easing.QUINT_EASEINOUT(20, 1, 10, 10)).to.equal(171);
            expect(enchant.Easing.QUINT_EASEINOUT(25, 1, 10, 10)).to.equal(1226);
        });
    });

    describe('SIN_EASEIN', function(){
        it('returns calculated sin_easein value', function(){
            expect(enchant.Easing.SIN_EASEIN(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.SIN_EASEIN(3, 1, 10, 10)).to.within(2.08, 2.09);
            expect(enchant.Easing.SIN_EASEIN(7, 1, 10, 10)).to.within(6.46, 6.47);
            expect(enchant.Easing.SIN_EASEIN(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('SIN_EASEOUT', function(){
        it('returns calculated sin_easeout value', function(){
            expect(enchant.Easing.SIN_EASEOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.SIN_EASEOUT(3, 1, 10, 10)).to.within(5.53, 5.54);
            expect(enchant.Easing.SIN_EASEOUT(7, 1, 10, 10)).to.within(9.91, 9.92);
            expect(enchant.Easing.SIN_EASEOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('SIN_EASEINOUT', function(){
        it('returns calculated sin_easeinout value', function(){
            expect(enchant.Easing.SIN_EASEINOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.SIN_EASEINOUT(3, 1, 10, 10)).to.within(3.06, 3.07);
            expect(enchant.Easing.SIN_EASEINOUT(7, 1, 10, 10)).to.within(8.93, 8.94);
            expect(enchant.Easing.SIN_EASEINOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('CIRC_EASEIN', function(){
        it('returns calculated circ_easein value', function(){
            expect(enchant.Easing.CIRC_EASEIN(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.CIRC_EASEIN(3, 1, 10, 10)).to.within(1.46, 1.47);
            expect(enchant.Easing.CIRC_EASEIN(7, 1, 10, 10)).to.within(3.85, 3.86);
            expect(enchant.Easing.CIRC_EASEIN(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('CIRC_EASEOUT', function(){
        it('returns calculated circ_easeout value', function(){
            expect(enchant.Easing.CIRC_EASEOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.CIRC_EASEOUT(3, 1, 10, 10)).to.within(8.14, 8.15);
            expect(enchant.Easing.CIRC_EASEOUT(7, 1, 10, 10)).to.within(10.53, 10.54);
            expect(enchant.Easing.CIRC_EASEOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('CIRC_EASEINOUT', function(){
        it('returns calculated circ_easeinout value', function(){
            expect(enchant.Easing.CIRC_EASEINOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.CIRC_EASEINOUT(3, 1, 10, 10)).to.within(1.99, 2.00);
            expect(enchant.Easing.CIRC_EASEINOUT(7, 1, 10, 10)).to.equal(10);
            expect(enchant.Easing.CIRC_EASEINOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('ELASTIC_EASEIN', function(){
        it('returns calculated elastic_easein value in case variable "a" and "p" are not given', function(){
            expect(enchant.Easing.ELASTIC_EASEIN(0, 1, 10, 10), 'in case t = 0').to.equal(1);
            expect(enchant.Easing.ELASTIC_EASEIN(3, 1, 10, 10)).to.within(0.96, 0.97);
            expect(enchant.Easing.ELASTIC_EASEIN(7, 1, 10, 10)).to.within(2.24, 2.25);
            expect(enchant.Easing.ELASTIC_EASEIN(10, 1, 10, 10), 'in case ( t / d ) = 1').to.equal(11);
        });

        it('returns calculated elastic_easein value in case variable "p" is not given', function(){
            expect(enchant.Easing.ELASTIC_EASEIN(0, 1, 10, 10, 20), 'in case t = 0').to.equal(1);
            expect(enchant.Easing.ELASTIC_EASEIN(3, 1, 10, 10, 20)).to.equal(1.078125);
            expect(enchant.Easing.ELASTIC_EASEIN(7, 1, 10, 10, 20)).to.within(2.24, 2.25);
            expect(enchant.Easing.ELASTIC_EASEIN(10, 1, 10, 10, 20), 'in case ( t / d ) = 1').to.equal(11);
        });

        it('returns calculated elastic_easein value', function(){
            expect(enchant.Easing.ELASTIC_EASEIN(0, 1, 10, 10, 20, 10), 'in case t = 0').to.equal(1);
            expect(enchant.Easing.ELASTIC_EASEIN(3, 1, 10, 10, 20, 10), 'in case a > |c| ').to.within(0.84, 0.85);
            expect(enchant.Easing.ELASTIC_EASEIN(7, 1, 10, 10, 20, 10), 'in case a > |c|').to.within(2.67, 2.68);
            expect(enchant.Easing.ELASTIC_EASEIN(3, 1, 10, 10, 10, 10), 'in case a <= |c| ').to.within(0.97, 0.98);
            expect(enchant.Easing.ELASTIC_EASEIN(7, 1, 10, 10, 10, 10), 'in case a <= |c|').to.within(0.61, 0.62);
            expect(enchant.Easing.ELASTIC_EASEIN(10, 1, 10, 10, 20, 10), 'in case ( t / d ) = 1').to.equal(11);
        });
    });

    describe('ELASTIC_EASEOUT', function(){
        it('returns calculated elastic_easeout value in case variable "a" and "p" are not given', function(){
            expect(enchant.Easing.ELASTIC_EASEOUT(0, 1, 10, 10), 'in case t = 0').to.equal(1);
            expect(enchant.Easing.ELASTIC_EASEOUT(3, 1, 10, 10)).to.equal(9.75);
            expect(enchant.Easing.ELASTIC_EASEOUT(7, 1, 10, 10)).to.equal(11.0390625);
            expect(enchant.Easing.ELASTIC_EASEOUT(10, 1, 10, 10), 'in case ( t / d ) = 1').to.equal(11);
        });

        it('returns calculated elastic_easeout value in case variable "p" is not given', function(){
            expect(enchant.Easing.ELASTIC_EASEOUT(0, 1, 10, 10, 20), 'in case t = 0').to.equal(1);
            expect(enchant.Easing.ELASTIC_EASEOUT(3, 1, 10, 10, 20)).to.within(9.74, 9.75);
            expect(enchant.Easing.ELASTIC_EASEOUT(7, 1, 10, 10, 20)).to.equal(11.15625);
            expect(enchant.Easing.ELASTIC_EASEOUT(10, 1, 10, 10, 20), 'in case ( t / d ) = 1').to.equal(11);
        });

        it('returns calculated elastic_easeout value', function(){
            expect(enchant.Easing.ELASTIC_EASEOUT(0, 1, 10, 10, 20, 10), 'in case t = 0').to.equal(1);
            expect(enchant.Easing.ELASTIC_EASEOUT(3, 1, 10, 10, 20, 10), 'in case a > |c| ').to.within(13.44, 13.45);
            expect(enchant.Easing.ELASTIC_EASEOUT(7, 1, 10, 10, 20, 10), 'in case a > |c|').to.within(10.89, 10.90);
            expect(enchant.Easing.ELASTIC_EASEOUT(3, 1, 10, 10, 10, 10), 'in case a <= |c| ').to.within(11.38, 11.39);
            expect(enchant.Easing.ELASTIC_EASEOUT(7, 1, 10, 10, 10, 10), 'in case a <= |c|').to.within(11.02, 11.03);
            expect(enchant.Easing.ELASTIC_EASEOUT(10, 1, 10, 10, 20, 10), 'in case ( t / d ) = 1').to.equal(11);
        });
    });

    describe('ELASTIC_EASEINOUT', function(){
        it('returns calculated elastic_easeinout value in case variable "a" and "p" are not given', function(){
            expect(enchant.Easing.ELASTIC_EASEINOUT(0, 1, 10, 10), 'in case t = 0').to.equal(1);
            expect(enchant.Easing.ELASTIC_EASEINOUT(0.5, 1, 10, 10), 'in case t < 1').to.within(1.00, 1.01);
            expect(enchant.Easing.ELASTIC_EASEINOUT(3, 1, 10, 10)).to.within(1.23, 1.24);
            expect(enchant.Easing.ELASTIC_EASEINOUT(7, 1, 10, 10)).to.within(10.76, 10.77);
            expect(enchant.Easing.ELASTIC_EASEINOUT(10, 1, 10, 10), 'in case ( t / d ) = 1').to.equal(11);
        });

        it('returns calculated elastic_easeinout value in case variable "p" is not given', function(){
            expect(enchant.Easing.ELASTIC_EASEINOUT(0, 1, 10, 10, 20), 'in case t = 0').to.equal(1);
            expect(enchant.Easing.ELASTIC_EASEINOUT(0.5, 1, 10, 10, 20), 'in case t < 1').to.within(1.00, 1.01);
            expect(enchant.Easing.ELASTIC_EASEINOUT(3, 1, 10, 10, 20)).to.within(0.89, 0.90);
            expect(enchant.Easing.ELASTIC_EASEINOUT(7, 1, 10, 10, 20)).to.within(10.41, 10.42);
            expect(enchant.Easing.ELASTIC_EASEINOUT(10, 1, 10, 10, 20), 'in case ( t / d ) = 1').to.equal(11);
        });

        it('returns calculated elastic_easeinout value', function(){
            expect(enchant.Easing.ELASTIC_EASEINOUT(0, 1, 10, 10, 20, 10), 'in case t = 0').to.equal(1);
            expect(enchant.Easing.ELASTIC_EASEINOUT(0.5, 1, 10, 10, 20, 10), 'in case t < 1').to.within(0.99, 1.00);
            expect(enchant.Easing.ELASTIC_EASEINOUT(3, 1, 10, 10, 20, 10), 'in case a > |c| ').to.within(1.06, 1.07);
            expect(enchant.Easing.ELASTIC_EASEINOUT(7, 1, 10, 10, 20, 10), 'in case a > |c|').to.within(11.57, 11.58);
            expect(enchant.Easing.ELASTIC_EASEINOUT(3, 1, 10, 10, 10, 10), 'in case a <= |c| ').to.within(0.74, 0.75);
            expect(enchant.Easing.ELASTIC_EASEINOUT(7, 1, 10, 10, 10, 10), 'in case a <= |c|').to.within(11.25, 11.26);
            expect(enchant.Easing.ELASTIC_EASEINOUT(10, 1, 10, 10, 20, 10), 'in case ( t / d ) = 1').to.equal(11);
        });
    });

    describe('BOUNCE_EASEIN', function(){
        it('returns calculated bounce_easein value', function(){
            expect(enchant.Easing.BOUNCE_EASEIN(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.BOUNCE_EASEIN(3, 1, 10, 10), 'in case t < 1 / 2.75').to.within(1.69, 1.70);
            expect(enchant.Easing.BOUNCE_EASEIN(8, 1, 10, 10), 'in case t < 2 / 2.75').to.equal(7.975);
            expect(enchant.Easing.BOUNCE_EASEIN(9.1, 1, 10, 10), 'in case t < 2.5 / 2.75').to.within(10.38, 10.39);
            expect(enchant.Easing.BOUNCE_EASEIN(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('BOUNCE_EASEOUT', function(){
        it('returns calculated bounce_easeout value', function(){
            expect(enchant.Easing.BOUNCE_EASEOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.BOUNCE_EASEOUT(3, 1, 10, 10), 'in case t < 1 / 2.75').to.within(7.80, 7.81);
            expect(enchant.Easing.BOUNCE_EASEOUT(8, 1, 10, 10), 'in case t < 2 / 2.75').to.within(10.39, 10.40);
            expect(enchant.Easing.BOUNCE_EASEOUT(9.1, 1, 10, 10), 'in case t < 2.5 / 2.75').to.within(10.99, 11.00);
            expect(enchant.Easing.BOUNCE_EASEOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    // t(現在の時刻), b(初期値), c(変化後の値), d(値の変化にかける時間)
    // t, b, c, d
    describe('BOUNCE_EASEINOUT', function(){
        it('returns calculated bounce_easeinout value', function(){
            expect(enchant.Easing.BOUNCE_EASEINOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.BOUNCE_EASEINOUT(3, 1, 10, 10), 'in case t < d / 2').to.within(1.45, 1.46);
            expect(enchant.Easing.BOUNCE_EASEINOUT(5, 1, 10, 10), 'in case t = d / 2').to.equal(6);
            expect(enchant.Easing.BOUNCE_EASEINOUT(8, 1, 10, 10), 'in case t > d / 2').to.equal(9.8625);
            expect(enchant.Easing.BOUNCE_EASEINOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('BACK_EASEIN', function(){
        it('returns calculated back_easein value in case variable "s" is not given', function(){
            expect(enchant.Easing.BACK_EASEIN(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.BACK_EASEIN(3, 1, 10, 10)).to.within(0.19, 0.20);
            expect(enchant.Easing.BACK_EASEIN(7, 1, 10, 10)).to.within(1.92, 1.93);
            expect(enchant.Easing.BACK_EASEIN(10, 1, 10, 10)).to.within(10.99, 11.00);
        });

        it('returns calculated back_easein value in case variable "s" is given', function(){
            expect(enchant.Easing.BACK_EASEIN(0, 1, 10, 10, 1)).to.equal(1);
            expect(enchant.Easing.BACK_EASEIN(3, 1, 10, 10, 1)).to.equal(0.64);
            expect(enchant.Easing.BACK_EASEIN(7, 1, 10, 10, 1)).to.within(2.95, 2.96);
            expect(enchant.Easing.BACK_EASEIN(10, 1, 10, 10, 1)).to.equal(11);
        });
    });

    describe('BACK_EASEOUT', function(){
        it('returns calculated back_easeout value in case variable "s" is not given', function(){
            expect(enchant.Easing.BACK_EASEOUT(0, 1, 10, 10)).to.within(1.00, 1.01);
            expect(enchant.Easing.BACK_EASEOUT(3, 1, 10, 10)).to.within(10.07, 10.08);
            expect(enchant.Easing.BACK_EASEOUT(7, 1, 10, 10)).to.equal(11.8019954);
            expect(enchant.Easing.BACK_EASEOUT(10, 1, 10, 10)).to.equal(11);
        });

        it('returns calculated back_easeout value in case variable "s" is given', function(){
            expect(enchant.Easing.BACK_EASEOUT(0, 1, 10, 10, 1)).to.equal(1);
            expect(enchant.Easing.BACK_EASEOUT(3, 1, 10, 10, 1)).to.within(9.04, 9.05);
            expect(enchant.Easing.BACK_EASEOUT(7, 1, 10, 10, 1)).to.equal(11.36);
            expect(enchant.Easing.BACK_EASEOUT(10, 1, 10, 10, 1)).to.equal(11);
        });
    });

    describe('BACK_EASEINOUT', function(){
        it('returns calculated back_easeinout value in case variable "s" is not given and ( t / d / 2 ) < 1 ', function(){
            expect(enchant.Easing.BACK_EASEINOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.BACK_EASEINOUT(3, 1, 10, 10)).to.within(0.21, 0.22);
            expect(enchant.Easing.BACK_EASEINOUT(7, 1, 10, 10)).to.within(11.78, 11.79);
            expect(enchant.Easing.BACK_EASEINOUT(10, 1, 10, 10)).to.equal(11);
        });

        it('returns calculated back_easeinout value in case variable "s" is not given and ( t / d / 2 ) >= 1 ', function(){
            expect(enchant.Easing.BACK_EASEINOUT(20, 1, 10, 10)).to.equal(206.69457);
            expect(enchant.Easing.BACK_EASEINOUT(25, 1, 10, 10)).to.equal(613.08371);
        });

        it('returns calculated back_easeinout value in case variable "s" is given and (t / d / 2 ) < 1', function(){
            expect(enchant.Easing.BACK_EASEINOUT(0, 1, 10, 10, 1)).to.equal(1);
            expect(enchant.Easing.BACK_EASEINOUT(3, 1, 10, 10, 1)).to.equal(0.982);
            expect(enchant.Easing.BACK_EASEINOUT(7, 1, 10, 10, 1)).to.equal(11.018);
            expect(enchant.Easing.BACK_EASEINOUT(10, 1, 10, 10, 1)).to.equal(11);
        });

        it('returns calculated back_easeinout value in case variable "s" is not given and ( t / d / 2 ) >= 1 ', function(){
            expect(enchant.Easing.BACK_EASEINOUT(20, 1, 10, 10, 1)).to.equal(142.5);
            expect(enchant.Easing.BACK_EASEINOUT(25, 1, 10, 10, 1)).to.within(420.49, 420.50);
        });
    });

    describe('EXPO_EASEIN', function(){
        it('returns calculated expo_easein value', function(){
            expect(enchant.Easing.EXPO_EASEIN(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.EXPO_EASEIN(3, 1, 10, 10)).to.equal(1.078125);
            expect(enchant.Easing.EXPO_EASEIN(7, 1, 10, 10)).to.within(2.24, 2.25);
            expect(enchant.Easing.EXPO_EASEIN(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('EXPO_EASEOUT', function(){
        it('returns calculated expo_easeout value', function(){
            expect(enchant.Easing.EXPO_EASEOUT(0, 1, 10, 10)).to.equal(1);
            expect(enchant.Easing.EXPO_EASEOUT(3, 1, 10, 10)).to.equal(9.75);
            expect(enchant.Easing.EXPO_EASEOUT(7, 1, 10, 10)).to.equal(10.921875);
            expect(enchant.Easing.EXPO_EASEOUT(10, 1, 10, 10)).to.equal(11);
        });
    });

    describe('EXPO_EASEINOUT', function(){
        it('returns calculated expo_easeinout value', function(){
            expect(enchant.Easing.EXPO_EASEINOUT(0, 1, 10, 10), 'in case t = 0').to.equal(1);
            expect(enchant.Easing.EXPO_EASEINOUT(3, 1, 10, 10), 'in case (t / d / 2 ) < 1').to.equal(1.3125);
            expect(enchant.Easing.EXPO_EASEINOUT(7, 1, 10, 10), 'in case (t / d / 2 ) < 1').to.equal(10.6875);
            expect(enchant.Easing.EXPO_EASEINOUT(10, 1, 10, 10), 'in case t = d').to.equal(11);
            expect(enchant.Easing.EXPO_EASEINOUT(20, 1, 10, 10), 'in case (t / d / 2 ) >= 1').to.within(10.99, 11.00);
            expect(enchant.Easing.EXPO_EASEINOUT(25, 1, 10, 10), 'in case (t / d / 2 ) >= 1').to.within(10.99, 11.00);
        });
    });

});