(function ($, window) {
  "use strict";

  var document = window.document;

  $(function () {
    var menuSelect = $("#edit-menu-menu-parent");
    if (menuSelect.length) {
      var toggle = $(
        ' <a id="better_parent_item_toggle" href="#">(' + Drupal.t("browse") + ')</a>'
      ).click(function () {
        _better_parent_item_toggle_control(menuSelect, $(this));
        return false;
      });
      menuSelect.after(toggle);
    }
  });

  function _better_parent_item_toggle_control(select, toggle) {
    var bpi = $("#better_parent_item");
    if (!bpi.length) {
      bpi = _better_parent_item_setup(select);
    }

    if (!select.is(":hidden")) {
      select.hide();
      _better_parent_item_pre_select(select);
      bpi.show();
      toggle.text("(" + Drupal.t("select") + ")");
    } else {
      select.show();
      bpi.hide();
      toggle.text("(" + Drupal.t("browse") + ")");
    }
  }

  function _better_parent_item_determine_level(label) {
    var matches = label.match(/^-+\s/);
    matches = matches !== null ? matches.join("") : "-";
    return (matches.length - 1) / 2;
  }

  function _better_parent_item_clean_label(label) {
    return label.replace(/-+\s/, "");
  }

  function _better_parent_item_pre_select(select) {
    $("#better_parent_item ul").hide();
    if (select.val() !== "") {
      var selected = $('a[id="' + select.val() + '"]');

      selected.parents("ul").show();
      selected.parents("ul").parent("li").addClass("opened");
      selected.click();

      var div = $("#better_parent_item");
      div.scrollTop(selected.position().top - parseInt(div.height(), 10) / 2);
    }
  }

  function _better_parent_item_setup(select) {
    var root = document.createElement("ul");
    root.setAttribute("id", "better_parent_item");

    var parent = root;
    var previous = root;
    var level = 0;

    select.find("option").each(function () {
      var option = $(this);
      var value = option.val();
      var label = option.html();
      var iLevel = _better_parent_item_determine_level(label);
      var item = document.createElement("li");
      var link = document.createElement("a");
      link.setAttribute("id", value);
      link.innerHTML = _better_parent_item_clean_label(label);
      item.appendChild(link);

      if (iLevel > level) {
        var ul = document.createElement("ul");
        previous.appendChild(ul);
        parent = ul;
        level += 1;
        ul.setAttribute("class", "level-" + level);
      } else if (iLevel < level) {
        do {
          parent = parent.parentNode.parentNode;
          level -= 1;
        } while (level > iLevel);
      }

      parent.appendChild(item);
      previous = item;
    });

    select.after(root);

    $("#better_parent_item li a").click(function () {
      var anchor = $(this);
      var ul = anchor.next("ul");

      $("#better_parent_item li a.selected").removeClass("selected");
      anchor.addClass("selected");

      select.val(anchor.attr("id"));

      if (ul.length) {
        ul.slideToggle("fast", function () {
          $(this).parent("li").toggleClass("opened");
        });
      }

      return false;
    });

    $("#better_parent_item ul").each(function () {
      $(this).parent("li").addClass("hasChildren");
    });

    $("#better_parent_item ul").hide();

    return $("#better_parent_item");
  }
})(window.jQuery, window);
