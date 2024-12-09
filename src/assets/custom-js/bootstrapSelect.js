/* 
 Copyright (C) Philippe Meyer 2018-2019
 Distributed under the MIT License
 bootstrapSelect v0.88 : Changed check marks design
 https://github.com/PhilippeMarcMeyer/bootstrapSelect
*/
document.addEventListener('DOMContentLoaded', () => {
    (function ($) {

        $.fn.bootstrapSelect = function (action, options) {
            const errMsg = "bootstrapSelect error : "
            var factory;
            if (action == "init") {
                factory = this;
                factory.byColor = "off";// public
                factory.byClass = "off"; // private : specific classes for each menu item, get from the option className
                factory.width = 120;
                factory.className = "bs-select"; // general class
                factory.maxWidth = 500;
                factory.maxHeight = 400;
                factory.isDisabled = false;
                factory.tooltip = null;
                factory.isMultiple = false;
                factory.factoryId = $(this).attr("id");
                factory.marginLeft = "0px";
                factory.multipleSize = -1;
                factory.search = false;
                factory.placeHolder = "";
                factory.header; // button
                factory.title = null; // button title
                factory.translations = {"all": "All", "items": "items"};

                if (!options) options = {};

                if (options.colors) {
                    factory.byColor = options.colors;
                }
                if ($.isPlainObject(options.tooltip)) {
                    if (options.tooltip.message) {
                        factory.tooltip = {"message": options.tooltip.message, "position": "left"};
                        if (options.tooltip.position) {
                            factory.tooltip.position = options.tooltip.position;
                        }
                    }
                }

                if (options.className != undefined) {
                    factory.className = options.className;
                }

                if (options.translations != undefined) {
                    factory.translations = options.translations;
                }

                if (options.maxWidth != undefined) {
                    factory.maxWidth = options.maxWidth;
                }

                if (options.search != undefined) {
                    factory.search = options.search;
                } else if ($(factory).hasClass('notSelectable')) {
                    factory.search = false
                } else if ($(factory).find('option').length > 10) {
                    factory.search = true

                }

                if (options.placeHolder != undefined) {
                    factory.placeHolder = options.placeHolder;
                }

                if (options.maxHeight != undefined) {
                    factory.maxHeight = options.maxHeight;
                }
                factory.isMultiple = $(factory).attr("multiple") ? true : false;

                let testMultipleSize = $(factory).attr("size");
                if (testMultipleSize != undefined) {
                    testMultipleSize = parseInt(testMultipleSize);
                    if (!isNaN(testMultipleSize) && testMultipleSize >= 1) {
                        factory.multipleSize = testMultipleSize
                    }
                }

                factory.marginLeft = $(factory).css("margin-left");
                $(factory).css("display", "none");

                var $drop = $("<div></div>");
                $(factory).after($drop);

                var $already = $("#btn-group-" + factory.factoryId);
                if ($already.length > 0) {
                    $already.remove();
                }
                $drop
                    .addClass("btn-group w-100 " + factory.className + " " + factory.attr('class'))
                    .attr("id", "btn-group-" + factory.factoryId)
                    .css("margin-left", factory.marginLeft);

                var $button = $("<button></button>");

                var presentValue = $(factory).val();

                $button
                    .appendTo($drop)
                    .addClass("form-select w-100")
                    .attr("data-bs-toggle", "dropdown")
                    .attr("aria-haspopup", "true")
                    .attr("aria-expanded", "false")
                    .css({"width": "100%", "text-align": "left", "z-index": 1, "font-size": "14px"})
                ;

                if (factory.tooltip != null) {
                    $button
                        .attr("data-placement", options.tooltip.position)
                        .attr("title", options.tooltip.message.replace('"', ''));
                }

                factory.title = $("<span></span>");
                factory.title
                    .appendTo($button)
                    .addClass("title");

                var $caret = $("<span></span>");
                $caret
                    .appendTo($button)
                    .addClass("caret")
                    .css({"position": "absolute", "right": "8px", "margin-top": "8px"});

                factory.header = $button;

                var $ul = $("<ul></ul>");
                $ul
                    .appendTo($drop)
                    .addClass("dropdown-menu px-2 w-100")
                    .css({"cursor": "pointer", "max-height": factory.maxHeight + "px", "overflow-y": "auto"});

                if (factory.isMultiple) {
                    $ul.addClass("multi");
                }

                let selectedTexts = ""
                let sep = "";
                let nrActives = 0;

                if (factory.search) {
                    var $div = $("<div></div>");
                    $div
                        .addClass("bs-js-search-zone input-group input-group-sm mb-2")
                        .css({ "background-color": "white" });

                    var $searchIcon = $("<span></span>")

                    $searchIcon.addClass('input-group-text bg-white border border-1 border-end-0')
                        .html('<i class="bi bi-search"></i>')

                    $searchIcon.appendTo($div)
                    var $input = $("<input/>");

                    $input
                        .appendTo($div)
                        .attr("type", "text")
                        .attr("id", "search_" + factory.factoryId)
                        .attr("placeholder", "Search Option")
                        .addClass('form-control border border-1 border-start-0')
                    ;

                    $div
                        .appendTo($ul)
                    let fontSizeForP = factory.isMultiple ? "18px" : "16px";
                    var $para = $("<p></p>");
                    // $para
                    //     .appendTo($ul)
                    //     .css({"font-size": fontSizeForP})
                    //     .html("&nbsp;");

                    $ul.on("scroll", function () {
                        let s = $(this).scrollTop();
                        $("#search_" + factory.factoryId).parent().css("top", s + "px");
                    });

                }
                $(factory).find("option").each(function (i) {

                    var text = $(this).text();
                    var value = $(this).attr("value") || text;

                    var $li = $("<li></li>");
                    $li
                        .appendTo($ul)
                        .attr("data-value", value)
                        .attr("data-text", text)
                        .addClass('hover rounded-1 p-1')
                        .html(text);

                    let optionSelected = $(this).prop("selected");
                    if (optionSelected) {
                        $li.addClass("active");
                        nrActives++;
                        if (factory.isMultiple){
                            selectedTexts += '  ' + '<span class="select-badge">' + text + '</span>';
                        }else {
                            selectedTexts += sep + text;
                        }
                        sep = ",";
                    }

                    var color = "black";
                    if (factory.byColor == "on") {
                        color = $(this).data("color") || color;
                        $li
                            .css("color", color);

                        if (value == presentValue) {
                            $li.addClass("active");
                            factory.title
                                .html(text)
                                .css("color", color);
                        }
                    } else {
                        var className = $(this).attr("class") || "none";
                        factory.byClass = "on";
                        $li
                            .addClass(className);

                        if (value == presentValue) {
                            $li.addClass("active");
                            factory.title
                                .html(text)
                                .attr("class", "title " + className);
                        }
                    }


                    if (factory.tooltip != null) {
                        $button.tooltip();
                    }
                });

                if (factory.multipleSize != -1) {
                    if (nrActives > factory.multipleSize) {
                        let wordForItems = factory.translations.items || "items"
                        selectedTexts = nrActives + " " + wordForItems;
                    }
                }
                $(factory.title).html(selectedTexts);
                if (factory.search) {
                    $("#search_" + factory.factoryId).on("keyup", function () {

                        let searchValue = $(this).val().toUpperCase();
                        let searchValueLength = searchValue.length;
                        if (searchValueLength < 2) {
                            $($drop).find("li").each(function () {
                                $(this).removeClass("d-none");
                            });
                        } else {
                            $($drop).find("li").each(function () {
                                let text = $(this).attr("data-text").toUpperCase();
                                if (text.indexOf(searchValue) == -1) {
                                    $(this).addClass("d-none");
                                } else {
                                    $(this).removeClass("d-none");
                                }
                            });
                        }
                    });
                    $("body").on("click", function () {
                        $(".bs-js-search-zone input").val("");
                        $($drop).find("li").each(function () {
                            $(this).removeClass("d-none");
                        });
                    });
                }

                if (factory.placeHolder != "" && factory.title.text() == "") {
                    factory.title.html(factory.placeHolder)
                }

                $($drop).find("li").on("click", function (event) {
                    let that = this;

                    if (!factory.isDisabled) {
                        let text = $(that).attr("data-text");
                        let value = $(that).attr("data-value");
                        if (factory.isMultiple) {
                            event.stopPropagation();
                            if ($(that).hasClass("active")) {
                                $(that).removeClass("active");
                                $("#" + factory.factoryId + " option[value='" + value + "']").prop("selected", false);
                            } else {
                                $(that).addClass("active");
                                $("#" + factory.factoryId + " option[value='" + value + "']").prop("selected", true);
                            }

                            let selectedTexts = ""
                            let sep = "";
                            let nrActives = 0;
                            let nrAll = 0;
                            $($drop).find("li").each(function () {
                                nrAll++;
                                if ($(this).hasClass("active")) {
                                    nrActives++;
                                    selectedTexts += sep + '<span class="select-badge">' +$(this).attr("data-text") + '</span>';
                                    sep = "  ";
                                }
                            });
                            if (nrAll == nrActives) {
                                let wordForAll = factory.translations.all || "all";
                                selectedTexts = '<span class="select-badge">' +wordForAll + '</span>';
                            } else if (factory.multipleSize != -1) {
                                if (nrActives > factory.multipleSize) {
                                    let wordForItems = factory.translations.items || "items"
                                    selectedTexts = '<span class="select-badge">' + nrActives + " " + wordForItems + '</span>';
                                }
                            }

                            $(factory.title).html(selectedTexts);

                            $(factory).get(0).dispatchEvent( new Event('change'))
                            $(factory).trigger("change");
                        } else {

                            if (factory.byColor == "on") {
                                var color = $(that).css("color") || "black";
                                $(factory.title).css("color", color);
                            }
                            if (factory.byClass == "on") {
                                var className = $(that).attr("class");
                                $(factory.title).attr("class", "title " + className);
                            }
                            $($drop).find("li").each(function () {
                                if ($(this).attr("data-value") == value) {
                                    $(this).addClass("active");
                                } else {
                                    $(this).removeClass("active");
                                }
                            });

                            $(factory).find("option").each(function (i) {
                                if ($(this).val() == value) {
                                    $(this).prop("selected", true);
                                }
                            });
                            $(factory.title).html(text);

                            $(factory).get(0).dispatchEvent( new Event('change'))
                            $(factory).trigger("change");
                        }
                        // isMultiple

                        if (factory.placeHolder != "" && factory.title.text() == "") {
                            factory.title.html(factory.placeHolder)
                        }
                    }
                });
                $ul.outerWidth($ul.outerWidth() + 30);
                return factory;
            } else if (action == "empty") {
                let factory = this;
                let $target = "#btn-group-" + $(this).attr("id");
                if ($($target).find("button").hasClass("disabled")) return;

                $($target).find("option").each(function () {
                    $(this).prop("selected", false);
                });

                $($target).find("li").each(function () {
                    $(this).removeClass("active");
                });

                $($target).find(".title").html("");
                return (this);

            } else if (action == "setValue") {
                let factory = this;
                let $target = "#btn-group-" + $(this).attr("id");
                if ($($target).find("button").hasClass("disabled")) return;

                if (options == undefined) return;
                let values = [];
                var rowValue = options;
                if (typeof rowValue == "string") {
                    values = rowValue.split(",");
                } else if (typeof value == "number") {
                    values = [rowValue];
                } else if (typeof value == "object") {
                    if (Object.prototype.toString.call(rowValue) == "[object Array]") {
                        value = rowValue;
                    }
                } else {
                    return;
                }
                let selectedTexts = ""
                let sep = "";
                let nrActives = 0;
                let nrAll = 0;
                let setAll = values.length == 1 && values[0] == "all";
                $(factory).find("option").each(function () {
                    nrAll++;
                    let value = $(this).attr("value");
                    if (setAll || values.indexOf(value) != -1) {
                        $(this).prop("selected", true);
                    } else {
                        $(this).prop("selected", false);
                    }
                });

                $($target).find("li").each(function () {
                    let value = $(this).attr("data-value");
                    let text = $(this).attr("data-text");
                    if (setAll || values.indexOf(value) != -1) {
                        $(this).addClass("active");
                        selectedTexts += sep + text;
                        sep = ",";
                        nrActives++;
                    } else {
                        $(this).removeClass("active");
                    }
                });
                factory.isMultiple = $(factory).attr("multiple") ? true : false;
                if (factory.isMultiple) {
                    let testMultipleSize = $(factory).attr("size");
                    if (testMultipleSize != undefined) {
                        testMultipleSize = parseInt(testMultipleSize);
                        if (!isNaN(testMultipleSize) && testMultipleSize >= 1) {
                            factory.multipleSize = testMultipleSize
                        }
                    }
                    if (nrActives == nrAll) {
                        let wordForAll = factory.translations.all || "all"
                        selectedTexts = wordForAll;
                    } else if (nrActives > factory.multipleSize) {
                        let wordForItems = factory.translations.items || "items"
                        selectedTexts = nrActives + " " + wordForItems;
                    }
                }
                $($target).find(".title").html(selectedTexts);
                return (this);
            } else if (action == "hideOption") {
                let factory = this;
                let $target = "#btn-group-" + $(this).attr("id");
                if ($($target).find("button").hasClass("disabled")) return;
                if (options != undefined) {
                    var value = options;
                    if (typeof value == "string" || typeof value == "number") {
                        var $li = $($target).find("li[data-value='" + value + "']");
                        if ($li.length == 1) {
                            let isSelected = $($target).find("option[value='" + value + "']").prop("selected");
                            if (!isSelected) {
                                $li.removeClass("active");
                                $li.addClass("d-none");
                            } else {
                                console.log("can't hide selected option !");
                            }
                        }
                    } else {
                        console.log("hideOption parameter should be either a string or a number");
                    }
                }
                return (factory);
            } else if (action == "showOption") {
                let factory = this;
                let $target = "#btn-group-" + $(this).attr("id");
                if ($($target).find("button").hasClass("disabled")) return;
                if (options != undefined) {
                    var value = options;
                    if (typeof value == "string" || typeof value == "number") {
                        var $li = $($target).find("li[data-value='" + value + "']");
                        if ($li.length == 1) {
                            $li.removeClass("d-none");
                        }
                    } else {
                        console.log("hideOption parameter should be either a string or a number");
                    }
                }
                return (factory);
            } else if (action == "disable") {
                isDisabled = true;
                let $target = "#btn-group-" + $(this).attr("id");
                $($target).find("button").addClass("disabled");
                return (this);
            } else if (action == "enable") {
                isDisabled = false;
                let $target = "#btn-group-" + $(this).attr("id");
                $($target).find("button").removeClass("disabled");
                return (this);
            } else if (action == "destroy") {
                let $target = "#btn-group-" + $(this).attr("id");
                $($target)
                    .remove();

                factory = null;
                return (this);
            } else {
                onError = true;
                console.log(errMsg + "no action parameter provided (param 1)");
            }
        }
    }(jQuery));

});
