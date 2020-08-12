from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from django.test import LiveServerTestCase
from django.contrib.auth.models import User
import time

class AddAsset(LiveServerTestCase):

  def setUp(self):
    self.browser = webdriver.Firefox()
    self.user = User.objects.create_user(username='admin1', password='admin1', email='test@test.com', is_active=True)
    self.user.save()

  def tearDown(self):
    self.browser.quit()
  
  def login(self):
    self.browser.get(self.live_server_url + '/login')
    username_field = self.browser.find_element_by_id('id_username')
    username_field.send_keys('admin1')
    password_field = self.browser.find_element_by_id('id_password')
    password_field.send_keys('admin1')
    password_field.send_keys(Keys.RETURN)
    wait = WebDriverWait(self.browser, 5)
    wait.until(EC.text_to_be_present_in_element((By.ID, "content"), 'Hello'))
  
  def test_add_asset_on_page(self):
    self.login()
    self.browser.get(self.live_server_url + '/assets/add')
    time.sleep(1)
    body = self.browser.find_element_by_tag_name('body')
    self.assertIn('Add an Asset', body.text)
  
  def test_add_asset_form_is_on_page(self):
    self.login()
    self.browser.get(self.live_server_url + '/assets/add')
    time.sleep(1)
    asset_tag_field = self.browser.find_element_by_id('id_add_asset_tag')
    asset_type_field = self.browser.find_element_by_id('id_add_asset_type')
    self.assertEquals(True, asset_tag_field.is_displayed())
    self.assertEquals(True, asset_type_field.is_displayed())
    
  def test_form_can_be_submitted_and_redirect(self):
    self.login()
    self.browser.get(self.live_server_url + '/assets/add')
    time.sleep(1)
    asset_tag_field = self.browser.find_element_by_id('id_add_asset_tag')
    asset_tag_field.send_keys('HD1269')
    asset_type_field = self.browser.find_element_by_id('id_add_asset_type')
    asset_type_field.send_keys('Laptop')
    asset_submit_button = self.browser.find_element_by_id('id_add_asset_submit')
    asset_submit_button.send_keys(Keys.RETURN)
    wait = WebDriverWait(self.browser, 5)
    wait.until(EC.text_to_be_present_in_element((By.ID, "content"), 'Your Assets'))
    body = self.browser.find_element_by_tag_name('body')
    self.assertIn('Your Assets', body.text)