Readme available in french and english<br>
Readme disponible en français et en anglais<br>

#English

MQTT server
==============

The Nodejs smartCampus server.

NodeJS
----------
 For Linux (Currently doesn't work on Windows) :
 Download source http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz
 <pre>
 ./configure
 make
 sudo make install
 </pre>
Bower
----------
    sudo npm install -g bower

Install dependences
-----------
    npm install
    bower install


Launch (default port : 9999)
-----------

    node serveur.js
    
    Admin interface : http://localhost:9999/admin
    Client interface : http://localhost:9999/client

Init database
--------------

    Go inside the folder /SmartCampus/WebServer/initDB
    sh initDB.sh

mongo usage
============

mongo
----------

    mongo
    use Client
    show collections
    db.items.find()

More info about mongo shell: http://docs.mongodb.org/manual/tutorial/getting-started/

API
=====
    
Show all entities
    http://localhost:9999/api/entity/ 

Show an entity $id
    http://localhost:9999/api/entity/$id/ 

Show infos of entity $id
    http://localhost:9999/api/entity/$id/infos 

Show the first info of entity $id
    http://localhost:9999/api/entity/$id/infos/0 

Show the first info of entity $id
    http://localhost:9999/api/entity/$id/infos/0/uneInfo 
    
Examples
--------
Some examples available in /view
    post.html
    get.html
    getone.html
    update.html
    delete.html


###Pagination
Pagination is also supported via skip= and limit= query params.

    http://localhost:9999/api/entity/$id?skip=10&limit=10

###Population
Mongoose populate is supported, but this will be changing shortly to allow for more
fine grained controll over population.  Currently you can do

    http://localhost:9999/api/entity?populate=items

or to specify particular fields.

    http://localhost:9999/api/entity?skip=10&populate[items]=name,type



###Filter
Filtering is available for strings. 

    http://localhost:9999/api/entity?filter[name]=iae

Also you can and or nor the filters by using + (and) - (nor)  or nothing or
    http://localhost:9999/api/entity?filter[-name]=C
    http://localhost:9999/api/entity?filter[+name]=iae&filter[-type]=p



To filter all String fields that have a C in them

    http://localhost:9999/api/entity?filter=C


###Sorting
Sorting is supported 1 ascending -1 ascending.

  http://localhost:9999/api/entity?sort=title:1,date:-1

###Transformer
Transformers can be registered on startup.  A simple TransformerFactory is
included.  Something that takes security into account could be added.  Currently
this is only supported on the get operations.   May change the responses to post
to send location, though I find that pretty inconvient.


```javascript

app.use('/api', require('mers').rest({
    mongoose:mongoose,
    transformers:{
           renameid:function(Model, label){
            //do some setup but return function.
              return function(obj){
                obj.id = obj._id;
                delete obj._id;
                //don't forget to return the object.  Null will filter it from the results.
                return obj;
              }
           }
      }
    }));
}
```

to get results transformered just add

     http://localhost:9999/api/entity?transform=renameid



It handles  get/put/post/delete.
See tests/routes-mocha.js for examples.

###Static Finders
It should also be able to be used with Class finders. Now handles class finders. Note: They must return  a query object.
They are passed the query object and the rest of the url. All of the populate's, filters, transforms should work.

```javascript

/**
 * Note this must return a query object.
 * @param q
 * @param term
 */
BlogPostSchema.statics.findTitleLike = function findTitleLike(q, term) {
    return this.find({'title':new RegExp(q.title || term, 'i')});
}

```

So you can get the url

    http://localhost:9999/api/entity/finder/findTitleLike?title=term

or

    http://localhost:9999/api/entity/finder/findTitleLike/term

### [Error Handling][error]
To create a custom error handler

```javascript

   app.use('/rest, rest({
         error : function(err, req, res, next){
               res.send({
                   status:1,
                   error:err && err.message
               });
           }).rest());

```

### Custom Transformers
You can transform your results by adding a custom transformer and or adding a new TransformerFactory

```javascript

   app.use('/rest, rest({
         transformers :{
          cooltranform:function(Model, label){
             return function(obj){
                    obj.id = obj._id;
                    delete obj._id;
                    return obj; //returning null removes it from the output
             }
          } }).rest());

```

### Selecting
Selecting support is upcoming, but for now you can do it in finders

```javascript
 var User = new Schema({
   username:String,
   birthdate:Date
 });
 User.statics.selectJustIdAndUsername  = function(){
  this.find({}).select('_id username');
 }

```


#Français

Serveur MQTT
==============

Le serveur NodeJS de SmartCampus

NodeJS
----------
 Pour Linux (Ne fonctionne pas encore sous Windows, problème de plugins) :
 Télécharger les sources http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz
 <pre>
 ./configure
 make
 sudo make install
 </pre>
 
Bower
----------
    sudo npm install -g bower

Installation des dépendances
-----------
    npm install
    bower install


Lancement (port par défaut : 9999)
-----------

    node serveur.js
    
    Interface administrateur : http://localhost:9999/admin
    Interface client : http://localhost:9999/client

Initialisation de la base de données
--------------

    Go inside the folder /SmartCampus/WebServer/initDB
    sh initDB.sh

Usage de MongoDB pour vérifier la base de données
============

mongo
----------

    mongo
    use Client
    show collections
    db.items.find()

Plus d'information sur les commandes mongo: http://docs.mongodb.org/manual/tutorial/getting-started/

API
=====
    
Voir toutes les entités
    http://localhost:9999/api/entity/ 

Voir l'entité d'id $id
    http://localhost:9999/api/entity/$id/ 

Voir les infos de l'entité d'id $id
    http://localhost:9999/api/entity/$id/infos 

Voir la première information de l'entité d'id $id
    http://localhost:9999/api/entity/$id/infos/0 

Voir la première information de l'entité d'id $id
    http://localhost:9999/api/entity/$id/infos/0/uneInfo 
    
Exemples
--------
Certains exemples sont disponibles dans le dossier /view
    post.html
    get.html
    getone.html
    update.html
    delete.html


###Pagination
La pagination est également supportée via skip= et limit= en paramètres de requête.

    http://localhost:9999/api/entity/$id?skip=10&limit=10

###Population
Mongoose populate est supporté, mais sera bientôt modifié. Peut être utilisé de la façon suivante

    http://localhost:9999/api/entity?populate=items

Ou en précisant certains champs

    http://localhost:9999/api/entity?skip=10&populate[items]=name,type



###Filter
Le filtrage est disponible pour les chaînes de caractères

    http://localhost:9999/api/entity?filter[name]=iae

Vou pouvez également utiliser les condition ET et OU en ajoutant + (ET), - (OU) ou rien.
    http://localhost:9999/api/entity?filter[-name]=C
    http://localhost:9999/api/entity?filter[+name]=iae&filter[-type]=p




Par exemple pour filtrer une chaîne ayant le caractère C
    http://localhost:9999/api/entity?filter=C


###Sorting
Tri possible, 1 ascendant, -1 descendant

  http://localhost:9999/api/entity?sort=title:1,date:-1

###Transformer
Les Transformers peuvent être enregistrés au démarrage. Un TransformerFactory simple est inclu. Il est possible d'ajouter de la sécurité. Cela n'est actuellement supporté que sur les opérations de type GET.


```javascript

app.use('/api', require('mers').rest({
    mongoose:mongoose,
    transformers:{
           renameid:function(Model, label){
              return function(obj){
                obj.id = obj._id;
                delete obj._id;
                // Ne pas oublier de retourner l'objet.
                return obj;
              }
           }
      }
    }));
}
```

pour récupérer les résultats des transformed il suffit d'ajouter :

     http://localhost:9999/api/entity?transform=renameid



Prise en charge des requêtes get/put/post/delete.
Consultez tests/routes-mocha.js pour des exemples.

###Static Finders
Peut également être utilisé avec Class finders. Doit retourner un objet query.

```javascript

/**
 * Doit retourner un objet query.
 * @param q
 * @param term
 */
BlogPostSchema.statics.findTitleLike = function findTitleLike(q, term) {
    return this.find({'title':new RegExp(q.title || term, 'i')});
}

```

Il est possible de get l'url suivante

    http://localhost:9999/api/entity/finder/findTitleLike?title=term

ou bien

    http://localhost:9999/api/entity/finder/findTitleLike/term

### [Error Handling][error]
Permet de créer un handler d'erreur personnalisé.

```javascript

   app.use('/rest, rest({
         error : function(err, req, res, next){
               res.send({
                   status:1,
                   error:err && err.message
               });
           }).rest());

```

### Custom Transformers
Il est possible de transformer les résultats en ajoutant un transformer personnalisé ou en ajoutant un nouveau TransformerFactory.

```javascript

   app.use('/rest, rest({
         transformers :{
          cooltranform:function(Model, label){
             return function(obj){
                    obj.id = obj._id;
                    delete obj._id;
                    return obj; 
             }
          } }).rest());

```

### Selecting

Non disponible actuellement, mais possible à effectuer avec des finders.

```javascript
 var User = new Schema({
   username:String,
   birthdate:Date
 });
 User.statics.selectJustIdAndUsername  = function(){
  this.find({}).select('_id username');
 }

```
