from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class Account(TimeStampedModel):
    class AccountType(models.TextChoices):
        BANK = 'bank', 'Bank'
        MOBILE_MONEY = 'mobile_money', 'Mobile Money'
        CASH = 'cash', 'Cash'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='accounts')
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=AccountType.choices)
    balance = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    currency = models.CharField(max_length=10, default='ETB')
    is_active = models.BooleanField(default=True)
    archived_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['type']),
            models.Index(fields=['is_active']),
        ]
        unique_together = ('user', 'name')

    def __str__(self):
        return f"{self.name} ({self.currency})"
