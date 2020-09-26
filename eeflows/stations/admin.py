from django.contrib import admin

from stations.models import BioPeriod, FET, FishCoefficients, Station


admin.site.register(Station)
admin.site.register(FishCoefficients)
admin.site.register(BioPeriod)
admin.site.register(FET)
