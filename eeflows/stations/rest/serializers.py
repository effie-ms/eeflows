from rest_framework import serializers

from stations.models import FET, FishCoefficients, Station
from stations.utils.read_data import (
    get_low_flow_method_by_abbr,
    get_low_flow_method_freq_by_abbr,
    get_sensor_type_by_abbreviation,
)


class FishCoefficientsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FishCoefficients
        fields = ("id", "name", "winter", "summer", "spring", "autumn")
        read_only_fields = ("id", "name", "winter", "summer", "spring", "autumn")


class FETInfoSerializer(serializers.ModelSerializer):
    base_p_coefficients = FishCoefficientsSerializer(read_only=True)
    critical_p_coefficients = FishCoefficientsSerializer(read_only=True)
    subsistence_p_coefficients = FishCoefficientsSerializer(read_only=True)

    class Meta:
        model = FET
        fields = (
            "id",
            "fet_short_label",
            "fet_name",
            "base_p_coefficients",
            "critical_p_coefficients",
            "subsistence_p_coefficients",
        )
        read_only_fields = (
            "id",
            "fet_short_label",
            "fet_name",
            "base_p_coefficients",
            "critical_p_coefficients",
            "subsistence_p_coefficients",
        )


class FETSerializer(serializers.ModelSerializer):
    class Meta:
        model = FET
        fields = ("id", "fet_short_label", "fet_name")
        read_only_fields = ("id", "fet_short_label", "fet_name")


class StationSerializer(serializers.ModelSerializer):
    river_FET = FETSerializer(read_only=True)

    class Meta:
        model = Station
        fields = (
            "id",
            "name",
            "catchment_area",
            "river_FET",
            "river_body",
            "longitude",
            "latitude",
        )
        read_only_fields = (
            "id",
            "name",
            "catchment_area",
            "river_FET",
            "river_body",
            "longitude",
            "latitude",
        )


class EflowsInputSerializer(serializers.Serializer):
    """
    Serializer to check query parameters of the eflows endpoint
    """

    secondAxisType = serializers.CharField()
    secondAxisThreshold = serializers.FloatField()

    area = serializers.FloatField()
    areaFactor = serializers.FloatField()
    fetId = serializers.IntegerField()

    fillMissingEflows = serializers.BooleanField()
    fillMissingSecondAxis = serializers.BooleanField()

    fromTime = serializers.DateField(
        format="iso-8601"
    )  # year-month-day (e.g. 2020-01-01)
    toTime = serializers.DateField(
        format="iso-8601"
    )  # year-month-day (e.g. 2020-01-02)

    enableForecasting = serializers.BooleanField()

    forecastMultiStationsEflows = serializers.BooleanField()
    forecastMultiStationsSecondAxis = serializers.BooleanField()

    forecastEflowsVariable = serializers.CharField()
    forecastSecondAxisVariable = serializers.CharField()

    meanLowFlowMethod = serializers.CharField()
    meanLowFlowMethodFrequency = serializers.CharField()
    multiplyByFishCoefficients = serializers.BooleanField()

    def validate(self, attrs):
        attrs = super().validate(attrs)

        sec_axis_ts_type_abbr = attrs["secondAxisType"]
        sec_axis_ts_type = get_sensor_type_by_abbreviation(sec_axis_ts_type_abbr)
        if sec_axis_ts_type is None:
            raise serializers.ValidationError({"secondAxisType": "Unknown"})

        forecast_eflows_variable_abbr = attrs["forecastEflowsVariable"]
        forecast_eflows_variable = get_sensor_type_by_abbreviation(
            forecast_eflows_variable_abbr
        )
        if forecast_eflows_variable is None:
            raise serializers.ValidationError({"forecastEflowsVariable": "Unknown"})

        forecast_second_axis_variable_abbr = attrs["forecastSecondAxisVariable"]
        forecast_second_axis_variable = get_sensor_type_by_abbreviation(
            forecast_second_axis_variable_abbr
        )
        if forecast_second_axis_variable is None:
            raise serializers.ValidationError({"forecastSecondAxisVariable": "Unknown"})

        low_flow_method = get_low_flow_method_by_abbr(attrs["meanLowFlowMethod"])
        low_flow_method_freq = get_low_flow_method_freq_by_abbr(
            attrs["meanLowFlowMethodFrequency"]
        )

        if low_flow_method is None:
            raise serializers.ValidationError({"meanLowFlowMethod": "Unknown"})

        if low_flow_method_freq is None:
            raise serializers.ValidationError({"meanLowFlowMethodFrequency": "Unknown"})

        fet_id = attrs["fetId"]
        fet = FET.objects.filter(pk=fet_id).first()
        if not fet:
            raise serializers.ValidationError({"fetId": "Does not exist"})

        from_time = attrs["fromTime"]
        to_time = attrs["toTime"]
        if to_time < from_time:
            raise serializers.ValidationError(
                {"toTime": "toTime is earlier than fromTime"}
            )

        return attrs
