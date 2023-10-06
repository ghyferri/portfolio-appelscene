const express = require("express"); // loads the express package
const exphbs = require("express-handlebars"); // loads handlebars for Express
const session = require("express-session"); // loads express session
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const connectSqlite3 = require("connect-sqlite3");
const port = 8080; // defines the port
const app = express(); // creates the Express application

const hbs = exphbs.create({
  // Specify your custom helpers here
  helpers: {
    theGenreD(value) {
      return value == "1";
    },
    theGenreH(value) {
      return value == "2";
    },
    theGenreP(value) {
      return value == "3";
    },
    theGenreU(value) {
      return value == "4";
    },
    theGenreUK(value) {
      return value == "5";
    },
    theGenreF(value) {
      return value == "6";
    },
    subtract(a, b) {
      return a - b;
    },
    add(a, b) {
      return a + b;
    },
    gt(a, b) {
      return a > b;
    },
    lt(a, b) {
      return a < b;
    },
    eq(a, b) {
      return a === b;
    },
    // Add more custom helpers as needed
  },
});

// defines handlebars engine
app.engine("handlebars", hbs.engine);
// defines the view engine to be handlebars
app.set("view engine", "handlebars");
// defines the views directory
app.set("views", "./views");
// define static directory "public" to access css/ and img/
app.use(express.static("public"));
// body parser

// function to check if a user is an admin
// function is_admin(req, res, next) {
//   if (req.session && req.session.user && req.session.user.isa) {
//     // User is an admin, allow access
//     return next();
//   } else {
//     console.log(user);
//     // User is not an admin, deny access
//     res.status(403).render("error.handlebars", {
//       ErrorHeader: "403: ACCESS DENIED",
//       ErrorBody: "Sorry, you have no permission to access this website.",
//       title: "Error 403",
//       style: "error.css",
//     });
//   }
// }
// middelware for admin
// app.use((req, res, next) => {
//   req.isAdmin = req.session.user ? req.session.user.is_admin : false;
//   next();
// });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const SQLiteStore = connectSqlite3(session);

