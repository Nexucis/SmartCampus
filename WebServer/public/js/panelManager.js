/*
 * SmartCampus
 *  ©SmartCampus 2014 https://github.com/thomasNDS/SmartCampus2014
 *  License MIT
 */

//Tableau qui va contenir les id de toutes les entités, pour éviter d'avoir à reload les entités et de faire un sort
entitiesArray = new Array();

//var global utilisée pour la construction des onglets
indexTab = 0;

/// ==== LOADERS ==== ////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tous les loaders à part loadEntities, ne sont pas utilisés.                                           //
// Le fait de les utiliser, créer un asynchronisme (même si la requete ajax en elle meme est synchrone)  //
// Le comportement du programme peut alors diverger en fonction de la machine sur laquelle il est lancé  //
// Préférer faire la requête directement dans la fonction dans ce cas là (cf buildPanel)                 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 * Fonction pour charger le tableau des elements
 */
function loadEntities() {
    var entities;
    //Requete pour get toutes les entités de la BD
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/entity",
        success: function(data) {
            entities = data;

            //On les stocke dans un tableau
            for (var i = 0; i < entities.payload.length; i++) {
                entitiesArray[i] = entities.payload[i];
            }
            sortEntityArray();
        }
    });
}

/*
 * Fonction pour arranger le tableau d'entites pour choisir quelle entité est à quel index
 * Association un marker -> une entité
 * @returns {undefined}
 */
function sortEntityArray() {
    var arraySorted = new Array();
    var entityIndex = null;
    var entity = null;

    //Polytech Grenoble -> 0
    entityIndex = getIndexElementByName("Polytech Grenoble");
    entity = entitiesArray[entityIndex];
    arraySorted[0] = entity;
    arrayUnset(entitiesArray, entity);

    //Barnave -> 1
    entityIndex = getIndexElementByName("Barnave");
    entity = entitiesArray[entityIndex];
    arraySorted[1] = entity;
    arrayUnset(entitiesArray, entity);

    //CROUS Taillées -> 2
    entityIndex = getIndexElementByName("Cité des Taillées");
    entity = entitiesArray[entityIndex];
    arraySorted[2] = entity;
    arrayUnset(entitiesArray, entity);

    //EVE -> 3
    entityIndex = getIndexElementByName("EVE");
    entity = entitiesArray[entityIndex];
    arraySorted[3] = entity;
    arrayUnset(entitiesArray, entity);

    //ARRET TRAM -> 4
    entityIndex = getIndexElementByName("Arrêt G.Fauré");
    entity = entitiesArray[entityIndex];
    arraySorted[4] = entity;
    arrayUnset(entitiesArray, entity);

    entitiesArray = arraySorted;

}

/*
 * Retourne l'index d'un element dans le tableau entitesArray
 * @param {type} name
 * @returns {Number}
 */
function getIndexElementByName(name) {
    var found = false;
    var i = 0;
    while (i < entitiesArray.length && !found) {
        if (entitiesArray[i].name === name) {
            found = true;
        } else {
            i++;
        }
    }
    return i;
}

/*
 * Fonction pour enlever un element d'un tableau
 * @param {type} array
 * @param {type} value
 * @returns {undefined}
 */
function arrayUnset(array, value) {
    array.splice(array.indexOf(value), 1);
}

/*
 * @DEPRECATED
 * Fonction pour charger le tableau des elements
 */
function loadEntitiesCallback(callback) {
    var entitiesArray = new Array();
    var entities;
    //Requete pour get toutes les entités de la BD
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/entity",
        success: function(data) {
            console.dir(data);
            entities = data;

            //On les stocke dans un tableau
            for (var i = 0; i < entities.payload.length; i++) {
                entitiesArray[i] = entities.payload[i];
            }
            console.log("tab otenu");
            console.dir(entitiesArray);
            callback(entitiesArray);
        }
    });
}

/*
 * @DEPRECATED
 * Charger les items d'une entite
 * @param {type} entity
 * @returns {loadItemsOfEntity.items}
 */
function loadItemsOfEntity(entity) {
    var items;
    entity.items.forEach(function(item) {
        items.push(loadItemById(item.id));
    });
    return items;
}

/*
 * @DEPRECATED
 * Charge les elements d'un item (Requete)
 * @param {type} objElem
 * @returns {undefined}
 */
