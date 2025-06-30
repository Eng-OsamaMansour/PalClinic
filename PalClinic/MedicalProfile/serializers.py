
from django.utils import timezone
from rest_framework import serializers
from Users.models import User
from Users.serializer import UserShortInfoSerlizer
from .models import (
    MedicalProfile,
    BasicInfo,
    Surgery,
    LabTest,
    Treatment,
    DoctorNote
)


class MedicalProfileSerializer(serializers.ModelSerializer):
    patient = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = MedicalProfile
        fields = ['patient', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
    def validate(self, attrs):
        request = self.context.get('request')
        patient = request.user
        if MedicalProfile.objects.filter(patient = patient).exists():
            raise serializers.ValidationError({"detail": "The profile already exists."})
        return attrs
    
class BasicInfoSerializer(serializers.ModelSerializer):
    medical_profile = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = BasicInfo
        fields = ['medical_profile', 'age', 'gender', 'height', 'weight', 'blood_type', 'allergies', 'chronic_conditions', 'created_at']
        read_only_fields = ['created_at']
    def validate(self, attrs):
        user = self.context['request'].user
        medical_profile_qs = MedicalProfile.objects.filter(patient=user)
        if not medical_profile_qs.exists():
            raise serializers.ValidationError({"detail": "The Medical Profile does not exist."})
        medical_profile = medical_profile_qs.first()
        if BasicInfo.objects.filter(medical_profile=medical_profile).exists():
            raise serializers.ValidationError({"detail": "The Basic Info already exists."})
        return attrs


class SurgerySerializer(serializers.ModelSerializer):
    medical_profile = serializers.PrimaryKeyRelatedField(read_only=True)
    doctor = UserShortInfoSerlizer(read_only=True)
    class Meta:
        model = Surgery
        fields = ['medical_profile', 'doctor', 'surgery_type', 'description', 'report', 'surgery_date', 'created_at']
        read_only_fields = ['created_at']
    def validate(self, attrs):
        patient = User.objects.get(id = self.context['view'].kwargs['paitent_id'])
        medicalprofile = MedicalProfile.objects.filter(patient = patient)
        if not medicalprofile.exists():
            raise serializers.ValidationError({"detail":"the medical profile does not exist"})
        return attrs
    


class LabTestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabTest
        fields = ['medical_profile', 'name', 'description', 'results', 'date', 'created_at']
        read_only_fields = ['created_at']
    def validate(self, attrs):
        patient = User.objects.get(id = self.context['view'].kwargs['paitent_id'])
        medicalprofile = MedicalProfile.objects.filter(patient = patient)
        if not medicalprofile.exists():
            raise serializers.ValidationError({"detail":"the medical profile does not exist"})
        return attrs

class TreatmentSerializer(serializers.ModelSerializer):
    doctor = UserShortInfoSerlizer(read_only=True)

    class Meta:
        model = Treatment
        fields = [
            'medical_profile', 'doctor', 'treatment', 'dosage', 'description',
            'start_date', 'end_date', 'created_at', 'active'
        ]
        read_only_fields = ['created_at', 'active']

    def validate(self, data):
        start_date = data.get('start_date')
        end_date   = data.get('end_date')
        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError(
                "End date cannot be before start date."
            )
        if end_date and end_date < timezone.localdate():
            raise serializers.ValidationError(
                "End date cannot be in the past."
            )

        return data
    
class DoctorNoteSerializer(serializers.ModelSerializer):
    doctor = UserShortInfoSerlizer(read_only = True)
    class Meta:
        model = DoctorNote
        fields = ['medical_profile', 'doctor', 'title', 'note', 'created_at']
        read_only_fields = ['created_at']




class MedicalProfileDetailSerializer(serializers.ModelSerializer):
    patient = UserShortInfoSerlizer(read_only=True)
    basic_info = BasicInfoSerializer(read_only=True)
    surgeries = SurgerySerializer(many=True, read_only=True)
    lab_tests = LabTestSerializer(many=True, read_only=True)
    treatments = TreatmentSerializer(many=True, read_only=True)
    doctor_notes = DoctorNoteSerializer(many=True, read_only=True)

    class Meta:
        model = MedicalProfile
        fields = [
            'patient',
            'created_at',
            'updated_at',
            'basic_info',
            'surgeries',
            'lab_tests',
            'treatments',
            'doctor_notes'
        ]