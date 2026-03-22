from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from apps.categories.models import Category


class CategoryApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='test', password='pass1234')
        self.client.force_authenticate(user=self.user)

    def test_create_category(self):
        response = self.client.post('/api/categories/', {
            'name': 'Salary',
            'type': 'income',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Category.objects.filter(name='Salary').exists())