function loadItemById(id) {
    var item;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/item/" + id,
        success: function(data) {
            console.dir(data.payload[0]);
            item = data.payload[0];
        }
    });
    return item;
}

/*
 * @DEPRECATED
 * Charge un commentaire à partir de son id
 * @param {type} id
 * @returns {unresolved}
 */
function loadComById(id) {
    var com;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/comment/" + id,
        success: function(data) {
            //            console.dir(data.payload[0]);
            com = data.payload[0];
        },
        error: function(err) {
            console.log(err);
        }
    });
    return com;
}

/*
 * @DEPRECATED
 * Charge un sensor à partir de son id
 * @param {type} id
 * @returns {unresolved}
 */
function loadSensorById(id) {
    var sensor;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/sensors_data/" + id,
        success: function(data) {
            console.dir(data.payload[0]);
            sensor = data.payload[0];
        },
        error: function(err) {
            console.log(err);
        }
    });
    return sensor;
}

/*
 * @DEPRECATED
 * Charge un sensor à partir de son id
 * @param {type} id
 * @returns {unresolved}
 */
function loadMesureById(id) {
    var mesure;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/mesure/" + id,
        success: function(data) {
            console.dir(data.payload[0]);
            mesure = data.payload[0];
        },
        error: function(err) {
            console.log(err);
        }
    });
    return mesure;
}

/*
 * @DEPRECATED
 * Charge les horaires à partir de son id
 * @param {type} id
 * @returns {unresolved}
 */
function loadSchedule(id) {
    var schedule;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/entity/" + id,
        success: function(data) {
            //            console.dir(data.payload[0]);
            schedule = data.payload[0].schedule;
        },
        error: function(err) {
            console.log(err);
        }
    });
    return schedule;
}

/*
 * @DEPRECATED
 * Charge un event à partir de son id
 * @param {type} id
 * @returns {unresolved}
 */
function loadEvent(id) {
    var event;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/event/" + id,
        success: function(data) {
            event = data.payload[0];
        },
        error: function(err) {
            console.log(err);
        }
    });
    return event;
}


/// ==== PANEL ==== ////

/*
 * Ajout d'un commentaire 'comment' à un entite d'id 'entityId'
 * @param {type} objElem
 * @returns {undefined}
 */
function addComment(entityId, comment) {
    console.log(entityId, comment);
    // get value of comment and pseudo
    var valComment = $("#commentArea").val();
    var valpseudo = $("#commentPseudo").val();

    //test if not a null comment
    if (valComment && valpseudo && valpseudo !== "" && valComment !== "") {
        comment = '<strong>' + valpseudo + '</strong>' + ' : ' + valComment;
        var com;
        jQuery.ajax({
            type: 'POST',
            async: false,
            data: {
                entityId: entityId,
                commentValue: comment
            },
            url: "/add_comment",
            success: function(data) {
                console.log("Comment created" + data);
            },
            error: function(err) {
                console.log("Loupé :P");
                console.log(err);
            }
        });
        refreshEntity(entityId);
        return com;
    }
}

/*
 * Vote
 * @param {type} idEntity : Entité pour laquelle on vote
 * @param {type} vote
 * @returns {undefined}
 */
function makeVote(idEntity, vote) {
    console.log("vote = " + vote);
    jQuery.ajax({
        type: 'POST',
        async: false,
        data: {
            value: vote,
            idEntity: idEntity
        },
        url: "/vote/vote_ru2",
        success: function(data) {
            //            console.log("vote effectué\n" + data);
        },
        error: function(err) {
            console.log(er);
        }
    });

    //Met a jour la moyenne dans l'interfac
    $("#avgVote").html(getTextualAvg(getVoteValue(idEntity)));
}

/*
 * Recupere le vote d'une entité
 * @param {type} idEntity
 * @returns {Number|data|Array}
 */
function getVoteValue(idEntity) {
    var vote = 1;
    jQuery.ajax({
        type: 'POST',
        async: false,
        url: "/vote/moyenne_ru",
        data: {
            idEntity: idEntity
        },
        success: function(data) {
            //            console.log("vote récupéré = " + data);
            vote = data;
        },
        error: function(err) {
            console.log("erreur dans la recup");
            console.log(err);
        }
    });
    return vote;
}

/*
 * Fonction pour mettre à jour une entité d'id "entityId"
 * @param {type} objElem
 * @returns {undefined}
 */
