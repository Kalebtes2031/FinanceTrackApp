from django.conf import settings
from django.db import models
from core.models import TimeStampedModel


class Category(TimeStampedModel):
    class CategoryType(models.TextChoices):
        INCOME = 'income', 'Income'
        EXPENSE = 'expense', 'Expense'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='categories',
        null=True,
        blank=True,
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=CategoryType.choices)

    class Meta:
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['type']),
        ]
        unique_together = ('user', 'name', 'type')

    def __str__(self):
        return f"{self.name} ({self.type})"