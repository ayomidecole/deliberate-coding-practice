package services

import "example.com/deliberate-coding-practice/exercises/go/04-runnable-api-construction/047-compose-account-support-api/models"

type AccountService struct {
	accounts []models.Account
}

func NewAccountService(accounts []models.Account) *AccountService {
	return &AccountService{accounts: accounts}
}

func (service *AccountService) FindAccount(
	accountID string,
) (models.Account, error) {
	for _, account := range service.accounts {
		if account.ID == accountID {
			return account, nil
		}
	}
	return models.Account{}, ErrAccountNotFound
}
