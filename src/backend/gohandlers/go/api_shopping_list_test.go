package swagger

import (
	"context"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"

	firebase "firebase.google.com/go"
	"google.golang.org/api/option"
)

func TestShoppingList(t *testing.T) {
	tests := []struct {
		name           string
		in             *http.Request
		out            *httptest.ResponseRecorder
		expectedStatus int
		expectedBody   string
	}{
		{
			name:           "AddShoppingList",
			in:             httptest.NewRequest("POST", "/shoppinglists", nil),
			out:            httptest.NewRecorder(),
			expectedStatus: http.StatusOK,
			expectedBody:   "",
		}, // TODO: teest cases
	}

	for _, test := range tests {
		test := test
		t.Run(test.name, func(t *testing.T) {
			ctx := context.Background()
			serviceAccountFile, _ := ioutil.ReadFile("unit-collabshop19.json")
			serviceAccount := option.WithCredentialsJSON([]byte(serviceAccountFile))
			app, _ := firebase.NewApp(ctx, nil, serviceAccount)
			firebaseApp := NewFirebaseApp(*app)
			firebaseApp.NewRouter()
			firebaseApp.AddShoppingList(test.out, test.in)

			if test.out.Code != test.expectedStatus {
				t.Logf("expected status code: %d\ngot: %d\n", test.expectedStatus, test.out.Code)
				t.Fail()
			}
		})
	}
}
