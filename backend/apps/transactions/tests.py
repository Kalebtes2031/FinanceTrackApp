from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from apps.accounts.models import Account
from apps.categories.models import Category
from apps.transactions.models import Transaction


class TransactionApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='test', password='pass1234')
        self.client.force_authenticate(user=self.user)
        self.account = Account.objects.create(user=self.user, name='Cash', type='cash', balance=100, currency='ETB')
        self.savings = Account.objects.create(user=self.user, name='Savings', type='bank', balance=50, currency='ETB')
        self.category = Category.objects.create(user=self.user, name='Food', type='expense')

    def test_expense_updates_balance(self):
        response = self.client.post('/api/transactions/', {
            'account': self.account.id,
            'amount': '30.00',
            'type': 'expense',
            'category': self.category.id,
            'description': 'Lunch',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.account.refresh_from_db()
        self.assertEqual(self.account.balance, 70)

    def test_transfer_updates_both_accounts(self):
        response = self.client.post('/api/transactions/', {
            'account': self.account.id,
            'to_account': self.savings.id,
            'amount': '20.00',
            'type': 'transfer',
            'description': 'Move',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.account.refresh_from_db()
        self.savings.refresh_from_db()
        self.assertEqual(self.account.balance, 80)
        self.assertEqual(self.savings.balance, 70)