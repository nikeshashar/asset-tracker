from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import HttpResponseRedirect
from django.urls import reverse
from .forms import AssetForm
from ..companyusers.models import CompanyUser
import logging
# Create your views here.
@login_required(login_url='/login')
def importView(response):
  return render(response, "importcsv/importcsv.html", {})

def upload_csv(request):
  asset_count = 0
  company = CompanyUser.objects.get(user=request.user.id).company
  data = {}
  if "GET" == request.method:
    return render(request, "importcsv/importcsv.html", data)
  # if not GET, then proceed
  try:
    csv_file = request.FILES["csv_file"]
    if not csv_file.name.endswith('.csv'):
      messages.error(request, "File is not CSV type")
      return HttpResponseRedirect(reverse("upload_csv"))
      #if file is too large, return
    if csv_file.multiple_chunks():
      messages.error(request, "Uploaded file is too big (%.2f MB)." % (csv_file.size/(1000*1000),))
      return HttpResponseRedirect(reverse("upload_csv"))

    file_data = csv_file.read().decode("utf-8")

    lines = file_data.split("\n")
    # removes headers from csv
    del lines[0]
  	# loop over the lines and save them in db. If error, store as string and then display
    for line in lines:
      fields = line.split(",")
      data_dict = {}
      data_dict["asset_tag"] = fields[0]
      data_dict["device_type"] = fields[1]
      data_dict["device_model"] = fields[2]
      data_dict["asset_status"] = fields[3]
      data_dict["serial_number"] = fields[4]
      data_dict["asset_condition"] = fields[5]
      data_dict["screen_size"] = fields[6]
      data_dict["hard_drive"] = fields[7]
      data_dict["ram"] = fields[8]
      data_dict["year"] = fields[9]
      data_dict["created_by"] = request.user.id
      data_dict["company"] = company

      try:
        form = AssetForm(data_dict)
        if form.is_valid():
          form.save()
          asset_count += 1
        else:
          logging.getLogger("error_logger").error(form.errors.as_json())
          messages.error(request, "Field required - unable to upload. "+form.errors.as_json())
      except Exception as e:
        logging.getLogger("error_logger").error(repr(e))
        pass

  except Exception as e:
    logging.getLogger("error_logger").error("Unable to upload file. "+repr(e))
    messages.error(request, "Unable to upload file. "+repr(e))

  messages.success(request, f'You have successfully uploaded {asset_count} assets!')
  return HttpResponseRedirect(reverse("upload_csv"))
