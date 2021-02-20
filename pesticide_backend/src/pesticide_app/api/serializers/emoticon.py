from rest_framework import serializers
from pesticide_app.models import Emoticon


class EmoticonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Emoticon
        fields = '__all__'
