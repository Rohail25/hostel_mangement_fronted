from pathlib import Path
path = Path('src/admin/pages/Vendor/VendorList.tsx')
text = path.read_text(encoding='utf-8')
text = text.replace('|| None', '|| null;')
old_attachment_block = '''                          {/* Attachments */}
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Attachments
                            </label>
                            <input
                              type="file"
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                const fileData = files.map((file) => ({
                                  name: file.name,
                                  url: URL.createObjectURL(file),
                                  uploadedAt: new Date().toISOString(),
                                }));
                                setVendorForm({ ...vendorForm, attachments: [...vendorForm.attachments, ...fileData] });
                              }}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {vendorForm.attachments.length > 0 && (
                              <div className="mt-2 space-y-1">
                                {vendorForm.attachments.map((file, idx) => (
                                  <div key={idx} className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-2 rounded">
                                    <span>{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVendorForm({
                                          ...vendorForm,
                                          attachments: vendorForm.attachments.filter((_, i) => i !== idx),
                                        });
                                      }}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <XMarkIcon className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
'''
new_attachment_block = '''                          {/* CNIC Documents */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                CNIC Front (Image)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setVendorForm({ ...vendorForm, cnicFront: e.target.files?.[0] || null })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {vendorForm.cnicFront && (
                                <p className="text-sm text-slate-600 mt-1">Selected: {vendorForm.cnicFront.name}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">
                                CNIC Back (Image)
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setVendorForm({ ...vendorForm, cnicBack: e.target.files?.[0] || null })}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {vendorForm.cnicBack && (
                                <p className="text-sm text-slate-600 mt-1">Selected: {vendorForm.cnicBack.name}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Business Card
                            </label>
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              onChange={(e) => setVendorForm({ ...vendorForm, businessCard: e.target.files?.[0] || null })}
                              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {vendorForm.businessCard && (
                              <p className="text-sm text-slate-600 mt-1">Selected: {vendorForm.businessCard.name}</p>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-sm font-medium text-slate-700">Additional Attachments</label>
                              <button
                                type="button"
                                onClick={() =>
                                  setVendorForm({
                                    ...vendorForm,
                                    additionalAttachments: [
                                      ...vendorForm.additionalAttachments,
                                      { id: `${Date.now()}`, title: '', file: null },
                                    ],
                                  })
                                }
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                + Add Attachment
                              </button>
                            </div>
                            <div className="space-y-4">
                              {vendorForm.additionalAttachments.map((attachment, idx) => (
                                <div key={attachment.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
                                    <input
                                      type="text"
                                      value={attachment.title}
                                      onChange={(e) => {
                                        const next = [...vendorForm.additionalAttachments];
                                        next[idx] = { ...next[idx], title: e.target.value };
                                        setVendorForm({ ...vendorForm, additionalAttachments: next });
                                      }}
                                      placeholder="Attachment title"
                                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">File</label>
                                    <input
                                      type="file"
                                      onChange={(e) => {
                                        const next = [...vendorForm.additionalAttachments];
                                        next[idx] = { ...next[idx], file: e.target.files?.[0] || null };
                                        setVendorForm({ ...vendorForm, additionalAttachments: next });
                                      }}
                                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {attachment.file && (
                                      <p className="text-sm text-slate-600 mt-1">Selected: {attachment.file.name}</p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setVendorForm({
                                          ...vendorForm,
                                          additionalAttachments: vendorForm.additionalAttachments.filter((_, i) => i !== idx),
                                        });
                                      }}
                                      className="text-sm text-red-600 hover:text-red-800"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
'''
count = text.count(old_attachment_block)
if count == 0:
    raise SystemExit('old_attachment_block not found')
text = text.replace(old_attachment_block, new_attachment_block, 2)
path.write_text(text, encoding='utf-8')
print('patched attachments block', count)
