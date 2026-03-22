from django.db.models import DecimalField, Sum, Value
from django.db.models.functions import Coalesce
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.accounts.models import Account
from apps.transactions.models import Transaction
from .serializers import DashboardAccountSerializer, DashboardTransactionSerializer, SpendingByCategorySerializer


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        accounts = Account.objects.filter(user=request.user, is_active=True)
        total_balance = accounts.aggregate(
            total=Coalesce(Sum('balance'), Value(0, output_field=DecimalField(max_digits=14, decimal_places=2)))
        )['total']

        balance_per_account = DashboardAccountSerializer(accounts, many=True).data

        recent_transactions_qs = (
            Transaction.objects.filter(user=request.user)
            .select_related('account', 'to_account', 'category')
            .order_by('-created_at')[:10]
        )
        recent_transactions = DashboardTransactionSerializer(recent_transactions_qs, many=True).data

        spending_qs = (
            Transaction.objects.filter(user=request.user, type=Transaction.TransactionType.EXPENSE)
            .values(category_name=Coalesce('category__name', Value('Uncategorized')))
            .annotate(
                total=Coalesce(
                    Sum('amount'),
                    Value(0, output_field=DecimalField(max_digits=14, decimal_places=2)),
                )
            )
            .order_by('-total')
        )
        spending_by_category = SpendingByCategorySerializer(spending_qs, many=True).data

        # Add virtual "Fees" category from aggregated transaction fees
        total_fees = Transaction.objects.filter(user=request.user).aggregate(
            total=Coalesce(Sum('fee'), Value(0, output_field=DecimalField(max_digits=14, decimal_places=2)))
        )['total']
        
        if total_fees > 0:
            spending_by_category.append({
                'category_name': 'Fees',
                'total': total_fees
            })

        return Response(
            {
                'total_balance': total_balance,
                'balance_per_account': balance_per_account,
                'recent_transactions': recent_transactions,
                'spending_by_category': spending_by_category,
            }
        )
