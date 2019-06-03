const express = require('express');

const server = express();

const accountsDb = require('./data/accounts-model')

server.use(express.json());

/****************************************/
/*          Get all accounts            */
/****************************************/

server.get('/accounts', async (req, res) => {
    try {
        const accounts = await accountsDb.find();
        res.status(200).json(accounts);
    }
    catch {
        res.status(500).json({"errorMessage": "Problem getting account data!"})
    }
})

/***************************************************************/
/*        Get a Project by its id and all related actions      */
/****************************************************************/

server.get('/accounts/:id', validateIdAndSaveAccount, async (req, res) => {
        const account = req.account;
        if (account)
            res.status(200).json(req.account);
        else 
            res.status(500).json({"errorMessage": "Cannot get account from database"})
    
});

/*****************************************/
/*        Insert a new account           */
/*****************************************/
server.post ('/accounts', validateAccountInfo, async (req,res) => {
    const body = req.body;
    try {
        account = await accountsDb.add(body);
        res.status(201).json(account);
    }
    catch {
        res.status(500).json({"errorMessage": "That was a problem adding the account"})
    }
})

/**********************************************/
/*        Update an existing account           */
/**********************************************/

server.put('/accounts/:id', validateIdAndSaveAccount, validateAccountInfo, async (req,res) => {
    const body = req.body;
    const id = req.params.id;

    try {
        const count = await accountsDb.update(id, body);
        res.status(200).json({"message": `${count} message(s) updated`});
    }
    catch {
        res.status(500).json({"errorMessage": "Account could not be inserted in database"});
    }
}) 

/**********************************************/
/*        Delete an existing action           */
/**********************************************/

server.delete('/accounts/:id', validateIdAndSaveAccount, async (req,res) => {
    const id = req.params.id;
    try {
        const count = await accountsDb.remove(id);
        res.status(200).json(`message: ${count} record(s) deleted`);
    }
    catch {
        res.status(500).json({"errorMessage": "Account could not be deleted from database"});
    }
}) 







/********************************************************************************/
/*                              Custom Middleware                               */
/********************************************************************************/


/****************************************/
/*        Validate account Id           */
/****************************************/

async function validateIdAndSaveAccount(req, res, next) {
    const id = req.params.id;
    if(id) {
        try {
            const account = await accountsDb.findById(id);
            if(account) {
                req.account = account;
                next();
            }
                
            else
                res.status(400).json({"errorMessage": "This account id does not exist"})
        } 
        catch {
            res.status(500).json({"errorMessage": "That was a problem checking the id"})
        }
    }
    else {
        res.status(400).json({"errorMessage": "You need to provide an id"})
    }
};

/****************************************/
/*        Validate account info         */
/****************************************/
async function validateAccountInfo(req,res, next) {
    const body = req.body;

    if(body.name && body.budget) {
        next();
    }
    else {
        res.status(400).json({"errorMessage":"name and budget are required"});
    }
}


module.exports = server;