from rest_framework import serializers
from pesticide_app.models import User
from .issue import IssueSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        read_only_fields = ('enrollment_number',
                            'current_year', 'is_master' 'is_active')
        exclude = ['access_token', 'refresh_token', 'password']


class UsersIssueTallySerializer(serializers.ModelSerializer):
    issues = IssueSerializer(source='issue_creator', many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'enrollment_number', 'name', 'issues')


class UserStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('is_active', 'is_master')


class UserLoggedInSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        read_only_fields = ('is_master', )
        fields = ('username', 'id', 'is_master')

class UserEnrollementNoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','enrollment_number', 'name','display_picture')