package services

import (
	"errors"
	"testing"

	"example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/models"
)

func TestFindAccountReturnsMatchingAccount(t *testing.T) {
	want := models.Account{
		ID: "account-a", CompanyName: "Northstar Analytics",
		Plan: "enterprise", Status: "active",
	}
	service := NewAccountService([]models.Account{
		{ID: "account-b", CompanyName: "Riverside Labs"},
		want,
	})

	got, err := service.FindAccount("account-a")

	if err != nil {
		t.Fatalf("FindAccount() error = %v; want nil", err)
	}
	if got != want {
		t.Errorf("FindAccount() = %+v; want %+v", got, want)
	}
}

func TestFindAccountReturnsNotFound(t *testing.T) {
	service := NewAccountService([]models.Account{{ID: "account-a"}})

	got, err := service.FindAccount("account-missing")

	if !errors.Is(err, ErrAccountNotFound) {
		t.Fatalf("FindAccount() error = %v; want %v", err, ErrAccountNotFound)
	}
	if got != (models.Account{}) {
		t.Errorf("FindAccount() = %+v; want empty account", got)
	}
}
