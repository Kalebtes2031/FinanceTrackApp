from django.core.management.base import BaseCommand
from django.db import transaction
from apps.accounts.models import Account
from apps.transactions.models import Transaction
from apps.transactions.services import _apply_delta


class Command(BaseCommand):
    help = 'Recalculate all account balances from transactions.'

    def handle(self, *args, **options):
        with transaction.atomic():
            accounts = Account.objects.select_for_update().all()
            account_map = {account.id: account for account in accounts}

            for account in accounts:
                account.balance = 0
                account.save(update_fields=['balance'])

            transactions = Transaction.objects.select_related('account', 'to_account').order_by('created_at')

            for tx in transactions:
                account = account_map[tx.account_id]
                to_account = account_map.get(tx.to_account_id)

                if tx.type == Transaction.TransactionType.INCOME:
                    _apply_delta(account, tx.amount, allow_negative=True)
                elif tx.type == Transaction.TransactionType.EXPENSE:
                    _apply_delta(account, -tx.amount, allow_negative=True)
                else:
                    _apply_delta(account, -tx.amount, allow_negative=True)
                    if to_account:
                        _apply_delta(to_account, tx.amount, allow_negative=True)

        self.stdout.write(self.style.SUCCESS('Balances recalculated successfully.'))
