from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.MedicalProfileListCreateView.as_view(), name='medical_profile_create'),
    path('basic_info/', views.BasicInfoListCreateView.as_view(), name='basic_info_create'),
    path('surgery/<int:paitent_id>', views.SurgeryListCreateView.as_view(), name='surgery_create'),
    path('lab_test/<int:paitent_id>', views.LabTestListCreateView.as_view(), name='lab_test_create'),
    path('treatment/<int:paitent_id>', views.TreatmentListCreateView.as_view(), name='treatment_create'),
    path('doctor_note/<int:paitent_id>', views.DoctorNoteListCreateView.as_view(), name='doctor_note_create'),
    path('<paitent_id>', views.MedicalProfileDetailView.as_view(), name='medical_profile_detail'),
]
