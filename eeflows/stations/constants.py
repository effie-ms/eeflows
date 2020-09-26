from enum import Enum


class MeasurementType(Enum):
    MIN = "Minimum"
    MAX = "Maximum"
    AVG = "Average"
    ALL = "All"


class SensorType(Enum):
    WaterTemperature = "Water Temperature"
    WaterLevel = "Water Level"
    Discharge = "Discharge"


class MeanLowFlowMethod(Enum):
    Tennant30 = "Tennant 30% mean"
    Tennant20 = "Tennant 20% mean"
    ExceedanceProbability95 = "Exceedance Probability 95%"
    ExceedanceProbability75 = "Exceedance Probability 75%"


class MeanLowFlowMethodFrequency(Enum):
    LongTerm = "Long-term"
    Seasonal = "Seasonal"
    Bioperiodical = "Bioperiodical"
    Monthly = "Monthly"


MONTHS = [
    (1, "January"),
    (2, "February"),
    (3, "March"),
    (4, "April"),
    (5, "May"),
    (6, "June"),
    (7, "July"),
    (8, "August"),
    (9, "September"),
    (10, "October"),
    (11, "November"),
    (12, "December"),
]


SUMMER_MONTHS = [
    (5, "May"),
    (6, "June"),
    (7, "July"),
    (8, "August"),
    (9, "September"),
]


WINTER_MONTHS = [
    (1, "January"),
    (2, "February"),
    (3, "March"),
    (4, "April"),
    (10, "October"),
    (11, "November"),
    (12, "December"),
]


class BioPeriodType(Enum):
    SPRING_SPAWNING = "Spring Spawning"
    REARING = "Rearing and Growth"
    FALL_SPAWNING = "Fall Spawning"
    OVERWINTERING = "Overwintering"


BIOPERIODS = [
    (1, BioPeriodType.OVERWINTERING.value),
    (2, BioPeriodType.SPRING_SPAWNING.value),
    (3, BioPeriodType.REARING.value),
    (4, BioPeriodType.FALL_SPAWNING.value),
]


class EFlowType(Enum):
    Low = "Mean low flow"
    Base = "Base eflow"
    Subsistence = "Subsistence eflow"
    Critical = "Critical eflow"
