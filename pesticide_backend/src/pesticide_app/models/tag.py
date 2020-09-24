from django.db import models


class Tag(models.Model):
    tag_text = models.CharField(max_length=20, unique=True)
    color = models.CharField(max_length=10, default="#775ada")

    def __str__(self):
        return self.tag_text
