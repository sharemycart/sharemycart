package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"google.golang.org/api/option"

	firebase "firebase.google.com/go"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
	api "github.com/utsavanand2/sharemycart/gohandlers/go"
)

var (
	// Version of the build
	Version = "dev"
	// GitCommit of the build
	GitCommit = ""
)

func main() {
	var wait time.Duration
	var port int
	var serviceAccountFile string
	flag.DurationVar(&wait, "graceful-timeout", time.Second*5, "The Duration for which the server gracefully waits for the existing connections to finish")
	flag.StringVar(&serviceAccountFile, "svc", "", "The content of the firebase service account JSON file")
	flag.IntVar(&port, "port", 8080, "Port to listen on")
	flag.Parse()

	ctx := context.Background()
	serviceAccount := option.WithCredentialsJSON([]byte(serviceAccountFile))
	app, err := firebase.NewApp(ctx, nil, serviceAccount)
	if err != nil {
		logrus.Fatalf("error initializing app: %v\n", err)
	}

	firebaseApp := api.NewFirebaseApp(*app)
	router := firebaseApp.NewRouter()

	server := NewServer(router, port)

	go func() {
		if err := server.ListenAndServe(); err != nil {
			logrus.Printf("error starting the server at port %d: %v", port, err)
		}
	}()

	logrus.Infof("Listening on port %d\n", port)

	c := make(chan os.Signal, 1)
	// We'll accept graceful sutdowns when quit via SIGNINT (Ctrl + C), SIGTERM and SIGKILL
	signal.Notify(c, syscall.SIGINT, syscall.SIGTERM, syscall.SIGKILL)

	// Block until we receive our signal
	<-c

	ctx, cancel := context.WithTimeout(context.Background(), wait)
	defer cancel()

	// Doesn't block if no connections, but will otherwise wait
	// until the timeout deadline.
	server.Shutdown(ctx)

	logrus.Println("server shutting down")
	os.Exit(0)
}

// NewServer returns a new *http.Server
func NewServer(router *mux.Router, port int) *http.Server {
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
		Handler:      router,
	}
	return srv
}