// define session
app.use(
  session({
    store: new SQLiteStore({ db: "session-db.db" }),
    saveUninitialized: false,
    resave: false,
    secret: "this!@123I%%%%sASecret678Sentence@!!!#",
  })
);

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
          desc: "Embark on an unforgettable journey with Kleinevlam and Simski as they serenade you with their latest hit, an anthem for wanderlust and adventure. In this music video, the duo's harmonious voices and captivating storytelling transport you to exotic destinations, where they dream of jet-setting around the world. Watch as they metaphorically 'let a plane land' in their hearts and minds, embracing the spirit of exploration and wanderlust. Join us in this musical escape, and let your imagination take flight.",
          release: "24-02-2023",
          link: "https://www.youtube.com/embed/0_RTEZ7MBOM?si=o11gmLJUY30iS1TF",
          image: "/img/landen_thumbnail.png",
          gid: "2",
        },
        {
          id: "2",
          title: "Bands",
          desc: "Ride along as he delves into the whirlwind of the rap game in 'Bands.' This music video captures the rapid ascent from the bottom to the top, where every day brings a new twist in the journey. Join us in this lyrical exploration of the fast-paced life in the world of hip-hop, where ambition knows no bounds",
          release: "11-08-2023",
          link: "https://www.youtube.com/embed/Db7Rmm4Oqyc?si=BABQy3oZGkMbdK8A",
          image: "/img/bands_thumbnail.png",
          gid: "2",
        },
        {
          id: "3",
          title: "Slide",
          desc: "Dive into the gritty and raw world of UK rap with Rico Suave and Bex as they let it 'slide' in their latest collaboration. This dynamic duo brings their unique style and lyrical prowess to the forefront, delivering a hard-hitting track that showcases the essence of UK hip-hop. With sharp wordplay and unapologetic storytelling, they navigate the streets and share their experiences. Join us in this musical journey through the urban landscapes of the UK as these two artists make their mark in the rap scene.",
          release: "28-04-2023",
          link: "https://www.youtube.com/embed/NWXNliUOHvA?si=9SaGBK7Sa25QFWXS",
          image: "/img/slide_thumbnail.png",
          gid: "5",
        },
        {
          id: "4",
          title: "Loopt Met Pijp",
          desc: "Join Guaps and YoungDream as they navigate their daily walk through the neighborhood with a watchful eye. In a world where caution is paramount, this video captures their journey through the streets, highlighting the importance of vigilance and awareness. Explore the challenges and stories that unfold as they move through their community, reminding us all to stay safe and alert in the ever-changing urban landscape.",
          release: "07-09-2023",
          link: "https://www.youtube.com/embed/WK4ovj8znPc?si=W2XHVmGLh07tDfxS",
          image: "/img/looptmetpijp_thumbnail.png",
          gid: "1",
        },
        {
          id: "5",
          title: "King Of The Castle",
          desc: "Step into the vivid dreamscape of a young dreamer names Lil Olibol. Follow along as our protagonist envisions a world where he reigns as the king of the castle, exploring realms of imagination and ambition. Through evocative lyrics and enchanting visuals, this video takes you on a journey through the aspirations of a young heart. Join us in this enchanting tale of dreams and possibilities, where even the most ordinary of places can become a kingdom of wonder and adventure.",
          release: "28-09-2023",
          link: "https://www.youtube.com/embed/scooMbR0XCA?si=qOPg5BxXUiDWbx8s",
          image: "/img/kotc_thumbnail.png",
          gid: "4",
        },
        {
          id: "6",
          title: "Demon Time",
          desc: "Enter the world of intrigue and secrecy with our latest creation. Join us as we dive into the shadows, where mysterious activities unfold under the cover of darkness. In this enigmatic tale, we explore the thrill of secrecy and the allure of the unknown. With haunting melodies and cryptic visuals, this video invites you to embrace the enigma and experience the thrill of the clandestine. Get ready for an adventure that will keep you on the edge of your seat, where every twist and turn leads to another layer of mystery.",
          release: "07-04-2023",
          link: "https://www.youtube.com/embed/NyDElPMGtMw?si=1DNrUB1xVQ9k-M7B",
          image: "/img/demontime_thumbnail.png",
          gid: "2",
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
  "CREATE TABLE IF NOT EXISTS artist (aid INTEGER PRIMARY KEY NOT NULL UNIQUE, aname TEXT NOT NULL, acountry TEXT, adesc TEXT )",
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
          desc: "Young boy from keerbergen, but began in Mechelen",
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
        {
          id: "7",
          name: "Rico Suave",
          country: "Uk",
          desc: "Know for being a madman",
        },
        {
          id: "8",
          name: "Ferno",
          country: "Nl",
          desc: "Manager aka the boss",
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
        {
          id: "8",
          vid: "3",
          aid: "7",
        },
        {
          id: "9",
          vid: "6",
          aid: "8",
        },
        {
          id: "10",
          vid: "6",
          aid: "1",
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

// Initialize the database with a 'users' table
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, isAdmin INTEGER)"
  );
  const adminPassword = bcrypt.hashSync("admin", 10); // Hash the admin password
  const adminUser = db.prepare(
    "INSERT OR IGNORE INTO users (username, password, isAdmin) VALUES (?, ?, ?)"
  );
  adminUser.run("admin", adminPassword, 1); // '1' indicates that this user is an admin
  adminUser.finalize();
});

// CONTROLLER (THE BOSS)
app.get("/", (request, response) => {
  response.render("home.handlebars", {
    title: "Home",
    style: "home.css",
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.username,
    isAdmin: request.session.isAdmin,
  });
});

app.get("/videos", (request, response) => {
  const page = request.query.page || 1; // Get the requested page number
  const itemsPerPage = 4; // Set the number of items to display per page

  // Calculate the offset based on the current page
  const offset = (page - 1) * itemsPerPage;
  db.all(
    `SELECT videoclip.*, GROUP_CONCAT(artist.aname, ' x ') AS anames
      FROM videoclip 
      INNER JOIN artistVideoclip ON videoclip.vid = artistVideoclip.vid
      INNER JOIN artist ON artistVideoclip.aid = artist.aid
      GROUP BY videoclip.vid
      ORDER BY videoclip.vtitle
      LIMIT ? OFFSET ?`,
    [itemsPerPage, offset],
    (error, theVideoclips) => {
      const model = {
        title: "Videos",
        style: "videos.css",
        hasDatabaseError: false,
        theError: "",
        videoclips: [],
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.username,
        isAdmin: request.session.isAdmin,
        currentPage: parseInt(page),
        totalPages: 0,
      };
      if (error) {
        model.hasDatabaseError = true;
        model.theError = error;
      } else {
        model.videoclips = theVideoclips;
        db.get("SELECT COUNT(*) as total FROM videoclip", (error, result) => {
          if (error) {
            console.log("error" + error);
          } else {
            const totalItems = result.total;
            const totalPages = Math.ceil(totalItems / itemsPerPage);

            model.totalPages = totalPages;
            response.render("videos.handlebars", model);
          }
        });
      }
    }
  );
});

