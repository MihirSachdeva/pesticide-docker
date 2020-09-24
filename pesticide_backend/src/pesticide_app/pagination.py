from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from pesticide.settings import PAGE_SIZE


class StandardResultsSetPagination(PageNumberPagination):
    page_size = PAGE_SIZE
    page_size_query_param = 'page_size'
    max_page_size = PAGE_SIZE

    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })
