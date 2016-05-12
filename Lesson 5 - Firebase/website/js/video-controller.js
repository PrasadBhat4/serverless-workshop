var videoController = {
    data: {
        config: null
    },
    uiElements: {
        videoCardTemplate: null,
        videoList: null,
        loadingIndicator: null
    },
    init: function (config) {
        this.uiElements.videoCardTemplate = $('#video-template');
        this.uiElements.videoList = $('#video-list');
        this.uiElements.loadingIndicator = $('#loading-indicator');

        this.data.config = config;

        this.wireEvents();

        this.connectToFirebase();
    },
    addVideoToScreen: function (videoId, videoObj) {
        // clone the template video element
        var newVideoElement = this.uiElements.videoCardTemplate.clone().attr('id', videoId);

        this.updateVideoOnScreen(newVideoElement, videoObj);

        this.uiElements.videoList.prepend(newVideoElement);
    },
    updateVideoOnScreen: function(videoElement, videoObj) {

        if (videoObj.transcoding) {
            // the video is currently transcoding... hide the video and show the spinner
            videoElement.find('video').hide();
            videoElement.find('.transcoding-indicator').show();
        } else {
            // the video is not transcoding... show the video and hide the spinner
            videoElement.find('video').show();
            videoElement.find('.transcoding-indicator').hide();
        }

        // set the video URL
        videoElement.find('source').attr('src', videoObj.source);
    },
    getElementForVideo: function(videoId) {
        return $('#' + videoId);
    },
    connectToFirebase: function () {
        var that = this;

        var firebaseRef = new Firebase(this.data.config.firebaseUrl);

        // fired when a new movie is added to firebase
        firebaseRef.child('videos')
            .on('child_added', function (childSnapshot, prevChildKey) {
                that.uiElements.loadingIndicator.hide();

                // add elements to the screen for the new video
                that.addVideoToScreen(childSnapshot.key(), childSnapshot.val());
            });

        // fired when a movie is updated
        firebaseRef.child('videos')
            .on('child_changed', function (childSnapshot, prevChildKey) {

                // update the video object on screen with the new video details from firebase
                that.updateVideoOnScreen(that.getElementForVideo(childSnapshot.key()), childSnapshot.val());
            });
    },
    wireEvents: function () {
        var that = this;

        /*this.uiElements.profileButton.click(function (e) {
         var url = that.data.config.apiBaseUrl + 'user-profile';

         $.get(url, function (data, status) {
         // save user profile data in the modal
         $('#user-profile-raw-json').text(JSON.stringify(data, null, 2));
         $('#user-profile-modal').modal();
         })
         });*/
    }
};
