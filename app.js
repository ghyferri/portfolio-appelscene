const express = require("express"); // loads the express package
const { engine } = require("express-handlebars"); // loads handlebars for Express
const port = 8080; // defines the port
const app = express(); // creates the Express application

// defines handlebars engine
app.engine("handlebars", engine());
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");

// define static directory "public" to access css/ and img/
app.use(express.static("public"));

// MODEL (DATA)
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("projects-gh.db");
// creates table genre at startup
db.run(
  "CREATE TABLE IF NOT EXISTS genre (gid INTEGER PRIMARY KEY NOT NULL UNIQUE, gname TEXT NOT NULL, gdesc TEXT NOT NULL)",
  (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error);
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table genre created!");
      const genres = [
        {
          id: "1",
          name: "Drill",
          desc: "Subgenre of rap music known for its dark and aggressive lyrics, often centered on street life and violence",
        },
        {
          id: "2",
          name: "Hiphop",
          desc: "A genre of music known for its rhythmic beats and spoken-word lyrics, encompassing a wide range of cultural elements such as rap, DJing, breakdancing, and graffiti art",
        },
        {
          id: "3",
          name: "Pop",
          desc: "Catchy, widely appealing music known for its memorable melodies and simple song structures",
        },
        {
          id: "4",
          name: "Underground",
          desc: "music, often independent or niche, that exists outside the mainstream industry. It emphasizes artistic innovation, authenticity, and non-commercial aspects, appealing to a more niche and dedicated audience",
        },
        {
          id: "5",
          name: "Uk",
          desc: "It encompasses various genres and styles, reflecting the rich and diverse musical culture of the UK",
        },
        {
          id: "6",
          name: "French",
          desc: "music refers to music from France or sung in French, covering diverse genres and styles",
        },
      ];
      // inserts projects
      genres.forEach((oneGenre) => {
        db.run(
          "INSERT or IGNORE INTO genre (gid, gname, gdesc) VALUES (?, ?, ?)",
          [oneGenre.id, oneGenre.name, oneGenre.desc],
          (error) => {
            if (error) {
              console.log("ERROR: ", error);
            } else {
              console.log("Line added into the genre table!");
            }
          }
        );
      });
    }
  }
);
// creates table videoclip at startup
db.run(
  "CREATE TABLE IF NOT EXISTS videoclip (vid INTEGER PRIMARY KEY NOT NULL UNIQUE, vtitle TEXT NOT NULL, vdesc TEXT NOT NULL, vrelease TEXT NOT NULL, vlink TEXT NOT NULL, vimage TEXT NOT NULL, gid INTEGER, FOREIGN KEY (gid) REFERENCES genre (gid))",
  (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error);
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table videoclip created!");
      const videoclips = [
        {
          id: "1",
          title: "Landen",
          desc: "A song about the luxury lifestyle",
          release: "24-02-2023",
          link: "https://www.youtube.com/watch?v=0_RTEZ7MBOM",
          image: "/img/landen_thumbnail.png",
          gid: "2",
        },
        {
          id: "2",
          title: "Bands",
          desc: "A song about cars",
          release: "11-08-2023",
          link: "https://www.youtube.com/watch?v=Db7Rmm4Oqyc",
          image: "/img/landen_thumbnail.png",
          gid: "2",
        },
        {
          id: "3",
          title: "Slide",
          desc: "A song from 2 young uk rappers",
          release: "28-04-2023",
          link: "https://www.youtube.com/watch?v=NWXNliUOHvA",
          image: "/img/landen_thumbnail.png",
          gid: "5",
        },
        {
          id: "4",
          title: "Loopt Met Pijp",
          desc: "2 drillers from Berchem owning the block",
          release: "07-09-2023",
          link: "https://www.youtube.com/watch?v=WK4ovj8znPc",
          image: "/img/looptmetpijp_thumbnail.png",
          gid: "1",
        },
        {
          id: "5",
          title: "King Of The Castle",
          desc: "A boy that is born to be the king of the castle",
          release: "28-09-2023",
          link: "https://www.youtube.com/watch?v=scooMbR0XCA",
          image: "/img/landen_thumbnail.png",
          gid: "4",
        },
      ];
      // inserts projects
      videoclips.forEach((oneVideoclip) => {
        db.run(
          "INSERT or IGNORE INTO videoclip (vid, vtitle, vdesc, vrelease, vlink, vimage, gid) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            oneVideoclip.id,
            oneVideoclip.title,
            oneVideoclip.desc,
            oneVideoclip.release,
            oneVideoclip.link,
            oneVideoclip.image,
            oneVideoclip.gid,
          ],
          (error) => {
            if (error) {
              console.log("ERROR: ", error);
            } else {
              console.log("Line added into the videoclip table!");
            }
          }
        );
      });
    }
  }
);
// creates table artist at startup
db.run(
  "CREATE TABLE IF NOT EXISTS artist (aid INTEGER PRIMARY KEY NOT NULL UNIQUE, aname TEXT NOT NULL, acountry TEXT NOT NULL, adesc TEXT NOT NULL)",
  (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error);
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table artist created!");
      const artists = [
        {
          id: "1",
          name: "Kleinevlam",
          country: "Belgium",
          desc: "Young boy from keerbergen, but begun in Mechelen",
        },
        {
          id: "2",
          name: "Simski",
          country: "Belgium",
          desc: "Shy, but sweet boy with good sense of humor",
        },
        {
          id: "3",
          name: "Bex",
          country: "UK",
          desc: "Hidden gem, discovered on the roads in the UK",
        },
        {
          id: "4",
          name: "Guaps",
          country: "Belgium",
          desc: "A fighter",
        },
        {
          id: "5",
          name: "Olibol",
          country: "Belgium",
          desc: "He has his own style ...",
        },
        {
          id: "6",
          name: "Youngdream",
          country: "Belgium",
          desc: "No school, only music",
        },
      ];
      // inserts artist
      artists.forEach((oneArtist) => {
        db.run(
          "INSERT or IGNORE INTO artist (aid, aname, acountry, adesc) VALUES (?, ?, ?, ?)",
          [oneArtist.id, oneArtist.name, oneArtist.country, oneArtist.desc],
          (error) => {
            if (error) {
              console.log("ERROR: ", error);
            } else {
              console.log("Line added into the artist table!");
            }
          }
        );
      });
    }
  }
);
// creates table artistvideoclip at startup
db.run(
  "CREATE TABLE IF NOT EXISTS artistVideoclip (avid INTEGER PRIMARY KEY NOT NULL UNIQUE, aid INTEGER, vid INTEGER, FOREIGN KEY (aid) REFERENCES artist (aid), FOREIGN KEY (vid) REFERENCES videoclip (vid))",
  (error) => {
    if (error) {
      // tests error: display error
      console.log("ERROR: ", error);
    } else {
      // tests error: no error, the table has been created
      console.log("---> Table artistVideoclip created!");
      const artistVideoclips = [
        {
          id: "1",
          vid: "1",
          aid: "1",
        },
        {
          id: "2",
          vid: "1",
          aid: "2",
        },
        {
          id: "3",
          vid: "2",
          aid: "1",
        },
        {
          id: "4",
          vid: "3",
          aid: "3",
        },
        {
          id: "5",
          vid: "4",
          aid: "4",
        },
        {
          id: "6",
          vid: "4",
          aid: "6",
        },
        {
          id: "7",
          vid: "5",
          aid: "5",
        },
      ];
      // inserts artistVideoclip
      artistVideoclips.forEach((oneartistVideoclip) => {
        db.run(
          "INSERT or IGNORE INTO artistVideoclip (avid, aid, vid) VALUES (?, ?, ?)",
          [
            oneartistVideoclip.id,
            oneartistVideoclip.aid,
            oneartistVideoclip.vid,
          ],
          (error) => {
            if (error) {
              console.log("ERROR: ", error);
            } else {
              console.log("Line added into the artistVideoclip table!");
            }
          }
        );
      });
    }
  }
);

