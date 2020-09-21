package structures

import "go.mongodb.org/mongo-driver/bson/primitive"

type Act struct {
	ID               primitive.ObjectID   `json:"id,omitempty" bson:"_id,omitempty"`
	IDExcel          int                  `json:"IDExcel,omitempty" bson:"IDExcel,omitempty"`
	Date             string               `json:"Date" bson:"Date"`
	Name             string               `json:"Name" bson:"Name"`
	InnerDate        string               `json:"InnerDate" bson:"InnerDate"`
	InnerDescription string               `json:"InnerDescription" bson:"InnerDescription"`
	InnerName        string               `json:"InnerName" bson:"InnerName"`
	InnerHeads       string               `json:"InnerHeads" bson:"InnerHeads"`
	InnerDeadline    string               `json:"InnerDeadline" bson:"InnerDeadline"`
	InnerMark        string               `json:"InnerMark" bson:"InnerMark"`
	IsInnerMark      bool                 `json:"IsInnerMark" bson:"IsInnerMark"`
	IsArchive        bool                 `json:"IsArchive" bson:"IsArchive"`
	Subdivisions     []Subdivision        `json:"Subdivisions" bson:"Subdivisions"`
	SubdivisionsID   []primitive.ObjectID `json:"SubdivisionsID" bson:"_idSubdivisionsID"`
}

type Subdivision struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name     string             `json:"Name,omitempty" bson:"Name,omitempty"`
	HeadName string             `json:"HeadName,omitempty" bson:"HeadName,omitempty"`
	Email    string             `json:"Email,omitempty" bson:"Email,omitempty"`
}

type Sender struct {	
	ID               	primitive.ObjectID   	`json:"id,omitempty" bson:"_id,omitempty"`
	Name				string 					`json:"name" bson:"name"`
	IsSenderWorking		bool 					`json:"isSenderWorking" bson:"isSenderWorking"`
}

type Adresses struct {	
	Email    			string
	HeadName			string
	Types				[]TypesMessages
	
}
type TypesMessages struct {	
	Type				string
	Row					[]string
}

// Для Беляковой и Шемякина
type Head struct {	
	HeadEmail			string
	SendedTo			[]string
}