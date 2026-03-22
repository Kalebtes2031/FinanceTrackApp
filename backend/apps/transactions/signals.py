from django.db import transaction as db_transaction
from django.db.models.signals import post_save, post_delete, pre_save
from django.dispatch import receiver
from apps.categories.models import Category
from .models import Transaction
from .services import apply_transaction_create, apply_transaction_update, apply_transaction_delete

def _get_fee_category(user):
    category, _ = Category.objects.get_or_create(
        user=user,
        name='Fees',
        type='expense',
    )
    return category

@receiver(pre_save, sender=Transaction)
def capture_old_transaction(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._old_instance = Transaction.objects.get(pk=instance.pk)
        except Transaction.DoesNotExist:
            instance._old_instance = None
    else:
        instance._old_instance = None

@receiver(post_save, sender=Transaction)
def handle_transaction_save(sender, instance, created, **kwargs):
    if created:
        apply_transaction_create(instance)
    elif getattr(instance, '_old_instance', None):
        apply_transaction_update(instance._old_instance, instance)

@receiver(post_delete, sender=Transaction)
def handle_transaction_delete(sender, instance, **kwargs):
    apply_transaction_delete(instance)
