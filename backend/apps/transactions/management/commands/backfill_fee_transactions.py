from django.core.management.base import BaseCommand
from django.db import transaction
from apps.categories.models import Category
from apps.transactions.models import Transaction


class Command(BaseCommand):
    help = 'Create or update fee transactions for existing transactions with a fee value.'

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Show what would change without writing.')

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        created = 0
        updated = 0
        deleted = 0

        fee_category_cache = {}

        def get_fee_category(user):
            if user.id in fee_category_cache:
                return fee_category_cache[user.id]
            category, _ = Category.objects.get_or_create(user=user, name='Fees', type='expense')
            fee_category_cache[user.id] = category
            return category

        with transaction.atomic():
            qs = Transaction.objects.filter(is_fee=False)
            for tx in qs.iterator():
                fee_tx = Transaction.objects.filter(fee_for=tx, is_fee=True).first()

                if tx.fee and tx.fee > 0:
                    fee_category = get_fee_category(tx.user)
                    if fee_tx:
                        needs_update = fee_tx.amount != tx.fee or fee_tx.account_id != tx.account_id
                        if needs_update and not dry_run:
                            fee_tx.amount = tx.fee
                            fee_tx.account_id = tx.account_id
                            fee_tx.category = fee_category
                            fee_tx.description = f"Fee for transaction {tx.id}"
                            fee_tx.save(update_fields=['amount', 'account', 'category', 'description'])
                        if needs_update:
                            updated += 1
                    else:
                        if not dry_run:
                            Transaction.objects.create(
                                user=tx.user,
                                account=tx.account,
                                amount=tx.fee,
                                fee=0,
                                type=Transaction.TransactionType.EXPENSE,
                                category=fee_category,
                                description=f"Fee for transaction {tx.id}",
                                is_fee=True,
                                fee_for=tx,
                            )
                        created += 1
                else:
                    if fee_tx:
                        if not dry_run:
                            fee_tx.delete()
                        deleted += 1

        self.stdout.write(self.style.SUCCESS(
            f"Fee backfill done. Created: {created}, Updated: {updated}, Deleted: {deleted}."
        ))
