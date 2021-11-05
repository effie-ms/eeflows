from django.core.validators import FileExtensionValidator
from django.db import models

from stations.constants import BIOPERIODS, BioPeriodType, EFlowType
from stations.utils.bioperiods import get_bioperiod_by_number


class BioPeriod(models.Model):
    name = models.CharField(max_length=255)
    January = models.IntegerField(choices=BIOPERIODS, default=1)
    February = models.IntegerField(choices=BIOPERIODS, default=1)
    March = models.IntegerField(choices=BIOPERIODS, default=2)
    April = models.IntegerField(choices=BIOPERIODS, default=2)
    May = models.IntegerField(choices=BIOPERIODS, default=2)
    June = models.IntegerField(choices=BIOPERIODS, default=2)
    July = models.IntegerField(choices=BIOPERIODS, default=3)
    August = models.IntegerField(choices=BIOPERIODS, default=3)
    September = models.IntegerField(choices=BIOPERIODS, default=3)
    October = models.IntegerField(choices=BIOPERIODS, default=4)
    November = models.IntegerField(choices=BIOPERIODS, default=4)
    December = models.IntegerField(choices=BIOPERIODS, default=4)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Bioperiods"

    def get_bioperiod_number_by_month(self, month):
        bp_month = None

        if month == 1:
            bp_month = self.January
        if month == 2:
            bp_month = self.February
        if month == 3:
            bp_month = self.March
        if month == 4:
            bp_month = self.April
        if month == 5:
            bp_month = self.May
        if month == 6:
            bp_month = self.June
        if month == 7:
            bp_month = self.July
        if month == 8:
            bp_month = self.August
        if month == 9:
            bp_month = self.September
        if month == 10:
            bp_month = self.October
        if month == 11:
            bp_month = self.November
        if month == 12:
            bp_month = self.December

        return bp_month

    def get_short_bioperiod_name_by_month(self, month):
        """
        month: int - month number
        returns: str or None - bioperiod abbreviation
        """
        bioperiod_number = self.get_bioperiod_number_by_month(month)

        if bioperiod_number == 1:
            return "OW"

        if bioperiod_number == 2:
            return "SS"

        if bioperiod_number == 3:
            return "RG"

        if bioperiod_number == 4:
            return "FS"

        return None

    def get_bioperiod_by_month(self, month):
        bp_month = self.get_bioperiod_number_by_month(month)
        if bp_month:
            return get_bioperiod_by_number(bp_month)
        return None

    def get_months_by_bioperiod(self, bioperiod):
        months = [
            month_number
            for month_number in range(1, 13)
            if self.get_bioperiod_by_month(month_number) == bioperiod
        ]
        months.sort()
        return months


class Station(models.Model):
    name = models.CharField(max_length=255)
    hydrological_data = models.FileField(
        upload_to="uploads/hydrological_data/%Y/%m/%d/",
        validators=[FileExtensionValidator(allowed_extensions=["xlsx"])],
        null=True,
    )
    watershed_area = models.FloatField(verbose_name="Watershed area in km2", default=0)
    longitude = models.FloatField(verbose_name="Longitude in degrees", default=0)
    latitude = models.FloatField(verbose_name="Latitude in degrees", default=0)
    river_body = models.CharField(max_length=255)
    bioperiods_months = models.ForeignKey(BioPeriod, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.name
