let assert = require("assert");
import {parseHTML} from '../src/parser';


describe('parse html: ', () => {
  it('<a></a>', function() {
    const tree = parseHTML('<a></a>');
    assert.equal(tree.children[0].tagName, 'a');
    assert.equal(tree.children[0].children.length, 0);
  });

  it('<a href="www.geekband.org"></a>', function() {
    const tree = parseHTML('<a href="www.geekband.org"></a>');
    assert.equal(tree.children[0].attributes[0].name, 'href');
    assert.equal(tree.children[0].attributes[0].value, 'www.geekband.org');
  });

  it('<a href="www.geekband.org"></a>', function() {
    const tree = parseHTML("<a href='www.geekband.org'></a>");
    assert.equal(tree.children[0].attributes[0].name, 'href');
    assert.equal(tree.children[0].attributes[0].value, 'www.geekband.org');
  });

  it('<a href="www.geekband.org" id></a>', function() {
    const tree = parseHTML("<a href='www.geekband.org' id></a>");
    assert.equal(tree.children[0].attributes[0].name, 'href');
    assert.equal(tree.children[0].attributes[0].value, 'www.geekband.org');
    assert.equal(tree.children[0].attributes[1].name, 'id');

  });

  it("<a href='www.geekband.org' id></a>", function() {
    const tree = parseHTML("<a href='www.geekband.org' id></a>");
    assert.equal(tree.children[0].attributes[0].name, 'href');
    assert.equal(tree.children[0].attributes[0].value, 'www.geekband.org');
    assert.equal(tree.children[0].attributes[1].name, 'id');

  });

  it('<a href ></a>', function() {
    const tree = parseHTML('<a href ></a>');
    assert.equal(tree.children[0].attributes[0].name, 'href');
    assert.equal(tree.children[0].attributes[0].value, '');
  });

  it('<a href id ></a>', function() {
    const tree = parseHTML('<a href id ></a>');
    assert.equal(tree.children[0].attributes[0].name, 'href');
    assert.equal(tree.children[0].attributes[1].name, 'id');
  });

  it('<a href="bb"></a>', function() {
    const tree = parseHTML('<a href="bb"></a>');
    assert.equal(tree.children[0].attributes[0].name, 'href');
    assert.equal(tree.children[0].attributes[0].value, 'bb');
  });

  it('<a>aaa</a>', function() {
    const tree = parseHTML('<a>aaa</a>');
    assert.equal(tree.children[0].children[0].type, 'text');
    assert.equal(tree.children[0].children[0].content, 'aaa');
  });

  it('<a style="width: 100px"></a>', function() {
    const tree = parseHTML('<a style="width: 100px"></a>');
    assert.equal(tree.children[0].attributes[0].name, 'style');
    assert.equal(tree.children[0].attributes[0].value, 'width: 100px');
  });

  it('<a id="www"/>', function() {
    const tree = parseHTML('<a id="www"/>');
    assert.equal(tree.children[0].attributes[1].name, 'isSelfClosing');
  });

  it('<a id=aaaaa />', function() {
    const tree = parseHTML('<a id=aaaaa />');
    assert.equal(tree.children[0].attributes[0].name, 'id');
    assert.equal(tree.children[0].attributes[0].value, 'aaaaa');
  });

  it('<a id=aaaaa/>', function() {
    const tree = parseHTML('<a id=aaaaa/>');
    assert.equal(tree.children[0].attributes[0].name, 'id');
    assert.equal(tree.children[0].attributes[0].value, 'aaaaa');
  });

  it('<>', function() {
    const tree = parseHTML('<>');
    console.log(tree.children[0]);
    // assert.equal(tree.children[0].attributes[1].name, 'isSelfClosing');
  });

});
