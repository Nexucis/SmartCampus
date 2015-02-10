loadEntities();
             buildEmptyPanel("#mainContent");
             showModalParameters('#mainContent');
             showModalAbout('#mainContent');
             showModalHelp('#mainContent');
             $('#popParam').modals();
             $('#popAbout').modals();
             $('#popHelp').modals();
             
             //Code inside modals
              $('#langage').on('change', function() {
                lang_selected = this.value;
            });
            $('#langage_info').html(translate("Langue"));
            
            
            loadAbout();
            function loadAbout() {
                var text = translate("L'équipe SmartCampus est formée de 5 étudiants de dernière année à Polytech'Grenoble, en filière RICM.") + "<br>"
                text += translate("Le but de cette application est de permettre à l'utilisateur d'accéder à plusieurs types d'informations :") + "<br>"
                text += translate("- des infos de crowdsourcing, comme la longueur de files d'attente ;") + "<br>"
                text += translate("- des infos générales sur les bâtiments et objets du campus ;") + "<br>"
                text += translate("- des infos variables, comme les horaires de tram et les menus du RU ;") + "<br>"
                text += translate("- des données de capteurs atmosphériques.") + "<br>";
                $('#content_about').html((text));
            }
             
             
             loadHelp();
            function loadHelp() {
                var text = translate("Cet application offre 2 modes de fonctionnement :") + "<br>"
                text += translate("- en mode \" réalité augmentée \", pointez votre téléphone sur un QR code pour obtenir des informations sur le batiment ou l'objet.") + "<br>"
                text += translate("- en mode \" plan \", cliquez sur un item de la carte pour obtenir des informations sur le batiment ou l'objet."
                        ) + "<br>"

                $('#content_help').html((text));
            }