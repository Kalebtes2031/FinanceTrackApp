from rest_framework import serializers
from apps.accounts.models import Account
from apps.transactions.models import Transaction

class DashboardAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'name', 'type', 'currency', 'balance']

class DashboardTransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.name', read_only=True)
    to_account_name = serializers.CharField(source='to_account.name', read_only=True, allow_null=True)
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 
            'type', 
            'amount', 
            'description', 
            'created_at', 
            'account_id', 
            'account_name', 
            'to_account_id', 
            'to_account_name', 
            'category_id', 
            'category_name'
        ]

class SpendingByCategorySerializer(serializers.Serializer):
    category_name = serializers.CharField()
    total = serializers.DecimalField(max_digits=14, decimal_places=2)
