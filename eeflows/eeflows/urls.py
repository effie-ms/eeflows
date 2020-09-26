from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic.base import RedirectView

from rest_framework_swagger.views import get_swagger_view


schema_view = get_swagger_view(title="EEFlows API schema")

admin.autodiscover()

urlpatterns = [
    url(r"^api/", include("eeflows.rest.urls")),
    url(r"^adminpanel/", admin.site.urls),
    url(r"^api/eeflows-api-schema/$", schema_view, name="openapi-schema"),
]

if settings.SWAGGER_ENABLED:
    swagger_view = get_swagger_view(title="EEFlows API")

    urlpatterns = urlpatterns + [
        url(
            r"^api/eeflows-api-documentation/$",
            swagger_view,
            name="openapi-documentation",
        ),
    ]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

if not settings.DEBUG:
    handler500 = "eeflows.views.server_error"
    handler404 = "eeflows.views.page_not_found"

if settings.DEBUG:
    try:
        import debug_toolbar

        urlpatterns += [url(r"^__debug__/", include(debug_toolbar.urls))]
    except ImportError:
        pass


urlpatterns += [
    url(
        r"^$",
        RedirectView.as_view(url=settings.SITE_URL, permanent=False),
        name="app-redirect",
    )
]