// CONTROLLER (THE BOSS)
app.get("/", (request, response) => {
  response.render("home.handlebars", {
    title: "Home",
    style: "home.css",
  });
});
// app.get("/videos", (request, response) => {
//   response.render("videos.handlebars", {
//     title: "Videos",
//     style: "videos.css",
//   });
// });

app.get("/videos", (request, response) => {
  db.all(
    `SELECT videoclip.*, GROUP_CONCAT(artist.aname, ' x ') AS anames
      FROM videoclip 
      INNER JOIN artistVideoclip ON videoclip.vid = artistVideoclip.vid
      INNER JOIN artist ON artistVideoclip.aid = artist.aid
      GROUP BY videoclip.vid`,
    (error, theVideoclips) => {
      const model = {
        title: "Videos",
        style: "videos.css",
        hasDatabaseError: false,
        theError: "",
        videoclips: [],
      };

      if (error) {
        model.hasDatabaseError = true;
        model.theError = error;
      } else {
        model.videoclips = theVideoclips;
      }
      console.log("THIS IS THE GIVEN MODEL" + model);
      response.render("videos.handlebars", model);
    }
  );
});

app.get("/video", (request, response) => {
  response.render("video.handlebars", {
    title: "Video",
    style: "video.css",
  });
});
app.get("/about", (request, response) => {
  response.render("about.handlebars", {
    title: "About",
    style: "about.css",
  });
});
app.get("/contact", (request, response) => {
  response.render("contact.handlebars", {
    title: "Contact",
    style: "contact.css",
  });
});
app.get("/login", (request, response) => {
  response.render("login.handlebars", {
    title: "Login",
    style: "login.css",
  });
});

// defines the final default route 404 NOT FOUND
app.use(function (req, res) {
  res.status(404).render("404.handlebars", {
    title: "Error 404",
    style: "error.css",
  });
});

// runs the app and listens to the port
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}...`);
});
