from rest_framework import serializers

from stations.models import Station
from stations.utils.read_data import (
    get_low_flow_method_by_abbr,
    get_low_flow_method_freq_by_abbr,
    get_sensor_type_by_abbreviation,
)


class StationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Station
        fields = (
            "id",
            "name",
            "watershed_area",
            "river_body",
            "longitude",
            "latitude",
        )
        read_only_fields = (
            "id",
            "name",
            "watershed_area",
            "river_body",
            "longitude",
            "latitude",
        )


class EflowsInputSerializer(serializers.Serializer):
    """
    Serializer to check query parameters of the eflows endpoint
    """

    secondAxisType = serializers.CharField()

    fromTime = serializers.DateField(
        format="iso-8601"
    )  # year-month-day (e.g. 2020-01-01)
    toTime = serializers.DateField(
        format="iso-8601"
    )  # year-month-day (e.g. 2020-01-02)

    meanLowFlowMethod = serializers.CharField()
    meanLowFlowMethodFrequency = serializers.CharField()

    def validate(self, attrs):
        attrs = super().validate(attrs)

        sec_axis_ts_type_abbr = attrs["secondAxisType"]
        sec_axis_ts_type = get_sensor_type_by_abbreviation(sec_axis_ts_type_abbr)
        if sec_axis_ts_type is None:
            raise serializers.ValidationError({"secondAxisType": "Unknown"})

        low_flow_method = get_low_flow_method_by_abbr(attrs["meanLowFlowMethod"])
        low_flow_method_freq = get_low_flow_method_freq_by_abbr(
            attrs["meanLowFlowMethodFrequency"]
        )

        if low_flow_method is None:
            raise serializers.ValidationError({"meanLowFlowMethod": "Unknown"})

        if low_flow_method_freq is None:
            raise serializers.ValidationError({"meanLowFlowMethodFrequency": "Unknown"})

        from_time = attrs["fromTime"]
        to_time = attrs["toTime"]
        if to_time < from_time:
            raise serializers.ValidationError(
                {"toTime": "toTime is earlier than fromTime"}
            )

        return attrs
