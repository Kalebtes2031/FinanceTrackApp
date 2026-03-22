from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('type', 'amount', 'account', 'to_account', 'user', 'created_at')
    list_filter = ('type',)
    search_fields = ('description', 'user__username')