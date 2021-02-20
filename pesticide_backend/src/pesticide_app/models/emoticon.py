from django.db import models


class Emoticon(models.Model):
    emoji = models.CharField(max_length=35, unique=True)
    aria_label = models.CharField(max_length=35, unique=True)
    search_keywords = models.TextField(blank=True)

    @classmethod
    def get_default_emoticon(cls):
        emoticon, created = cls.objects.get_or_create(
            emoji=':thumbs_up:',
            defaults=dict(aria_label='thumbs_up', search_keywords='thumbs up like')
        )
        return emoticon.pk

    def __str__(self):
        if self.aria_label:
            return f':{self.emoji}: - {self.aria_label}'
        return self.emoji
