/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// entity selected by admin (link)
var current_entity;
var current_entity_name;

function initialize() {
    current_entity = null;
    current_entity_name = null;
    build_menu();
    var menus = ['configuration', 'comments', 'rights', 'events', 'sensors'];
    $(menus).each(function(index, menu) {
        $("#menu_" + menu).click(function() {
            displayLeftPanel(menu);
        });
    });
}

// gathers entities from DB and builds the top menu
// and the corresponding panels
function build_menu() {
    var entities = get_entities(), entity = 0;
    if (entities) {
        while (entities[entity]) {
            $.getJSON('/api/entity/' + entities[entity],
                      function(data) {
                var name = data.payload.name.replace(" ", "_");
                $("#entities_list").append(
                    "<li><a href=\"#entity_"
                    + name
                    + "\" data-toggle=\"tab\" onclick=\"update_current_entity('" + data.payload._id + "')\">"
                    + data.payload.name
                    + "</strong></a></li>"
                );
                $("#entities_content").append(
                    "<div class=\"tab-pane\" id=\"entity_"
                    + name
                    + "\">"
                    + "</div>"
                );
            });
            entity++;
        }
    }
}

function get_entities() {
    var entities;
    $.ajax({
        url: '/whoami/',
        dataType: 'json',
        async: false,
        success: function(data) {
            entities = data.entity;
        }
    });
    return entities;
}

// display the left panel content according to
// the selected menu (left menu)
function displayLeftPanel(link) {
    $.ajax({
        url: 'admin/' + link + '.html',
        type: 'GET',
        dataType: 'html',
        success: function(data) {
            $("#leftpanel").html(data);
        },
        error: function() {
            $("#leftpanel").html('');
        }
    });
}

function get_sensors() {
}

function get_comments() {
    $("#div_comments").html("");
    if (current_entity) {
        $.getJSON('/api/entity/' + current_entity,
                  function(data) {
            var comments = data.payload.comments;
            $(comments).each(function(index, value) {
                $.getJSON('/api/comment/' + value,
                          function(com) {
                    if (com.payload.value && com.payload.date) {
                        $("#div_comments").append("<blockquote>" + com.payload.value + "</blockquote>");
                        $("#div_comments").append($.date(com.payload.date));
                    }
                });
            });
        });
    }
}

function get_events() {
    $("#div_events").html("");
    if (current_entity) {
        $.getJSON('/api/entity/' + current_entity,
                  function(data) {
            var events = data.payload.events;
            $(events).each(function(index, value) {
                $.getJSON('/api/event/' + value,
                          function(event) {
                    $("#div_events").append(event.payload.name);
                    $("#div_events").append(event.payload.description);
                    $("#div_events").append($.date(event.payload.date));
                });
            });
        });
    }
}