function refreshEntity(entityId) {
    var i = 0;
    var isFound = false;
    var indexEntity;
    //Recupere l'index de l'entite dans le tableau
    while (i < entitiesArray.length && !isFound) {
        if (entitiesArray[i]._id === entityId) {
            isFound = true;
            indexEntity = i;
        }
        i = i + 4;
    }
    //Mise a jour de l'entite dans le tableau
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/entity/" + entityId,
        success: function(data) {
            console.dir(data);
            entitiesArray[indexEntity] = data.payload;
        }
    });
    //Rebuild du panel pour mettre à jour l'item commentaire
    //@TODO : Optimiser (rechargement d'un seul item)
    var entity = entitiesArray[indexEntity];
    buildPanel(entity);
}

/*
 * Ferme le panel actuellement ouvert
 */
function closePanel() {
    $("#informationPanel").css("display", "none");
}

/*
 * INUTILISEE pour le moment!
 * Met la limite height pour affichage contenu
 * @returns {undefined}
 */
function changeMaxHeightContentTabs(parentNode) {
    var height = parseInt($(parentNode).css("height"));
    console.log("maj heightContent " + height);
    var maxHeightContentTab = height * (10 / 100);
    //    $("#contentTabs").css("max-height", maxHeightContentTab);
}

/*
 * Obtenir la couleur associé à la moyenne
 * vert < orange < rouge
 * @param {type} avg
 * @returns {String}
 */
function getColorAvg(avg) {
    var color = "";
    if (avg < 1.5) {
        color = "green";
    } else if (avg > 2.5) {
        color = "red";
    } else {
        color = "orange";
    }
    return color;
}

/*
 * Obtenir le texte traduisant la valeur des votes, et met change la couleur
 * DIFFERENCE avec le précedent : On gere a la fois le txt et la couleur car on l'appelle
 * a chaque changement de moyenne
 * @param {type} avg
 * @returns {String}
 */
function getTextualAvg(avg) {
    var txt = "";
    if (avg < 1.5) {
        txt = "Faible";
        $("#avgVote").css("color", "green");
    } else if (avg > 2.5) {
        txt = "Forte";
        $("#avgVote").css("color", "red");
    } else {
        txt = "Moyenne";
        $("#avgVote").css("color", "orange");
    }
    return txt;
}

/*
 * Fonction appelé lors de la construction du panel de vote pour crowdsourcring de type Queue
 * @param {type} objElem
 * @returns {undefined}
 */
function buildVotePanelQueue(idEntity) {
    var avg = getVoteValue(idEntity);
    var txtActualAvg = "Estimation de l'attente";
    var html = "<div id=\"votePanel\">";

    html += "<div>" + txtActualAvg + " : <span id=\"avgVote\" style=\"color:" + getColorAvg(avg) + "\">" + getTextualAvg(avg) + "</span></div>";
    html += "Comment est la file ?<br>";
    html += "<button type=\"button\" class=\"btn btn-info\" onclick=\"makeVote('" + idEntity + "',1)\">Faible</button> ";
    html += "<button type=\"button\" class=\"btn btn-info\" onclick=\"makeVote('" + idEntity + "',2)\">Moyenne</button> ";
    html += "<button type=\"button\" class=\"btn btn-info\" onclick=\"makeVote('" + idEntity + "',3)\">Forte</button>";
    html += "</div>";

    return html;
}

/*
 * Construction du panel Horaire
 * @param {type} arrayHours
 * @returns {String}
 */
function buildSchedulePanel(arrayHours) {
    var txt = "Horaires théoriques : <br><br>";
    //Horaires récupérés 
    var arrayToSeyssin = arrayHours[0];
    var arrayToGieres = arrayHours[1];
    var actualDate = new Date();
    var actualDateMin = actualDate.getHours() * 60 + actualDate.getMinutes();

    //Durées qu'on va afficher
    var hoursSeyssin = [];
    var hoursGieres = [];

    var isFound = false;
    var i = 0;

    //Vers Sessyn//
    while (i < arrayToSeyssin.length && !isFound) {
        if (arrayToSeyssin[i] > actualDateMin) {
            isFound = true;
        } else {
            i++;
        }
    }
    var cptHours = 0;
    while (i < arrayToSeyssin.length && cptHours < 5) {
        hoursSeyssin[cptHours] = arrayToSeyssin[i] - actualDateMin;
        i++;
        cptHours++;
    }
    isFound = false;
    i = 0;

    //Vers Gieres //
    while (i < arrayToGieres.length && !isFound) {
        if (arrayToGieres[i] > actualDateMin) {
            isFound = true;
        } else {
            i++;
        }
    }
    cptHours = 0;
    while (i < arrayToGieres.length && cptHours < 5) {
        hoursGieres[cptHours] = arrayToGieres[i] - actualDateMin;
        i++;
        cptHours++;
    }

    txt += "<div>";
    txt += "<b>Direction Seyssins Le Prisme :</b> <br>";
    hoursSeyssin.forEach(function(hour) {
        txt += hour + " min - ";
    });
    txt += "<br>";
    txt += "<b>Direction Gières :</b> <br>";
    hoursGieres.forEach(function(hour) {
        txt += hour + " min - ";
    });
    txt += "</div>";

    return txt;
}

