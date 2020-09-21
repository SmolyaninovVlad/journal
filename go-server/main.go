package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
	"strings"

	"journal/mailSender"
	"journal/structures"
	"github.com/gorilla/mux"
	"github.com/robfig/cron"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/unrolled/render.v1"
)

// SetHeaders ...
func SetHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "mode, access-control-allow-origin, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
		w.Header().Set("Content-Type", "application/json")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

var Client *mongo.Client

func main() {

	fmt.Println("Application is running...")

	
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://mongodb:27017"))
	if err != nil {
		log.Fatal(err)
	}

	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	if err := client.Connect(ctx); err != nil {
		log.Fatal(err)
	}
	Client = client

	//инициализация mailSender
	c := cron.New()
	fmt.Printf("successfully: c := cron.New() \n")
	c.AddFunc("@daily", func() {
	// c.AddFunc("@every 15s", func() {

		if err := mailSender.SetSender(time.Now(), client); err != nil {
			fmt.Println("POST error : ", err)
		}

	})
	fmt.Printf("successfully:c.AddFunc(, func() {} \n")
	//Запуск проверки полей и оповещения на почту
	c.Start()

	router := mux.NewRouter()

	renderer := render.New(render.Options{
		Directory:       "static",
		Layout:          "index",
		Extensions:      []string{".html"},
		Charset:         "UTF-8",
		DisableCharset:  true,
		IndentJSON:      true,
		HTMLContentType: "text/html",
	})

	router.HandleFunc("/updateAct", UpdateActEndpoint).Methods("POST", "OPTIONS")
	router.HandleFunc("/createAct", CreateActEndpoint).Methods("POST", "OPTIONS")
	router.HandleFunc("/createSub", CreateSubEndpoint).Methods("POST", "OPTIONS")
	router.HandleFunc("/updateSub", UpdateSubEndpoint).Methods("POST", "OPTIONS")
	router.HandleFunc("/deleteSub", DeleteSubEndpoint).Methods("POST", "OPTIONS")
	router.HandleFunc("/deleteAct", DeleteActEndpoint).Methods("POST", "OPTIONS")
	router.HandleFunc("/createAllActs", CreateAllActEndpoint).Methods("POST", "OPTIONS")
	router.HandleFunc("/createUpdateSubdivisions", CreateUpdateAllSubdivisionsEndpoint).Methods("POST", "OPTIONS")
	router.HandleFunc("/deleteAllActs", DeleteAllActsEndpoint).Methods("POST", "OPTIONS")
	router.HandleFunc("/getActs", GetActsEndpoint).Methods("GET", "OPTIONS")
	router.HandleFunc("/getSubdivisions", GetSubdivisionsEndpoint).Methods("GET", "OPTIONS")
	router.HandleFunc("/senderStart", senderStartEndpoint).Methods("GET", "OPTIONS")
	router.HandleFunc("/senderStop", senderStopEndpoint).Methods("GET", "OPTIONS")
	router.HandleFunc("/senderSend", senderSendEndpoint).Methods("GET", "OPTIONS")
	//Обработчик для установки признака архивности
	router.HandleFunc("/archiveSet", archiveSetEndpoint).Methods("POST", "OPTIONS")

	
	
	router.
		PathPrefix("/static/").
		Handler(
			http.StripPrefix(
				"/static/",
				http.FileServer(http.Dir("./static/")),
			),
		)
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		renderer.HTML(w, http.StatusOK, "index", nil)
	})
	router.Use(SetHeaders)
	http.ListenAndServe(":2222", router)
	fmt.Printf("running: :2222 \n")

}

func archiveSetEndpoint(response http.ResponseWriter, request *http.Request){
	response.Header().Add("content-type", "application/json")

	collection := Client.Database("journalData").Collection("acts")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	update := bson.M{"$set": bson.M{"IsArchive": true}}

	filter := bson.M{"IDExcel": bson.M{ "$gte": 1, "$lte": 269 } }

	res, err := collection.UpdateMany(
		ctx,
		filter,
		update,
	)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}
	fmt.Printf("acts updated:  %+v\n")
	json.NewEncoder(response).Encode(res)
}