function get_admins() {
    var selectedAdmin = null;
    if (current_entity) {
        $.getJSON('/api/administrator/',
                  function(data) {
            var admin = 0;
            while (data.payload[admin]) {
                if (data.payload[admin].entity.indexOf(current_entity) !== -1) {
                    $("#admins_list_on").append(
                        "<option value=\""
                        + data.payload[admin]._id
                        + "\">"
                        + data.payload[admin].first_name + ' ' + data.payload[admin].name
                        + "</option>"
                    ); 
                } else {
                    $("#admins_list_off").append(
                        "<option value=\""
                        + data.payload[admin]._id
                        + "\">"
                        + data.payload[admin].first_name + ' ' + data.payload[admin].name
                        + "</option>"
                    );
                }
                admin++;
            }
            $("#admins_list_off").change(function() {
                $.getJSON('/api/administrator/' + $("#admins_list_off").val(),
                          function(selection) {
                    selectedAdmin = selection;
                    console.log("off :"+selectedAdmin);
                    $("#admin_descr").html(selection.payload.first_name + ' ' + selection.payload.name);
                    if (selection.payload.entity.indexOf(current_entity) !== -1) {
                        admin_switch_set_to("on");
                    } else {
                        admin_switch_set_to("off");
                    }
                });
            });
            $("#admins_list_on").change(function() {
                $.getJSON('/api/administrator/' + $("#admins_list_on").val(),
                          function(selection) {
                    selectedAdmin = selection;
                    console.log("on :"+selectedAdmin);
                    $("#admin_descr").html(selection.payload.first_name + ' ' + selection.payload.name);
                    if (selection.payload.entity.indexOf(current_entity) !== -1) {
                        admin_switch_set_to("on");
                    } else {
                        admin_switch_set_to("off");
                    }
                });
            });
            $("#btn_delete").click(function() {
                console.log("in delete");
                if (selectedAdmin) {
                    var i = 0;
                    while (data.payload[i]._id!=selectedAdmin.payload._id) {
                        i++;
                    }

                    console.log("id : "+data.payload[i]._id);

                    if (data.payload[i].entity.indexOf(current_entity) !== -1) {
                        $('#admins_list_on option[value='+'"'+data.payload[i]._id+'"]').remove();
                        console.log("delete1234");
                    } else {
                        $('#admins_list_off option[value='+'"'+data.payload[i]._id+'"]').remove();
                        console.log("delete1235");
                    }

                    $.ajax({
                        type: "DELETE",
                        url: "/api/administrator",
                        data : {"name": selectedAdmin.payload.prenom,
                                "first_name": selectedAdmin.payload.nom,
                                "login": selectedAdmin.payload.login,
                                "password": selectedAdmin.payload.password,
                                "_id": selectedAdmin.payload._id
                               },
                        success: function () {
                            console.log("delete success!");
                        }
                    });
                }
            });

            $("#btn_onoff").click(function() {
                if (selectedAdmin) {
                    toggle_switch();
                    if ($("#btn_on").hasClass('active')) {
                        $.ajax({
                            url: '/api/administrator/' + selectedAdmin.payload._id,
                            type: 'PUT',
                            dataType: 'json',
                            data: {'entity': $.merge(selectedAdmin.payload.entity, [current_entity])},
                            success: function(data) {
                                show_modal("Ajout des droits", selectedAdmin.payload.login + " est maintenant administrateur de "
                                           + current_entity_name);

                                $("#admins_list_on").append(
                                    "<option value=\""
                                    + selectedAdmin.payload._id
                                    + "\">"
                                    + selectedAdmin.payload.first_name + ' ' + selectedAdmin.payload.name
                                    + "</option>"
                                ); 
                                $('#admins_list_off option[value='+'"'+selectedAdmin.payload._id+'"]').remove();

                            },
                            error: function() {
                                show_modal("Ajout des droits", "Erreur !");
                            }
                        });
                    } else {
                        $.ajax({
                            url: '/api/administrator/' + selectedAdmin.payload._id,
                            type: 'PUT',
                            dataType: 'json',
                            data: {'entity': $.grep(selectedAdmin.payload.entity, function(elt, idx) {
                                return (elt !== current_entity);
                            })},
                            success: function(data) {
                                show_modal("Retrait des droits", selectedAdmin.payload.login + " n'est plus administrateur de "
                                           + current_entity_name);

                                $("#admins_list_off").append(
                                    "<option value=\""
                                    + selectedAdmin.payload._id
                                    + "\">"
                                    + selectedAdmin.payload.first_name + ' ' + selectedAdmin.payload.name
                                    + "</option>"
                                ); 
                                $('#admins_list_on option[value='+'"'+selectedAdmin.payload._id+'"]').remove();

                            },
                            error: function() {
                                show_modal("Retrait des droits", "Erreur !");
                            }
                        });
                    }
                }
            });
        });
    }
}


function admin_switch_set_to(value) {
    if (($("#btn_on").hasClass('active') && value === "off") ||
        ($("#btn_off").hasClass('active') && value === "on")) {
        toggle_switch();
    }
}

function toggle_switch() {
    $(["btn_on", "btn_off"]).each(function(index, value) {
        $("#" + value).toggleClass('active');
        $("#" + value).toggleClass('btn-primary');
        $("#" + value).toggleClass('btn-default');
    });
}




// utils

$.date = function(dateObject) {
    var d = new Date(dateObject);
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    if (day < 10) {
        day = "0" + day;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var hour = d.getHours();
    var minute = d.getMinutes();
    var date = "<p class=\"text-right\">" + day + "/" + month + "/" + year + ", " + hour + "h" + minute + "</p>";

    return date;
};

function update_current_entity(entity_id) {
    current_entity = entity_id;
    $.getJSON('/api/entity/' + entity_id,
              function(data) {
        current_entity_name = data.payload.name || "";
        var openhab = data.payload.openhab;
        /*if (openhab) {
            $("#div_openhab").html("<a href=\"" + openhab + "\"><img src=\"images/openhab-logo.jpg\" alt=\"Interface openHAB\" style=\"width:100%\"/></a>");
        } else {
            $("#div_openhab").html("<img src=\"images/openhab-logo.jpg\" alt=\"Interface openHAB\" style=\"width:100%\"/>");
        }*/
    });
    $("#leftpanel").html('');
}

function show_modal(title, text) {
    $("#div_modal_body").html(text);
    $("#div_modal_title").html(title);
}
