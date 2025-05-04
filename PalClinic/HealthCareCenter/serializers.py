from rest_framework import serializers
from HealthCareCenter.models import HealthCareCenter


class HealthCareCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthCareCenter
        fields = ['name','centerType','centerType','address','location','phoneNumber','email','discrption']
        read_only_fields = ['created_at','updated_at']
    def validate(self, attrs):
        data = self.context['request'].data
        if HealthCareCenter.objects.filter(name = data.get("name")).exists():
            raise serializers.ValidationError("This Health Care Center is allredy exsists")
        return attrs