from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import User
from AccessControl.permissions import IsAdmin, IsPatient, IsDoctor, IsClinicModerator, IsHealthcareCenterModerator, IsLabModerator
from .serializer import SignUpSerializer, signInSerializer, UpdateUserSerializer, UserShortInfoSerlizer,HCModeratorCreateSerializer
from AccessControl.models import AssignClinicModerators, AssignedHealthCareCenterModerators


@api_view(['POST'])
def signUp(request):
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def signIn(request):
    serializer = signInSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data 
        refresh = RefreshToken.for_user(user)
        return Response({
            "id": user.id,
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "email": user.email,
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def signOut(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdmin])
def deleteUser(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@permission_classes([IsAdmin])
def updateUser(request, user_id):
    if request.user.role != "admin" and request.user.id != user_id:
        return Response(
            {"error": "You do not have permission to update this user."},
            status=status.HTTP_403_FORBIDDEN
        )
    if request.user.role != "admin" and "role" in request.data:
        return Response({"error": "Only admins can change roles."}, status=403)
    try:
        user = User.objects.get(id=user_id)
        serializer = UpdateUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def refresh_token(request):
    refresh_token = request.data.get('refresh')

    if not refresh_token:
        return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Decode the refresh token
        token = RefreshToken(refresh_token)

        # Generate a new access token using the refresh token
        access_token = str(token.access_token)

        return Response({
            "access": access_token,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": "Invalid refresh token."}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    serializer = UserShortInfoSerlizer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAdmin])           
def create_hc_moderator(request):
    serializer = HCModeratorCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            "message": "Moderator created",
            "email": user.email,
            "temp_password": user._plain_password
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def get_healthcarecenter_moderators(request):
    # Get all healthcarecenter_moderator users
    all_moderators = User.objects.filter(role='healthcarecenter_moderator')

    # Get IDs of moderators who are assigned and active in AssignedHealthCareCenterModerators
    assigned_active_ids = AssignedHealthCareCenterModerators.objects.filter(
        is_active=True
    ).values_list('moderator_id', flat=True)

    # Get moderators who are either not assigned at all, or assigned but only with is_active=False
    # First, get all moderators who are not assigned and active
    unassigned_moderators = all_moderators.exclude(id__in=assigned_active_ids)

    # Now, get moderators who are assigned but only with is_active=False
    assigned_inactive_ids = AssignedHealthCareCenterModerators.objects.filter(
        is_active=False
    ).values_list('moderator_id', flat=True)
    assigned_inactive_moderators = all_moderators.filter(id__in=assigned_inactive_ids)

    # Combine the two QuerySets and remove duplicates
    moderators = (unassigned_moderators | assigned_inactive_moderators).distinct()

    serializer = UserShortInfoSerlizer(moderators, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def get_clinic_moderators(request):
    all_moderators = User.objects.filter(role='clinic_moderator')
    
    assigned_active_ids = AssignClinicModerators.objects.filter(
        is_active=True
    ).values_list('moderator_id', flat=True)
    # Exclude those who are assigned and active
    unassigned_or_inactive_moderators = all_moderators.exclude(id__in=assigned_active_ids)

    serializer = UserShortInfoSerlizer(unassigned_or_inactive_moderators, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)