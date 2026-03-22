from decimal import Decimal
from django.conf import settings
from django.db import transaction as db_transaction
from django.core.exceptions import ValidationError
from apps.accounts.models import Account
from .models import Transaction


def _apply_delta(account, delta, allow_negative):
    account.balance = account.balance + delta
    if not allow_negative and account.balance < 0:
        raise ValidationError('Negative balances are not allowed.')
    account.save(update_fields=['balance'])


def apply_transaction_create(tx: Transaction):
    allow_negative = settings.ALLOW_NEGATIVE_BALANCES
    with db_transaction.atomic():
        accounts = Account.objects.select_for_update().filter(
            id__in=[a for a in [tx.account_id, tx.to_account_id] if a]
        )
        accounts_by_id = {a.id: a for a in accounts}
        account = accounts_by_id[tx.account_id]
        to_account = accounts_by_id.get(tx.to_account_id)

        if tx.type == Transaction.TransactionType.INCOME:
            _apply_delta(account, tx.amount - tx.fee, allow_negative)
        elif tx.type == Transaction.TransactionType.EXPENSE:
            _apply_delta(account, -(tx.amount + tx.fee), allow_negative)
        else:
            _apply_delta(account, -(tx.amount + tx.fee), allow_negative)
            _apply_delta(to_account, tx.amount, allow_negative)


def apply_transaction_update(old_tx: Transaction, new_tx: Transaction):
    allow_negative = settings.ALLOW_NEGATIVE_BALANCES
    with db_transaction.atomic():
        account_ids = {old_tx.account_id, old_tx.to_account_id, new_tx.account_id, new_tx.to_account_id}
        account_ids = [a for a in account_ids if a]
        accounts = Account.objects.select_for_update().filter(id__in=account_ids)
        accounts_by_id = {a.id: a for a in accounts}

        def get_account(account_id):
            return accounts_by_id[account_id]

        def get_to_account(account_id):
            return accounts_by_id.get(account_id)

        def reverse(tx: Transaction):
            account = get_account(tx.account_id)
            to_account = get_to_account(tx.to_account_id)
            if tx.type == Transaction.TransactionType.INCOME:
                _apply_delta(account, -(tx.amount - tx.fee), allow_negative)
            elif tx.type == Transaction.TransactionType.EXPENSE:
                _apply_delta(account, (tx.amount + tx.fee), allow_negative)
            else:
                _apply_delta(account, (tx.amount + tx.fee), allow_negative)
                _apply_delta(to_account, -tx.amount, allow_negative)

        def apply(tx: Transaction):
            account = get_account(tx.account_id)
            to_account = get_to_account(tx.to_account_id)
            if tx.type == Transaction.TransactionType.INCOME:
                _apply_delta(account, tx.amount - tx.fee, allow_negative)
            elif tx.type == Transaction.TransactionType.EXPENSE:
                _apply_delta(account, -(tx.amount + tx.fee), allow_negative)
            else:
                _apply_delta(account, -(tx.amount + tx.fee), allow_negative)
                _apply_delta(to_account, tx.amount, allow_negative)

        reverse(old_tx)
        apply(new_tx)


def apply_transaction_delete(tx: Transaction):
    allow_negative = settings.ALLOW_NEGATIVE_BALANCES
    with db_transaction.atomic():
        accounts = Account.objects.select_for_update().filter(
            id__in=[a for a in [tx.account_id, tx.to_account_id] if a]
        )
        accounts_by_id = {a.id: a for a in accounts}
        account = accounts_by_id[tx.account_id]
        to_account = accounts_by_id.get(tx.to_account_id)

        if tx.type == Transaction.TransactionType.INCOME:
            _apply_delta(account, -(tx.amount - tx.fee), allow_negative)
        elif tx.type == Transaction.TransactionType.EXPENSE:
            _apply_delta(account, (tx.amount + tx.fee), allow_negative)
        else:
            _apply_delta(account, (tx.amount + tx.fee), allow_negative)
            _apply_delta(to_account, -tx.amount, allow_negative)
