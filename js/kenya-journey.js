(function() {
    Vue.component("kenya-journey", {
        // the same object like a vue konstraktor, razlika ej da mu dajemo L
        template: "#kenya",
        //         // data postaje funkcja koju zovem i onda return objekt
        data: function() {
            return {
                url: "",
                username: "",
                title: "",
                description: "",
                created_at: "",
                comments: "",
                users: "",
                imageid: "",
                box2: []
            };
        },
        props: ["id"],
        mounted: function() {
            var self = this;
            axios.get("/bigImage/" + self.id).then(res => {
                if (res.data.length == 0) {
                    self.$emit("close");
                } else {
                this.url = res.data[0].url;
                this.username = res.data[0].username;
                this.title = res.data[0].title;
                this.description = res.data[0].description;
                this.created_at = res.data[0].created_at;
            }
            });
            axios
                .get("/comment/" + self.id)
                .then(res => {
                    console.log("ovo je.", res.data);
                    self.box2 = res.data;
                    // self.users = res.data.users;
                    // self.created_at = res.data.created_at;
                })
                .catch(err => console.log("error in comments:", err));
        },
        methods: {
            saveComments: function() {
                var self = this;
                console.log(self.id);
                axios
                    .post("/comment/", {
                        users: self.users,
                        comments: self.comments,
                        imageid: self.id
                    })
                    .then(res => {
                        console.log(res);
                        self.box2.unshift({
                            created_at: res.data[0].created_at,
                            imageid: res.data[0].imageid,
                            comments: res.data[0].comments,
                            users: res.data[0].users
                        });
                        self.users = "";
                        self.comments = ""
                    })
                    .catch(err => console.log("error in comments:", err));
            },
            exit: function() {
                this.$emit("close");
            }
        },
        watch: {
            id: function() {
                var self = this;
                axios.get("/bigImage/" + self.id).then(res => {
                    this.url = res.data[0].url;
                    this.username = res.data[0].username;
                    this.title = res.data[0].title;
                    this.description = res.data[0].description;
                    this.created_at = res.data[0].created_at;
                });
                axios
                    .get("/comment/" + self.id)
                    .then(res => {
                        console.log("ovo je.", res.data);
                        self.box2 = res.data;
                        // self.users = res.data.users;
                        // self.created_at = res.data.created_at;
                    })
                    .catch(err => console.log("error in comments:", err));
            },
        }
    });
})();
//
