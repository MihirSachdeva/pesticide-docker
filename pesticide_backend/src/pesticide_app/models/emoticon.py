from django.db import models


class Emoticon(models.Model):
    emoji = models.CharField(max_length=1)
    aria_label = model.CharField(max_length=15, blank=True)
    search_keywords = models.TextField(blank=True)

    def __str__(self):
        if self.aria_label:
            return f'{self.emoji} - {self.aria_label}'
        return self.emoji
