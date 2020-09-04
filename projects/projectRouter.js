//TODO 5. Set up a router for the /api/projects route and export it (connect to the server)
//TODO 6. Connect the projectsRouter to the projectModel 
//TODO 7. Create validatePost middleware for obvious reasons
//TODO 8. Set up the CRUD end points to view, add, edit or delete projects, and see the actions for a given project 
const express = require("express"); 
const projects = require("../data/helpers/projectModel"); 

//* create router *//
const router = express.Router(); 

//? What routes will we have? Operations: GET, DELETE, PUT, POST ?// 

//! GET all projects !//

router.get("/", (req, res) => {
    projects.get()
        .then(projects => {
            console.log("success"); 
            res.status(200).json(projects);
        })
        .catch(err => {
            res.status(500).json({ message: "Error retrieving resource" }); 
        })
});

//! GET project by id !// 

router.get("/:id", (req, res) => {
    const id = req.params.id; 
    projects.get(id)
        .then(project => {
            console.log("success"); 
            res.status(200).json(project);
        })
        .catch(err => {
            res.status(500).json({ message: "Error retrieving resource" }); 
        })
});

//! GET all ACTIONS for a project !//

router.get("/:id", (req, res) => {
    const id = req.params.id; 
    projects.getProjectActions(id)
        .then(actions => {
            res.status(200).json(actions); 
        })
        .catch(err => {
            res.status(500).json({ message: "Error returning actions for this project" }); 
        })
}); 

//! PUT update a project !// 
//* pass validatePost middleware into this HTTP method *//

router.put("/:id", validatePost, (req, res) => {
    const changes = req.body; 
    const id = req.params.id; 
    projects.update(id, changes)
        .then(updated => {
            res.status(200).json(updated); 
        })
        .catch(err => {
            res.status(500).json({ message: "Error updating project" }); 
        })
}); 

//! POST add a new project !// 
//* passing in validatePost middleware to check that required fields are given *//

router.post("/", validatePost, (req, res) => { 
    //? Q:if I already define these in the middlware, do I have to do it here? Or can I grab them differently?
    //* A:I was trying to complete this in a 'React-y' way, instead only the req.body needs to be passed, no new object 
    projects.insert(req.body)
        .then(project => {
            res.status(201).json(project); 
        })
        .catch(err => {
            res.status(500).json({ message: "Error adding new project" }); 
        })
}); 

//! DELETE (destroy) a project 
//! changed projectModel to return all the projects after delete! 

router.delete("/:id", (req, res) => {
    const id = req.params.id; 
    projects.remove(id)
        .then(project => {
            res.status(200).json(project); 
        })
        .catch(err => {
            res.status(500).json({ message: "Error removing this project" }); 
        })
});

//* custom middleware - validatePost *// 

function validatePost(req, res, next){
    const body = req.body; 
    const name = req.body.name; 
    const description = req.body.description; 
    if(!body){
        res.status(400).json({ message: "Missing project data" }); 
    } else if(!name || !description){
        res.status(400).json({ message: "Missing required project field" }); 
    } else {
        next(); 
    }
}; 

//* export router *// 
module.exports = router; 