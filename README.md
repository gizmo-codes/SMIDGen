# SMIDGen

A web application that allows users to pull in tweets based on keywords, determine relavence of the given tweets, and use AI and machine
learning to recommend new keywords based on the tweets selected as relavant. Project owners will be able to create, delete, and rename projects, as well as manage access to projects by other users.

# Project Website

[Sensify Lab](http://sensifylab.org/)

# Self-Hosted Demo
[Live Demo](https://smidgen.omzig.dev)
- Note: Firebase functionality is removed from demo.

# Contributors

* [Paul Townshend](https://github.com/paultownshend)
* [Ribo Yuan](https://github.com/riboyuan99)
* [Shaayal Kumar](https://github.com/shaayalk)
* [Andrew Rubenstein](https://github.com/Andrubes)
* [Xinyi Sun](https://github.com/sunxinyi0501)
* [Minghao Zhao](https://github.com/0Aris0)
* Matthew Chandler (me)

I was responsible for:
* Querying the Twitter API (/python/twapi.py)
* The frontend search page (/html/search.html)
* Saving and loading tweet data from Firebase (/js/search.js)

Essentailly everything in the [demo](https://smidgen.omzig.dev) as well as firebase interactions that are disabled.

# Dependencies
## [Python](https://www.python.org/) with [pip enabled](https://pip.pypa.io/en/stable/installation/)
`pip install` the following:
```
flask
flask_cors
requests
nltk
json2html
```

## [Node](https://nodejs.org/en/)
`npm install` the following:
```
express
cors
firebase-admin
```

Firebase: https://console.firebase.google.com/project/smidgen-5f8b9/overview

Authentication: https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js
