from django.forms import ValidationError
from rest_framework import serializers

from Users.serializer import UserShortInfoSerlizer
from .models import *
from Users.models import User

class DoctorAccessRequstSerlizer(serializers.ModelSerializer):
    doctor = UserShortInfoSerlizer(read_only = True)
    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = DoctorAccessRequest
        fields = ['id','doctor','patient','status', 'is_active', 'created_at']
        read_only_fields = [ 'created_at']
    def validate(self, attrs):
        request = self.context.get('request')
        doctor = request.user
        patient_id = self.context.get('view').kwargs.get('patient_id')

        if DoctorAccessRequest.objects.filter(doctor=doctor, patient_id=patient_id).exists():
            raise ValidationError("An access request from this doctor to this patient already exists.")

        return attrs

class UpdateActiveOrStatusSerlizer(serializers.ModelSerializer):
    class Meta:
        modle = DoctorAccessRequest
        fileds = ['status','is_active']

class AssignedHealthCareCenterModeratorsSerlizer(serializers.ModelSerializer):
    class Meta:
        model = AssignedHealthCareCenterModerators
        fields = ['moderator','healthcarecenter','is_active']
        read_only_fields = ['created_at']
    def validate(self, attrs):
        healthcarecenter = self.context.get('request').data.get('healthcarecenter')
        if AssignedHealthCareCenterModerators.objects.filter(healthcarecenter=healthcarecenter, is_active=True).exists():
            raise serializers.ValidationError("This Health Center Already Has A Moderator")
        return attrs
    



class AssignClinicModeratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignClinicModerators
        fields = ['moderator','clinic','is_active']
        read_only_fields = ['created_at']
    def validate(self, attrs):
        clinic = self.context.get('request').data.get('clinic')
        if AssignClinicModerators.objects.filter(clinic = clinic).exists():
            raise ValidationError("this clinic is already has a moderator")
        return attrs


class AssignClinicToHealthCenterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignClinicToHealthCenter
        fields = ['health','clinic','is_active']
        read_only_fields = ['created_at']
    def validate(self, attrs):
        request = self.context.get('request')
        if request.method == 'POST':
            clinic = self.context.get('request').data.get('clinic')
            health = self.context.get('request').data.get('health')
            if not HealthCareCenter.objects.filter(id = clinic).exists():
                raise ValidationError("The Clinic Does Not exist")
            if not Clinic.objects.filter(id = health).exists():
                raise ValidationError("The HealthCenter Does Not exists")
            if AssignClinicToHealthCenter.objects.filter(clinic = clinic,).exists():
                raise ValidationError("The Clinic is Already Assigned to health care center")
            elif request.method == 'PATCH':
                if not AssignClinicToHealthCenter.objects.filter(id = self.context.get('request').kwargs.get('pk')).exists():
                    raise ValidationError("The relation does not exisit")
        return attrs


class AssignDoctorToClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssignDoctorToClinic
        fields = ['id','doctor','clinic','is_active']
        read_only_fields = ['created_at']
    def validate(self, attrs):
        request = self.context.get('request')
        if request.method == 'POST':
            doctor = User.objects.get(id =self.context.get('request').data.get('doctor'))
            clinic = Clinic.objects.get(id = self.context.get('request').data.get('clinic'))
            if AssignDoctorToClinic.objects.filter(doctor = doctor,clinic=clinic).exists():
                raise ValidationError("this doctor is allready assigned to this clinic")
        return attrs

