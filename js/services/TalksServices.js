app.service('talksService', function ($rootScope, $firebaseArray, creatorsService, topicsService) {
    const TALKS = "talks";

    var talks = [];

    this.getTalksFromServer = function () {
        var ref = firebase.database().ref().child(TALKS);
        talks = $firebaseArray(ref);
    };

    this.add = function (talk) {
        var speakers = [];
        talk.speakers.forEach(function (item) {
            speakers.push({
                "name": item.name,
                "twitter": item.twitter,
                "id": item.$id,

            });

        });

        topicsService.addNewTalkToTopicsTalks(talk.topic[0].$id)
        talk.type = talk.type[0].name;
        talk.topic = talk.topic[0].$value;
        talk.speakers = speakers;

        talks.$add(talk).then(function (data) {
            var newItem = talks.$getRecord(data.key);
            talk.id = data.key;
            newItem.id = data.key;
            talks.$save(newItem);
            alert("Talk Added")
            talk.speakers.forEach(function (item) {
                creatorsService.addNewTalkToCreatorsTalks(item,talk)
            });
        }).catch(function (error) {
            console.log('Error!');
        });

    }

    this.getTalks = function () {
        return talks;
    }

});