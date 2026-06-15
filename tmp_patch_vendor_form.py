from pathlib import Path
path = Path('src/admin/pages/Vendor/VendorList.tsx')
text = path.read_text(encoding='utf-8')
old_photo = '''                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Business Description
                            </label>
                            <textarea
                              value={vendorForm.businessDescription}
                              onChange={(e) => setVendorForm({ ...vendorForm, businessDescription: e.target.value })}
                              placeholder="Describe the vendor or business"
                              rows={4}
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Profile Photo URL
                            </label>
                            <input
                              type="text"
                              value={vendorForm.profilePhoto}
                              onChange={(e) => setVendorForm({ ...vendorForm, profilePhoto: e.target.value })}
                              placeholder="https://example.com/photo.jpg"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          {/* Hostel */}
'''
new_photo = '''                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Business Description
                            </label>
                            <textarea
                              value={vendorForm.businessDescription}
                              onChange={(e) => setVendorForm({ ...vendorForm, businessDescription: e.target.value })}
                              placeholder="Describe the vendor or business"
                              rows={4}
                              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="flex flex-col items-center gap-4 py-4 rounded-lg border border-slate-200 bg-white p-4">
                            <div className="relative w-28 h-28 rounded-full border border-slate-300 overflow-hidden bg-slate-100">
                              {vendorForm.profilePhoto ? (
                                <img
                                  src={profilePhotoPreview || undefined}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : vendorForm.previousProfilePhoto ? (
                                <img
                                  src={vendorForm.previousProfilePhoto}
                                  alt="Previous profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-500 text-sm">
                                  No Photo
                                </div>
                              )}
                            </div>
                            <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                              <span>Choose Profile Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || None
                                  setVendorForm({ ...vendorForm, profilePhoto: file });
                                }}
                                className="hidden"
                              />
                            </label>
                            {vendorForm.profilePhoto && (
                              <p className="text-sm text-slate-600">Selected: {vendorForm.profilePhoto.name}</p>
                            )}
                          </div>

                          {/* Hostel */}
'''
old_address = '''                          </div>

                          {/* Location (Google Map Link) */}
'''
new_address = '''                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Address
                            </label>
                            <input
                              type="text"
                              value={vendorForm.address}
                              onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                              placeholder="Enter address"
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          {/* Location (Google Map Link) */}
'''
for rep in range(2):
    if old_photo not in text:
        raise SystemExit(f'Profile photo block not found on iteration {rep}')
    text = text.replace(old_photo, new_photo, 1)
for rep in range(2):
    if old_address not in text:
        raise SystemExit(f'Address insertion target not found on iteration {rep}')
    text = text.replace(old_address, new_address, 1)
path.write_text(text, encoding='utf-8')
print('patched profile/photo and address insertion')
