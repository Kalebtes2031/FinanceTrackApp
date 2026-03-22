from django.db import transaction as db_transaction
from rest_framework import serializers
from .models import Transaction
from .services import apply_transaction_create, apply_transaction_update
from apps.accounts.models import Account
from apps.categories.models import Category


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            'id',
            'account',
            'to_account',
            'amount',
            'type',
            'category',
            'description',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        request = self.context['request']
        user = request.user

        account = attrs.get('account', getattr(self.instance, 'account', None))
        to_account = attrs.get('to_account', getattr(self.instance, 'to_account', None))
        tx_type = attrs.get('type', getattr(self.instance, 'type', None))
        category = attrs.get('category', getattr(self.instance, 'category', None))
        amount = attrs.get('amount', getattr(self.instance, 'amount', None))

        if amount is not None and amount <= 0:
            raise serializers.ValidationError('Amount must be greater than zero.')

        if account and account.user_id != user.id:
            raise serializers.ValidationError('Account does not belong to user.')
        if account and not account.is_active:
            raise serializers.ValidationError('Account is archived.')

        if to_account and to_account.user_id != user.id:
            raise serializers.ValidationError('Destination account does not belong to user.')
        if to_account and not to_account.is_active:
            raise serializers.ValidationError('Destination account is archived.')

        if tx_type == Transaction.TransactionType.TRANSFER:
            if not to_account:
                raise serializers.ValidationError('Transfer requires to_account.')
            if to_account == account:
                raise serializers.ValidationError('Transfer accounts must be different.')
            attrs['category'] = None
        else:
            if to_account is not None:
                raise serializers.ValidationError('to_account only allowed for transfers.')

        if category and category.user_id not in (None, user.id):
            raise serializers.ValidationError('Category does not belong to user.')

        return attrs

    def create(self, validated_data):
        return Transaction.objects.create(user=self.context['request'].user, **validated_data)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
