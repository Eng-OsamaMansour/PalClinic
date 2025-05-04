from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['email', 'name', 'password', 'confirm_password', 'phoneNumber']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['confirm_password'] :
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        if len(data['name']) > 50 :
            raise serializers.ValidationError({"name": "Name is too long."})
        if len(data['phoneNumber']) > 15 :
            raise serializers.ValidationError({"phoneNumber": "Phone number is too long."})
        if '@' not in data['email'] or '.' not in data['email'] or len(data['email']) > 50:
            raise serializers.ValidationError({"email": "Email is not valid."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')  
        return User.objects.create_user(**validated_data)

class signInSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'name', 'role', 'phoneNumber']
        extra_kwargs = {
            'email': {'required': False},
            'name': {'required': False},
            'role': {'required': False},
            'phoneNumber': {'required': False},
        }

class UserShortInfoSerlizer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","name"]
