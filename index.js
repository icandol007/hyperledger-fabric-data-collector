const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/createSession', (req, res) => {
    const { sessionName, metadata, items, username } = req.body;
    const sessionId = uuidv4();

    const contractTemplate = `
    package main

    import (
        "encoding/json"
        "fmt"
        "github.com/hyperledger/fabric-contract-api-go/contractapi"
    )

    type DataCollectorContract struct {
        contractapi.Contract
    }

    type Item struct {
        ID    string \`json:"id"\`
        Value string \`json:"value"\`
    }

    type Session struct {
        ID       string \`json:"id"\`
        Name     string \`json:"name"\`
        Items    []Item \`json:"items"\`
        Metadata string \`json:"metadata"\`
    }

    func (c *DataCollectorContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
        return nil
    }

    func (c *DataCollectorContract) CreateSession(ctx contractapi.TransactionContextInterface, id string, name string, metadata string) error {
        session := Session{
            ID:       id,
            Name:     name,
            Items:    []Item{},
            Metadata: metadata,
        }
        sessionJSON, err := json.Marshal(session)
        if (err != nil) {
            return err
        }
        return ctx.GetStub().PutState(id, sessionJSON)
    }

    func (c *DataCollectorContract) AddItem(ctx contractapi.TransactionContextInterface, sessionId string, itemId string, value string) error {
        sessionJSON, err := ctx.GetStub().GetState(sessionId)
        if err != nil {
            return fmt.Errorf("failed to read from world state: %v", err)
        }
        if sessionJSON == nil {
            return fmt.Errorf("the session %s does not exist", sessionId)
        }

        var session Session
        err = json.Unmarshal(sessionJSON, &session)
        if err != nil {
            return err
        }

        item := Item{
            ID:    itemId,
            Value: value,
        }
        session.Items = append(session.Items, item)

        sessionJSON, err = json.Marshal(session)
        if err != nil {
            return err
        }

        return ctx.GetStub().PutState(sessionId, sessionJSON)
    }

    func (c *DataCollectorContract) SubmitData(ctx contractapi.TransactionContextInterface, sessionId string, itemId string) error {
        sessionJSON, err := ctx.GetStub().GetState(sessionId)
        if err != nil {
            return fmt.Errorf("failed to read from world state: %v", err)
        }
        if sessionJSON == nil {
            return fmt.Errorf("the session %s does not exist", sessionId)
        }

        var session Session
        err = json.Unmarshal(sessionJSON, &session)
        if err != nil {
            return err
        }

        return nil
    }

    func main() {
        chaincode, err := contractapi.NewChaincode(new(DataCollectorContract))
        if err != nil {
            fmt.Printf("Error create data-collector contract: %s", err.Error())
            return
        }

        if err := chaincode.Start(); err != nil {
            fmt.Printf("Error starting data-collector contract: %s", err.Error())
        }
    }
    `;

    // Create the chaincode directory
    const contractPath = path.join(__dirname, 'chaincode', sessionId);
    const contractLabel = 'test';
    fs.mkdirSync(contractPath, { recursive: true });
    fs.writeFileSync(path.join(contractPath, 'dataCollector.go'), contractTemplate);

    // Execute the deployment script
    exec(`scripts/deployChaincode.sh ${sessionId} ${contractPath} ${contractLabel}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Failed to deploy new chaincode');
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).send('Failed to deploy new chaincode');
        }
        console.log(`Stdout: ${stdout}`);
        res.status(200).send('New data collection session created and chaincode deployed');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
