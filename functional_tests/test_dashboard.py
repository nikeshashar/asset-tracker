from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from django.test import LiveServerTestCase
from django.contrib.auth.models import User
from assets.models import Asset
import time

class Dashboard(LiveServerTestCase):

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

  def test_dashboard_not_viewable_when_logged_out(self):
    self.browser.get(self.live_server_url + '/dashboard')
    body = self.browser.find_element_by_tag_name('body')
    self.assertIn('Login:', body.text)

  def test_zero_asset_count(self):
    self.login()
    body = self.browser.find_element_by_tag_name('body')
    self.assertIn('Total number of assets: 0', body.text)

  def test_dashboard_showing_count_of_assets(self):
    self.A = Asset(AssetTag='BR20RL', DeviceType='laptop', CreatedBy=self.user)
    self.A.save()
    self.login()
    body = self.browser.find_element_by_tag_name('body')
    self.assertIn('Total number of assets: 1', body.text)

  def test_dashboard_showing_count_of_laptops(self):
    self.A = Asset(AssetTag='BR20RL', DeviceType='laptop', CreatedBy=self.user)
    self.A.save()
    self.login()
    body = self.browser.find_element_by_tag_name('body')
    self.assertIn('Total number of laptops: 1', body.text)
    self.assertIn('Total number of mobiles: 0', body.text)

  def test_dashboard_showing_count_of_mobiles(self):
    self.A = Asset(AssetTag='BB23A', DeviceType='mobile', CreatedBy=self.user)
    self.A.save()
    self.login()
    body = self.browser.find_element_by_tag_name('body')
    self.assertIn('Total number of laptops: 0', body.text)
    self.assertIn('Total number of mobiles: 1', body.text)

  def test_add_asset_and_count_increases(self):
    with self.settings(DEBUG=True):
      self.login()
      body = self.browser.find_element_by_tag_name('body')
      self.assertIn('Total number of assets: 0', body.text)
      self.browser.get(self.live_server_url + '/assets/add')
      time.sleep(1)
      asset_tag_field = self.browser.find_element_by_id('id_add_asset_tag')
      asset_tag_field.send_keys('HD1269')
      asset_type_field = self.browser.find_element_by_id('id_add_asset_type')
      asset_type_field.send_keys('laptop')
      asset_submit_button = self.browser.find_element_by_id('id_add_asset_submit')
      asset_submit_button.send_keys(Keys.RETURN)
      self.browser.get(self.live_server_url + '/dashboard')
      body = self.browser.find_element_by_tag_name('body')
      self.assertIn('Total number of assets: 1', body.text)
  
  def test_asset_deletes_and_count_decreases(self):
    self.A = Asset(AssetTag='BB23A', DeviceType='mobile', CreatedBy=self.user)
    self.A.save()
    self.login()
    body = self.browser.find_element_by_tag_name('body')
    self.assertIn('Total number of assets: 1', body.text)
    self.browser.get(self.live_server_url + '/assets')
    asset_delete_button = self.browser.find_element_by_id('id_asset_delete_button_' + str(self.A.id))
    asset_delete_button.send_keys(Keys.RETURN)
    self.browser.get(self.live_server_url + '/dashboard')
    body = self.browser.find_element_by_tag_name('body')
    self.assertIn('Total number of assets: 0', body.text)
