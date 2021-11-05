from django.contrib import admin

from stations.models import BioPeriod, Station


admin.site.register(Station)
admin.site.register(BioPeriod)
