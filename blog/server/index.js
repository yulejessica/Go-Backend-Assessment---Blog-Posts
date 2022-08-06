require("dotenv").config();
const axios = require('axios');
const path = require("path");

const express = require("express");
var cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// const db = require('./database/db.js');
// var router = require('./routes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use('/', router);
app.use(express.static('client/dist'));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

let options = {
  url: 'https://api.hatchways.io/assessment/blog/',

};

//get all data
// app.get('/posts', (req, res) => {
//   console.log("hit the data in the server");

//   let tags = req.query.tags;
//   console.log('tags: ', tags)

//   let sortBy = req.query.sortBy;
//   console.log('sortBy:', sortBy);

//   let direction = req.query.direction;
//   console.log('direction', direction);

//   const validSortedVals = [
//     "author",
//     "authorId",
//     "id",
//     "likes",
//     "popularity",
//     "reads",
//     "tags",
//     undefined
//   ];

//   const validDir = ["asc", "desc", undefined];


//   //handle invlaid params:
//   if(validSortedVals.indexOf(sortBy) === -1) {
//     res.status(400).send({
//       err: "invalid sortBy parameter!"
//     })
//   }

//   if(validDir.indexOf(sortBy) === -1) {
//     res.status(400).send({
//       err: "invalid direction parameter!"
//     })
//   }

//   if(tags.indexOf(',') > -1) {
//     let tagArr = tags.split(',');
//     let getAllPaths = tagArr.map((tag, i) => (
//       axios.get(`${options.url}/posts?tag=${tags}}&sortBy=${sortBy}&direction=${direction}`))
//     );

//     axios.all([...getAllPaths])
//       .then(
//         axios.spread((tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9) => {
//           let data = [
//             tag1 ? tag1.data.posts : "",
//             tag2 ? tag2.data.posts : "",
//             tag3 ? tag3.data.posts : "",
//             tag4 ? tag4.data.posts : "",
//             tag5 ? tag5.data.posts : "",
//             tag6 ? tag6.data.posts : "",
//             tag7 ? tag7.data.posts : "",
//             tag8 ? tag8.data.posts : "",
//             tag9 ? tag9.data.posts : "",
//           ];
//           //create hashmap to get rid of dupicates
//           let post = {};
//           let postsArr = [];
//           for(let i = 0; i < data.length; i++) {
//             let curr = data[i];
//             for(let i = 0; i < curr.length; i++) {
//               post[curr[i].id] = curr[i];
//             }
//           };
//           for(let k in post) {
//             postsArr.push(post[k])
//           };

//           console.log('postArr', postsArr);
//           if(sortBy) {
//             if(direction === 'asc') {
//               postsArr = postsArr.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
//             } else if (direction ==='desc') {
//               postsArr = postsArr.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1))
//             }
//           }
//           res.status(200).send(postsArr);

//     })
//     )
//       .catch(err => {
//         res.status(400).send({
//           error: "Tags is required"
//         });
//         console.log('err', err)
//       })
//   } else {
//     axios.get(`${options.url}/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`, {headers: options.headers})
//     .then((req) => {
//       let postsArr = req.data.posts;

//       if(sortBy) {
//         if(direction === 'asc') {
//           postsArr = postsArr.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1))
//         } else if (direction ==='desc') {
//           postsArr = postsArr.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1))
//         }
//       }

//       console.log('postsArr', postsArr);
//       res.status(200).send(postsArr);
//     })
//     .catch(err => res.status(500).send(err));
// }


//   // axios.get(`${options.url}/posts?tag=${tags}`, {headers: options.headers})
//   // .then(list => res.status(200).send(list.data))
//   // .catch(err => res.status(500).send(err));
// });
app.get('/posts', (req, res) => {
  let tags = req.query.tags;
  console.log('tags: ', tags)

  let sortBy = req.query.sortBy;
  console.log('sortBy:', sortBy);

  let direction = req.query.direction;
  console.log('direction', direction);

  const validSortValues = [
    "id",
    "author",
    "authorId",
    "likes",
    "popularity",
    "reads",
    "tags",
    undefined,
  ];
  const validDirections = ["asc", "desc", undefined];

  // Throws error if the sortBy/direction value are not valid.
  if (validSortValues.indexOf(sortBy) === -1) {
    res.status(400).send({
      error: "sortBy parameter is invalid",
    });
  }
  if (validDirections.indexOf(direction) === -1) {
    res.status(400).send({
      error: "sortBy parameter is invalid",
    });
  }

  // If the user requests more than one tag, we will precede with the following
  if (tags.indexOf(",") !== -1) {
    let tagArray = tags.split(",");
    let getPaths = tagArray.map((tag, i) => {
      return axios.get(
        `${options.url}/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`
      );
    });

    axios
      .all([...getPaths])

      // Null/undefined are not used because I use the length method below on the data array
      .then(
        axios.spread((tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9) => {
          let data = [
            tag1 ? tag1.data.posts : "",
            tag2 ? tag2.data.posts : "",
            tag3 ? tag3.data.posts : "",
            tag4 ? tag4.data.posts : "",
            tag5 ? tag5.data.posts : "",
            tag6 ? tag6.data.posts : "",
            tag7 ? tag7.data.posts : "",
            tag8 ? tag8.data.posts : "",
            tag9 ? tag9.data.posts : "",
          ];
          // Most efficient way to get rid of duplicates is to make a hash table
          // Using the post id as the key in the hash table, it will ensure that duplicates are removed
          let post = {};
          let posts = [];
          for (let i = 0; i < data.length; i++) {
            let blog = data[i];
            for (let i = 0; i < blog.length; i++) {
              post[blog[i].id] = blog[i];
            }
          }

          // Create response object so that the result of the request is in the correct format
          for (let key in post) {
            posts.push(post[key]);
          }

          // if a sortBy value is utilized by the user, then we will sort depending on the direction
          if (sortBy) {
            if (direction === "desc") {
              posts = posts.sort((a, b) => (b[sortBy] > a[sortBy] ? 1 : -1));
            } else {
              posts = posts.sort((a, b) => (b[sortBy] < a[sortBy] ? 1 : -1));
            }
          }

          // Finally we have rid ourselves of duplicates and sorted our data as the user desires and can return the data
          res.status(200).send(posts);
        })
      )

      // If no tags are used, then this error will be shown to the user
      .catch((error) => {
        res.status(400).send({
          error: "Tags parameter is required",
        });
        console.log(error);
      });
  } else {
    // If user searches for one tag, then we don't have to worry about duplicate values
    axios
      .get(
        `${options.url}/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`
      )
      .then((request) => {
        let data = request.data.posts;
        if (sortBy) {
          if (direction === "desc") {
            data = data.sort((a, b) => (b[sortBy] > a[sortBy] ? 1 : -1));
          } else {
            data = data.sort((a, b) => (b[sortBy] < a[sortBy] ? 1 : -1));
          }
        }
        res.status(200).send(data);
      })
      .catch((error) => {
        res.status(400).send({
          error: "Tags parameter is required",
        });
        console.log(error);
      });
  }
})