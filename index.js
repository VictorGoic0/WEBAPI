const express = require('express');
const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json({ message: 'The users information could not be retrieved.'});
    })
})

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(404).json({ message: 'The user with the specified ID does not exist.'})
    })
})

server.post('/api/users', (req, res) => {
    if (!req.body.bio || !req.body.name) {
        res.status(400).json({ message: 'Please provide name and bio for the user.'})
    }
    else {
        db.insert(req.body)
    .then(edited => {
        db.findById(edited.id)
        .then(user => {
            res.status(201).json(user);
        })
    })
    .catch(err => {
        res.status(500).json({ message: 'There was an error while saving the user to the database'})
    })
    }
})

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    db.findById(id)
    .then(user => {
        db.remove(id)
        .then(deleted => {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({message: 'The user could not be removed'})
        })
    })
    .catch(err => res.status(404).json({message: 'The user with the specified ID does not exist.'}))
})

server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const userInfo = req.body;
    if (!userInfo.name || !userInfo.bio) {
        res.status(400).json({ message: 'Please provide name and bio for the user.'})
    }
    else {
        db.update(id, userInfo)
    .then(updated => {
        db.findById(id)
            .then(user => {
                res.status(200).json(user);
            })
            .catch(err => {
                res.status(404).json({ message: 'The user with the specified ID does not exist.'})
            })
    })
    .catch(err => {
        res.status(500).json({ message: 'The user information could not be modified.'})
    })
    }
})

server.listen(5000, () => {
    console.log('API up and running on port 5000')
  });  