from django.conf.urls import include, url


urlpatterns = [
    url(r"^auth/", include("accounts.jwt.urls")),
    url(r"^user/", include("accounts.rest.urls")),
    url(r"^", include("stations.rest.api_urls")),
]
