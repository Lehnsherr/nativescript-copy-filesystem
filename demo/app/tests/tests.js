var CopyFilesystem = require("nativescript-copy-filesystem").CopyFilesystem;
var copyFilesystem = new CopyFilesystem();

describe("greet function", function() {
    it("exists", function() {
        expect(copyFilesystem.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(copyFilesystem.greet()).toEqual("Hello, NS");
    });
});