/**
 * Build un onglet du panel d'information
 * @param {type} title : Titre de l'onglet
 * @param {type} content : Contenu
 * @returns {undefined}
 */
function buildInfoPanel(title, content){
    var newTitle = title.replace(" ","");
    var titleDiv = "<h3 class=\"titleInfoPanel\"  onClick=\"$('#"+newTitle+"').toggle('blind')\">"+title+"</h3>";
    var contentDiv = "<div id=\""+newTitle+"\">"+content+"</div> "
    $("#contentPanelPOI").append(titleDiv);
    $("#contentPanelPOI").append(contentDiv);
    $("#"+newTitle).hide();
}




/*
 * Fonction qui va remplir le panel d'information de l'entité
 * Va charger au fur et a mesure tous les élements de l'entité
 */
function buildPanel(objElem) {
    var entity = objElem;
    entity.name = translate(entity.name);
    entity.description = translate(entity.description);

    /* Clean le panel */
    cleanChildOfNodeID("contentPanelPOI");
    //Titre du panel info
    $("#informationTitle").html(objElem.name);

    //Onglet Description
    var descriptionContent = "<div id=\"descriptionContent\">" + objElem.description + "</div>";

    if (objElem.typeCrowdsourcing === "queue") {
        descriptionContent += buildVotePanelQueue(objElem._id);
    }

    buildInfoPanel("Description", descriptionContent);

    //Onglet Horaire
    var scheduleContent = "";
    var schedule = objElem.schedule;
    if (schedule.length !== 0) {
        var arraySchedule = JSON.parse(schedule);
        scheduleContent = buildSchedulePanel(arraySchedule);
        buildInfoPanel("Horaire", scheduleContent);
    }

    objElem.items.forEach(function(itemId) {
        var itemLoaded;
        jQuery.ajax({
            type: 'GET',
            async: false,
            url: "/api/item/" + itemId,
            success: function(data) {
                itemLoaded = data.payload;
            }
        });

        if (itemLoaded.show !== false) {
            //DESCRIPTION
            itemLoaded.description = translate(itemLoaded.description);
            itemLoaded.name = translate(itemLoaded.name);
            var itemContent = itemLoaded.description + "<br>";

            // INFOS
            var infoContent = "";
            infoContent += "<div id=\"infoDiv\">";
            itemLoaded.infos.forEach(function(info, index) {
                if (info !== "") {
                    var infoDay = info.split(" ");
                    var day = infoDay[0];
                    var hour = infoDay [1];
                    var dateTiretString = infoDay[2];
                    var date = dateTiretString.split("--")[0];
                    var meal = info.split("--");
                    var mealToShow = meal[1];
                    infoContent += "<br><div class=\"mealDiv\"><b>" + day + " " + hour + " " + date + " </b> : <br>" + mealToShow + "</div>";
                }
            });
            infoContent += "</div>";

            itemContent += infoContent;

            // SENSORS
            var sensorContent = "";
            if (itemLoaded.Sensors_data.length > 0) {
                sensorContent += "<div id=\"sensorsDiv\">Capteurs : <br>";
                sensorContent += "<div>";

                itemLoaded.Sensors_data.forEach(function(sensorId) {
                    var sensorLoaded;
                    jQuery.ajax({
                        type: 'GET',
                        async: false,
                        url: "/api/sensors_data/" + sensorId,
                        success: function(data) {
                            sensorLoaded = data.payload;
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });
                    var mesureId = sensorLoaded.mesure[0];
                    var mesure;
                    jQuery.ajax({
                        type: 'GET',
                        async: false,
                        url: "/api/mesure/" + mesureId,
                        success: function(data) {
                            mesure = data.payload;
                        },
                        error: function(err) {
                            console.log(err);
                        }
                    });
                    sensorContent += '<dl class="dl-horizontal">';
                    sensorContent += '<dt class="customTypo">'+sensorLoaded.type + " : </dt>" +'<dd class="badge pull-left">'+ mesure.value;
                    if (sensorLoaded.type === "airQualite") {
                        sensorContent += " ppm</dd>";
                    } else if (sensorLoaded.type === "humidite") {
                        sensorContent += " %</dd>";
                    }
                    sensorContent += "<br>";
                });
                sensorContent += "</div>";
                sensorContent += "</div>";
            }
            itemContent += sensorContent;
            buildInfoPanel(itemLoaded.name, itemContent);
        }
    });

    //Onglet Event
    if (objElem.events.length > 0) {
        var eventContent = "<div>";
        var nbrOfEvent = 0;
        objElem.events.forEach(function(eventId) {
            var eventLoaded;
            jQuery.ajax({
                type: 'GET',
                async: false,
                url: "/api/event/" + eventId,
                success: function(data) {
                    eventLoaded = data.payload;
                },
                error: function(err) {
                    console.log(err);
                }
            });
            if (eventLoaded.description !== "" && nbrOfEvent != 10) {
                var tmp = eventLoaded.description.split("--");
                var event = "<p><b>" + tmp[0]+"</b> : "+tmp[1] + "</p><br>";
                eventContent += event;
                nbrOfEvent++;
            }
        });

        eventContent += "</div>";
        buildInfoPanel("Évènement", eventContent);
    }

    //Onglet Com ///////////////
    var commentContent = "";
    //Chargement et affichage
    objElem.comments.forEach(function(comId) {
        var com;
        jQuery.ajax({
            type: 'GET',
            async: false,
            url: "/api/comment/" + comId,
            success: function(data) {
                com = data.payload;
            },
            error: function(err) {
                console.log(err);
            }
        });
        var date = new Date(com.date);
        commentContent += "<div>" + date.toLocaleDateString() + " : " + com.value + "</div>";
    });
    //Ajout
    commentContent += '<div class="line-separator"></div><div class="zoneAddComment"><h4>Ajouter un commentaire</h4>';
    commentContent += '<input id="commentPseudo" class="form-control addPseudo" placeholder="Pseudo"><br/>';
    commentContent += "<textarea id='commentArea' class='form-control commentArea' placeholder='Commentaire'></textarea> ";
    commentContent += "<div class=\"commentBtn\"><button class=\"btn btn-primary\" onclick=\"addComment('" + objElem._id + "','" + $("#commentArea").val() + "'" + ")\">Poster</button></div>";
    commentContent += "</div></div>";
    buildInfoPanel("Avis", commentContent);
}

/**
 * Fonction à appeler pour build le panneau d'information vide
 * A appeler au début
 * @param {type} htmlNodeToAppend - Element HTML sur lequel on va ajouter le panel
 * @returns {undefined}
 */
function buildEmptyPanel(htmlNodeToAppend) {
    var panel = "<div id=\"informationPanel\">" +
        "<div class=\"titlePanel\">" +
        "<h3 id=\"informationTitle\"></h3>" +
        "<button class=\"btn btn-primary\" onclick=\"closePanel()\">x</button>" +
        "</div>" +
        "<div class=\"tabbable tabs-left\">" +
        "<ul id=\"tabsPanel\" class=\"nav nav-tabs\">" +
        "</ul>" +
        "<div id=\"contentTabs\" class=\"tab-content\"></div>" +
        "</div>" +
        "</div>";
    $(htmlNodeToAppend).append(panel);
}

/*
 * Enleve les child d'un node
 */
function cleanChildOfNodeID(parentNode) {
    var myNode = document.getElementById(parentNode);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}

/*
 * Création de la fenetre modal parametre
 */
function showModalParameters(htmlNodeToAppend) {
    var modalParam = "<div id=\"popParam\" class=\"modal hide fade\">" +
        "<div class=\"modal-header\"> <a class=\"close\" data-dismiss=\"modal\">×</a>" +
        "<h3 style=\"text-align:center\">Paramètres</h3>" +
        "</div>" +
        "<div id=\"popUpContent\" class=\"modal-body\">" +
        "Voulez-vous l'afficher ?" +
        "</div>" +
        ' <div  class="modal-footer"> ' +
        '<a class="btn btn-success" data-dismiss="modal">Fermer </a>' +
        ' </div>' +
        "</div>";
    $(htmlNodeToAppend).append(modalParam);
}

/*
 * Création de la fenetre modal A propos
 */
function showModalAbout(htmlNodeToAppend) {
    var modalAbout = "<div id=\"popAbout\" class=\"modal hide fade\">" +
        "<div class=\"modal-header\"> <a class=\"close\" data-dismiss=\"modal\">×</a>" +
        "<h3 style=\"text-align:center\">A propos</h3>" +
        "</div>" +
        "<div id=\"popUpContent\" class=\"modal-body\">" +
        "Voulez-vous l'afficher ?" +
        "</div>" +
        ' <div  class="modal-footer"> ' +
        '<a class="btn btn-success" data-dismiss="modal">Fermer </a>' +
        ' </div>' +
        "</div>";
    $(htmlNodeToAppend).append(modalAbout);
}

/*
 * Creation de la fenetre modal Aide
 */
function showModalHelp(htmlNodeToAppend) {
    var modalHelp = "<div id=\"popHelp\" class=\"modal hide fade\">" +
        "<div class=\"modal-header\"> <a class=\"close\" data-dismiss=\"modal\">×</a>" +
        "<h3 style=\"text-align:center\">Aide</h3>" +
        "</div>" +
        "<div id=\"popUpContent\" class=\"modal-body\">" +
        "Voulez-vous l'afficher ?" +
        "</div>" +
        ' <div  class="modal-footer"> ' +
        '<a class="btn btn-success" data-dismiss="modal">Fermer </a>' +
        ' </div>' +
        "</div>";
    $(htmlNodeToAppend).append(modalHelp);
}

/*
* Affichage des dernieres donnees d'un capteur dans le panel
*/
function buildPannelSensor(objElem){

    $("#titleSensors").html("Info capteur n°"+objElem.name);


    cleanChildOfNodeID("contentPanelSensors");
    var sensorsData;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: "/api/sensorsWireless_Data/",
        success: function(data) {
            sensorsData = data.payload;
        },
        error: function(err) {
            console.log(err);
        }
    });

    var lastData = [];
    sensorsData.forEach(function(elem, index, array){
        if(elem.name === objElem.name){
            lastData.push(elem);
        }
    });

    var lastData = lastData[lastData.length-1];
    var lastDate = {
        year : new Date(lastData.date).getFullYear(),
        month : new Date(lastData.date).getMonth(),
        day : new Date(lastData.date).getDate(),
        hour : new Date(lastData.date).getHours(),
        minutes : new Date(lastData.date).getMinutes(),
        seconds : new Date(lastData.date).getSeconds()

    };
    
    var updateTime = '<div class="pull-right">Last update : '+lastDate.hour+'h '+lastDate.minutes+'min '+lastDate.seconds+'s le '+lastDate.day+'/'+lastDate.month+'/'+lastDate.year+'</div><br><br><br>';
    $("#contentPanelSensors").append(updateTime);

    var tmp = '<dl class="dl-horizontal">';

    tmp += '<dt class="customTypo">Temperature</dt><dd class="badge pull-left">'+lastData.temperature+'°C<dd>';
    tmp += '<dt class="customTypo">Humidité</dt><dd class="badge pull-left">'+lastData.humidite+'%<dd>';
    tmp += '<dt class="customTypo">Pression</dt><dd class="badge pull-left">'+lastData.pression+'hPa<dd>';
    tmp += '<dt class="customTypo">Luminosité</dt><dd class="badge pull-left">'+lastData.luminosite+'Lux<dd>';
    tmp += '<dt class="customTypo">Pluviométrie</dt><dd class="badge pull-left">'+lastData.pluviometrie+'mm<dd>';
    tmp += '<dt class="customTypo">Direction du vent</dt><dd class="badge pull-left">'+lastData.directionVent+'<dd>';
    tmp += '<dt class="customTypo">Vitesse du vent</dt><dd class="badge pull-left">'+lastData.vitesseVent+'km/h<dd>';

    tmp += '</div>'
    $("#contentPanelSensors").append(tmp);    

}