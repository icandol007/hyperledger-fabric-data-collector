package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/peer"
)

type VoteContract struct{}

type Vote struct {
	ID        string `json:"id"`
	Candidate string `json:"candidate"`
	Voter     string `json:"voter"`
}

func (s *VoteContract) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

func (s *VoteContract) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()

	switch function {
	case "CastVote":
		return s.CastVote(stub, args)
	case "QueryVote":
		return s.QueryVote(stub, args)
	default:
		return shim.Error("Invalid function name.")
	}
}

func (s *VoteContract) CastVote(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	vote := Vote{
		ID:        args[0],
		Candidate: args[1],
		Voter:     args[2],
	}

	voteAsBytes, _ := json.Marshal(vote)
	err := stub.PutState(args[0], voteAsBytes)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to cast vote: %s", err.Error()))
	}

	return shim.Success(nil)
}

func (s *VoteContract) QueryVote(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	voteID := args[0]
	voteAsBytes, err := stub.GetState(voteID)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to get vote: %s", err.Error()))
	}
	if voteAsBytes == nil {
		return shim.Error("Vote not found")
	}

	return shim.Success(voteAsBytes)
}

func main() {
	err := shim.Start(new(VoteContract))
	if err != nil {
		fmt.Printf("Error starting Vote Contract: %s", err)
	}
}
