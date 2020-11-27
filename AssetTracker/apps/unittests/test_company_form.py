from django.test import TestCase
from ..register.forms import CompanyRegisterForm

class CompanyForm(TestCase):

  def test_company_form_label(self):
    form = CompanyRegisterForm()
    self.assertTrue(form.fields['name'].label == 'Company Name')
