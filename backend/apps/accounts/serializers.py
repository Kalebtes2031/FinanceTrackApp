from rest_framework import serializers
from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'id',
            'name',
            'type',
            'balance',
            'currency',
            'is_active',
            'archived_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'is_active', 'archived_at', 'created_at', 'updated_at']

    def validate_balance(self, value):
        if self.instance is not None:
            raise serializers.ValidationError('Balance is updated by transactions only.')
        return value
