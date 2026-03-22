from django.contrib import admin
from .models import Account


@admin.register(Account)
class AccountAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'currency', 'balance', 'user', 'created_at')
    list_filter = ('type', 'currency')
    search_fields = ('name', 'user__username')