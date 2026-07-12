import os
import re

def create_page(source_file, target_file, topbar_title, form_title, fields, save_btn_text):
    with open(source_file, 'r') as f:
        content = f.read()
    
    # Extract everything before main-content
    prefix = content.split('<div class="main-content">')[0]
    
    # Generate the form
    fields_html = ""
    for label, placeholder in fields:
        fields_html += f"""
            <div class="form-group" style="margin-bottom:14px">
              <label class="form-label">{label}</label>
              <input class="form-input" type="text" placeholder="{placeholder}">
            </div>"""
    
    main_content = f"""<div class="main-content">
  <div class="topbar">
    <div class="topbar-left">
      <div class="page-title">{topbar_title}</div>
    </div>
    <div class="topbar-right">
      <button class="btn btn-primary" onclick="window.location.href='15-action-success.html'">{save_btn_text}</button>
    </div>
  </div>
  <div class="page-body">
    <div class="card" style="max-width:600px;margin:0 auto">
      <div class="card-header"><div class="card-title">{form_title}</div></div>
      <div class="card-body">
        {fields_html}
        <div style="margin-top:20px">
          <button class="btn btn-primary" style="width:100%" onclick="window.location.href='15-action-success.html'">{save_btn_text}</button>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>"""

    with open(target_file, 'w') as f:
        f.write(prefix + main_content)


create_page('03-vehicle-registry.html', '10-add-vehicle.html', 'Add Vehicle', 'Vehicle Details', [
    ('Registration Number', 'e.g. GJ-01-AB-1234'),
    ('Make & Model', 'e.g. Tata Prima'),
    ('Capacity', 'e.g. 10 Tons')
], 'Save Vehicle')

create_page('04-drivers.html', '11-add-driver.html', 'Add Driver', 'Driver Details', [
    ('Full Name', 'e.g. John Doe'),
    ('License Number', 'e.g. GJ-1234567890'),
    ('Contact Number', 'e.g. +91 9876543210')
], 'Save Driver')

create_page('05-trip-dispatcher.html', '12-new-trip.html', 'New Trip', 'Trip Details', [
    ('Route', 'e.g. Mumbai - Delhi'),
    ('Assigned Vehicle', 'e.g. Truck-01'),
    ('Assigned Driver', 'e.g. Raven K.')
], 'Dispatch Trip')

create_page('06-maintenance.html', '13-add-maintenance.html', 'Add Maintenance Record', 'Maintenance Details', [
    ('Vehicle ID', 'e.g. Truck-01'),
    ('Service Type', 'e.g. Oil Change'),
    ('Cost', 'e.g. 5000')
], 'Save Record')

create_page('07-fuel-expenses.html', '14-add-expense.html', 'Add Fuel / Expense', 'Expense Details', [
    ('Vehicle ID', 'e.g. Truck-01'),
    ('Amount (Liters / Cost)', 'e.g. 50 Liters'),
    ('Receipt Number', 'e.g. REC-9923')
], 'Save Expense')

# Create success page
with open('02-dashboard.html', 'r') as f:
    content = f.read()
prefix = content.split('<div class="main-content">')[0]

success_main = """<div class="main-content">
  <div class="page-body" style="display:flex;align-items:center;justify-content:center;height:100%">
    <div class="card" style="max-width:400px;text-align:center;padding:40px">
      <div style="width:60px;height:60px;background:#ecfdf5;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style="margin-bottom:10px;font-size:20px;color:#0f172a">Action Successful</h2>
      <p style="color:#64748b;font-size:14px;margin-bottom:24px">Your changes have been saved successfully.</p>
      <button class="btn btn-primary" onclick="window.history.back()">Go Back</button>
      <button class="btn btn-ghost" onclick="window.location.href='02-dashboard.html'">Go to Dashboard</button>
    </div>
  </div>
</div>
</body>
</html>"""

with open('15-action-success.html', 'w') as f:
    f.write(prefix + success_main)
