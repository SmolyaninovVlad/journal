package structures

import "go.mongodb.org/mongo-driver/bson/primitive"

type Act struct {
	ID               primitive.ObjectID   `json:"id,omitempty" bson:"_id,omitempty"`
	IDExcel          int                  `json:"IDExcel,omitempty" bson:"IDExcel,omitempty"`
	Date             string               `json:"Date" bson:"Date,omitempty"`
	Name             string               `json:"Name,omitempty" bson:"Name,omitempty"`
	InnerDate        string               `json:"InnerDate,omitempty" bson:"InnerDate,omitempty"`
	InnerDescription string               `json:"InnerDescription,omitempty" bson:"InnerDescription,omitempty"`
	InnerName        string               `json:"InnerName,omitempty" bson:"InnerName,omitempty"`
	InnerHeads       string               `json:"InnerHeads,omitempty" bson:"InnerHeads,omitempty"`
	InnerDeadline    string               `json:"InnerDeadline,omitempty" bson:"InnerDeadline,omitempty"`
	InnerMark        string               `json:"InnerMark,omitempty" bson:"InnerMark,omitempty"`
	Subdivisions     []Subdivision        `json:"Subdivisions,omitempty bson:"Subdivisions,omitempty""`
	SubdivisionsID   []primitive.ObjectID `json:"SubdivisionsID,omitempty" bson:"_idSubdivisionsID,omitempty"`
}

type Subdivision struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name     string             `json:"Name,omitempty" bson:"Name,omitempty"`
	HeadName string             `json:"HeadName,omitempty" bson:"HeadName,omitempty"`
	Email    string             `json:"Email,omitempty" bson:"Email,omitempty"`
}