app.get("/videos/:vid", (request, response) => {
  const videoId = request.params.vid;
  db.get(
    `SELECT videoclip.*, GROUP_CONCAT(artist.aname, ' x ') AS anames, artist.*, genre.gname
    FROM videoclip 
    INNER JOIN artistVideoclip ON videoclip.vid = artistVideoclip.vid
    INNER JOIN artist ON artistVideoclip.aid = artist.aid
    LEFT JOIN genre ON videoclip.gid = genre.gid
    WHERE videoclip.vid= ?
    GROUP BY videoclip.vid`,
    [videoId],
    (error, videoclip) => {
      if (error) {
        response.status(500).send("Database error");
        console.log(error);
      } else if (!videoclip) {
        response.status(404).send("Videoclip not found");
      } else {
        const model = {
          title: "Video",
          style: "video.css",
          isLoggedIn: request.session.isLoggedIn,
          name: request.session.username,
          isAdmin: request.session.isAdmin,
          videoclip: videoclip,
        };
        response.render("video.handlebars", model);
      }
    }
  );
});

app.get("/about", (request, response) => {
  response.render("about.handlebars", {
    title: "About",
    style: "about.css",
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.username,
    isAdmin: request.session.isAdmin,
  });
});

app.get("/contact", (request, response) => {
  response.render("contact.handlebars", {
    title: "Contact",
    style: "contact.css",
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.username,
    isAdmin: request.session.isAdmin,
  });
});

//login
app.get("/login", (request, response) => {
  response.render("login.handlebars", {
    title: "Login",
    style: "login.css",
    isLoggedIn: request.session.isLoggedIn,
    name: request.session.username,
    isAdmin: request.session.isAdmin,
  });
});

// Handle the login form submission
app.post("/login-post", (req, res) => {
  const { username, password } = req.body;

  // Check the user's credentials in the database
  db.get(
    "SELECT * FROM users WHERE username = ? AND isAdmin = 1",
    username,
    (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Internal Server Error");
      }
      if (!user || !bcrypt.compareSync(password, user.password)) {
        // User not found or password incorrect
        const loginError = "* Wrong username or password";
        req.session.isAdmin = false;
        req.session.isLoggedIn = false;
        req.session.name = "";
        return res.render("login.handlebars", {
          error: loginError,
          style: "login.css",
          title: "login",
        });
      }
      req.session.isAdmin = 1;
      req.session.isLoggedIn = true;
      req.session.name = username;

      res.redirect("/");
    }
  );
});

app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    console.log("Error while destroying this session");
  });

  res.redirect("/login");
});

app.get("/dashboard", (request, response) => {
  if (!request.session.isLoggedIn || request.session.isAdmin == 0) {
    //  User is not an admin, deny access
    response.status(403).render("error.handlebars", {
      ErrorHeader: "403: ACCESS DENIED",
      ErrorBody: "Sorry, you have no permission to access this website.",
      title: "Error 403",
      style: "error.css",
    });
    return;
  }
  db.all(
    `SELECT videoclip.*, GROUP_CONCAT(artist.aname, ' x ') AS anames
      FROM videoclip 
      INNER JOIN artistVideoclip ON videoclip.vid = artistVideoclip.vid
      INNER JOIN artist ON artistVideoclip.aid = artist.aid
      GROUP BY videoclip.vid
      ORDER BY videoclip.vtitle`,
    (error, theVideoclips) => {
      let errorDashboard = false;
      if (error) {
        errorDashboard = true;
      }
      response.render("dashboard.handlebars", {
        title: "Dashboard",
        style: "dashboard.css",
        items: theVideoclips,
        hasDatabaseError: errorDashboard,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.username,
        isAdmin: request.session.isAdmin,
      });
    }
  );
});

app.get("/dashboard/delete/:id", (request, response) => {
  const id = request.params.id;
  if (request.session.isLoggedIn == true && request.session.isAdmin == true) {
    db.run(
      "DELETE FROM videoclip WHERE vid=?",
      [id],
      function (error, theVideoclips) {
        if (error) {
          return response.status(500).send("Internal Server Error");
        } else {
          response.redirect("/dashboard");
        }
      }
    );
  } else {
    response.redirect("/login");
  }
});

