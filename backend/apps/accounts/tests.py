from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from apps.accounts.models import Account


class AccountApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='test', password='pass1234')
        self.client.force_authenticate(user=self.user)

    def test_create_account(self):
        response = self.client.post('/api/accounts/', {
            'name': 'CBE',
            'type': 'bank',
            'currency': 'ETB',
            'balance': '1000.00',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        account = Account.objects.get(id=response.data['id'])
        self.assertEqual(account.balance, 1000)