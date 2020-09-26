from rest_framework import routers

from stations.rest.views import StationViewSet


router = routers.SimpleRouter(trailing_slash=False)
router.register(r"stations", StationViewSet, basename="api-stations")

urlpatterns = router.urls
