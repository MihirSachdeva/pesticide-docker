from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('djrichtextfield/', include('djrichtextfield.urls')),
    path('api/', include('pesticide_app.api.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('api-auth/', include('rest_framework.urls')),
    # path('rest-auth/registration/', include('rest_auth.registration.urls')),
    # path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)