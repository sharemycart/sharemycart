package swagger

import (
	firebase "firebase.google.com/go"
)

// The Firebase struct is used for dependency injection
type Firebase struct {
	App firebase.App
}

// NewFirebaseApp returns a new Firebase{} struct
func NewFirebaseApp(app firebase.App) *Firebase {
	return &Firebase{
		App: app,
	}
}
