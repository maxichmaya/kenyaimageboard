(function() {
    new Vue({
        el: ".main",
        data: {
            box: [],
            title: "",
            description: "",
            username: "",
            comments: "",
            user: "",
            file: null,
            showBigPhoto: location.hash.slice(1) || null
        },
        mounted: function() {
            var self = this;
            axios
                .get("/images")
                .then(function(resp) {
                    console.log("resp.data:", resp.data);
                    self.box = resp.data.rows;
                })
                .catch(function(err) {
                    console.log("err in GET: ", err);
                });
                addEventListener("hashchange", function() {
                    self.showBigPhoto = location.hash.slice(1);
            });
        }, //closes mounted

        methods: {
            clicked: function(e) {
                this.showBigPhoto = true;
                console.log("e:", e);
            },
            close: function() {
                this.showBigPhoto = null;
                location.hash = "";
                history.replaceState(null, null, " ");
            },
            showMoreButton: function() {
                console.log(this.box.length-1);
                var self = this;
                var lastId = self.box[self.box.length -1].id;

                axios
                .get("/moreimages/" + lastId)
                .then(res => {
                    console.log(res);
                    self.box = self.box.concat(res.data)
                });
                console.log("Friday yeyeyey", lastId);
            },
            showModal: function(id) {
                this.showBigPhoto = id;
            },
            handleClick: function() {
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("username", this.username);
                formData.append("description", this.description);
                formData.append("file", this.file);
                var self = this;
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        self.box.unshift(resp.data);
                        self.title = "";
                        self.username = "";
                        self.description = "";
                        console.log("resp from POST/upload: ", resp);
                    })
                    .catch(function(err) {
                        console.log("err in POST/upload: ", err);
                    });
            },
            // saveComments: function() {
            //     var self = this;
            //     axios.post("/commentsOn")
            // },
            handleChange: function(e) {
                this.file = e.target.files[0];
            }
        }
    }); //closing VUe
})();
