'use strict';

var fs = require('fs');
var chai = require('chai');
var chaiAlmost = require('chai-almost');
var mjs = require('mathjs');
var Atoms = require('../lib/cryst.js').Atoms;
var utils = require('../lib/utils.js');

chai.use(chaiAlmost(1e-6));
const expect = chai.expect;

describe('#atoms', function() {

    it('should fail if given non-existent atom species', function() {
        expect(function() {
            var a = new Atoms(['Zz']);
        }).to.throw();
    });
    it('should fail if given arrays of inconsistent length', function() {
        expect(function() {
            var a = new Atoms(['C', 'C'], [
                [1, 1, 1]
            ]);
        }).to.throw();
        expect(function() {
            var a = new Atoms(['C', 'C'], [
                [1, 1, 1],
                [1]
            ]);
        }).to.throw();
    });
    it('should store positions in array', function() {
        var a = new Atoms(['C'], [
            [0, 0, 0]
        ]);
        expect(a.get_array('positions')[0][0]).to.equal(0);
    });
    it('should deal appropriately with cells', function() {
        var a = new Atoms([], [], 1);
        expect(a.get_cell()[0]).to.eql([1, 0, 0]);
        var a = new Atoms([], [], [1, 2, 3]);
        expect(a.get_cell()).to.eql([
            [1, 0, 0],
            [0, 2, 0],
            [0, 0, 3]
        ]);
        var a = new Atoms([], [], [1, 1, null]);
        expect(a.get_pbc()).to.eql([true, true, false]);
    });
    it('should compute properly fractional coordinates', function() {
        var a = new Atoms(['C'], [
            [0.5, 0.5, 1]
        ], [
            [1, 1, 0],
            [2, -2, 0],
            [0, 0, 2]
        ]);
        expect(a.get_scaled_positions()).to.eql([
            [0.5, 0, 0.5]
        ]);
    });
    it('should handle fractional coordinates as an input', function() {
        var a = new Atoms(['C'], [
                [0.5, 0.5, 0.0]
            ], [
                [1, 1, 0],
                [0, 3, 0],
                [0, 0, 1]
            ], {},
            true);
        expect(a.get_positions()).to.eql([
            [0.5, 2.0, 0]
        ]);
    });
    it('should throw an error with unknown species only if not tolerant',
        function() {

            expect(function() {
                var a = new Atoms(['X']);
            }).to.throw;

            var a = new Atoms(['X'], [
                [0, 0, 0]
            ], null, null, false, true);

        });
    it('should correctly parse a cif file',
        function() {

            var contents = fs.readFileSync(__dirname +
                '/../examples/example_single.cif',
                'utf8');

            var a = Atoms.readCif(contents)['I'];

            expect(a.length()).to.equal(84);
            expect(a.get_pbc()).to.deep.equal([true, true, true]);

        });
    it('should not create artefacts when dealing with symmetry operations',
        function() {

            var contents = fs.readFileSync(__dirname + 
                '/../examples/test_symop.cif', 
                'utf8');

            var symtol = 1e-3;
            var a = Atoms.readCif(contents, symtol)['TESTSYMOP'];

            var fpos = a.get_scaled_positions();

            for (var i = 0; i < fpos.length-1; ++i) {
                var p1 = fpos[i];
                for (var j = i+1; j < fpos.length; ++j) {
                    var p2 = fpos[j];
                    var r = [(p2[0]-p1[0])%1,
                             (p2[1]-p1[1])%1,
                             (p2[2]-p1[2])%1];
                    r = utils.shortestPeriodicLength(r);
                    expect(r).to.be.above(symtol);
                }
            }

        });
    it('should correctly interpret various formats of cell', function() {

            // Cubic cell
            var a = new Atoms(['C'], [[0,0,0]], 2.0);
            expect(a.get_cell()).to.deep.equal([[2, 0, 0], [0, 2, 0], [0, 0, 2]]);

            // Orthorombic cell
            a = new Atoms(['C'], [[0,0,0]], [1,2,3]);
            expect(a.get_cell()).to.deep.equal([[1, 0, 0], [0, 2, 0], [0, 0, 3]]);

            // Cartesian cell
            a = new Atoms(['C'], [[0,0,0]], [[1,1,0],[0,2,0],[0,1,3]]);
            expect(a.get_cell()).to.deep.equal([[1,1,0],[0,2,0],[0,1,3]]);

            // Partial periodicity
            a = new Atoms(['C'], [[0,0,0]], [1,null,1]);
            expect(a.get_pbc()).to.deep.equal([true, false, true]);
            expect(a.get_cell()).to.deep.equal([[1, 0, 0], null, [0, 0, 1]]);

            // Axes and angles
            a = new Atoms(['C'], [[0,0,0]], [[1, Math.sqrt(2), 1], [90, 90, 45]]);
            expect(a.get_cell()).to.almost.deep.equal([[1,0,0],[1,1,0],[0,0,1]]);
            
        });

});