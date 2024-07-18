package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// VotingContract provides functions for managing a voting system
type VotingContract struct {
	contractapi.Contract
}

// Voter describes basic details of a voter
type Voter struct {
	VoterID    string `json:"voterID"`
	Name       string `json:"name"`
	Registered bool   `json:"registered"`
	Voted      bool   `json:"voted"`
	Timestamp  string `json:"timestamp"`
}

// Candidate describes basic details of a candidate
type Candidate struct {
	CandidateID   string `json:"candidateID"`
	Name          string `json:"name"`
	Party         string `json:"party"`
	VotesReceived int    `json:"votesReceived"`
}

// Vote describes a vote cast by a voter
type Vote struct {
	VoteID      string `json:"voteID"`
	VoterID     string `json:"voterID"`
	CandidateID string `json:"candidateID"`
	Timestamp   string `json:"timestamp"`
}

// InitLedger adds a base set of candidates to the ledger
func (s *VotingContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	candidates := []Candidate{
		{CandidateID: "CANDIDATE1", Name: "John Doe", Party: "Party A", VotesReceived: 0},
		{CandidateID: "CANDIDATE2", Name: "Jane Smith", Party: "Party B", VotesReceived: 0},
	}

	for _, candidate := range candidates {
		candidateJSON, err := json.Marshal(candidate)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(candidate.CandidateID, candidateJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	return nil
}

// CreateVoter registers a new voter
func (s *VotingContract) CreateVoter(ctx contractapi.TransactionContextInterface, voterID string, name string) error {
	voter := Voter{
		VoterID:    voterID,
		Name:       name,
		Registered: true,
		Voted:      false,
		Timestamp:  "",
	}

	voterJSON, err := json.Marshal(voter)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(voterID, voterJSON)
}

// QueryVoter returns the voter stored in the world state with given id
func (s *VotingContract) QueryVoter(ctx contractapi.TransactionContextInterface, voterID string) (*Voter, error) {
	voterJSON, err := ctx.GetStub().GetState(voterID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if voterJSON == nil {
		return nil, fmt.Errorf("the voter %s does not exist", voterID)
	}

	var voter Voter
	err = json.Unmarshal(voterJSON, &voter)
	if err != nil {
		return nil, err
	}

	return &voter, nil
}

// CreateVote creates a new vote record
func (s *VotingContract) CreateVote(ctx contractapi.TransactionContextInterface, voteID string, voterID string) error {
	vote := Vote{
		VoteID:      voteID,
		VoterID:     voterID,
		CandidateID: "",
		Timestamp:   "",
	}

	voteJSON, err := json.Marshal(vote)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(voteID, voteJSON)
}

// UpdateVote updates an existing vote with candidate selection
func (s *VotingContract) UpdateVote(ctx contractapi.TransactionContextInterface, voteID string, candidateID string) error {
	voteJSON, err := ctx.GetStub().GetState(voteID)
	if err != nil {
		return fmt.Errorf("failed to read from world state: %v", err)
	}
	if voteJSON == nil {
		return fmt.Errorf("the vote %s does not exist", voteID)
	}

	var vote Vote
	err = json.Unmarshal(voteJSON, &vote)
	if err != nil {
		return err
	}

	if vote.CandidateID != "" {
		return fmt.Errorf("vote %s has already been cast", voteID)
	}

	vote.CandidateID = candidateID
	vote.Timestamp = time.Now().Format(time.RFC3339)

	voteJSON, err = json.Marshal(vote)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(voteID, voteJSON)
	if err != nil {
		return err
	}

	candidateJSON, err := ctx.GetStub().GetState(candidateID)
	if err != nil {
		return fmt.Errorf("failed to read candidate from world state: %v", err)
	}
	if candidateJSON == nil {
		return fmt.Errorf("the candidate %s does not exist", candidateID)
	}

	var candidate Candidate
	err = json.Unmarshal(candidateJSON, &candidate)
	if err != nil {
		return err
	}

	candidate.VotesReceived += 1

	candidateJSON, err = json.Marshal(candidate)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(candidateID, candidateJSON)
}

// QueryVote returns the vote stored in the world state with given id
func (s *VotingContract) QueryVote(ctx contractapi.TransactionContextInterface, voteID string) (*Vote, error) {
	voteJSON, err := ctx.GetStub().GetState(voteID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if voteJSON == nil {
		return nil, fmt.Errorf("the vote %s does not exist", voteID)
	}

	var vote Vote
	err = json.Unmarshal(voteJSON, &vote)
	if err != nil {
		return nil, err
	}

	return &vote, nil
}

// QueryCandidate returns the candidate stored in the world state with given id
func (s *VotingContract) QueryCandidate(ctx contractapi.TransactionContextInterface, candidateID string) (*Candidate, error) {
	candidateJSON, err := ctx.GetStub().GetState(candidateID)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if candidateJSON == nil {
		return nil, fmt.Errorf("the candidate %s does not exist", candidateID)
	}

	var candidate Candidate
	err = json.Unmarshal(candidateJSON, &candidate)
	if err != nil {
		return nil, err
	}

	return &candidate, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(VotingContract))
	if err != nil {
		fmt.Printf("Error create voting contract chaincode: %s", err)
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting voting contract chaincode: %s", err)
	}
}
