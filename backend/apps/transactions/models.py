from django.conf import settings
from django.db import models
from core.models import TimeStampedModel
from apps.accounts.models import Account
from apps.categories.models import Category


class Transaction(TimeStampedModel):
    class TransactionType(models.TextChoices):
        INCOME = 'income', 'Income'
        EXPENSE = 'expense', 'Expense'
        TRANSFER = 'transfer', 'Transfer'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    account = models.ForeignKey(Account, on_delete=models.PROTECT, related_name='transactions')
    to_account = models.ForeignKey(
        Account,
        on_delete=models.PROTECT,
        related_name='incoming_transfers',
        null=True,
        blank=True,
    )
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    type = models.CharField(max_length=20, choices=TransactionType.choices)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.CharField(max_length=255, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['account']),
            models.Index(fields=['type']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.type} {self.amount}"