from rest_framework.permissions import BasePermission,SAFE_METHODS
from AccessControl.models import DoctorAccessRequest,AssignedHealthCareCenterModerators,AssignClinicModerators
from MedicalProfile.models import DoctorNote
from Users.models import User
from HealthCareCenter.models import HealthCareCenter
from Clinic.models import Clinic


# Used
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

# Used     
class IsPatient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'patient'

# Used
class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'
    
class IsClinicModerator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'clinic_moderator'

class IsHealthcareCenterModerator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'healthcarecenter_moderator'
    
class IsLabModerator(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'lab_moderator'

class IsDoctorUser(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'doctor'

# Used
class IsOwner(BasePermission):
    def has_permission(self, request, view):
        patient_id = view.kwargs.get('patient_id')
        if patient_id:
            return str(request.user.id) == str(patient_id)
        return True 

    def has_object_permission(self, request, view, obj):
        return obj.patient == request.user

def is_allowed_doctor(doctor, patient):
    return DoctorAccessRequest.objects.filter(patient=patient, doctor=doctor,status='accepted', is_active=True).exists()

# Used
class IsAllowedDoctor(BasePermission):
    def has_permission(self, request, view):
        patient = User.objects.get(id=view.kwargs['paitent_id'])
        doctor = request.user
        return is_allowed_doctor(doctor,patient)
# Used
class IsOwnerOrAllowedDoctor(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.role != 'doctor' and user.role != 'patient':
            return False
        patient = User.objects.get(id=view.kwargs['paitent_id'])
        return is_allowed_doctor(user, patient) or user == patient


class CanEditDoctorNote(BasePermission):
    def has_object_permission(self, request, view, obj: DoctorNote):
        return request.method in SAFE_METHODS or obj.doctor == request.user


def is_assigned_moderator(healthcarecenter ,moderator):
    return AssignedHealthCareCenterModerators.objects.filter(healthcarecenter = healthcarecenter,moderator=moderator,is_active = True).exists()
class IsHealthAllawoedModeratorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.role == 'admin':
            return True        
        elif user.role == 'healthcarecenter_moderator':
            healthcarecenter_id = view.kwargs.get('pk')  
            if not healthcarecenter_id:
                return False
            try:
                healthcarecenter = HealthCareCenter.objects.get(id=healthcarecenter_id)
            except HealthCareCenter.DoesNotExist:
                return False
            return is_assigned_moderator(healthcarecenter, user)  
        return False
 
def is_assigned_clinic_moderator(clinic,moderator):
    return AssignClinicModerators.objects.filter(moderator=moderator,clinic=clinic,is_active=True).exists()
class IsClinicAllowedModeratorOrAdmin(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        print(user.role)
        if user.role == 'admin':
            return True
        elif user.role == 'clinic_moderator':
            clinic_id = view.kwargs.get('pk')
            if not clinic_id:
                return False
            try:
                clinic = Clinic.objects.get(id=clinic_id)
            except Clinic.DoesNotExist:
                return False
            return is_assigned_clinic_moderator(clinic,user)
        return False
    
            