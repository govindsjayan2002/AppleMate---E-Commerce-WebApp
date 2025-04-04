from django.db import models

class Enquiry(models.Model):
    CATEGORY_CHOICES = [
        ('Feedback', 'Feedback'),
        ('Complaint', 'Complaint'),
        ('Inquiry', 'Inquiry'),
        ('Other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    subject = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Enquiry from {self.name} - {self.subject}"
