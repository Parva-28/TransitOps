import re
import os

files_to_update = {
    '02-dashboard.html': [
        ('<button class="btn btn-ghost btn-sm">', '<button class="btn btn-ghost btn-sm" onclick="window.location.href=\'15-action-success.html\'">'),
        ('<button class="btn btn-ghost btn-sm" style="margin-left:8px">', '<button class="btn btn-ghost btn-sm" style="margin-left:8px" onclick="window.location.href=\'15-action-success.html\'">')
    ],
    '03-vehicle-registry.html': [
        ('<button class="btn btn-primary">', '<button class="btn btn-primary" onclick="window.location.href=\'10-add-vehicle.html\'">'),
        ('<button class="btn btn-ghost btn-sm">', '<button class="btn btn-ghost btn-sm" onclick="window.location.href=\'15-action-success.html\'">')
    ],
    '04-drivers.html': [
        ('<button class="btn btn-primary">', '<button class="btn btn-primary" onclick="window.location.href=\'11-add-driver.html\'">'),
        ('<button class="btn btn-ghost btn-sm">', '<button class="btn btn-ghost btn-sm" onclick="window.location.href=\'15-action-success.html\'">')
    ],
    '05-trip-dispatcher.html': [
        ('<button class="btn btn-primary">', '<button class="btn btn-primary" onclick="window.location.href=\'12-new-trip.html\'">'),
        ('<button class="btn btn-primary" style="flex:1;background:#f1f5f9;color:#475569;box-shadow:none;background:transparent;border:1px solid #e2e8f0">', '<button class="btn btn-primary" style="flex:1;background:#f1f5f9;color:#475569;box-shadow:none;background:transparent;border:1px solid #e2e8f0" onclick="window.location.href=\'15-action-success.html\'">')
    ],
    '06-maintenance.html': [
        ('<button class="btn btn-primary" style="margin-top:4px">', '<button class="btn btn-primary" style="margin-top:4px" onclick="window.location.href=\'13-add-maintenance.html\'">'),
        ('<button class="btn btn-ghost btn-sm">', '<button class="btn btn-ghost btn-sm" onclick="window.location.href=\'15-action-success.html\'">')
    ],
    '07-fuel-expenses.html': [
        ('<button class="btn btn-primary">', '<button class="btn btn-primary" onclick="window.location.href=\'14-add-expense.html\'">'),
        ('<button class="btn btn-ghost btn-sm">', '<button class="btn btn-ghost btn-sm" onclick="window.location.href=\'15-action-success.html\'">')
    ],
    '08-analytics.html': [
        ('<button class="btn btn-ghost btn-sm">', '<button class="btn btn-ghost btn-sm" onclick="window.location.href=\'15-action-success.html\'">'),
        ('<button class="btn btn-primary">', '<button class="btn btn-primary" onclick="window.location.href=\'15-action-success.html\'">')
    ],
    '09-settings.html': [
        ('<button class="btn btn-primary">', '<button class="btn btn-primary" onclick="window.location.href=\'15-action-success.html\'">'),
        ('<button class="btn btn-primary" style="width:100%">', '<button class="btn btn-primary" style="width:100%" onclick="window.location.href=\'15-action-success.html\'">')
    ]
}

for filename, replacements in files_to_update.items():
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            content = f.read()
        
        for old_str, new_str in replacements:
            content = content.replace(old_str, new_str)
            
        with open(filename, 'w') as f:
            f.write(content)
            
print("Links updated")