app.post("/dashboard/new", (request, response) => {
  const newVideoclip = [
    request.body.vtitlenew,
    request.body.vdescnew,
    request.body.vreleasenew,
    request.body.vlinknew,
    request.body.vimagenew,
    request.body.gidnew,
  ];
  if (request.session.isLoggedIn && request.session.isAdmin == true) {
    db.run(
      "INSERT INTO videoclip (vtitle, vdesc, vrelease, vlink, vimage, gid) VALUES (?, ? ,? ,? ,?, ?)",
      newVideoclip,
      (error) => {
        if (error) {
          console.log("ERROR: " + error);
        } else {
          console.log("Line added into the videos table");
          db.get("SELECT last_insert_rowid() as lastID", (err, row) => {
            if (err) {
              console.error(err.message);
            } else {
              const videoClipId = row.lastID;

              db.run(
                "INSERT INTO artist (aname) VALUES (?)",
                request.body.anamenew,
                (error) => {
                  if (error) {
                    console.log("ERROR: " + error);
                  } else {
                    db.get(
                      "SELECT last_insert_rowid() as lastID",
                      (err, row) => {
                        if (err) {
                          console.error(err.message);
                        } else {
                          const artistId = row.lastID;
                          db.run(
                            "INSERT INTO artistVideoclip (aid, vid) VALUES (?, ?)",
                            [artistId, videoClipId],
                            (error) => {
                              if (error) {
                                console.log("ERROR: " + error);
                              } else {
                                response.redirect("/dashboard");
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      }
    );
  } else {
    response.redirect("/login");
  }
});
app.get("/dashboard/update/:id", (request, response) => {
  const id = request.params.id;
  db.get("SELECT * FROM videoclip WHERE vid = ?", [id], (error, videoClip) => {
    if (error) {
      console.log("ERROR" + error);
      const model = {
        dbError: true,
        theError: error,
        videoclip: {},
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.username,
        isAdmin: request.session.isAdmin,
      };
      response.redirect("/dashboard", model);
    } else {
      const model = {
        dbError: false,
        theError: "",
        videoclip: videoClip,
        isLoggedIn: request.session.isLoggedIn,
        name: request.session.username,
        isAdmin: request.session.isAdmin,
        title: "Dashboard",
        style: "dashboard.css",
        helpers: {
          theGenreD(value) {
            return value == "1";
          },
          theGenreH(value) {
            return value == "2";
          },
          theGenreP(value) {
            return value == "3";
          },
          theGenreU(value) {
            return value == "4";
          },
          theGenreUK(value) {
            return value == "5";
          },
          theGenreF(value) {
            return value == "6";
          },
        },
      };
      res.render("dashboard.handlebars", model);
    }

    // Render a form for updating the videoclip
    response.render("update_videoclip_form", {
      videoClip: videoClip,
    });
  });
});

app.post("/dashboard/update/:id", (request, response) => {
  const id = request.params.id;
  const updatedVideoClip = [
    request.body.vtitle,
    request.body.vdesc,
    request.body.vrelease,
    request.body.vlink,
    request.body.vimage,
    request.body.gid,
    id, // Include the ID in the update query
  ];
  if (request.session.isLoggedIn == true && request.session.isAdmin == 1) {
    db.run(
      "UPDATE videoclip SET vtitle = ?, vdesc = ?, vrelease = ?, vlink = ?, vimage = ?, gid = ? WHERE vid = ?",
      updatedVideoClip,
      (error) => {
        if (error) {
          console.log("Error" + error);
        } else {
          console.log("Line updated in the videos table");
          db.get(
            `SELECT artist.aid
            FROM artist
            INNER JOIN artistVideoclip ON artist.aid = artistvideoclip.aid
            INNER JOIN videoclip ON artistVideoclip.vid = videoclip.vid
            WHERE videoclip.vid = ?;
            `,
            [id],
            (err, row) => {
              if (err) {
                console.log("error" + err);
              } else {
                console.log(row);
                const aidArtist = row.aid;
                db.run(
                  "UPDATE artist SET aname = ? where aid = ?",
                  [request.body.aname, aidArtist],
                  (error) => {
                    if (error) {
                      console.log("Error" + error);
                    } else {
                      console.log("Line updated in the artist table");
                    }
                    response.redirect("/dashboard");
                  }
                );
              }
            }
          );
        }
      }
    );
  } else {
    response.redirect("/login");
  }
});
// defines the final default route 404 NOT FOUND
app.use(function (req, res) {
  res.status(404).render("error.handlebars", {
    ErrorHeader: "404: NOT FOUND",
    ErrorBody:
      "Sorry, the requested page was not found on this site. Please consider going back to the",
    title: "Error 404",
    style: "error.css",
  });
});

// runs the app and listens to the port
app.listen(port, () => {
  console.log(`Server running and listening on port ${port}...`);
});
