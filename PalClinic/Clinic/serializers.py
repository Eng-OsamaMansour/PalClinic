from rest_framework import serializers
from .models import Clinic

class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ['id','name','clinictype','address','phoneNumber','email','location','specialties','operating_hours']
        read_only_fields = ['created_at']
    def validate(self, attrs):
        data = self.context['request'].data
        if Clinic.objects.filter(name = data.get('name')).exists():
            raise ValueError({'detail':'this clinic is alredy exisits'})
        return attrs