func senderSendEndpoint(response http.ResponseWriter, request *http.Request){
	fmt.Printf("sender manually initialized... \n")
	if err := mailSender.SetSender(time.Now(), Client); err != nil {
		fmt.Println("POST error : ", err)
	}
	fmt.Printf("sender finished\n")
}
func senderStartEndpoint(response http.ResponseWriter, request *http.Request){
	collection := Client.Database("journalData").Collection("mailSender")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	var Sender structures.Sender
	Sender.Name = "main"
	Sender.IsSenderWorking = true
	
	update := bson.M{"$set": Sender}
	filter := bson.M{"name": Sender.Name}


	res, err := collection.UpdateOne(
		ctx,
		filter,
		update,
	)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return		
	}
	if res.MatchedCount==0 {
		resInsert, errInsert := collection.InsertOne(ctx, Sender)
		if errInsert != nil {
			response.WriteHeader(http.StatusInternalServerError)
			response.Write([]byte(`{"message": "` + err.Error() + `"}`))
			return
		}
		if resInsert != nil{
			fmt.Printf("Sender inserted:  %+v\n", resInsert)
			json.NewEncoder(response).Encode(resInsert)
		}
	} else {
		fmt.Printf("Sender activated:  %+v\n", res)
		json.NewEncoder(response).Encode(res)
	}
}
func senderStopEndpoint(response http.ResponseWriter, request *http.Request){
	collection := Client.Database("journalData").Collection("mailSender")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	var Sender structures.Sender
	Sender.Name = "main"
	Sender.IsSenderWorking = false

	update := bson.M{"$set": Sender}
	filter := bson.M{"name": Sender.Name}
	res, err := collection.UpdateOne(
		ctx,
		filter,
		update,
	)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return		
	}
	if res.MatchedCount==0 {
		fmt.Printf("Sender doesnt exist\n")		
	} else {
		fmt.Printf("Sender disactivated\n")
	}
	json.NewEncoder(response).Encode(res)
}

func DeleteAllActsEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	// params := mux.Vars(request)
	// id, _ := primitive.ObjectIDFromHex(params["id"])

	collection := Client.Database("journalData").Collection("acts")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	err := collection.Drop(ctx)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}
	json.NewEncoder(response).Encode("Success")
}

func GetActsEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var acts []structures.Act
	collection := Client.Database("journalData").Collection("acts")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}
	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var act structures.Act
		cursor.Decode(&act)
		acts = append(acts, act)
	}
	if err := cursor.Err(); err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}
	json.NewEncoder(response).Encode(acts)
}

func DeleteActEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var act structures.Act

	json.NewDecoder(request.Body).Decode(&act)
	// fmt.Printf("client: %+v\n", act.IDExcel)

	collection := Client.Database("journalData").Collection("acts")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	res, err := collection.DeleteOne(ctx, bson.M{"IDExcel": act.IDExcel})
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}
	fmt.Printf("act deleted:  %+v\n", act)
	json.NewEncoder(response).Encode(res)
}

func DeleteSubEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var sub structures.Subdivision

	json.NewDecoder(request.Body).Decode(&sub)

	collection := Client.Database("journalData").Collection("Subdivisions")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	res, err := collection.DeleteOne(ctx, bson.M{"_id": sub.ID})
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}
	fmt.Printf("Subdivision deleted:  %+v\n", sub)
	json.NewEncoder(response).Encode(res)
}

func UpdateActEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var act *structures.Act
	json.NewDecoder(request.Body).Decode(&act)

	// json.NewDecoder(request.Body).Decode(&Subdivision)
	// fmt.Printf("client: %+v\n", act)

	collection := Client.Database("journalData").Collection("acts")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	act.Name = act.Name
	act.InnerDate = act.InnerDate

	

	update := bson.M{"$set": act}

	filter := bson.M{"_id": act.ID}

	res, err := collection.UpdateOne(
		ctx,
		filter,
		update,
	)

	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}
	fmt.Printf("act updated:  %+v\n", act)
	json.NewEncoder(response).Encode(res)
}

func CreateActEndpoint(response http.ResponseWriter, request *http.Request) {
	var act structures.Act
	var maxActId structures.Act

	json.NewDecoder(request.Body).Decode(&act)

	collection := Client.Database("journalData").Collection("acts")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	//Поиск максимального значения IdExcel для записи следующего
	options := options.Find()
	options.SetSort(bson.D{{"IDExcel", -1}})
	options.SetLimit(1)
	cursor, err := collection.Find(context.Background(), bson.M{}, options)
	for cursor.Next(context.TODO()) {
		cursor.Decode(&maxActId)
	}
	act.IDExcel = maxActId.IDExcel + 1

	res, err := collection.InsertOne(ctx, act)

	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}

	answer := bson.M{"InsertedID": res.InsertedID, "IDExcel": act.IDExcel}
	fmt.Printf("act created:  %+v\n", act)
	json.NewEncoder(response).Encode(answer)
}


func UpdateSubEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	var Subdivision *structures.Subdivision
	json.NewDecoder(request.Body).Decode(&Subdivision)


	collection := Client.Database("journalData").Collection("Subdivisions")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	Subdivision.Name = Subdivision.Name
	Subdivision.HeadName = Subdivision.HeadName
	Subdivision.Email = Subdivision.Email
	

	update := bson.M{"$set": Subdivision}

	filter := bson.M{"_id": Subdivision.ID}

	res, err := collection.UpdateOne(
		ctx,
		filter,
		update,
	)

	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}
	fmt.Printf("Subdivision updated:  %+v\n", Subdivision)
	json.NewEncoder(response).Encode(res)
}

func CreateSubEndpoint(response http.ResponseWriter, request *http.Request) {
	var Subdivision *structures.Subdivision

	json.NewDecoder(request.Body).Decode(&Subdivision)

	collection := Client.Database("journalData").Collection("Subdivisions")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	res, err := collection.InsertOne(ctx, Subdivision)

	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}

	answer := bson.M{"InsertedID": res.InsertedID}
	fmt.Printf("Subdivision created:  %+v\n", Subdivision)
	json.NewEncoder(response).Encode(answer)
}


func CreateAllActEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	collectionActs := Client.Database("journalData").Collection("acts")
	collectionSubs := Client.Database("journalData").Collection("Subdivisions")

	var Acts []*structures.Act
	var Sub structures.Subdivision

	// var Subs []*structures.Subdivision
	// var Subs []*Subdivision
	var allActs = []interface{}{}

	//Получаем из запроса все акты
	json.NewDecoder(request.Body).Decode(&Acts)

	for _, Act := range Acts {

		Subs := Act.Subdivisions
		for _, sub := range Subs {

			//Добавление подразделения
			filter := bson.M{"Name": strings.Trim(sub.Name," ")}
			//Поиск текущего подразделения из уже существующих в базе
			err := collectionSubs.FindOne(ctx, filter).Decode(&Sub)

			if err != nil && len(sub.Name) > 0 {
				//Документ не найден, то поиск по подстроке
				//Строка без пробелов + отрезанная до первого пробела
				filter1 := bson.M{"Name": primitive.Regex{Pattern: strings.Split(strings.TrimSpace(sub.Name)," ")[0], Options: ""}}
				var Sub1 structures.Subdivision
				ctx1, _ := context.WithTimeout(context.Background(), 10*time.Second)
				err1 := collectionSubs.FindOne(ctx1, filter1).Decode(&Sub1)
				fmt.Printf("err1 :  %+v\n", err1)
				if err1 == nil {
					Act.SubdivisionsID = append(Act.SubdivisionsID, Sub1.ID)
				}
			} else {
				Act.SubdivisionsID = append(Act.SubdivisionsID, Sub.ID)
			}

		}
		//Добавление акта
		allActs = append(allActs, Act)
	}


	resultActs, _ := collectionActs.InsertMany(ctx, allActs)
	fmt.Printf("all acts reloaded %+v\n")
	json.NewEncoder(response).Encode(resultActs)
}

func CreateUpdateAllSubdivisionsEndpoint(response http.ResponseWriter, request *http.Request) {
	response.Header().Add("content-type", "application/json")

	collection := Client.Database("journalData").Collection("Subdivisions")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)

	//Удаление всех данных из коллекции
	_, err := collection.DeleteMany(ctx, structures.Subdivision{})
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}

	//Запись новых данных в БД из запроса
	var Subdivisions []structures.Subdivision
	var Subdivisions1 []interface{}

	json.NewDecoder(request.Body).Decode(&Subdivisions)

	//обход полученного из запроса массива с подменой имён
	var subdivision structures.Subdivision
	for _, value := range Subdivisions {		
		subdivision = value		
		subdivision.Name=value.Name+" "+strings.Split(value.HeadName, " ")[0]
		Subdivisions1 = append(Subdivisions1, subdivision)		
	}
	result, err := collection.InsertMany(ctx, Subdivisions1)
	if err != nil {
		fmt.Printf("error:  %+v\n", err )
	}

	fmt.Printf("all subdivisions reloaded %+v\n", result )
	json.NewEncoder(response).Encode(result)

}

func GetSubdivisionsEndpoint(response http.ResponseWriter, request *http.Request) {
	fmt.Printf("all subdivisions reloaded %+v\n" )
	response.Header().Add("content-type", "application/json")
	var subdivisions []structures.Subdivision
	collection := Client.Database("journalData").Collection("Subdivisions")
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	cursor, err := collection.Find(ctx, bson.M{})

	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}

	defer cursor.Close(ctx)
	for cursor.Next(ctx) {
		var subdivision structures.Subdivision
		cursor.Decode(&subdivision)
		subdivisions = append(subdivisions, subdivision)
	}
	if err := cursor.Err(); err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte(`{"message": "` + err.Error() + `"}`))
		return
	}
	json.NewEncoder(response).Encode(subdivisions)
}
