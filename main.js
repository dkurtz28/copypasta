//  Make the items sortable ====================================================
$(function() {
  $(".source, .target").sortable({
    connectWith: ".connected",
  });
});

//  Changes the height of the text box =========================================
function changeHeight(e) {
  // Reset the height
  topTextarea.style.height = "";

  // Set the new height. Add 2 to remove any unnecessary scoll bars;
  // 300px is the maximum height
  topTextarea.style.height = Math.min(topTextarea.scrollHeight + 2, 300) + "px";
}

// On text input call changeHeight =============================================
$("#topTextarea").on("input", changeHeight);


// =============================================================================
function resetItems() {
  var arr = $("#topTextarea").val().split("\n")
  var list = $('.source.connected.ui-sortable');
  var parent = list.parent();

  list.detach().empty().each(function(i) {
    for (var x = 0; x < arr.length; x++) {
      if (arr[x].replace(/\s+/g, '') != "") {
        var actionBtns = '</span><span class="remove">x</span><span class="arrow">⇔</span></li>'
        $(this).append('<li class="source-item"><span class="text">' + arr[x] + actionBtns);
      }

      if (x == arr.length - 1) {
        $(this).appendTo(parent);
      }
    }
  });
};
$(".setItems").click(resetItems)

//  Expand and collapse the item boxes =========================================
$(".collapse").click(function() {
  $(".connected").height("inherit")
  $(".collapse").hide()
  $(".expand").show()
});

$(".expand").click(function() {
  // CSS Default 400 - 2x2 (padding) - 1x2 (border)
  $(".connected").height("394")
  $(".collapse").show()
  $(".expand").hide()
});

//  Takes items from the "target" area and displays them in the bottom textarea
//  Also copies them to the clipboard
function createList() {
  var res = $(".target .text").map(function(i,e) {
    return (e.innerText + "\n");
  }).get().join("").replace(/;/g , "\t");

  // If there is nothing to copy abort
  if (res == "") return

  var tArea = $("#botTextarea")
  var message = $('.tempMessage')

  // Display formated items and select the text
  tArea.val(res)
  tArea.focus()
  tArea.select()

  // Copy and display the "copied to clipboard" message
  if (document.execCommand("copy")) {
    message.fadeIn()
    message.delay(500).fadeOut(1000)
  }
};
$(".createList").click(createList)



// On double click of "list item" move list item over ==========================
$(".source").on("dblclick", ".source-item", function(e) {
  if (e.target.className == "source-item") {
    $(".target").append(e.target);
  }
});
$(".target").on("dblclick", ".source-item", function(e) {
  var name = e.target.className
  if (name == "source-item") {
    $(".source").append(e.target);
  }
});

// On single click of "arrow" move list item over ==============================
$(".source").on("click", ".arrow", function(e) {
  $(".target").append($(this).parent());
});
$(".target").on("click", ".arrow", function(e) {
  $(".source").append($(this).parent());
});

// On single click of "X" remove list item =====================================
$(".connected").on("click", "li .remove", function(e) {
  $(this).parent().remove();
});

// Clear the target field  =====================================================
$(".right").on("click", ".clear", function(e) {
  $(".target").children().remove();
});
// Clear the source field  =====================================================
$(".left").on("click", ".clear", function(e) {
  $(".source").children().remove();
});


// Upload File
$("#myFile").change(function(e) {
  var reader = new FileReader();
  var file = e.target.files[0]

  // Print the contents of the file
  reader.onload = (function() {
    return function(item) {
      $("#topTextarea").val(item.target.result)
      changeHeight()
      resetItems()
    };
  })(file);
  reader.readAsText(file);
});

// Download as CSV or TXT  =====================================================
$("a[download].dlFile").click(function(e) {
  createList()
  var output = $("#botTextarea").val()

  // If there isnt anything to download abort
  if (output == "") {
    e.preventDefault()
    return
  }

  var fName = $(".dlName").val()
  var fType = $(".dlType").val()
  var dataType = "data:application/" + fType + ";charset=UTF-8"

  var fUrl =  window.URL.createObjectURL(new Blob([output], { type: dataType }));
  $(this).attr("download", fName + "." + fType)
  $(this).attr("href", fUrl);
});
