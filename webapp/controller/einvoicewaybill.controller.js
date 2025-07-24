sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/ui/thirdparty/jquery",
		"sap/base/Log",
		"sap/ui/Device",
		"sap/m/MessageBox",
		"sap/ui/core/Fragment",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/base/util/deepExtend",
		"sap/m/Token",
	],
	(
		Controller,
		JSONModel,
		jQuery,
		Log,
		Device,
		MessageBox,
		Fragment,
		Filter,
		FilterOperator,
		deepExtend,
		Token
	) => {
		"use strict";
		var tData = [],
			kData = [],
			bdata = [],
			mData = [],
			Cdata = [];
		var mFilters = [];
		var aFilters = [];
		var itemData = [];
		const STATECODE = [
			{ CountryRegionKey: "IN", Region: "AN", ITDStateCode: "35", Description: "ANDAMAN AND NICOBAR" },
			{ CountryRegionKey: "IN", Region: "AP", ITDStateCode: "37", Description: "ANDHRA PRADESH" },
			{ CountryRegionKey: "IN", Region: "AR", ITDStateCode: "12", Description: "ARUNACHAL PRADESH" },
			{ CountryRegionKey: "IN", Region: "AS", ITDStateCode: "18", Description: "ASSAM" },
			{ CountryRegionKey: "IN", Region: "BR", ITDStateCode: "10", Description: "BIHAR" },
			{ CountryRegionKey: "IN", Region: "CG", ITDStateCode: "22", Description: "CHHATTISGARH" },
			{ CountryRegionKey: "IN", Region: "CH", ITDStateCode: "04", Description: "CHANDIGARH" },
			{ CountryRegionKey: "IN", Region: "DH", ITDStateCode: "26", Description: "DADRA AND NAGAR HAVELI" },
			{ CountryRegionKey: "IN", Region: "DL", ITDStateCode: "07", Description: "DELHI" },
			{ CountryRegionKey: "IN", Region: "GA", ITDStateCode: "30", Description: "GOA" },
			{ CountryRegionKey: "IN", Region: "GJ", ITDStateCode: "24", Description: "GUJARAT" },
			{ CountryRegionKey: "IN", Region: "HP", ITDStateCode: "02", Description: "HIMACHAL PRADESH" },
			{ CountryRegionKey: "IN", Region: "HR", ITDStateCode: "06", Description: "HARYANA" },
			{ CountryRegionKey: "IN", Region: "JH", ITDStateCode: "20", Description: "JHARKHAND" },
			{ CountryRegionKey: "IN", Region: "JK", ITDStateCode: "01", Description: "JAMMU AND KASHMIR" },
			{ CountryRegionKey: "IN", Region: "KA", ITDStateCode: "29", Description: "KARNATAKA" },
			{ CountryRegionKey: "IN", Region: "KL", ITDStateCode: "32", Description: "KERALA" },
			{ CountryRegionKey: "IN", Region: "LA", ITDStateCode: "38", Description: "LADAKH" },
			{ CountryRegionKey: "IN", Region: "LD", ITDStateCode: "31", Description: "LAKSHADWEEP" },
			{ CountryRegionKey: "IN", Region: "MH", ITDStateCode: "27", Description: "MAHARASHTRA" },
			{ CountryRegionKey: "IN", Region: "ML", ITDStateCode: "17", Description: "MEGHALAYA" },
			{ CountryRegionKey: "IN", Region: "MN", ITDStateCode: "14", Description: "MANIPUR" },
			{ CountryRegionKey: "IN", Region: "MP", ITDStateCode: "23", Description: "MADHYA PRADESH" },
			{ CountryRegionKey: "IN", Region: "MZ", ITDStateCode: "15", Description: "MIZORAM" },
			{ CountryRegionKey: "IN", Region: "NL", ITDStateCode: "13", Description: "NAGALAND" },
			{ CountryRegionKey: "IN", Region: "OD", ITDStateCode: "21", Description: "ODISHA" },
			{ CountryRegionKey: "IN", Region: "PB", ITDStateCode: "03", Description: "PUNJAB" },
			{ CountryRegionKey: "IN", Region: "PY", ITDStateCode: "34", Description: "PUDUCHERRY" },
			{ CountryRegionKey: "IN", Region: "RJ", ITDStateCode: "08", Description: "RAJASTHAN" },
			{ CountryRegionKey: "IN", Region: "SK", ITDStateCode: "11", Description: "SIKKIM" },
			{ CountryRegionKey: "IN", Region: "TN", ITDStateCode: "33", Description: "TAMIL NADU" },
			{ CountryRegionKey: "IN", Region: "TR", ITDStateCode: "16", Description: "TRIPURA" },
			{ CountryRegionKey: "IN", Region: "TS", ITDStateCode: "36", Description: "TELANGANA" },
			{ CountryRegionKey: "IN", Region: "UK", ITDStateCode: "05", Description: "UTTARAKHAND" },
			{ CountryRegionKey: "IN", Region: "UP", ITDStateCode: "09", Description: "UTTAR PRADESH" },
			{ CountryRegionKey: "IN", Region: "WB", ITDStateCode: "19", Description: "WEST BENGAL" }
		];


		return Controller.extend("einvoiceewaybill.controller.einvoicewaybill", {
			onInit: function () {
				var that = this;
				var oLocalModel = that.getView().getModel("LocalModel");
				if (!oLocalModel) {
					oLocalModel = new sap.ui.model.json.JSONModel({ pdfEntries: [] });
					that.getView().setModel(oLocalModel, "LocalModel");
				}
				var oDeviceModel = new JSONModel(Device);
				oDeviceModel.setDefaultBindingMode("OneWay");
				that.getView().setModel(oDeviceModel, "device");
				var obj = {
					BillingDocFrom: "",
					BillingDocTo: "",
					BillingType: "",
				};
				var obj1 = {};
				var oModel = new JSONModel(obj);
				that.getView().setModel(oModel, "localModel");
				var oModel = new JSONModel(obj1);
				that.getView().setModel(oModel, "EWBModel");
				var oModel = new JSONModel(obj1);
				that.getView().setModel(oModel, "EinvoiceModel");
				that.contentTable();
				var billtype = this.getView().byId("idBillingType");
				var companycode = this.getView().byId("idcompanycode");
				var plant = this.getView().byId("idplant");
				var fnValidator = function (args) {
					var text = args.text;
					return new Token({ key: text, text: text });
				};
				billtype.addValidator(fnValidator);
				companycode.addValidator(fnValidator);
				plant.addValidator(fnValidator);

				$.getScript(
					"https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
				)
					.done(function (script, textStatus) {
						console.log("XLSX library loaded successfully");
					})
					.fail(function (jqxhr, settings, exception) {
						console.error("Failed to load XLSX library");
					});
				var that = this;
				that._calltempleate(that, "E_Invoice_E_Way_Bill").then(function (data) {
					that._printTemplate = data;
				});
			},
			// formatDateToDDMMYYYY: function(date) {
			// 	if (!date) return "";
			// 	const d = new Date(date);
			// 	const day = String(d.getDate()).padStart(2, '0');
			// 	const month = String(d.getMonth() + 1).padStart(2, '0');
			// 	const year = d.getFullYear();
			// 	return `${day}/${month}/${year}`;
			// },

			contentTable: function () {
				var that = this;
				var aListItems = [
					{ title: "Total Number of Doc", number: "" },
					{ title: "Not Processed Doc.", number: "" },
					{ title: "eInvoice Generated", number: "" },
					{ title: "eInvoice Cancelled", number: "" },
					{ title: "eWay Bill Generated", number: "" },
					{ title: "eWay Bill Cancelled", number: "" },
					{ title: "Success", number: "" },
					{ title: "Errors", number: "" },
					{ title: "Cancelled", number: "" },
				];
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({ listData: aListItems });
				that.getView().setModel(oModel);
			},
			//----------------------------------------------------------------------------- billing type value help ---------------------------------------------------------------------------------//
			_onBillTypeValueHelpRequest: function (oEvent) {
				var that = this;
				var aFilters = [];
				var BillDocFrom = that.getView().byId("idBillingDocFrom").getValue();
				var BillDocTo = that.getView().byId("idBillingDocTo").getValue();
				var BillFromDate = that.getView().byId("idFromDate").getValue();
				var BillToDate = that.getView().byId("idToDate").getValue();
				if (BillDocFrom && BillDocTo) {
					aFilters.push(
						new Filter(
							"BillingDocument",
							FilterOperator.BT,
							BillDocFrom,
							BillDocTo
						)
					);
				} else if (BillDocFrom) {
					aFilters.push(
						new Filter("BillingDocument", FilterOperator.EQ, BillDocFrom)
					);
				} else if (BillDocTo) {
					aFilters.push(
						new Filter("BillingDocument", FilterOperator.EQ, BillDocTo)
					);
				}
				if (BillFromDate && BillToDate) {
					aFilters.push(
						new Filter(
							"BillingDocumentDate",
							FilterOperator.BT,
							new Date(BillFromDate),
							new Date(BillToDate)
						)
					);
				} else if (BillFromDate) {
					aFilters.push(
						new Filter(
							"BillingDocumentDate",
							FilterOperator.EQ,
							new Date(BillFromDate)
						)
					);
				} else if (BillToDate) {
					aFilters.push(
						new Filter(
							"BillingDocumentDate",
							FilterOperator.EQ,
							new Date(BillToDate)
						)
					);
				}
				// else {
				// 	sap.m.MessageBox.error("Please Select Date");
				// 	return;
				// }
				var BillingType = "S1";
				if (BillingType) {
					aFilters.push(
						new Filter("BillingDocumentType", FilterOperator.NE, BillingType)
					);
				}
				if (!this._BillTypeDialog) {
					this._BillTypeDialog = sap.ui.xmlfragment(
						"einvoiceewaybill.view.BillingTypeValueHelp",
						this
					);
					this.getView().addDependent(this._BillTypeDialog);
				}
				this._BillTypeDialog.open();
				this._BillTypeDialog.setBusy(true);
				this.getView()
					.getModel("mainService")
					.read("/YY1_EinvoiceDocs", {
						filters: aFilters,
						success: function (oData, oResponse) {
							var uniqueBillTypes = [];
							var billTypeMap = {};
							oData.results.forEach(function (item) {
								if (!billTypeMap[item.BillingDocumentType]) {
									billTypeMap[item.BillingDocumentType] = true;
									uniqueBillTypes.push(item);
								}
							});
							var oModel = new sap.ui.model.json.JSONModel({
								results: uniqueBillTypes,
							});
							that.getView().setModel(oModel, "BillTypeDataModel");
							that._BillTypeDialog.setBusy(false);
						},
						error: function (err) {
							sap.m.MessageToast.show(
								JSON.parse(err.responseText).error.message.value
							);
							that._BillTypeDialog.setBusy(false);
						},
					});
			},

			_onBillTypeValueHelpConfirm: function (oEvent) {
				var aSelectedItems = oEvent.getParameter("selectedItems");
				var oInput = this.byId("idBillingType");
				if (aSelectedItems && aSelectedItems.length > 0) {
					aSelectedItems.forEach(function (oItem) {
						oInput.addToken(
							new Token({
								text: oItem.getTitle(),
							})
						);
					});
				}
			},

			_onBillTypeSearch: function (oEvent) {
				// var sValue = oEvent.getParameter("value").toLowerCase();
				// var oData = this.getView().getModel("BillTypeDataModel").getData().results;
				// var aFilteredData = oData.filter(function (item) {
				// 	return item.BillingDocumentType.toLowerCase().includes(sValue);
				// });
				// var oModel = new JSONModel();
				// oModel.setData({ results: aFilteredData });
				// this.getView().setModel(oModel, "BillTypeDataModel");
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter(
					"BillingDocumentType",
					sap.ui.model.FilterOperator.Contains,
					sValue
				);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
			//----------------------------------------------------------------------------- company code value help ----------------------------------------------------------------------------------//
			_oncompanycodeValueHelpRequest: function () {
				var that = this;
				this._Dialog = sap.ui.xmlfragment(
					"einvoiceewaybill.view.companycodevaluehelp",
					this
				);
				this.getView().addDependent(this._Dialog);
				this._Dialog.open();
				this._Dialog.setBusy(true);
				this.getView()
					.getModel("mainService")
					.read("/YY1_EinvoiceDocs", {
						success: function (oData, oResponse) {
							var uniqueMIC = {},
								arr = [];

							for (var i = 0; i < oData.results.length; i++) {
								var obj = {
									CompanyCode: oData.results[i].CompanyCode,
								};

								var sMIC = oData.results[i].CompanyCode;
								if (!uniqueMIC[sMIC]) {
									uniqueMIC[sMIC] = true;
									arr.push(obj);
								}
							}
							var oModel = new sap.ui.model.json.JSONModel(oData);
							that.getView().setModel(oModel, "OwnerModel");
							that
								.getView()
								.getModel("OwnerModel")
								.setProperty("/results", arr);
							that._Dialog.setBusy(false);
						},
						error: function (err) {
							MessageToast.error(
								JSON.parse(err.responseText).error.message.value
							);
							that._Dialog.setBusy(false);
						},
					});
			},

			_oncompanycodeValueHelpConfirm: function (oEvent) {
				var aSelectedItems = oEvent.getParameter("selectedItems");
				var oInput = this.byId("idcompanycode");
				if (aSelectedItems && aSelectedItems.length > 0) {
					aSelectedItems.forEach(function (oItem) {
						oInput.addToken(
							new Token({
								text: oItem.getTitle(),
							})
						);
					});
				}
				// var oSelectedItem = oEvent.getParameter("selectedItem");
				// var oList = this.getView().getModel("OwnerModel").getData().results;

				// // oEvent.getSource().getBinding("items").filter([]);
				// if (!oSelectedItem) {
				// 	return;
				// }
				// this.getView().getModel("localModel").setProperty("/companycode", oSelectedItem.getTitle());
			},

			_oncompanycodeSearch: function (oEvent) {
				// var sValue = oEvent.getParameter("value");
				// var oData = this.getView().getModel("OwnerModel").getData().results;
				// var aFilteredData = oData.filter(function (item) {
				// 	return item.CompanyCode.includes(sValue);
				// });
				// var oModel = new JSONModel();
				// oModel.setData({ results: aFilteredData });
				// this.getView().setModel(oModel, "OwnerModel");
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter(
					"CompanyCode",
					sap.ui.model.FilterOperator.Contains,
					sValue
				);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},
			//--------------------------------------------------------------------------------- plant value help -----------------------------------------------------------------------------------------//
			_onplantValueHelpRequest: function () {
				var that = this;
				this._Dialog = sap.ui.xmlfragment(
					"einvoiceewaybill.view.plantvaluehelp",
					this
				);
				this.getView().addDependent(this._Dialog);
				this._Dialog.open();
				this._Dialog.setBusy(true);
				this.getView()
					.getModel("mainService")
					.read("/YY1_EinvoiceDocs", {
						success: function (oData, oResponse) {
							var uniqueMIC = {},
								arr = [];

							for (var i = 0; i < oData.results.length; i++) {
								var obj = {
									Plant: oData.results[i].Plant,
									PlantName: oData.results[i].PlantName,
								};

								var sMIC = oData.results[i].Plant;
								if (!uniqueMIC[sMIC]) {
									uniqueMIC[sMIC] = true;
									arr.push(obj);
								}
							}
							var oModel = new sap.ui.model.json.JSONModel(oData);
							that.getView().setModel(oModel, "plantModel");
							that
								.getView()
								.getModel("plantModel")
								.setProperty("/results", arr);
							that._Dialog.setBusy(false);
						},
						error: function (err) {
							MessageToast.error(
								JSON.parse(err.responseText).error.message.value
							);
							that._Dialog.setBusy(false);
						},
					});
			},

			_onplantValueHelpConfirm: function (oEvent) {
				var aSelectedItems = oEvent.getParameter("selectedItems");
				var oInput = this.byId("idplant");
				if (aSelectedItems && aSelectedItems.length > 0) {
					aSelectedItems.forEach(function (oItem) {
						oInput.addToken(
							new Token({
								text: oItem.getTitle(),
							})
						);
					});
				}
				// var oSelectedItem = oEvent.getParameter("selectedItem");
				// var oList = this.getView().getModel("OwnerModel").getData().results;

				// // oEvent.getSource().getBinding("items").filter([]);
				// if (!oSelectedItem) {
				// 	return;
				// }
				// this.getView().getModel("localModel").setProperty("/companycode", oSelectedItem.getTitle());
			},

			_onplantSearch: function (oEvent) {
				// var sValue = oEvent.getParameter("value");
				// var oData = this.getView().getModel("plantModel").getData().results;
				// var aFilteredData = oData.filter(function (item) {
				// 	return item.Plant.includes(sValue);
				// });
				// var oModel = new JSONModel();
				// oModel.setData({ results: aFilteredData });
				// this.getView().setModel(oModel, "plantModel");
				var sValue = oEvent.getParameter("value");
				var oFilter = new sap.ui.model.Filter(
					"Plant",
					sap.ui.model.FilterOperator.Contains,
					sValue
				);
				oEvent.getSource().getBinding("items").filter([oFilter]);
			},

			onBillTypeChange: function (oEvent) {
				var oMultiInput = oEvent.getSource();
				var sValue = oEvent.getParameter("value");
				var aNewBillTypeTokens = sValue
					.split(",")
					.map(function (billType) {
						return billType.trim();
					})
					.filter(function (billType) {
						return billType !== "";
					});
				var existingTokens = oMultiInput.getTokens().map(function (token) {
					return token.getKey();
				});
				aNewBillTypeTokens.forEach(function (billType) {
					if (existingTokens.indexOf(billType) === -1) {
						var oToken = new sap.m.Token({ key: billType, text: billType });
						oMultiInput.addToken(oToken);
						existingTokens.push(billType);
					}
				});
				oMultiInput.setValue("");
			},
			//--------------------------------------------------------------------------------- filter ---------------------------------------------------------------------------------------------------//
			setFilters: function (aProperty, aTokens) {
				for (var i = 0; i < aTokens.length; i++) {
					aFilters.push(
						new sap.ui.model.Filter(
							aProperty,
							sap.ui.model.FilterOperator.EQ,
							aTokens[i].getText()
						)
					);
				}
			},
			//----------------------------------------------------------------------------------Fetch the data ---------------------------------------------------------------------------------------//
			onExecute: function () {
				var that = this;
				tData = [];
				kData = [];
				bdata = [];
				mData = [];
				var ccfilter = [];
				mFilters = [];
				aFilters = [];
				itemData = [];
				var oFilter = [];
				var aFilter = [];
				var itemfilter = [];
				var adobefilter = [];
				// var uniqueKeys = new Set();
				var BillFromDate = that.getView().byId("idFromDate").getValue();
				var BillToDate = that.getView().byId("idToDate").getValue();
				var BillDocFrom = that.getView().byId("idBillingDocFrom").getValue();
				var BillDocTo = that.getView().byId("idBillingDocTo").getValue();
				var DocumnetrefFrom = that.getView().byId("idDocrefFrom").getValue();
				var DocumnetrefTo = that.getView().byId("idDocrefto").getValue();
				var AccountDocFrom = that.getView().byId("idaccdocFrom").getValue();
				var AccountDocTo = that.getView().byId("idaccdocto").getValue();
				var billingtype = this.getView().byId("idBillingType").getTokens();
				var companycode = this.getView().byId("idcompanycode").getTokens();
				var plant = this.getView().byId("idplant").getTokens();

				if (BillFromDate || BillToDate) {
					if (BillFromDate && BillToDate) {
						aFilters.push(
							new Filter("BillingDocumentDate", FilterOperator.BT, that.convertDate(BillFromDate), that.convertDate(BillToDate))
						);
					} else if (BillFromDate) {
						aFilters.push(new Filter("BillingDocumentDate", FilterOperator.EQ, that.convertDate(BillFromDate)));
					} else if (BillToDate) {
						aFilters.push(
							new Filter(
								"BillingDocumentDate",
								FilterOperator.EQ,
								that.convertDate(BillToDate)
							)
						);
					}

					if (BillDocFrom && BillDocTo) {
						aFilters.push(
							new Filter(
								"BillingDocument",
								FilterOperator.BT,
								BillDocFrom,
								BillDocTo
							)
						);
					} else if (BillDocFrom) {
						aFilters.push(
							new Filter("BillingDocument", FilterOperator.EQ, BillDocFrom)
						);
					} else if (BillDocTo) {
						aFilters.push(
							new Filter("BillingDocument", FilterOperator.EQ, BillDocTo)
						);
					}
					if (DocumnetrefFrom && DocumnetrefTo) {
						aFilters.push(
							new Filter(
								"DocumentReferenceID",
								FilterOperator.BT,
								DocumnetrefFrom,
								DocumnetrefTo
							)
						);
					} else if (DocumnetrefFrom) {
						aFilters.push(
							new Filter(
								"DocumentReferenceID",
								FilterOperator.EQ,
								DocumnetrefFrom
							)
						);
					} else if (DocumnetrefTo) {
						aFilters.push(
							new Filter(
								"DocumentReferenceID",
								FilterOperator.EQ,
								DocumnetrefTo
							)
						);
					}
					if (AccountDocFrom && AccountDocTo) {
						aFilters.push(
							new Filter(
								"AccountingDocument",
								FilterOperator.BT,
								AccountDocFrom,
								AccountDocTo
							)
						);
					} else if (AccountDocFrom) {
						aFilters.push(
							new Filter(
								"AccountingDocument",
								FilterOperator.EQ,
								AccountDocFrom
							)
						);
					} else if (AccountDocTo) {
						aFilters.push(
							new Filter("AccountingDocument", FilterOperator.EQ, AccountDocTo)
						);
					}
					if (billingtype) {
						this.setFilters("BillingDocumentType", billingtype);
					}
					if (companycode) {
						this.setFilters("CompanyCode", companycode);
					}
					if (plant) {
						this.setFilters("Plant", plant);
					}
					aFilters.push(
						new Filter("BillingDocumentType", FilterOperator.NE, "S1")
					);
					aFilters.push(
						new Filter("BillingDocumentType", FilterOperator.NE, "S2")
					);
				} else {
					MessageBox.error("Please Select Date");
					return;
				}

				that.getView().setBusy(true);
				that
					.getView()
					.getModel("mainService")
					.read("/YY1_EinvoiceDocs", {
						filters: aFilters,
						success: function (oData) {
							console.log("///odata", oData);
							if (oData.results.length === 0) {
								MessageBox.error("Data not found!");
								that.getView().setBusy(false);
								return;
							}
							for (var i = 0; i < oData.results.length; i++) {
								var item = oData.results[i];
								// oFilter.push(
								// 	new Filter("CompanyCode", FilterOperator.EQ, item.CompanyCode)
								// );
								// oFilter.push(
								// 	new Filter("Plant", FilterOperator.EQ, item.Plant)
								// );
								// aFilter.push(
								// 	new Filter(
								// 		"UnitQuantityCode",
								// 		FilterOperator.EQ,
								// 		item.BillingQuantityUnit
								// 	)
								// );
								ccfilter.push(
									new Filter("PlantGSTIN", FilterOperator.EQ, item.PlantGSTIN)
								);

								mFilters.push(
									new Filter(
										"BillingDocument",
										FilterOperator.EQ,
										item.BillingDocument
									)
								);
								mFilters.push(
									new Filter("CompanyCode", FilterOperator.EQ, item.CompanyCode)
								);
								mFilters.push(
									new Filter(
										"BillingDate",
										FilterOperator.EQ,
										item.BillingDocumentDate
									)
								);

								itemfilter.push(
									new Filter(
										"BillingDocument",
										FilterOperator.EQ,
										item.BillingDocument
									)
								);
								itemfilter.push(
									new Filter(
										"BillingDocumentItem",
										FilterOperator.EQ,
										item.BillingDocumentItem
									)
								);

								adobefilter.push(
									new Filter(
										"BillingDocument",
										FilterOperator.EQ,
										item.BillingDocument
									)
								);
								adobefilter.push(
									new Filter(
										"BillingDocumentItem",
										FilterOperator.EQ,
										item.BillingDocumentItem
									)
								);
								adobefilter.push(
									new Filter(
										"BillingDocumentDate",
										FilterOperator.EQ,
										item.BillingDocumentDate
									)
								);

								//   var obj = {
								// 	Status: "",
								// 	DocumentStatus: "",
								// 	CreationDate: item.CreationDate,
								// 	CreatedOn: item.CreationTime,
								// 	CreatedBy: item.CreatedByUser,
								// 	BillingDocument: item.BillingDocument,
								// 	PostingDate: item.PostingDate,
								// 	DocumentNumber: item.DocumentReferenceID,
								// 	Accountingdocument: item.AccountingDocument,
								// 	CompanyCode: item.CompanyCode,
								// 	Plant: item.Plant,
								// 	SalesOrganization: item.SalesOrganization,
								// 	BillingType: item.BillingDocumentType,
								// 	InvoiceRefNum: item.IRN,
								// 	AcknowledgementNum: item.AcknowledgementNo,
								// 	AcknowledgementDate: item.AcknowledgementDate,
								// 	Messages: "",
								// 	AcknowledgementTime: item.AcknowledgementTime,
								// 	CancelledDate: item.EinvoiceCancellationDate,
								// 	CancelledTime: item.EinvoiceCancellationTime,
								// 	eWayBillCreationDate: item.EwayBillValidFromDate,
								// 	eWayBillCreationTime: item.EwayBillValidFromTime,
								// 	ValidTodate: item.EwayBillValidToDate,
								// 	ValidTotime: item.EwayBillValidToTime,
								// 	ValidFromdate: item.EwayBillValidFromDate,
								// 	ValidFromtime: item.EwayBillValidFromTime,
								// 	eWayBillStatus: item.CancelEwayBill,
								// 	CancellationCodeEWB: item.EWayCancelReasonCode,
								// 	EWBCancelRemark: item.EWayCancellationRemark,
								// 	EWBCancelDate: item.EWayCancelDate,
								// 	EWayCancelTime: item.EWayCancelTime,
								// 	TransportID: item.TransporterGSTIN,
								// 	TransportDocNum: item.TransportDocNo,
								// 	TransportDocDate: item.TransportDocDate,
								// 	VehicleNum: item.VehicleNo,
								// 	VehicleType: item.VehicleType,
								// 	ModeOfTransport: item.ModeofTransport,
								// 	TransporterName: item.TransporterName,
								// 	TransporterGSTIN: item.TransporterGSTIN,
								// 	BillingDocumentItem: parseFloat(item.BillingDocumentItem)
								// 	  .toString()
								// 	  .padStart(2, "0"),
								// 	BillingDocumentItemText: item.BillingDocumentItemText,
								// 	BillingQuantity: item.BillingQuantity,
								// 	BillingQuantityUnit: item.BillingQuantityUnit,
								// 	NetAmount: item.NetAmount,
								// 	TransactionCurrency: item.TransactionCurrency,
								// 	GrossAmount: item.GrossAmount,
								// 	TaxAmount: item.TaxAmount,
								// 	PriceDetnExchangeRate: item.PriceDetnExchangeRate,
								// 	ReferenceSDDocument: item.ReferenceSDDocument,
								// 	SalesDocument: item.SalesDocument,
								// 	DistributionChannel: item.DistributionChannel,
								// 	Division: item.Division,
								// 	BillingDocumentDate: item.BillingDocumentDate,
								// 	TotalNetAmount: item.TotalNetAmount,
								// 	TotalTaxAmount: item.TotalTaxAmount,
								// 	TransactionCurrency_1: item.TransactionCurrency_1,
								// 	DocumentReferenceID: item.DocumentReferenceID,
								// 	ConditionAmount: item.ConditionAmount,
								// 	ConditionRateValue: item.ConditionRateValue,
								// 	JOIGRate: item.JOIGRate,
								// 	JOIGAmount: item.JOIGAmount,
								// 	JOCGRate: item.JOCGRate,
								// 	JOCGAmount: item.JOCGAmount,
								// 	JOSGRate: item.JOSGRate,
								// 	JOSGAmount: item.JOSGAmount,
								// 	ConditionRateValue_4: item.ConditionRateValue_4,
								// 	ConditionAmount_4: item.ConditionAmount_4,
								// 	EinvoiceCateogry: item.SupType,
								// 	DocType: item.DocType,
								// 	BusinessPartner: item.BusinessPartner,
								// 	CityName_1: item.CityName_1,
								// 	DistrictName: item.DistrictName,
								// 	StreetName_1: item.StreetName_1,
								// 	PostalCode_1: item.PostalCode_1,
								// 	StreetPrefixName1_1: item.StreetPrefixName1_1,
								// 	StreetPrefixName2_1: item.StreetPrefixName2_1,
								// 	Region_1: item.Region_1,
								// 	BillToPartyCountry: item.BillToPartyCountry,
								// 	CustomerName: item.CustomerName,
								// 	CustomerName_1: item.CustomerName_1,
								// 	Customer: item.Customer,
								// 	CityName_2: item.CityName_2,
								// 	DistrictName_1: item.DistrictName_1,
								// 	StreetName_2: item.StreetName_2,
								// 	PostalCode_2: item.PostalCode_2,
								// 	StreetPrefixName1_2: item.StreetPrefixName1_2,
								// 	ShipToPartyStreet: item.ShipToPartyStreet,
								// 	Region_2: item.Region_2,
								// 	ShipToPartyCountry: item.ShipToPartyCountry,
								// 	TaxNumber3_1: item.TaxNumber3_1,
								// 	TaxNumber3: item.TaxNumber3,
								// 	PlantName: item.PlantName,
								// 	CompanyName: item.CompanyName,
								// 	StreetName: item.StreetName,
								// 	StreetPrefixName1: item.StreetPrefixName1,
								// 	StreetPrefixName2: item.StreetPrefixName2,
								// 	CityName: item.CityName,
								// 	Region: item.Region,
								// 	PostalCode: item.PostalCode,
								// 	Country: item.Country,
								// 	EmailAddress: item.EmailAddress,
								// 	PhoneAreaCodeSubscriberNumb_1:
								// 	  item.PhoneAreaCodeSubscriberNumb_1,
								// 	PhoneAreaCodeSubscriberNumber:
								// 	  item.PhoneAreaCodeSubscriberNumber,
								// 	ConsumptionTaxCtrlCode: item.ConsumptionTaxCtrlCode,
								// 	PurchaseOrderByCustomer: item.PurchaseOrderByCustomer,
								// 	CustomerPurchaseOrderDate: item.CustomerPurchaseOrderDate,
								// 	DistrictName_2: item.DistrictName_2,
								// 	FiscalYear: item.FiscalYear,
								// 	PlantGSTIN: item.PlantGSTIN,
								// 	EinvoiceUnitQuantityCode: item.EinvoiceUnitQuantityCode,
								// 	ProfitCenter: item.ProfitCenter,
								// 	Plant_1: item.Plant_1,
								// 	AccountingExchangeRate: item.AccountingExchangeRate,
								// 	DepartureCountry: item.DepartureCountry,
								// 	ConditionRateValue_5: item.ConditionRateValue_5,
								// 	ConditionAmount_5: item.ConditionAmount_5,
								// 	ConditionRateValue_6: item.ConditionRateValue_6,
								// 	JTC2Amount: item.JTC2Amount,
								// 	ConditionRateValue_7: item.ConditionRateValue_7,
								// 	ConditionAmount_7: item.ConditionAmount_7,
								// 	ConditionRateValue_8: item.ConditionRateValue_8,
								// 	ConditionAmount_8: item.ConditionAmount_8,
								// 	EWayBill: item.EWayBill,
								// 	EInvoiceReasonCode: item.EInvoiceReasonCode,
								// 	TransporterID: item.TransporterID,
								// 	PortCode: item.PortCode,
								// 	PortName: item.PortName,
								// 	PortAddress1: item.PortAddress1,
								// 	PortAddress2: item.PortAddress2,
								// 	PortCity: item.PortCity,
								// 	PortPostalCode: item.PortPostalCode,
								// 	PortRegionCode: item.PortRegionCode,
								// 	PortCountry: item.PortCountry,
								// 	SalesDocumentItemCategory: item.SalesDocumentItemCategory,
								// 	TransportDistanceinKM: item.TransportDistanceinKM,
								// 	QRCode1: item.QRCode1,
								// 	QRCode2: item.QRCode2,
								// 	EInvoiceReasonCode: item.EInvoiceReasonCode,
								// 	EinvoiceCancellationRemark: item.EinvoiceCancellationRemark,
								// 	CancelEinvoice: item.CancelEinvoice,
								// 	PricingProcedure: item.SDPricingProcedure, // add vikas
								// 	FPA1Amount: item.FPA1Amount,
								// 	ZLB1Amount: item.ZLB1Amount,
								// 	ZFREAmount: item.ZFREAmount,
								// 	ZFRCAmount: item.ZFRCAmount,
								// 	ZHSSRate: item.ZHSSRate,
								// 	ZHSSAmount: item.ZHSSAmount,
								// 	EXPCAT: item.EXPCAT,
								// 	MaterialByCustomer: item.MaterialByCustomer,
								// 	MaterialSalesText: item.MaterialSalesText,
								// 	BTPHouseNumber: item.BTPHouseNumber,
								// 	STPHouseNumber: item.STPHouseNumber,
								// 	BTPOrganizationBPName3: item.BTPOrganizationBPName3,
								// 	BTPOrganizationBPName2: item.BTPOrganizationBPName2,
								// 	BTPOrganizationBPName1: item.BTPOrganizationBPName1,
								// 	BTPOrganizationBPName4: item.BTPOrganizationBPName4,
								// 	SHPOrganizationBPName3: item.SHPOrganizationBPName3,
								// 	SHPOrganizationBPName2: item.SHPOrganizationBPName2,
								// 	SHPOrganizationBPName1: item.SHPOrganizationBPName1,
								// 	SHPOrganizationBPName4: item.SHPOrganizationBPName4,
								// 	YY1_UnloadingPoint_SDH: item.YY1_UnloadingPoint_SDH,
								// 	CustomerTaxClassification: item.CustomerTaxClassification,
								//   };
								tData.push(item);
							}
							that.companycode(ccfilter)
							// that.onExecute1();
							// that.onfetchplantgstin(oFilter, aFilter, itemfilter, adobefilter);
						},
						error: function () {
							MessageBox.error("Error fetching eDocument data");
							that.getView().setBusy(false);
						},
					});
			},
			//----------------------------------------------------------------------------------- Fetch the plantgstin -------------------------------------------------------------------------------//
			onfetchplantgstin: function (oFilter, aFilter, itemfilter, adobefilter) {
				var that = this;
				var ccfilter = [];
				that.getView().setBusy(true);
				that
					.getView()
					.getModel("mainService")
					.read("/YY1_EinvoiceDocs", {
						filters: oFilter,
						success: function (oData) {
							if (oData.results.length === 0) {
								MessageBox.error("PlantGSTIN not found!");
								that.getView().setBusy(false);
								return;
							}
							// Create a lookup map for quick access
							var plantGstinMap = {};
							oData.results.forEach((record) => {
								var key = record.Plant + "_" + record.CompanyCode; // Unique key based on Plant & CompanyCode
								plantGstinMap[key] = record.GSTIN;
							});

							// Update tData based on matching Plant & CompanyCode
							tData.forEach((item) => {
								var key = item.Plant + "_" + item.CompanyCode;
								if (plantGstinMap[key]) {
									item.PlantGSTIN = plantGstinMap[key]; // Assign GSTIN if match found
									ccfilter.push(
										new Filter("PlantGSTIN", FilterOperator.EQ, item.PlantGSTIN)
									);
								} else {
									item.PlantGSTIN = ""; // Default if no match
								}
							});

							console.log("Updated tData with plantgstin:", tData);
							that.EinvIndiaItemPricing(itemfilter, adobefilter, ccfilter);
							// that.onfetchunitcode(aFilter, itemfilter, adobefilter, ccfilter);
						},
						error: function () {
							MessageBox.error("Error fetching eDocument data");
							that.getView().setBusy(false);
						},
					});
			},
			//-------------------------------------------------------------------------------------Fetch unitcode -------------------------------------------------------------------------------------//
			// onfetchunitcode: function (aFilter, itemfilter, adobefilter, ccfilter) {
			//   var that = this;
			//   that.getView().setBusy(true);
			//   that
			// 	.getView()
			// 	.getModel("mainService")
			// 	.read("/YY1_EinvoiceDocs", {
			// 	  filters: aFilter,
			// 	  success: function (oData) {
			// 		if (oData.results.length === 0) {
			// 		  MessageBox.error("Unitecode not found!");
			// 		  that.getView().setBusy(false);
			// 		  return;
			// 		}
			// 		// Create a lookup map for quick access
			// 		var unitCodeMap = {};
			// 		oData.results.forEach((record) => {
			// 		  unitCodeMap[record.UnitQuantityCode] =
			// 			record.EinvoiceUnitQuantityCode;
			// 		});

			// 		// Update tData based on matching UnitQuantityCode
			// 		tData.forEach((item) => {
			// 		  if (unitCodeMap[item.BillingQuantityUnit]) {
			// 			item.EinvoiceUnitQuantityCode =
			// 			  unitCodeMap[item.BillingQuantityUnit];
			// 		  } else {
			// 			item.EinvoiceUnitQuantityCode = ""; // Default if no match
			// 		  }
			// 		});

			// 		console.log("Updated tData with unit code:", tData);
			// 		that.EinvIndiaItemPricing(itemfilter, adobefilter, ccfilter);
			// 	  },
			// 	  error: function () {
			// 		MessageBox.error("Error fetching eDocument data");
			// 		that.getView().setBusy(false);
			// 	  },
			// 	});
			// },
			//------------------------------------------------------------------------------------------- fetching item pricing------------------------------------------------------------------------------------//
			EinvIndiaItemPricing(itemfilter, adobefilter, ccfilter) {
				var that = this;
				itemData = [];
				that.getView().setBusy(true);
				var omModel = that.getView().getModel("mainService");

				omModel.read("/YY1_EinvoiceDocs", {
					filters: itemfilter,
					success: function (oData) {
						if (oData.results.length === 0) {
							MessageBox.error("Unitecode not found!");
							that.getView().setBusy(false);
							return;
						}

						var unitCodeMap = {};
						oData.results.forEach((record) => {
							var key = `${record.BillingDocument}_${record.BillingDocumentItem}_${record.ConditionType}`;

							if (!unitCodeMap[key]) {
								unitCodeMap[key] = true;
								itemData.push({
									BillingDocument: record.BillingDocument,
									BillingDocumentItem: record.BillingDocumentItem,
									ConditionType: record.ConditionType,
									PricingProcedureStep: record.PricingProcedureStep,
									PricingProcedureCounter: record.PricingProcedureCounter,
									ConditionAmount: record.ConditionAmount,
									ConditionQuantity: record.ConditionQuantity,
									ConditionCurrency: record.ConditionCurrency,
									ConditionRateValue: record.ConditionRateValue,
									ConditionBaseValue: record.ConditionBaseValue,
									TransactionCurrency: record.TransactionCurrency,
									ConditionQuantityUnit: record.ConditionQuantityUnit,
								});
							}
						});

						console.log("Unique itemData:", itemData);
						that.EinvoiceAdobe(adobefilter, ccfilter);
					},
					error: function () {
						that.getView().setBusy(false);
					},
				});
			},

			//-------------------------------------------------------------------------------------------- fetching -----------------------------------------------------------------------------------------------//
			EinvoiceAdobe(adobefilter, ccfilter) {
				var that = this;
				that.getView().setBusy(true);
				that
					.getView()
					.getModel("mainService")
					.read("/YY1_EinvoiceDocs", {
						filters: adobefilter,
						success: function (oData) {
							console.log("/oData2//", oData);
							if (oData.results.length === 0) {
								MessageBox.error("Unitecode not found!");
								that.getView().setBusy(false);
								return;
							}
							var unitCodeMap = {};
							oData.results.forEach((record) => {
								var key =
									record.BillingDocument +
									"_" +
									parseFloat(record.BillingDocumentItem)
										.toString()
										.padStart(2, "0"); // Unique key
								if (!unitCodeMap[key]) {
									unitCodeMap[key] = {
										BillingDocument: record.BillingDocument,
										BillingDocumentItem: parseFloat(record.BillingDocumentItem)
											.toString()
											.padStart(2, "0"),
										NetDueDate: record.NetDueDate,
										IncotermsClassification: record.IncotermsClassification,
										IncotermsLocation1: record.IncotermsLocation1,
										TaxNumber3_1: record.TaxNumber3_1,
										TelephoneNumber1_1: record.TelephoneNumber1_1,
										TelephoneNumber2_1: record.TelephoneNumber2_1,
										TelephoneNumber1: record.TelephoneNumber1,
										TelephoneNumber2: record.TelephoneNumber2,
										PurchaseOrderByCustomer_1: record.PurchaseOrderByCustomer_1,
										CustomerPurchaseOrderDate: record.CustomerPurchaseOrderDate,
										IncotermsClassification: record.IncotermsClassification,
										IncotermsLocation1: record.IncotermsLocation1,
										AddresseeFullName: record.AddresseeFullName,
										BPCustomerName: record.BPCustomerName,
										BPCustomerName_1: record.BPCustomerName_1,
										BillToParty: record.BillToParty,
										ShipToParty: record.ShipToParty,
										StreetName: record.StreetName,
										StreetName_1: record.StreetName_1,
										Product: record.Product,
										StreetName_3: record.StreetName_3,
									};
								}
							});
							var ndata = Object.values(unitCodeMap);
							console.log("ndata", ndata);

							// Compare BillingDocument and BillingDocumentItem between ndata and tData
							ndata.forEach((ndataItem) => {
								tData.forEach((tDataItem) => {
									if (
										tDataItem.BillingDocument === ndataItem.BillingDocument &&
										tDataItem.BillingDocumentItem ===
										ndataItem.BillingDocumentItem
									) {
										Object.assign(tDataItem, ndataItem); // Push all properties of ndataItem into tDataItem
									}
								});
							});

							console.log("Updated tData with matched ndata details:", tData);
							that.companycode(ccfilter);
							// that.onExecute1();
							// that.onbilling();
						},
						error: function (oError) {
							MessageBox.error("Error fetching data!");
							that.getView().setBusy(false);
						},
					});
			},
			//pending
			companycode: function (ccfilter) {
				var that = this;
				that.getView().setBusy(true);
				that
					.getView()
					.getModel("YY1_CLIENTCREDENTIALS_CDS")
					.read("/YY1_CLIENTCREDENTIALS", {
						filters: ccfilter,
						success: function (oData) {
							console.log("/oData2//", oData);
							// if (oData.results.length === 0) {
							// 	MessageBox.error("Company code not found!");
							// 	that.getView().setBusy(false);
							// 	return;
							// }

							var plantDataMap = {}; // Map to store PlantGSTIN-based data

							oData.results.forEach((record) => {
								plantDataMap[record.PlantGSTIN] = {
									ClientCode: record.ClientCode_1,
									UserName: record.User_1,
									Password: record.Password,
								};
							});

							// Update tData based on matching PlantGSTIN
							tData.forEach((item) => {
								if (plantDataMap[item.PlantGSTIN]) {
									item.ClientCode = plantDataMap[item.PlantGSTIN].ClientCode;
									item.UserName = plantDataMap[item.PlantGSTIN].UserName;
									item.Password = plantDataMap[item.PlantGSTIN].Password;
								} else {
									item.ClientCode = "";
									item.UserName = "";
									item.Password = "";
								}
							});

							console.log("Updated tData with PlantGSTIN data:", tData);
							// that.getView().setBusy(false);
							that.onExecute1();
							// that.onbilling();
						},
						error: function (oError) {
							MessageBox.error("Error fetching data!");
							that.getView().setBusy(false);
						},
					});
			},
			onbilling: function () {
				var that = this;
				// debugger
				var k = 0;
				var oHeaders = {
					"X-Requested-With": "X",
					Accept: "application/json",
				};
				//   var mModel = that.getView().getModel("API_BILLING_DOCUMENT_SRV");
				var mModel = that.getView().getModel("mainService");
				mModel.setUseBatch(true);
				console.log("createdata", tData);
				for (var i = 0; i < tData.length; i++) {
					var sPath = `/A_BillingDocument('${tData[0].BillingDocument}')/to_Text`;

					this.getView().setBusy(true);
					mModel.read(sPath, {
						method: "GET",
						headers: oHeaders,

						success: function (oData, oResponse) {
							k++;

							bdata = [...oData.results];
							if (k >= tData.length) {
								console.log("bdata", bdata);
								that.onExecute1();
								// that.getView().setBusy(false);
							}
						},
						error: function (err) {
							k++;
							if (k >= tData.length) {
								var errMessage = JSON.parse(err.responseText).error.message
									.value;
								MessageBox.error(errMessage);
							}

							// that.createMatDoc(sOrder);
							that.getView().setBusy(false);
						},
					});
				}

				// oItems = [];
				mModel.submitChanges({
					success: function (oData, oResponse) {
						// Success handling for batch request
					},
					error: function (err) {
						// Error handling for batch request
					},
				});
			},

			onbillitem: function () {
				var that = this;
				// debugger
				var k = 0;
				var oHeaders = {
					"X-Requested-With": "X",
					Accept: "application/json",
				};
				var billitemMap = {}; // Map to store PlantGSTIN-based data

				var mModel = that.getView().getModel("mainService");
				mModel.setUseBatch(true);
				console.log("createdata", tData);
				var data = [];
				for (var i = 0; i < tData.length; i++) {
					// var sPath = "/MaterialBOMItem(BillOfMaterial='"+aFilteredRecords[i].BillofMaterail+"',BillOfMaterialCategory='M',BillOfMaterialVariant='"+aFilteredRecords[i].AlternativeNo+"',BillOfMaterialVersion='',BillOfMaterialItemNodeNumber='1',HeaderChangeDocument='',Material= '"+aFilteredRecords[i].Material+"',Plant='"+aFilteredRecords[i].Plant+"')"

					// var sPath = `/MaterialBOM(BillOfMaterial='${sOrderno}',BillOfMaterialCategory='M',BillOfMaterialVariant='${AlternativeNo}',BillOfMaterialVersion='',EngineeringChangeDocument='',Material='${material}',Plant='${sPlant}')`;
					// var sPath = `/A_BillingDocument('${tData[0].BillingDocument}')/to_Text`
					var sPath = `/A_BillingDocumentItem(BillingDocument='${tData[i].BillingDocument}',BillingDocumentItem='${tData[i].BillingDocumentItem}')/to_ItemText`;

					this.getView().setBusy(true);
					mModel.read(sPath, {
						method: "GET",
						headers: oHeaders,
						// changeSetId: "changeset" + i,
						success: function (oData, oResponse) {
							console.log("oDataoData", oData);
							k++;
							// oData.results.forEach((record) => {
							// 	var key = record.BillingDocument + "_" + record.BillingDocumentItem
							// 	billitemMap[key] = {
							// 		BillingDocument: record.BillingDocument,
							// 		BillingDocumentItem: record.BillingDocumentItem,
							// 		Language: record.Language,
							// 		LongText: record.LongText,
							// 		LongTextID: record.LongTextID
							// 	};
							// });
							data.push(...oData.results);

							if (k >= tData.length) {
								kData.forEach((item) => {
									// Initialize properties to avoid undefined
									item.longtextZPAC = "";
									item.longtext0001 = "";

									data.forEach((item1) => {
										if (
											item.BillingDocument === item1.BillingDocument &&
											item.BillingDocumentItem === item1.BillingDocumentItem
										) {
											if (item1.LongTextID === "ZPAC") {
												item.longtextZPAC = item1.LongText || "";
												// item.longtext0001 = ''
											} else if (item1.LongTextID === "0001") {
												item.longtext0001 = item1.LongText || "";
												// item.longtextZPAC  = ''
											} else if (
												item1.LongTextID === "ZPAC" &&
												item1.LongTextID === "0001"
											) {
												item.longtext0001 = item1.LongText || "";
												item.longtextZPAC = item1.LongText || "";
											}
										}
									});
									console.log("kdata", item);
								});

								// oData.results.forEach(item1 => {
								// 	if(item.BillingDocument == item1.BillingDocument && item.BillingDocumentItem == item1.BillingDocumentItem ){
								// 		if(item1.LongTextID == 'ZPAC'){
								// 			item.longtextZPAC == item1.LongText
								// 		}else if (item1.LongTextID == '0001'){
								// 			item.longtext0001 == item1.LongText
								// 		}
								// 	}
								// } )

								// Update tData based on matching PlantGSTIN
								// kData.forEach((item) => {
								// 	var key = item.BillingDocument + "_" + item.BillingDocumentItem
								// 	if (billitemMap[key]) {
								// 		item.Language = billitemMap[key].Language;
								// 		item.LongText = billitemMap[key].LongText;
								// 		item.LongTextID = billitemMap[key].LongTextID;
								// 	} else {
								// 		item.Language = "";
								// 		item.LongText = "";
								// 		item.LongTextID = "";
								// 	}
								// });

								console.log("kdata", kData);
								// that.updateContentTable();
								that.onotcaddress();
								// that.getView().setBusy(false);
							}
						},
						error: function (err) {
							k++;
							if (k >= tData.length) {
								var errMessage = JSON.parse(err.responseText).error.message
									.value;
								MessageBox.error(errMessage);
							}

							// that.createMatDoc(sOrder);
							that.getView().setBusy(false);
						},
					});
				}

				// oItems = [];
				mModel.submitChanges({
					success: function (oData, oResponse) {
						// Success handling for batch request
					},
					error: function (err) {
						// Error handling for batch request
					},
				});
			},
			onotcaddress: function () {
				var that = this;
				var otcfilter = [];
				kData.forEach((filters) => {
					otcfilter.push(
						new Filter(
							"BillingDocument",
							FilterOperator.EQ,
							filters.BillingDocument
						)
					);
					otcfilter.push(
						new Filter(
							"BillingDocumentItem",
							FilterOperator.EQ,
							filters.BillingDocumentItem
						)
					);
				});
				that.getView().setBusy(true);
				that
					.getView()
					.getModel("mainService")
					.read("/YY1_EinvoiceDocs", {
						filters: otcfilter,
						success: function (oData) {
							if (oData.results.length === 0) {
								MessageBox.error("otcaddress not found!");
								that.getView().setBusy(false);
								return;
							}
							// Create a lookup map for quick access
							var unitCodeMap = {};
							oData.results.forEach((record) => {
								var key =
									record.BillingDocument +
									"_" +
									parseFloat(record.BillingDocumentItem)
										.toString()
										.padStart(2, "0");
								unitCodeMap[key] = {
									BillingDocument: record.BillingDocument,
									BillingDocumentItem: record.BillingDocumentItem,
									otcBillingDocumentItemText: record.BillingDocumentItemText,
									otcAddresseeFullName: record.AddresseeFullName,
									otcOrganizationName1: record.OrganizationName1,
									otcCityName: record.CityName,
									otcDistrictName: record.DistrictName,
									otcPostalCode: record.PostalCode,
									otcStreetName: record.StreetName,
									otcStreetPrefixName1: record.StreetPrefixName1,
									otcStreetPrefixName2: record.StreetPrefixName2,
									otcStreetSuffixName1: record.StreetSuffixName1,
									otcStreetSuffixName2: record.StreetSuffixName2,
									otcHouseNumber: record.HouseNumber,
									otcCountry: record.Country,
									otcRegion: record.Region,
									otcBuilding: record.Building,
									otcFloor: record.Floor,
									otcAddresseeFullName_1: record.AddresseeFullName_1,
									otcOrganizationName1_1: record.OrganizationName1_1,
									otcCityName_1: record.CityName_1,
									otcDistrictName_1: record.DistrictName_1,
									otcVillageName: record.VillageName,
									otcPostalCode_1: record.PostalCode_1,
									otcStreetName_1: record.StreetName_1,
									otcStreetPrefixName1_1: record.StreetPrefixName1_1,
									otcStreetPrefixName2_1: record.StreetPrefixName2_1,
									otcStreetSuffixName1_1: record.StreetSuffixName1_1,
									otcStreetSuffixName2_1: record.StreetSuffixName2_1,
									otcHouseNumber_1: record.HouseNumber_1,
									otcBuilding_1: record.Building_1,
									otcFloor_1: record.Floor_1,
									otcBillToPartyCountry: record.BillToPartyCountry,
									otcRegion_1: record.Region_1,
									otcShipToPartyCustomer: record.ShipToPartyCustomer,
									otcBillToPartyCustomer: record.BillToPartyCustomer,
									otcAccountByCustomer: record.AccountByCustomer,
									otcAccountByCustomer_1: record.AccountByCustomer_1,
									otcBillToPartyAccountGroup: record.BillToPartyAccountGroup,
									otcShipToPartyAccountGroup: record.ShipToPartyAccountGroup,
								};
							});

							// Update tData based on matching UnitQuantityCode
							kData.forEach((item) => {
								var key = item.BillingDocument + "_" + item.BillingDocumentItem;
								if (unitCodeMap[key]) {
									(item.otcBillingDocumentItemText =
										unitCodeMap[key].otcBillingDocumentItemText),
										(item.otcAddresseeFullName =
											unitCodeMap[key].otcAddresseeFullName),
										(item.otcOrganizationName1 =
											unitCodeMap[key].otcOrganizationName1),
										(item.otcCityName = unitCodeMap[key].otcCityName),
										(item.otcDistrictName = unitCodeMap[key].otcDistrictName),
										(item.otcPostalCode = unitCodeMap[key].otcPostalCode),
										(item.otcStreetName = unitCodeMap[key].otcStreetName),
										(item.otcStreetPrefixName1 =
											unitCodeMap[key].otcStreetPrefixName1),
										(item.otcStreetPrefixName2 =
											unitCodeMap[key].otcStreetPrefixName2),
										(item.otcStreetSuffixName1 =
											unitCodeMap[key].otcStreetSuffixName1),
										(item.otcStreetSuffixName2 =
											unitCodeMap[key].otcStreetSuffixName2),
										(item.otcHouseNumber = unitCodeMap[key].otcHouseNumber),
										(item.otcCountry = unitCodeMap[key].otcCountry),
										(item.otcRegion = unitCodeMap[key].otcRegion),
										(item.otcBuilding = unitCodeMap[key].otcBuilding),
										(item.otcFloor = unitCodeMap[key].otcFloor),
										(item.otcAddresseeFullName_1 =
											unitCodeMap[key].otcAddresseeFullName_1),
										(item.otcOrganizationName1_1 =
											unitCodeMap[key].otcOrganizationName1_1),
										(item.otcCityName_1 = unitCodeMap[key].otcCityName_1),
										(item.otcDistrictName_1 =
											unitCodeMap[key].otcDistrictName_1),
										(item.otcVillageName = unitCodeMap[key].otcVillageName),
										(item.otcPostalCode_1 = unitCodeMap[key].otcPostalCode_1),
										(item.otcStreetName_1 = unitCodeMap[key].otcStreetName_1),
										(item.otcStreetPrefixName1_1 =
											unitCodeMap[key].otcStreetPrefixName1_1),
										(item.otcStreetPrefixName2_1 =
											unitCodeMap[key].otcStreetPrefixName2_1),
										(item.otcStreetSuffixName1_1 =
											unitCodeMap[key].otcStreetSuffixName1_1),
										(item.otcStreetSuffixName2_1 =
											unitCodeMap[key].otcStreetSuffixName2_1),
										(item.otcHouseNumber_1 = unitCodeMap[key].otcHouseNumber_1),
										(item.otcBuilding_1 = unitCodeMap[key].otcBuilding_1),
										(item.otcFloor_1 = unitCodeMap[key].otcFloor_1),
										(item.otcBillToPartyCountry = unitCodeMap[key].otcBillToPartyCountry),
										(item.otcRegion_1 = unitCodeMap[key].otcRegion_1),
										(item.otcShipToPartyCustomer =
											unitCodeMap[key].otcShipToPartyCustomer),
										(item.otcBillToPartyCustomer =
											unitCodeMap[key].otcBillToPartyCustomer),
										(item.otcAccountByCustomer =
											unitCodeMap[key].otcAccountByCustomer),
										(item.otcAccountByCustomer_1 =
											unitCodeMap[key].otcAccountByCustomer_1),
										(item.otcBillToPartyAccountGroup =
											unitCodeMap[key].otcBillToPartyAccountGroup),
										(item.otcShipToPartyAccountGroup =
											unitCodeMap[key].otcShipToPartyAccountGroup);
								} else {
									(item.otcBillingDocumentItemText = ""),
										(item.otcAddresseeFullName = ""),
										(item.otcOrganizationName1 = ""),
										(item.otcCityName = ""),
										(item.otcDistrictName = ""),
										(item.otcPostalCode = ""),
										(item.otcStreetName = ""),
										(item.otcStreetPrefixName1 = ""),
										(item.otcStreetPrefixName2 = ""),
										(item.otcStreetSuffixName1 = ""),
										(item.otcStreetSuffixName2 = ""),
										(item.otcHouseNumber = ""),
										(item.otcCountry = ""),
										(item.otcRegion = ""),
										(item.otcBuilding = ""),
										(item.otcFloor = ""),
										(item.otcAddresseeFullName_1 = ""),
										(item.otcOrganizationName1_1 = ""),
										(item.otcCityName_1 = ""),
										(item.otcDistrictName_1 = ""),
										(item.otcVillageName = ""),
										(item.otcPostalCode_1 = ""),
										(item.otcStreetName_1 = ""),
										(item.otcStreetPrefixName1_1 = ""),
										(item.otcStreetPrefixName2_1 = ""),
										(item.otcStreetSuffixName1_1 = ""),
										(item.otcStreetSuffixName2_1 = ""),
										(item.otcHouseNumber_1 = ""),
										(item.otcBuilding_1 = ""),
										(item.otcFloor_1 = ""),
										(item.otcBillToPartyCountry = ""),
										(item.otcRegion_1 = ""),
										(item.otcShipToPartyCustomer = ""),
										(item.otcBillToPartyCustomer = ""),
										(item.otcAccountByCustomer = ""),
										(item.otcAccountByCustomer_1 = ""),
										(item.otcBillToPartyAccountGroup = ""),
										(item.otcShipToPartyAccountGroup = "");
								}
							});

							console.log("Updated tData with unit code:", tData);

							var oEntryModel = new JSONModel();
							oEntryModel.setData({ items: mData });
							that.getView().setModel(oEntryModel, "entryModel");
							// that.getView().setBusy(false);
							that.updateContentTable();
						},
						error: function () {
							MessageBox.error("Error fetching eDocument data");
							that.getView().setBusy(false);
						},
					});
			},

			//------------------------------------------------------------------------------------ check and display from CBO  -----------------------------------------------------------------------------------//
			onExecute1: function () {
				var that = this;
				mData = [];
				kData = [];
				var uniqueKeys = new Set();
				var uniqueItemKeys = new Set(); // Track unique keys for kData
				var IrnNumber = "",
					EWayBill = "",
					documentStatus = "";
				that.getView().setBusy(true);

				that
					.getView()
					.getModel("YY1_EINVOICE_CDS")
					.read("/YY1_EINVOICE", {
						filters: mFilters,
						success: function (oData) {
							var pDataResults = oData.results.length ? [...oData.results] : [];
							console.log("///", oData);
							tData.forEach(function (item) {
								var uniqueKey = `${item.BillingDocument}-${item.FiscalYear}`;

								if (!uniqueKeys.has(uniqueKey)) {
									uniqueKeys.add(uniqueKey);
									var matchingPData = pDataResults.find(function (pItem) {
										return (
											pItem.BillingDocument === item.BillingDocument &&
											pItem.CompanyCode === item.CompanyCode &&
											that.dateFormat(pItem.BillingDate) ===
											that.dateFormat(item.BillingDocumentDate)
										);
									});

									if (matchingPData) {
										documentStatus = matchingPData.EdocumentStatus;
										IrnNumber = matchingPData.IRN || "";
										EWayBill = matchingPData.EWayBill || "";
										var ewayvalidfromdate = matchingPData.EwayBillValidFromDate;
										var ewayvalidfromtime = matchingPData.EwayBillValidFromTime;
										var ewayvalidtodate = matchingPData.EwayBillValidToDate;
										var ewayvalidtotime = matchingPData.EwayBillValidToTime;
										var acknowledgementno = matchingPData.AcknowledgementNo;
										var acknowledgementdate = matchingPData.AcknowledgementDate;
										var AcknowledgementTime = matchingPData.AcknowledgementTime;
										var message = matchingPData.Message;
										var ewaybillstatus = matchingPData.CancelEwayBill;
										var EWayCancelReasonCode =
											matchingPData.EWayCancelReasonCode;
										var EWayCancelDate = matchingPData.EWayCancelDate;
										var EWayCancelTime = matchingPData.EWayCancelTime;
										var EWayCancellationRemark =
											matchingPData.EWayCancellationRemark;
										var cancelledDate = matchingPData.EinvoiceCancellationDate;
										var cancelledtime = matchingPData.EinvoiceCancellationTime;
										var transporterid = matchingPData.TransporterID;
										var transporterdocno = matchingPData.TransportDocNo;
										var transporterdocdate = matchingPData.TransportDocDate;
										var vehicalno = matchingPData.VehicleNo;
										var vehicaltype = matchingPData.VehicleType;
										var ModeofTransport = matchingPData.ModeofTransport;
										var TransporterName = matchingPData.TransporterName;
										var TransporterGSTIN = matchingPData.TransporterGSTIN;
										var PortCode = matchingPData.PortCode;
										var PortName = item.PortName;
										var PortAddress1 = item.PortAddress1;
										var PortAddress2 = item.PortAddress2;
										var PortCity = item.PortCity;
										var PortPostalCode = item.PortPostalCode;
										var PortRegionCode = item.PortRegionCode;
										var PortCountry = item.PortCountry;
										var tarnsportdistance = matchingPData.TransportDistanceinKM;
										var qrpart1 = matchingPData.QRCode1;
										var qrpart2 = matchingPData.QRCode2;
										var EInvoiceReasonCode = matchingPData.EInvoiceReasonCode;
										var EinvoiceCancellationRemark =
											matchingPData.EinvoiceCancellationRemark;
										var CancelEinvoice = matchingPData.CancelEinvoice;
										var SubSupplyTypeDesc = matchingPData.SubSupplyTypeDesc
										var PDFURL = matchingPData.PDFURL
										var SummaryPDFURL=matchingPData.SummaryPDFURL
									} else {
										// var transportdata = pDataResults.find(function (pItem) {
										// 	return pItem.BillingDocument === item.BillingDocument && pItem.CompanyCode === item.CompanyCode && that.dateFormat(pItem.BillingDate) === that.dateFormat(item.BillingDocumentDate);
										// });
										documentStatus = "eDocument Created";
										//   IrnNumber = item.InvoiceRefNum;
										//   EWayBill = item.EWayBill;
										//   var ewayvalidfromdate = item.ValidFromdate;
										//   var ewayvalidfromtime = item.ValidFromtime;
										//   var ewayvalidtodate = item.ValidTodate;
										//   var ewayvalidtotime = item.ValidTotime;
										//   var acknowledgementno = item.AcknowledgementNum;
										//   var acknowledgementdate = item.AcknowledgementDate;
										//   var AcknowledgementTime = item.AcknowledgementTime;
										//   var message = item.Messages;
										//   var ewaybillstatus = item.eWayBillStatus;
										//   var EWayCancelReasonCode = item.CancellationCodeEWB;
										//   var EWayCancelDate = item.EWBCancelDate;
										//   var EWayCancelTime = item.EWayCancelTime;
										//   var EWayCancellationRemark = item.EWBCancelRemark;
										//   var cancelledDate = item.CancelledDate;
										//   var cancelledtime = item.CancelledTime;
										//   var transporterid = item.TransporterID;
										//   var transporterdocno = item.TransportDocNum;
										//   var transporterdocdate = item.TransportDocDate;
										//   var vehicalno = item.VehicleNum;
										//   var vehicaltype = item.VehicleType;
										//   var ModeofTransport = item.ModeOfTransport;
										//   var TransporterName = item.TransporterName;
										//   var TransporterGSTIN = item.TransporterGSTIN;
										//   var PortCode = item.PortCode;
										//   var PortName = item.PortName;
										//   var PortAddress1 = item.PortAddress1;
										//   var PortAddress2 = item.PortAddress2;
										//   var PortCity = item.PortCity;
										//   var PortPostalCode = item.PortPostalCode;
										//   var PortRegionCode = item.PortRegionCode;
										//   var PortCountry = item.PortCountry;
										//   var tarnsportdistance = item.TransportDistanceinKM;
										//   var qrpart1 = item.QRCode1;
										//   var qrpart2 = item.QRCode2;
										//   var EInvoiceReasonCode = item.EInvoiceReasonCode;
										//   var EinvoiceCancellationRemark =
										// 	item.EinvoiceCancellationRemark;
										//   var CancelEinvoice = item.CancelEinvoice;
										IrnNumber = item.IRN;
										EWayBill = item.EWayBill;
										var ewayvalidfromdate = item.EwayBillValidFromDate;
										var ewayvalidfromtime = item.EwayBillValidFromTime;
										var ewayvalidtodate = item.EwayBillValidToDate;
										var ewayvalidtotime = item.EwayBillValidToTime;
										var acknowledgementno = item.AcknowledgementNo;
										var acknowledgementdate = item.AcknowledgementDate;
										var AcknowledgementTime = item.AcknowledgementTime;
										var message = item.Message; // Note: 'Messages' is not in your array; corrected to 'Message'
										var ewaybillstatus = item.eWayBillStatus || false; // Not present in data, assigning empty fallback
										var EWayCancelReasonCode = item.EWayCancelReasonCode;
										var EWayCancelDate = item.EWayCancelDate;
										var EWayCancelTime = item.EWayCancelTime;
										var EWayCancellationRemark = item.EWayCancellationRemark;
										var cancelledDate = item.EinvoiceCancellationDate;
										var cancelledtime = item.EinvoiceCancellationTime;
										var transporterid = item.TransporterID || ""; // Not present in data, assigning empty fallback
										var transporterdocno = item.TransportDocNo;
										var transporterdocdate = item.TransportDocDate;
										var vehicalno = item.VehicleNo;
										var vehicaltype = item.VehicleType;
										var ModeofTransport = item.ModeofTransport;
										var TransporterName = item.TransporterName;
										var TransporterGSTIN = item.TransporterGSTIN;
										var PortCode = item.PortCode;
										var PortName = item.PortName;
										var PortAddress1 = item.PortAddress1;
										var PortAddress2 = item.PortAddress2;
										var PortCity = item.PortCity;
										var PortPostalCode = item.PortPostalCode;
										var PortRegionCode = item.PortRegion;
										var PortCountry = item.PortCountry;
										var tarnsportdistance = item.TransportDistanceinKM;
										var qrpart1 = item.QRCode1;
										var qrpart2 = item.QRCode2;
										var EInvoiceReasonCode = item.EInvoiceReasonCode;
										var EinvoiceCancellationRemark = item.EinvoiceCancellationRemark;
										var CancelEinvoice = item.CancelEinvoice || false;
										var SubSupplyTypeDesc = item.SubSupplyTypeDesc
										var PDFURL = item.PDFURL
										var SummaryPDFURL=item.SummaryPDFURL

									}

									mData.push({
										Status: item.Status,
										DocumentStatus: documentStatus,
										CreationDate: that.dateFormat(item.CreationDate),
										CreatedOn: that.convertEdmTime(
											item.CreationTime.__edmType
												? item.CreationTime.ms
												: item.CreationTime
										),
										CreatedBy: item.CreatedByUser,
										BillingDocument: item.BillingDocument,
										PostingDate: that.dateFormat(item.PostingDate),
										DocumentNumber: item.DocumentReferenceID || "",
										Accountingdocument: item.AccountingDocument || "",
										CompanyCode: item.CompanyCode || "",
										Plant: item.Plant || "",
										SalesOrganization: item.SalesOrganization || "",
										BillingType: item.BillingDocumentType || "",
										InvoiceRefNum: IrnNumber,
										AcknowledgementNum: acknowledgementno,
										AcknowledgementDate: that.dateFormat(acknowledgementdate),
										Messages: message,
										AcknowledgementTime: that.convertEdmTime(
											AcknowledgementTime.__edmType
												? AcknowledgementTime.ms
												: AcknowledgementTime
										),
										CancelledDate: that.dateFormat(cancelledDate),
										CancelledTime: that.convertEdmTime(
											cancelledtime.__edmType ? cancelledtime.ms : cancelledtime
										),
										EWayBill: EWayBill,
										eWayBillCreationDate: that.dateFormat(ewayvalidfromdate),
										eWayBillCreationTime: that.convertEdmTime(
											ewayvalidfromtime.__edmType
												? ewayvalidfromtime.ms
												: ewayvalidfromtime
										),
										ValidFromdate: that.dateFormat(ewayvalidfromdate),
										ValidFromtime: that.convertEdmTime(
											ewayvalidfromtime.__edmType
												? ewayvalidfromtime.ms
												: ewayvalidfromtime
										),
										ValidTodate: that.dateFormat(ewayvalidtodate),
										ValidTotime: that.convertEdmTime(
											ewayvalidtotime.__edmType
												? ewayvalidtotime.ms
												: ewayvalidtotime
										),
										eWayBillStatus: ewaybillstatus,
										CancellationCodeEWB: EWayCancelReasonCode,
										EWBCancelRemark: EWayCancellationRemark,
										EWBCancelDate: that.dateFormat(EWayCancelDate),
										EWayCancelTime: that.convertEdmTime(
											EWayCancelTime.__edmType
												? EWayCancelTime.ms
												: EWayCancelTime
										),
										TransporterID: transporterid,
										TransportDocNum: transporterdocno,
										TransportDocDate: that.dateFormat(transporterdocdate),
										VehicleNum: vehicalno,
										VehicleType: vehicaltype,
										ModeOfTransport: ModeofTransport,
										TransporterName: TransporterName,
										TransporterGSTIN: TransporterGSTIN,
										PortCode: PortCode,
										PortName: PortName,
										PortAddress1: PortAddress1,
										PortAddress2: PortAddress2,
										PortCity: PortCity,
										PortPostalCode: PortPostalCode,
										PortRegionCode: PortRegionCode,
										PortCountry: PortCountry,
										TransportDistanceinKM: tarnsportdistance,
										FiscalYear: item.FiscalYear,
										BillingDocumentDate: that.dateFormat(
											item.BillingDocumentDate
										),
										QRCode1: qrpart1,
										QRCode2: qrpart2,
										EInvoiceReasonCode: EInvoiceReasonCode,
										EinvoiceCancellationRemark: EinvoiceCancellationRemark,
										CancelEinvoice: CancelEinvoice,
										SalesDocument: item.SalesDocument, // add vikas
										PurchaseOrderByCustomer: item.PurchaseOrderByCustomer,
										// PricingProcedure: item.PricingProcedure,
										Cust_Purch_Date_BDI: item.CustomerPurchaseOrderDate,
										// FullName: item.FullName,
										// Partner: item.Partner,
										// AccountByCustomer_BDI: item.AccountByCustomer_BDI,
										// Incoterms: item.Incoterms,
										// Region: item.Region,
										// RegionName: item.RegionName,
										// YY1_ODIN_BDH: item.YY1_ODIN_BDH,
										DocumentReferenceID: item.DocumentReferenceID,
										// YY1_CUST_MOBILE_NUMBER_BDH: item.YY1_CUST_MOBILE_NUMBER_BDH,
										// YY1_CUST_TEL_NUMBER_BDH: item.YY1_CUST_TEL_NUMBER_BDH,
										// ZHSSRate: item.ZHSSRate,
										// ZHSSAmount: item.ZHSSAmount,
										// Product: item.Product,
										passwrd: item.Password,
										user: item.UserName,
										Clientcode: item.ClientCode,
										SubSupplyTypeDesc: SubSupplyTypeDesc,
										PDFURL: PDFURL,
										SummaryPDFURL:SummaryPDFURL
										// BTPOrganizationBPName3: item.BTPOrganizationBPName3,
										// BTPOrganizationBPName2: item.BTPOrganizationBPName2,
										// BTPOrganizationBPName1: item.BTPOrganizationBPName1,
										// BTPOrganizationBPName4: item.BTPOrganizationBPName4,
										// SHPOrganizationBPName3: item.SHPOrganizationBPName3,
										// SHPOrganizationBPName2: item.SHPOrganizationBPName2,
										// SHPOrganizationBPName1: item.SHPOrganizationBPName1,
										// SHPOrganizationBPName4: item.SHPOrganizationBPName4,
										// YY1_UnloadingPoint_SDH: item.YY1_UnloadingPoint_SDH,
									});
								}
							});

							// Ensure unique kData based on BillingDocument and BillingDocumentItem
							tData.forEach((itemList) => {
								var uniqueItemKey = `${itemList.BillingDocument}-${itemList.BillingDocumentItem}`;

								if (!uniqueItemKeys.has(uniqueItemKey)) {
									uniqueItemKeys.add(uniqueItemKey);
									kData.push(itemList);
								}
							});

							console.log("mData", mData);
							console.log("kData", kData);

							var oEntryModel = new JSONModel();
							oEntryModel.setData({ items: mData });
							that.getView().setModel(oEntryModel, "entryModel");
							that.getView().setBusy(false);
							// that.onbillitem();
							that.updateContentTable();
						},
						error: function () {
							MessageBox.error("Error fetching eDocument data");
							that.getView().setBusy(false);
						},
					});
			},
			updateContentTable: function () {
				var that = this;
				var oModel = this.getView().getModel();
				var aListData = oModel.getProperty("/listData");
				var oEntryModel = this.getView().getModel("entryModel");
				var aEntryData = oEntryModel.getData().items || [];
				that.getView().setBusy(true);
				//total doc
				aListData[0].number = aEntryData.length;
				// not proceed doc
				var eDocumentCreatedCount = aEntryData.filter(function (item) {
					return item.DocumentStatus === "eDocument Created";
				}).length;
				aListData[1].number = eDocumentCreatedCount;

				// irn generated
				var irnGeneratedCount = aEntryData.filter(function (item) {
					return item.InvoiceRefNum !== "" && item.CancelledDate === "";
				}).length;
				aListData[2].number = irnGeneratedCount;

				// irn cancelled
				var irnCancelledCount = aEntryData.filter(function (item) {
					return item.CancelledDate !== "" && item.InvoiceRefNum !== "";
				}).length;
				aListData[3].number = irnCancelledCount;

				// eway bill generated
				var ewaybillgeneratedCount = aEntryData.filter(function (item) {
					return item.EWayBill !== "" && item.EWBCancelDate === "";
				}).length;
				aListData[4].number = ewaybillgeneratedCount;

				// eway bill cancelled
				var ewaybillCancelledCount = aEntryData.filter(function (item) {
					return item.EWBCancelDate !== "" && item.EWayBill !== "";
				}).length;
				aListData[5].number = ewaybillCancelledCount;

				// Success
				var irnerrorsCount = aEntryData.filter(function (item) {
					return item.DocumentStatus === "Success";
				}).length;
				aListData[6].number = irnerrorsCount;

				// errors
				var ewaybillerrorsCount = aEntryData.filter(function (item) {
					return item.DocumentStatus === "eDocument has errors";
				}).length;
				aListData[7].number = ewaybillerrorsCount;
				// cancelled
				var ewaybillerrorsCount = aEntryData.filter(function (item) {
					return item.DocumentStatus === "Cancelled";
				}).length;
				aListData[8].number = ewaybillerrorsCount;
				oModel.setProperty("/listData", aListData);

				that.getView().setBusy(false);
			},

			//------------------------------------------------------------------------------------ Export Data ------------------------------------------------------------------------------------------------------------//
			onExport: function () {
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length === 0) {
					MessageBox.error("Please select open line items !");
					return;
				}
				var aData = [];
				var aColumns = [
					{ header: "Status", key: "Status" },
					{ header: "Document Status", key: "DocumentStatus" },
					{ header: "Creation Date", key: "CreationDate" },
					{ header: "Created On", key: "CreatedOn" },
					{ header: "Created By", key: "CreatedBy" },
					{ header: "Billing Document Date", key: "BillingDocumentDate" },
					{ header: "Billing Document", key: "BillingDocument" },
					{ header: "Posting Date", key: "PostingDate" },
					{ header: "Document Number", key: "DocumentNumber" },
					{ header: "Accounting document", key: "Accountingdocument" },
					{ header: "Company Code", key: "CompanyCode" },
					{ header: "Plant", key: "Plant" },
					{ header: "Sales Organization", key: "SalesOrganization" },
					{ header: "Billing Type", key: "BillingType" },
					{ header: "Invoice Reference Number", key: "InvoiceRefNum" },
					{ header: "Acknowledgement Number", key: "AcknowledgementNum" },
					{ header: "Acknowledgement Date", key: "AcknowledgementDate" },
					{ header: "Messages", key: "Messages" },
					{ header: "Acknowledgement Time", key: "AcknowledgementTime" },
					{ header: "E-Invoice Cancellation Status", key: "CancelEinvoice" },
					{ header: "EInvoice Reason Code", key: "EInvoiceReasonCode" },
					{
						header: "Einvoice Cancellation Remark",
						key: "EinvoiceCancellationRemark",
					},
					{ header: "Cancelled Date", key: "CancelledDate" },
					{ header: "Cancelled Time", key: "CancelledTime" },
					{ header: "eWay Bill Number", key: "EWayBill" },
					{ header: "eWay Bill Creation Date", key: "eWayBillCreationDate" },
					{ header: "eWay Bill Creation Time", key: "eWayBillCreationTime" },
					{ header: "Valid From Date", key: "ValidFromdate" },
					{ header: "Valid From time", key: "ValidFromtime" },
					{ header: "Valid To Date", key: "ValidTodate" },
					{ header: "Valid To time", key: "ValidTotime" },
					{ header: "eWay Bill Status", key: "eWayBillStatus" },
					{ header: "Cancellation Code EWB", key: "CancellationCodeEWB" },
					{ header: "EWB Cancel Remark", key: "EWBCancelRemark" },
					{ header: "EWB Cancel Date", key: "EWBCancelDate" },
					{ header: "EWay Cancel Time", key: "EWayCancelTime" },
					{ header: "Transport ID", key: "TransporterID" },
					{ header: "Transport Document Number", key: "TransportDocNum" },
					{ header: "Transport Document Date", key: "TransportDocDate" },
					{ header: "Vehicle Number", key: "VehicleNum" },
					{ header: "Vehicle Type", key: "VehicleType" },
					{ header: "Mode Of Transport", key: "ModeOfTransport" },
					{ header: "Transporter Name", key: "TransporterName" },
					{ header: "Transporter GSTIN", key: "TransporterGSTIN" },
					{ header: "Port Code", key: "PortCode" },
				];
				aSelectedIndices.forEach(function (iIndex) {
					var oContext = oTable.getContextByIndex(iIndex);
					var oRowData = {
						Status: oContext.getProperty("Status"),
						DocumentStatus: oContext.getProperty("DocumentStatus"),
						CreationDate: oContext.getProperty("CreationDate"),
						CreatedOn: oContext.getProperty("CreatedOn"),
						CreatedBy: oContext.getProperty("CreatedBy"),
						BillingDocumentDate: oContext.getProperty("BillingDocumentDate"),
						BillingDocument: oContext.getProperty("BillingDocument"),
						PostingDate: oContext.getProperty("PostingDate"),
						DocumentNumber: oContext.getProperty("DocumentNumber"),
						Accountingdocument: oContext.getProperty("Accountingdocument"),
						CompanyCode: oContext.getProperty("CompanyCode"),
						Plant: oContext.getProperty("Plant"),
						SalesOrganization: oContext.getProperty("SalesOrganization"),
						BillingType: oContext.getProperty("BillingType"),
						InvoiceRefNum: oContext.getProperty("InvoiceRefNum"),
						AcknowledgementNum: oContext.getProperty("AcknowledgementNum"),
						AcknowledgementDate: oContext.getProperty("AcknowledgementDate"),
						Messages: oContext.getProperty("Messages"),
						AcknowledgementTime: oContext.getProperty("AcknowledgementTime"),
						CancelEinvoice: oContext.getProperty("CancelEinvoice"),
						EInvoiceReasonCode: oContext.getProperty("EInvoiceReasonCode"),
						EinvoiceCancellationRemark: oContext.getProperty(
							"EinvoiceCancellationRemark"
						),
						CancelledDate: oContext.getProperty("CancelledDate"),
						CancelledTime: oContext.getProperty("CancelledTime"),
						EWayBill: oContext.getProperty("EWayBill"),
						eWayBillCreationDate: oContext.getProperty("eWayBillCreationDate"),
						eWayBillCreationTime: oContext.getProperty("eWayBillCreationTime"),
						ValidFromdate: oContext.getProperty("ValidFromdate"),
						ValidFromtime: oContext.getProperty("ValidFromtime"),
						ValidTodate: oContext.getProperty("ValidTodate"),
						ValidTotime: oContext.getProperty("ValidTotime"),
						eWayBillStatus: oContext.getProperty("eWayBillStatus"),
						CancellationCodeEWB: oContext.getProperty("CancellationCodeEWB"),
						EWBCancelRemark: oContext.getProperty("EWBCancelRemark"),
						EWBCancelDate: oContext.getProperty("EWBCancelDate"),
						EWayCancelTime: oContext.getProperty("EWayCancelTime"),
						TransporterID: oContext.getProperty("TransporterID"),
						TransportDocNum: oContext.getProperty("TransportDocNum"),
						TransportDocDate: oContext.getProperty("TransportDocDate"),
						VehicleNum: oContext.getProperty("VehicleNum"),
						VehicleType: oContext.getProperty("VehicleType"),
						ModeOfTransport: oContext.getProperty("ModeOfTransport"),
						TransporterName: oContext.getProperty("TransporterName"),
						TransporterGSTIN: oContext.getProperty("TransporterGSTIN"),
						PortCode: oContext.getProperty("PortCode"),
					};
					aData.push(oRowData);
				});

				var oWorksheet = XLSX.utils.json_to_sheet(aData, {
					header: aColumns.map((c) => c.key),
				});
				XLSX.utils.sheet_add_aoa(oWorksheet, [aColumns.map((c) => c.header)], {
					origin: "A1",
				});
				oWorksheet["!cols"] = aColumns.map((column) => {
					const maxLength = Math.max(
						column.header.length,
						...aData.map((item) =>
							item[column.key] ? item[column.key].toString().length : 0
						)
					);
					return { width: maxLength + 2 };
				});
				var oWorkbook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(
					oWorkbook,
					oWorksheet,
					"E-Invoice and E-Way Bill"
				);
				XLSX.writeFile(oWorkbook, "E-Invoice_E-Way_Bill.xlsx");
			},

			//------------------------------------------------------------------------------------ Edit Form -------------------------------------------------------------------------------------------------------------//
			onEdit: function () {
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length === 0) {
					MessageBox.error("Please select a row!");
					return;
				} else if (aSelectedIndices.length > 1) {
					MessageBox.show("Please select only one row.");
					return;
				}
				var oContext = oTable.getContextByIndex(aSelectedIndices[0]);
				var oSelectedData = oContext.getObject();
				var oLocalModel = this.getView().getModel("localModel");
				that
					.getView()
					.getModel("localModel")
					.setProperty("/DocNumber", oSelectedData.DocumentNumber);
				oLocalModel.setProperty(
					"/VehicleNumber",
					oSelectedData.VehicleNum || ""
				);
				// oLocalModel.setProperty("/TransporterGSTINNo", oSelectedData.TransporterGSTIN || "");
				oLocalModel.setProperty(
					"/transportdistance",
					oSelectedData.TransportDistanceinKM || ""
				);
				oLocalModel.setProperty(
					"/TransporterName",
					oSelectedData.TransporterName || ""
				);
				oLocalModel.setProperty(
					"/TransporterId",
					oSelectedData.TransporterID || ""
				);
				oLocalModel.setProperty(
					"/TransportDocNo",
					oSelectedData.TransportDocNum || ""
				);
				oLocalModel.setProperty(
					"/TransportDocDate",
					oSelectedData.TransportDocDate || ""
				);
				oLocalModel.setProperty(
					"/ModeOfTransport",
					oSelectedData.ModeOfTransport || ""
				);
				oLocalModel.setProperty(
					"/VehicleType",
					oSelectedData.VehicleType || ""
				);

				oLocalModel.setProperty("/portcode", oSelectedData.PortCode || "");
				oLocalModel.setProperty("/SubSupplyTypeDesc", oSelectedData.SubSupplyTypeDesc)
				// oLocalModel.setProperty("/DocNumber", oSelectedData.DocumentNumber || "");
				if (!this._EditFormDialog) {
					this._EditFormDialog = sap.ui.xmlfragment(
						"einvoiceewaybill.view.EditFormDialog",
						this
					);
					this.getView().addDependent(this._EditFormDialog);
					this._EditFormDialog.setContentWidth("600px");
				}

				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();

				if (aSelectedIndices.length !== 0) {
					for (var i = 0; i < aSelectedIndices.length; i++) {
						var selecteddata = oTable
							.getContextByIndex(aSelectedIndices[i])
							.getObject();
						console.log("selecteddata", selecteddata)
					}
				};

				var itemdata = tData.find(function (pItem) {
					return (
						pItem.AccountingDocument === selecteddata.Accountingdocument &&
						pItem.BillingDocument === selecteddata.BillingDocument &&
						pItem.DocumentReferenceID === selecteddata.DocumentReferenceID
						// pItem.CompanyCode === selecteddata.CompanyCode &&
						// pItem.BillingDocument === selecteddata.BillingDocument &&
						// pItem.BillingDocumentDate === selecteddata.BillingDate
					);
				});
				if (
					itemdata.BillingDocumentType === "F8" ||
					(itemdata.BillingDocumentType === "JSN" &&
						itemdata.TotalTaxAmount === "0.00")
				) {
					var doctype = "CHL";
					var subsupplytyp = "8";
					oLocalModel.setProperty("/subsupplydescVisibility", true);


				}
				else {
					oLocalModel.setProperty("/subsupplydescVisibility", false);
				}
				this._EditFormDialog.open();

				// var transportType = oLocalModel.getProperty("/TransporterType");
				// if (transportType === "1") {
				// 	that.getView().byId("element2").setVisible(false);
				// 	that.getView().byId("element3").setVisible(false);
				// 	that.getView().byId("element4").setVisible(true);
				// }
			},

			onDialogSave: function () {
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length === 0) {
					MessageBox.error("No row selected to update.");
					return;
				}
				var oContext = oTable.getContextByIndex(aSelectedIndices[0]);
				var oSelectedData = oContext.getObject();
				var oEntryModel = this.getView().getModel("entryModel");
				var oLocalModel = this.getView().getModel("localModel");
				oSelectedData.VehicleNum =
					oLocalModel.getProperty("/VehicleNumber") || "";
				// oSelectedData.TransporterGSTIN = oLocalModel.getProperty("/TransporterGSTINNo") || "";
				oSelectedData.TransportDistanceinKM =
					oLocalModel.getProperty("/transportdistance") || "";
				oSelectedData.TransporterName =
					oLocalModel.getProperty("/TransporterName") || "";
				oSelectedData.TransporterID =
					oLocalModel.getProperty("/TransporterId") || "";
				oSelectedData.TransportDocNum =
					oLocalModel.getProperty("/TransportDocNo") || "";
				oSelectedData.TransportDocDate =
					that.dateFormat(oLocalModel.getProperty("/TransportDocDate")) || "";
				oSelectedData.ModeOfTransport =
					oLocalModel.getProperty("/ModeOfTransport") || "";
				oSelectedData.VehicleType =
					oLocalModel.getProperty("/VehicleType") || "";
				oSelectedData.PortCode = oLocalModel.getProperty("/portcode") || "";
				oSelectedData.SubSupplyTypeDesc = oLocalModel.getProperty("/SubSupplyTypeDesc")
				var oData = oEntryModel.getData();
				var sPath = oContext.getPath();
				var iIndex = parseInt(sPath.split("/")[2]);
				oData[iIndex] = oSelectedData;
				oEntryModel.setData(oData);
				this._EditFormDialog.close();
				// MessageBox.success("Data updated successfully!");
				if (oSelectedData.PortCode == "") {
					that.oncheckdoc();
				} else {
					that.portaddress();
				}
			},

			onDialogCancel: function () {
				this._EditFormDialog.close();
			},

			portaddress: function () {
				var that = this;
				var oFilter = [];
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length === 0) {
					MessageBox.error("No row selected to update.");
					return;
				}
				var oContext = oTable.getContextByIndex(aSelectedIndices[0]);
				var oSelectedData = oContext.getObject();
				var oEntryModel = this.getView().getModel("entryModel");
				oFilter.push(
					new Filter("PortCode", FilterOperator.EQ, oSelectedData.PortCode)
				);
				this.getView().setBusy(true);
				that
					.getView()
					.getModel("mainService")
					.read("/YY1_EinvoiceDocs", {
						filters: oFilter,
						success: function (oData) {
							if (oData.results.length === 0) {
								MessageBox.error("Please Mantain Port Address");
								that.getView().setBusy(false);
								return;
							}
							oSelectedData.PortName = oData.results[0].PortName;
							oSelectedData.PortAddress1 = oData.results[0].Address1;
							oSelectedData.PortAddress2 = oData.results[0].Address2;
							oSelectedData.PortCity = oData.results[0].City;
							oSelectedData.PortPostalCode = oData.results[0].PostalCode;
							oSelectedData.PortRegionCode = oData.results[0].RegionCode;
							oSelectedData.PortCountry = oData.results[0].Country;

							var oData = oEntryModel.getData();
							var sPath = oContext.getPath();
							var iIndex = parseInt(sPath.split("/")[2]);
							oData[iIndex] = oSelectedData;
							oEntryModel.setData(oData);
							that.oncheckdoc();
						},
						error: function () {
							MessageBox.error("Error fetching port address data");
							that.getView().setBusy(false);
						},
					});
			},

			//---------------------------------------------------------------------------------------- Saveing to CBO data ----------------------------------------------------------------------------------------------//
			oncheckdoc: function () {
				var that = this;
				var ffilter = [];
				var oTable = that.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				for (var i = 0; i < aSelectedIndices.length; i++) {
					var selecteddata = oTable
						.getContextByIndex(aSelectedIndices[i])
						.getObject();
					ffilter.push(
						new Filter(
							"BillingDocument",
							FilterOperator.EQ,
							selecteddata.BillingDocument
						)
					);
					ffilter.push(
						new Filter(
							"CompanyCode",
							FilterOperator.EQ,
							selecteddata.CompanyCode
						)
					);
					// ffilter.push(new Filter("BillingDate", FilterOperator.EQ, selecteddata.BillingDocumentDate));
				}
				that.getView().setBusy(true);
				that
					.getView()
					.getModel("YY1_EINVOICE_CDS")
					.read("/YY1_EINVOICE", {
						filters: ffilter,
						success: function (oData) {
							if (oData.results.length === 0) {
								var oModel = that.getView().getModel("YY1_EINVOICE_CDS");
								var oTable = that.getView().byId("idEntryTable");
								var oHeaders = {
									"X-Requested-With": "X",
									Accept: "application/json",
								};
								var aSelectedIndices = oTable.getSelectedIndices();
								oModel.setUseBatch(true);
								var count = 0;

								for (var i = 0; i < aSelectedIndices.length; i++) {
									var selecteddata = oTable
										.getContextByIndex(aSelectedIndices[i])
										.getObject();
									var EdocumentStatus = "";
									if (selecteddata.EWayBill == undefined) {
										selecteddata.EWayBill = ""
									}

									if (
										selecteddata.InvoiceRefNum === "" &&
										selecteddata.EWayBill === "" &&
										selecteddata.Messages !== ""
									) {
										documentstatus = "eDocument has errors";
									} else if (
										selecteddata.InvoiceRefNum !== "" &&
										selecteddata.EWayBill === "" &&
										selecteddata.CancelledDate === ""
									) {
										documentstatus = "E-Invoice Generated";
									} else if (
										selecteddata.InvoiceRefNum !== "" &&
										selecteddata.EWayBill !== "" &&
										selecteddata.CancelledDate === "" &&
										selecteddata.EWBCancelDate === ""
									) {
										documentstatus = "Success";
									} else if (
										selecteddata.InvoiceRefNum === "" &&
										selecteddata.EWayBill !== "" &&
										selecteddata.CancelledDate === "" &&
										selecteddata.EWBCancelDate === ""
									) {
										documentstatus = "E-Way Bill Generated";
									}
									else if (selecteddata.EWayBill !== "" && selecteddata.EWBCancelDate !== "") {
										documentstatus = "E-Invoice Generated";
									}
									else if (
										selecteddata.InvoiceRefNum !== "" &&
										selecteddata.EWayBill !== "" &&
										selecteddata.CancelledDate !== "" &&
										selecteddata.EWBCancelDate !== ""
									) {
										documentstatus = "Cancelled";
									} else if (
										selecteddata.InvoiceRefNum !== "" &&
										selecteddata.CancelledDate !== ""
									) {
										documentstatus = "E-Invoice Cancelled";
									} else if (selecteddata.eWayBillStatus === true) {
										documentstatus = "E-Way Bill Cancelled";
									} else {
										documentstatus = selecteddata.DocumentStatus;
									}

									var sPath = "/YY1_EINVOICE";
									var oEntry = {
										BillingDocument: selecteddata.BillingDocument,
										CompanyCode: selecteddata.CompanyCode,
										FiscalYear: selecteddata.FiscalYear,
										EdocumentStatus: documentstatus,
										IRN: selecteddata.InvoiceRefNum,
										EWayBill: selecteddata.EWayBill,
										AcknowledgementNo: String(selecteddata.AcknowledgementNum),
										QRCode1: selecteddata.QRCode1,
										QRCode2: selecteddata.QRCode2,
										Message: selecteddata.Messages,
										CancelEwayBill: selecteddata.eWayBillStatus,
										EWayCancelReasonCode: selecteddata.CancellationCodeEWB,
										EWayCancellationRemark: selecteddata.EWBCancelRemark,
										EInvoiceReasonCode: selecteddata.EInvoiceReasonCode,
										EinvoiceCancellationRemark:
											selecteddata.EinvoiceCancellationRemark,
										TransporterID: selecteddata.TransporterID,
										TransportDocNo: selecteddata.TransportDocNum,
										TransporterGSTIN: selecteddata.TransporterGSTIN,
										TransporterName: selecteddata.TransporterName,
										ModeofTransport: selecteddata.ModeOfTransport,
										VehicleType: selecteddata.VehicleType,
										TransportDistanceinKM: selecteddata.TransportDistanceinKM,
										VehicleNo: selecteddata.VehicleNum,
										PortCode: selecteddata.PortCode,
										CancelEinvoice: selecteddata.CancelEinvoice,
										SubSupplyTypeDesc: selecteddata.SubSupplyTypeDesc,
										PDFURL: selecteddata.PDFURL,
										SummaryPDFURL:selecteddata.SummaryPDFURL

									};

									var fieldMappings = {
										BillingDate: "BillingDocumentDate",
										EwayBillValidFromDate: "ValidFromdate",
										EwayBillValidFromTime: "ValidFromtime",
										EwayBillValidToDate: "ValidTodate",
										EwayBillValidToTime: "ValidTotime",
										AcknowledgementDate: "AcknowledgementDate",
										EWayCancelDate: "EWBCancelDate",
										EinvoiceCancellationDate: "CancelledDate",
										TransportDocDate: "TransportDocDate",
										AcknowledgementTime: "AcknowledgementTime",
										EWayCancelTime: "EWayCancelTime",
										EinvoiceCancellationTime: "CancelledTime",
									};

									Object.keys(fieldMappings).forEach((field) => {
										var value = selecteddata[fieldMappings[field]];
										if (value !== "" && value !== "00:00:00") {
											if (field.includes("Date")) {
												oEntry[field] = that.convertDate(
													selecteddata[fieldMappings[field]]
												);
											} else if (field.includes("Time")) {
												oEntry[field] = that.convertEdmTime(
													selecteddata[fieldMappings[field]]
												);
											} else {
												oEntry[field] = selecteddata[fieldMappings[field]];
											}
										}
									});

									oModel.create(sPath, oEntry, {
										method: "POST",
										headers: oHeaders,
										changeSetId: "changeset " + i,
										success: function (oData, oResponse) {
											count++;
											if (count === aSelectedIndices.length) {
												// MessageBox.success("Data Saved Successfully");
												that.onExecute();
											}
										},
										error: function (err) {
											count++;
											var err1 = JSON.parse(err.responseText);
											let errormessage = err1.error.message.value;
											console.log(errormessage);
											if (count === aSelectedIndices.length) {
												MessageBox.error(
													"Failed to save the data: " + errormessage
												);
												that.getView().setBusy(false);
											}
										},
									});
								}

								that.getView().setBusy(true);
								oModel.submitChanges({
									success: function (oData, oResponse) { },
									error: function (err) { },
								});
							} else {
								var oModel = that.getView().getModel("YY1_EINVOICE_CDS");
								var oTable = that.getView().byId("idEntryTable");
								var oHeaders = {
									"X-Requested-With": "X",
									Accept: "application/json",
									"If-Match": "*",
								};
								var aSelectedIndices = oTable.getSelectedIndices();
								oModel.setUseBatch(true);
								var count = 0;

								for (var i = 0; i < aSelectedIndices.length; i++) {
									var selecteddata = oTable
										.getContextByIndex(aSelectedIndices[i])
										.getObject();
									var documentstatus = "";

									if (
										selecteddata.InvoiceRefNum === "" &&
										selecteddata.EWayBill === "" &&
										selecteddata.Messages !== ""
									) {
										documentstatus = "eDocument has errors";
									} else if (
										selecteddata.InvoiceRefNum !== "" &&
										selecteddata.EWayBill === "" &&
										selecteddata.CancelledDate === ""
									) {
										documentstatus = "E-Invoice Generated";
									} else if (
										selecteddata.InvoiceRefNum !== "" &&
										selecteddata.EWayBill !== "" &&
										selecteddata.CancelledDate === "" &&
										selecteddata.EWBCancelDate === ""
									) {
										documentstatus = "Success";
									} else if (
										selecteddata.InvoiceRefNum === "" &&
										selecteddata.EWayBill !== "" &&
										selecteddata.CancelledDate === "" &&
										selecteddata.EWBCancelDate === ""
									) {
										documentstatus = "E-Way Bill Generated";
									} else if (
										selecteddata.InvoiceRefNum === "" &&
										selecteddata.EWayBill !== "" &&
										selecteddata.CancelledDate === "" &&
										selecteddata.EWBCancelDate !== ""
									) {
										documentstatus = "E-Way Bill Cancelled";
									}
									else if (selecteddata.EWayBill !== "" && selecteddata.EWBCancelDate !== "") {
										documentstatus = "E-Invoice Generated";}
									 else if (
										selecteddata.InvoiceRefNum !== "" &&
										selecteddata.EWayBill !== "" &&
										selecteddata.CancelledDate !== "" &&
										selecteddata.EWBCancelDate !== ""
									) {
										documentstatus = "Cancelled";
									} else if (
										selecteddata.InvoiceRefNum !== "" &&
										selecteddata.EWayBill === "" &&
										selecteddata.CancelledDate !== "" &&
										selecteddata.EWBCancelDate === ""
									) {
										documentstatus = "E-Invoice Cancelled";
									} else {
										documentstatus = selecteddata.DocumentStatus;
									}

									var matchuuid = oData.results.find(function (pItem) {
										return (
											pItem.BillingDocument === selecteddata.BillingDocument &&
											pItem.CompanyCode === selecteddata.CompanyCode &&
											that.dateFormat4(pItem.BillingDate) ===
											that.dateFormat4(selecteddata.BillingDocumentDate)
										);
									});
									// var sPath = "/YY1_EINVOICEINDIA(SAP_UUID=guid'" + oData.results[0].SAP_UUID + "')";
									var sPath =
										"/YY1_EINVOICE(SAP_UUID=guid'" +
										matchuuid.SAP_UUID +
										"')";
									var oEntry = {
										BillingDocument: selecteddata.BillingDocument,
										CompanyCode: selecteddata.CompanyCode,
										FiscalYear: selecteddata.FiscalYear,
										EdocumentStatus: documentstatus,
										IRN: selecteddata.InvoiceRefNum,
										EWayBill: selecteddata.EWayBill,
										AcknowledgementNo: String(selecteddata.AcknowledgementNum),
										QRCode1: selecteddata.QRCode1,
										QRCode2: selecteddata.QRCode2,
										Message: selecteddata.Messages,
										CancelEwayBill: selecteddata.eWayBillStatus,
										EWayCancelReasonCode: selecteddata.CancellationCodeEWB,
										EWayCancellationRemark: selecteddata.EWBCancelRemark,
										EInvoiceReasonCode: selecteddata.EInvoiceReasonCode,
										EinvoiceCancellationRemark:
											selecteddata.EinvoiceCancellationRemark,
										TransporterID: selecteddata.TransporterID,
										TransportDocNo: selecteddata.TransportDocNum,
										TransporterGSTIN: selecteddata.TransporterGSTIN,
										TransporterName: selecteddata.TransporterName,
										ModeofTransport: selecteddata.ModeOfTransport,
										VehicleType: selecteddata.VehicleType,
										TransportDistanceinKM: selecteddata.TransportDistanceinKM,
										VehicleNo: selecteddata.VehicleNum,
										PortCode: selecteddata.PortCode,
										SubSupplyTypeDesc: selecteddata.SubSupplyTypeDesc,
										PDFURL: selecteddata.PDFURL,
										SummaryPDFURL:selecteddata.SummaryPDFURL,
										//   PortName: selecteddata.PortName,
										//   PortAddress1: selecteddata.PortAddress1,
										//   PortAddress2: selecteddata.PortAddress2,
										//   PortCity: selecteddata.PortCity,
										//   PortPostalCode: selecteddata.PortPostalCode,
										//   PortRegionCode: selecteddata.PortRegionCode,
										//   PortCountry: selecteddata.PortCountry,
										CancelEinvoice: selecteddata.CancelEinvoice,
									};

									var fieldMappings = {
										BillingDate: "BillingDocumentDate",
										EwayBillValidFromDate: "ValidFromdate",
										EwayBillValidFromTime: "ValidFromtime",
										EwayBillValidToDate: "ValidTodate",
										EwayBillValidToTime: "ValidTotime",
										AcknowledgementDate: "AcknowledgementDate",
										EWayCancelDate: "EWBCancelDate",
										EinvoiceCancellationDate: "CancelledDate",
										TransportDocDate: "TransportDocDate",
										AcknowledgementTime: "AcknowledgementTime",
										EWayCancelTime: "EWayCancelTime",
										EinvoiceCancellationTime: "CancelledTime",
									};

									Object.keys(fieldMappings).forEach((field) => {
										var value = selecteddata[fieldMappings[field]];
										if (value !== "" && value !== "00:00:00") {
											if (field.includes("Date")) {
												oEntry[field] = that.convertDate(
													selecteddata[fieldMappings[field]]
												);
											} else if (field.includes("Time")) {
												oEntry[field] = that.convertEdmTime(
													selecteddata[fieldMappings[field]]
												);
											} else {
												oEntry[field] = selecteddata[fieldMappings[field]];
											}
										}
									});

									oModel.update(sPath, oEntry, {
										method: "PATCH",
										headers: oHeaders,
										changeSetId: "changeset " + i,
										success: function (oData, oResponse) {
											count++;
											if (count === aSelectedIndices.length) {
												// MessageBox.success("Data Saved Successfully");
												that.onExecute();
											}
										},
										error: function (err) {
											count++;
											var err1 = JSON.parse(err.responseText);
											let errormessage = err1.error.message.value;
											console.log(errormessage);
											if (count === aSelectedIndices.length) {
												MessageBox.error(
													"Failed to save the data: " + errormessage
												);
												that.getView().setBusy(false);
											}
										},
									});
								}

								that.getView().setBusy(true);
								oModel.submitChanges({
									success: function (oData, oResponse) { },
									error: function (err) { },
								});
							}
						},
						error: function () {
							MessageBox.error("Error fetching eDocument data");
							that.getView().setBusy(false);
						},
					});
			},

			//-------------------------------------------------------------------------------------- Generate IRN -------------------------------------------------------------------------------------------------------//

			onGenerateIRN: async function () {
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				that.getView().setBusy(true);
				var irncount = 0;
				if (aSelectedIndices.length !== 0) {
					for (var i = 0; i < aSelectedIndices.length; i++) {
						var selecteddata = oTable
							.getContextByIndex(aSelectedIndices[i])
							.getObject();
						var items = [],
							AssVal = 0,
							CgstVal = 0,
							SgstVal = 0,
							IgstVal = 0,
							Discount = 0,
							OthChrg = 0;
						var itemdata = tData.filter(function (pItem) {
							return (
								pItem.AccountingDocument === selecteddata.Accountingdocument &&
								pItem.BillingDocument === selecteddata.BillingDocument &&
								pItem.DocumentReferenceID === selecteddata.DocumentReferenceID
							);
						});
						for (var j = 0; j < itemdata.length; j++) {
							var salesdoccat = itemdata[j].SalesDocumentItemCategory;
							if (salesdoccat === "TAD") {
								var IsServc = "Y";
							} else {
								var IsServc = "N";
							}
							if (itemdata[j].ZTAXAmount === "0.00") {
								AssVal = (
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate) +
									parseFloat(AssVal)
								).toFixed(2);
								var assamt = (
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate)
								).toFixed(2);
							} else {
								var assamt = (
									(parseFloat(itemdata[j].NetAmount) +
										parseFloat(itemdata[j].TaxAmount)) *
									parseFloat(itemdata[j].AccountingExchangeRate)
								).toFixed(2);
								AssVal = (parseFloat(assamt) + parseFloat(AssVal)).toFixed(2);
							}
							CgstVal = (
								parseFloat(itemdata[j].JOCGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate) +
								parseFloat(CgstVal)
							).toFixed(2);
							SgstVal = (
								parseFloat(itemdata[j].JOSGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate) +
								parseFloat(SgstVal)
							).toFixed(2);
							IgstVal = (
								parseFloat(itemdata[j].JOIGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate) +
								parseFloat(IgstVal)
							).toFixed(2);
							Discount =
								(parseFloat(Math.abs(itemdata[j].ZTAXAmount)) *
									parseFloat(itemdata[j].AccountingExchangeRate)) +
								parseFloat(Discount);

							// var unitprice = (parseFloat(itemdata[j].ConditionAmount) / parseFloat(itemdata[j].BillingQuantity)) * (parseFloat(itemdata[j].AccountingExchangeRate))
							var unitprice = (
								(parseFloat(assamt) / parseFloat(itemdata[j].BillingQuantity)) *
								parseFloat(itemdata[j].AccountingExchangeRate)
							).toFixed(2);
							var totalamt;
							if (itemdata[j].ZTAXAmount != 0) {
								totalamt = (parseFloat(itemdata[j].NetAmount) + parseFloat(itemdata[j].TaxAmount)) * parseFloat(itemdata[j].AccountingExchangeRate);
							} else {
								totalamt =
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate);
							}

							// var discount =
							//   (parseFloat(itemdata[j].ConditionAmount_4) +
							// 	parseFloat(itemdata[j].ConditionAmount_7) +
							// 	parseFloat(itemdata[j].ConditionAmount_8)) *
							//   parseFloat(itemdata[j].AccountingExchangeRate);

							var gstrate =
								parseFloat(itemdata[j].JOIGRate) +
								parseFloat(itemdata[j].JOCGRate) +
								parseFloat(itemdata[j].JOSGRate);
							var igstamt = (
								parseFloat(itemdata[j].JOIGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate)
							).toFixed(2);
							var cgstamt = (
								parseFloat(itemdata[j].JOCGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate)
							).toFixed(2);
							var sgstamt = (
								parseFloat(itemdata[j].JOSGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate)
							).toFixed(2);
							// var otherchrg = ((parseFloat(itemdata[j].ConditionAmount_5) + parseFloat(itemdata[j].JTC2Amount) + parseFloat(itemdata[j].ZFRCAmount) + parseFloat(itemdata[j].ZFREAmount) + parseFloat(itemdata[j].ZLB1Amount) + parseFloat(itemdata[j].FPA1Amount)) * parseFloat(itemdata[j].AccountingExchangeRate)).toFixed(2)
							var otherchrg =
								parseFloat(itemdata[j].JTC2Amount) *
								parseFloat(itemdata[j].AccountingExchangeRate);
							OthChrg = (parseFloat(otherchrg) + parseFloat(OthChrg)).toFixed(
								2
							);
							if (itemdata[j].ZTAXAmount === "0.00") {
								var totitemval = (
									(parseFloat(itemdata[j].NetAmount) +
										parseFloat(itemdata[j].TaxAmount)) *
									parseFloat(itemdata[j].AccountingExchangeRate)
								).toFixed(2);
							} else {
								var totitemval = (
									(parseFloat(itemdata[j].NetAmount) +
										parseFloat((itemdata[j].TaxAmount) * 2)) *
									parseFloat(itemdata[j].AccountingExchangeRate)
								).toFixed(2);
							}
							if (parseFloat(itemdata[j].BillingQuantity) > 0) {
								var obj = {
									SlNo: itemdata[j].BillingDocumentItem,//"000010",
									PrdDesc: itemdata[j].BillingDocumentItemText,//"Woven Textile Fabric",
									IsServc: IsServc,//"N", //y
									HsnCd: itemdata[j].ConsumptionTaxCtrlCode,//"520100", //998314
									// Barcde: "",
									Qty: itemdata[j].BillingQuantity,//1.0,
									FreeQty: 0,
									Unit: itemdata[j].UnitQuantityCode,// "NOS",
									UnitPrice: unitprice,//99600.0,
									TotAmt: totalamt,//99600.0,
									Discount: 0.0,//parseFloat(Math.abs(itemdata[j].ZTAXAmount))*parseFloat(itemdata[j].AccountingExchangeRate),//0.0,

									// PreTaxVal: 0.0,
									cgstrt: parseFloat(itemdata[j].JOCGRate).toFixed(
										2
									),
									cgstamt: String(cgstamt),
									sgstrt: parseFloat(itemdata[j].JOSGRate).toFixed(
										2
									),
									sgstamt: String(sgstamt),
									igstrt: parseFloat(itemdata[j].JOIGRate).toFixed(
										2
									),
									AssAmt: assamt,// 99600.0,
									GstRt: gstrate,// 0.0,
									CgstAmt: cgstamt,// 0.0,
									SgstAmt: sgstamt,// 0.0,
									IgstAmt: String(igstamt),// 0.0,
									CesAmt: 0.0,
									CesRt: 0.0,
									CesNonAdvlAmt: 0.0,
									StateCesRt: 0.0,
									StateCesAmt: 0.0,
									StateCesNonAdvlAmt: 0.0,
									OthChrg: otherchrg,// 0.0,
									TotItemVal: String(totitemval),//99600.0,
									// OrdLineRef: "",
									OrgCntry: itemdata[j].DepartureCountry,//"",
									// PrdSlNo: "",
									// AttribDtls: [
									// 	{
									// 		Nm: "",
									// 		Val: "",
									// 		SlNo: null,
									// 	},
									// ],
									// BchDtls: {
									// 	SlNo: null,
									// 	Nm: "",
									// 	ExpDt: "",
									// 	WrDt: "",
									// },

									// prdnm: itemdata[j].BillingDocumentItemText,
									// hsncd: itemdata[j].ConsumptionTaxCtrlCode,
									// qty: itemdata[j].BillingQuantity,
									// uqc: itemdata[j].EinvoiceUnitQuantityCode,
									// unitrate: unitprice,
									// grossamt: assamt,
									// assamt: assamt,
									// taxability: "TAX",
									// cgstrt: parseFloat(itemdata[j].JOCGRate).toFixed(
									// 	2
									// ),
									// cgstamt: String(cgstamt),
									// sgstrt: parseFloat(itemdata[j].JOSGRate).toFixed(
									// 	2
									// ),
									// sgstamt: String(sgstamt),
									// igstrt: parseFloat(itemdata[j].JOIGRate).toFixed(
									// 	2
									// ),
									// igstamt: String(igstamt),
									// cessrt: "0.00",
									// cessamt: "0.00",
									// cessnonadval: "0.00",
									// // "discount": discount,
									// othchrg: otherchrg,
									// statecessrt: "0.00",
									// statecessamt: "0.00",
									// totitemval: String(totitemval),
								};
								items.push(obj);
							}
						}
						//pending
						var selleradrs2 =
							(itemdata[0].PlantStreet || "") +
							(itemdata[0].PlantStreet2 || "");
						var buyeradrs2 =
							(itemdata[0].BillToPartyStreet || "") +
							(itemdata[0].BillToPartyStreet2 || "")
						if (itemdata[0].BillToPartyCountry === "IN") {
							var buyergstin = itemdata[0].BillToPartyGSTIN;
							var buyerpos = itemdata[0].BillToPartyRegion;
							var buyerpin = itemdata[0].BillToPartyPostalCode;
							var buyerstdcode = STATECODE.find((item) => {
								return itemdata[0].BillToPartyRegion === item.Region
							});
							var buyerstd = buyerstdcode.ITDStateCode

						} else {
							var buyergstin = "URP";
							var buyerstd = "96";
							var buyerpin = "999999";
						}
						if (itemdata[0].ShipToPartyCountry === "IN") {
							var portcode = selecteddata.PortCode;
							var shipgstin = itemdata[0].ShipToPartyGSTIN;
							var shipligname = itemdata[0].ShipToPartyCustomerName;
							// var shipaddr1 = itemdata[0].ShipToPartyStreet;
							//pending
							var shipaddr1 =
								(itemdata[0].ShipToPartyStreet || "") +
								(itemdata[0].ShipToPartyStreet2 || "")
							var shiploc = itemdata[0].ShipToPartyCity;
							var shippin = itemdata[0].ShipToPartyPostalCode;
							var shipstcd = itemdata[0].ShipToPartyRegion;
							var shipstdcode = STATECODE.find((item) => {
								return itemdata[0].ShipToPartyRegion === item.Region
							});
							var shipstd = shipstdcode.ITDStateCode

						} else {
							var portcode = selecteddata.PortCode;
							console.log("portcode", selecteddata)
							console.log("portcode", portcode)

							debugger
							if (portcode == "") {
								MessageBox.error(
									"Please maintain the port code by selecting Edit Eway Bill Details."
								);
								return;
							} else { //fetch the data from cds in place of cbo itemdata[0]
								var shipgstin = "URP";
								var shipligname = selecteddata.PortName;
								var shipaddr1 = selecteddata.PortAddress1;
								var shipadd2 = itemdata[0].PortAddress2//selecteddata.PortAddress2;
								var shiploc = itemdata[0].PortCity//selecteddata.PortCity;
								var shippin = itemdata[0].PortPostalCode //selecteddata.PortPostalCode;
								var shipstd = itemdata[0].PortRegion//selecteddata.PortRegionCode;
								// var shipstdcode = STATECODE.find((item)=>{
								// 	return itemdata[0].PortRegion=== item.Region
								// });
								// var shipstd = shipstdcode.ITDStateCode

							}
						}
						//no chnges trnasaction mode is not in logitax
						if (itemdata[0].BillToParty === itemdata[0].ShipToParty) {
							var transmode = "REG";
						} else {
							var transmode = "SHP";
						}

						var TotInvVal = (
							(parseFloat(itemdata[0].TotalNetAmount) +
								parseFloat(itemdata[0].TotalTaxAmount)) *
							parseFloat(itemdata[0].AccountingExchangeRate)
						).toFixed(2);
						var TotInvValFc =
							parseFloat(itemdata[0].TotalNetAmount) +
							parseFloat(itemdata[0].TotalTaxAmount);

						if (itemdata[0].TotalTaxAmount === "0.00") {
							var wthpay = "N";
						} else {
							var wthpay = "Y";
						}

						var oPayload = {
							"Version": "1.1",
							"TranDtls": {
								"TaxSch": "GST",
								"SupTyp": itemdata[0].SupType,//"B2B",
								"RegRev": "N",
								"EcmGstin": null,
								"IgstOnIntra": "N",
							},
							"DocDtls": {
								"Typ": itemdata[0].DocType,
								"No": itemdata[0].DocumentReferenceID,
								"Dt": that.dateFormat1(itemdata[0].BillingDocumentDate)
							},
							"SellerDtls": {
								"Gstin": itemdata[0].PlantGSTIN,
								"LglNm": itemdata[0].PlantName,//"DTA Cybercity Pune",
								"TrdNm": itemdata[0].PlantName,//"",
								"Addr1": itemdata[0].PlantStreet,//"LEVEL 5, WING A AND WING B, TOWER I",
								// "Addr2": selleradrs2,//itemdata[0].PlantStreet2,//"",
								"Loc": itemdata[0].PlantCity,//"MAGARPATTA CITY, HADAPSAR, PUNE",
								"Pin": itemdata[0].PlantPostalCode,//"411013",
								"Stcd": itemdata[0].PlantStateCode,//"27",

								//   Ph: "",
								//   Em: "",
							},
							"BuyerDtls": {
								"Gstin": buyergstin,//itemdata[0].BillToPartyGSTIN,//"27AAAPI3182M002",
								"LglNm": itemdata[0].BillToPartyCustomerName,//"EXL SERVICE. COM INDIA",
								"TrdNm": itemdata[0].BillToPartyCustomerName,//"",
								"Pos": buyerstd,//itemdata[0].BillToPartyRegion,//"09",
								"Addr1": buyeradrs2,//itemdata[0].BillToPartyStreet,//"8th Floor of Wing A of Building",
								// Addr2: buyeradrs2,//itemdata[0].BillToPartyStreet,//"",
								"Loc": itemdata[0].BillToPartyCity,//"Gautam Buddha Nagar",
								"Pin": buyerpin,//itemdata[0].BillToPartyPostalCode,//"444999",
								//   Ph: "",
								//   Em: "",
								"Stcd": buyerstd,//itemdata[0].BillToPartyRegion//"27",
							},
							// DispDtls: {
							// 	//   Nm: "",
							// 	//   Addr1: "",
							// 	//   Addr2: "",
							// 	//   Loc: "",
							// 	//   Pin: "",
							// 	//   Stcd: "",
							// },
							"ShipDtls": {
								"Gstin": shipgstin,//itemdata[0].ShipToPartyGSTIN,//"",
								"LglNm": shipligname,// itemdata[0].ShipToPartyCustomerName,//"EXL SERVICE. COM INDIA",
								"TrdNm": shipligname,// itemdata[0].ShipToPartyCustomerName,//"",
								"Addr1": shipaddr1,// itemdata[0].ShipToPartyStreet,//"8th Floor of Wing A of Building",
								// Addr2: itemdata[0].ShipToPartyStreet,//"",
								"Loc": shiploc,// itemdata[0].ShipToPartyCity,//"Gautam Buddha Nagar",
								"Pin": shippin,// itemdata[0].ShipToPartyPostalCode,//"201306",
								"Stcd": shipstd,//itemdata[0].ShipToPartyRegion   //"09",
							},
							"ValDtls": {
								"AssVal": AssVal,//99600.0,
								"CgstVal": CgstVal,//0.0,
								"SgstVal": SgstVal,//0.0,
								"IgstVal": IgstVal,// 0.0,
								"CesVal": 0.0,
								"StCesVal": 0.0,
								"RndOffAmt": 0.0,
								"TotInvVal": TotInvVal,//99600.0,
								"TotInvValFc": TotInvValFc,// 0.0,
								"Discount": Discount,// 0.0,
								"OthChrg": 0.0,
							},
							"ItemList": items,
							// PayDtls: {
							// 	//   Nm: "",
							// 	//   AccDet: "",
							// 	//   Mode: "",
							// 	//   FinInsBr: "",
							// 	//   PayTerm: "",
							// 	//   PayInstr: "",
							// 	//   CrTrn: "",
							// 	//   DirDr: "",
							// 	//   CrDay: null,
							// 	//   PaidAmt: 0.0,
							// 	//   PaymtDue: 0.0,
							// },
							"RefDtls": {
								//   InvRm: "",
								//   DocPerdDtls: {
								// 	InvStDt: "",
								// 	InvEndDt: "",
								//   },
								//   PrecDocDtls: [
								// 	{
								// 	  InvNo: "",
								// 	  InvDt: "",
								// 	  OthRefNo: "",
								// 	},
								//   ],
								"ContrDtls": [
									{
										// RecAdvRefr: "",
										// RecAdvDt: "",
										// TendRefr: "",
										// ContrRefr: "",
										// ExtRefr: "",
										// ProjRefr: "",
										PORefr: itemdata[0].PurchaseOrderByCustomer,//"",
										PORefDt: that.dateFormat1(itemdata[0].CustomerPurchaseOrderDate),//"",
									},
								],
							},
							"ExpDtls": {
								//   ShipBNo: "",
								//   ShipBDt: "",
								"Port": itemdata[0].PortCode,//"",
								//   RefClm: "",
								"ForCur": itemdata[0].TransactionCurrency_1,//"",
								"CntCode": itemdata[0].BillToPartyCountry,//"",
								//   ExpDuty: null,
							},
							"AddlDocDtls": [
								{
									"Url": "",
									"Docs": "",
									"Info": "",
								},
							],

							"EwbDtls": {
								"TransId": "",
								"TransName": "",
								"TransMode": "",
								"Distance": null,
								"TransDocNo": "",
								"TransDocDt": "",
								"VehNo": "",
								"VehType": "",
							}
						}
							;
						var oHeaders = {
							Authorization: "Basic " + btoa("G0111" + ":" + "Admin@123"),
							// "Content-Type": "application/json"
							// "Authorization": "Basic MjIyMjpBZG1pbkAxMjM0"
						};

						this.getView().setBusy(true);
						await $.ajax({
							url: `https://testdigisign.primustechsys.com:4001/api/auth`,
							// url: `https://primebridge.primustechsys.com/api/auth`,
							type: "GET",
							beforeSend: function (xhr) {
								// xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
								xhr.setRequestHeader(
									"Authorization",
									"Basic " + btoa("G0111" + ":" + "Admin@123")
								);
								xhr.setRequestHeader("Content-Type", "application/json");
							},
							async: true, // Use asynchronous request
							success: async function (data) {
								console.log("Token received:", data);
								let jsonData = JSON.parse(data);
								var tokens = jsonData.access_token;
								// var username = jsonData.userName
								var oHeaders = {
									// 'X-CSRF-Token': '',
									// "Authorization": "Basic " + base64Credentials,
									// "Content-Type": "application/json"

									// 'Clientcode': selecteddata.Clientcode,
									CustomerCode: "G0111",
									Token: tokens,
									"Content-Type": "application/JSON",
								};
								that.getView().setBusy(true);
								await $.ajax({
									// url: '/api/Invoice/GenerateIRN?gstin=27AALCC5030G1ZT',
									url: `https://testdigisign.primustechsys.com:4001/api/Invoice/GenerateIRN?gstin=${itemdata[0].PlantGSTIN}`,
									// url: `https://primebridge.primustechsys.com/api/Invoice/GenerateIRN?gstin=${itemdata[0].PlantGSTIN}`,
									type: "POST",
									data: JSON.stringify(oPayload),
									headers: oHeaders,
									async: false,
									success: function (data) {
										console.log("success" + data);
										let result = data[0];
										if (result.status === "ACT") {
											if (result.irn !== null) {
												if (result.status === "ACT") {
													MessageBox.success(result.message);
													sap.m.MessageToast.show(
														"IRN generated successfully!"
													);
													let ackdate = result.ackDt;
													// Store the first 1000 characters
													let QrfirstPart = result.signedQRCode.slice(0, 500);

													// Store remaining characters if any
													let QrsecondPart =
														result.signedQRCode.length > 500
															? result.signedQRCode.slice(500)
															: "";

													selecteddata.InvoiceRefNum = result.irn;
													selecteddata.AcknowledgementNum = result.ackNo;
													selecteddata.AcknowledgementDate = ackdate;
													// selecteddata.AcknowledgementTime = acktime;
													selecteddata.QRCode1 = QrfirstPart;
													selecteddata.QRCode2 = QrsecondPart;
													var omodel = that.getView().getModel("entryModel");
													omodel.refresh(true);
												} else {
													sap.m.MessageToast.show(
														"Error while IRN generation!"
													);
													// that.getView().getModel("entryModel").setProperty("/items/" + selecteddata.Messages + "/Messages", data.error[0].error_desc);
													selecteddata.Messages =
														result.irn.error[0].error_desc;
												}
											}
										} else {
											sap.m.MessageToast.show("Error while IRN generation!");
											sap.m.MessageBox.error(data[0].message);
											// var msg = data.Errors[0].error_desc
											// that.getView().getModel("entryModel").setProperty("/items/" + msg  + "/Messages", data.Errors[0].error_desc);
											selecteddata.Messages = data[0].message;
											that.getView().setBusy(false);

										}
										// that.getView().setBusy(false);
										irncount++;
										if (irncount >= aSelectedIndices.length) {
											that.oncheckdoc();
										}
									},
									error: function (e) {
										console.log("error: " + e);
										that.getView().setBusy(false);
									},
								});
							},
							error: function (xhr, status, error) {
								console.log("Error:", status, error);
								MessageBox.error("Token generation failed");
								return error;
								that.getView().setBusy(false);
							},
						});
					}
				} else {
					sap.m.MessageToast.show("Please select at least one record!");
				}
			},
			// ---------------------------------------------------------------------------------------------- Token Access ---------------------------------------------------------------------------------------------------//
			tokenaccess: function (user, password) {
				var that = this;
				// var base64Credentials = btoa(user + ":" + password);
				var oHeaders = {
					Authorization: "Basic " + btoa("G0111" + ":" + "Admin@123"),
					"Content-Type": "application/json",
				};
				this.getView().setBusy(true);
				$.ajax({
					// url: `api/auth?username=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}`, // Use the correct full URL
					url: `https://testdigisign.primustechsys.com:4001/api/auth`,
					// url: `https://primebridge.primustechsys.com/api/auth`,
					type: "GET",
					headers: oHeaders,
					async: false, // Use asynchronous request
					success: function (data) {
						console.log("Token received:", data);
						let jsonData = JSON.parse(data);
						var tokens = jsonData.access_token;
						var username = jsonData.userName;
						that.getView().setBusy(false);
						return tokens;
					},
					error: function (xhr, status, error) {
						console.log("Error:", status, error);
						MessageBox.error("Token generation failed");
						return error;
						that.getView().setBusy(false);
					},
				});
			},

			// ------------------------------------------------------------------------------------------------- download Payloads ---------------------------------------------------------------------------------------------//
			downloadPayload: function () {
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length > 1) {
					sap.m.MessageToast.show("Please select only one record!");
				} else if (aSelectedIndices.length === 0) {
					sap.m.MessageToast.show("Please select a record!");
				} else {
					for (var i = 0; i < aSelectedIndices.length; i++) {
						var selecteddata = oTable
							.getContextByIndex(aSelectedIndices[i])
							.getObject();
						var items = [],
							AssVal = 0,
							CgstVal = 0,
							SgstVal = 0,
							IgstVal = 0,
							Discount = 0,
							OthChrg = 0;
						var itemdata = tData.filter(function (pItem) {
							return (
								pItem.AccountingDocument === selecteddata.Accountingdocument &&
								pItem.BillingDocument === selecteddata.BillingDocument &&
								pItem.DocumentReferenceID === selecteddata.DocumentNumber
							);
						});
						// if (selecteddata.InvoiceRefNum !== "" || selecteddata.EWayBill !== "") {
						// 	MessageBox.error("The IRN/E-way bill has already been generated ");
						// 	return;
						// }
						for (var j = 0; j < itemdata.length; j++) {
							var salesdoccat = itemdata[j].SalesDocumentItemCategory;
							if (salesdoccat === "TAD") {
								var IsServc = "Y";
							} else {
								var IsServc = "N";
							}
							if (itemdata[j].ConditionAmount_4 === "0.00") {
								AssVal =
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate) +
									parseFloat(AssVal);
								var assamt =
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate);
							} else {
								var assamt =
									(parseFloat(itemdata[j].ConditionAmount_4) +
										(parseFloat(itemdata[j].JOIGAmount) +
											parseFloat(itemdata[j].JOCGAmount) +
											parseFloat(itemdata[j].JOSGAmount))) *
									parseFloat(itemdata[j].AccountingExchangeRate);
								AssVal = assamt + parseFloat(AssVal);
							}

							CgstVal =
								parseFloat(itemdata[j].JOCGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate) +
								parseFloat(CgstVal);
							SgstVal =
								parseFloat(itemdata[j].JOSGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate) +
								parseFloat(SgstVal);
							IgstVal =
								parseFloat(itemdata[j].JOIGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate) +
								parseFloat(IgstVal);
							Discount =
								(parseFloat(itemdata[j].ConditionAmount_4) +
									parseFloat(itemdata[j].ConditionAmount_7) +
									parseFloat(itemdata[j].ConditionAmount_8)) *
								parseFloat(itemdata[j].AccountingExchangeRate) +
								parseFloat(Discount);

							// var unitprice = (parseFloat(itemdata[j].ConditionAmount) / parseFloat(itemdata[j].BillingQuantity)) * (parseFloat(itemdata[j].AccountingExchangeRate))
							var unitprice = (
								(parseFloat(assamt) / parseFloat(itemdata[j].BillingQuantity)) *
								parseFloat(itemdata[j].AccountingExchangeRate)
							).toFixed(2);
							var totalamt =
								parseFloat(itemdata[j].ConditionAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate);
							var discount =
								(parseFloat(itemdata[j].ConditionAmount_4) +
									parseFloat(itemdata[j].ConditionAmount_7) +
									parseFloat(itemdata[j].ConditionAmount_8)) *
								parseFloat(itemdata[j].AccountingExchangeRate);

							var gstrate =
								parseFloat(itemdata[j].JOIGRate) +
								parseFloat(itemdata[j].JOCGRate) +
								parseFloat(itemdata[j].JOSGRate);
							var igstamt =
								parseFloat(itemdata[j].JOIGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate);
							var cgstamt =
								parseFloat(itemdata[j].JOCGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate);
							var sgstamt =
								parseFloat(itemdata[j].JOSGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate);
							// var otherchrg = ((parseFloat(itemdata[j].ConditionAmount_5) + parseFloat(itemdata[j].JTC2Amount) + parseFloat(itemdata[j].ZFRCAmount) + parseFloat(itemdata[j].ZFREAmount) + parseFloat(itemdata[j].ZLB1Amount) + parseFloat(itemdata[j].FPA1Amount)) * parseFloat(itemdata[j].AccountingExchangeRate))
							var otherchrg =
								parseFloat(itemdata[j].JTC2Amount) *
								parseFloat(itemdata[j].AccountingExchangeRate);
							OthChrg = otherchrg + parseFloat(OthChrg);
							var totitemval = (
								(parseFloat(itemdata[j].NetAmount) +
									parseFloat(itemdata[j].TaxAmount)) *
								parseFloat(itemdata[j].AccountingExchangeRate)
							).toFixed(2);
							if (parseFloat(itemdata[j].BillingQuantity) > 0) {
								var obj = {
									prdnm: itemdata[j].BillingDocumentItemText,
									hsncd: itemdata[j].ConsumptionTaxCtrlCode,
									qty: itemdata[j].BillingQuantity,
									uqc: itemdata[j].EinvoiceUnitQuantityCode,
									unitrate: unitprice,
									grossamt: String(Math.abs(assamt)),
									assamt: String(Math.abs(assamt)),
									taxability: "TAX",
									cgstrt: parseFloat(itemdata[j].JOCGRate).toFixed(
										2
									),
									cgstamt: String(cgstamt),
									sgstrt: parseFloat(itemdata[j].JOSGRate).toFixed(
										2
									),
									sgstamt: String(sgstamt),
									igstrt: parseFloat(itemdata[j].JOIGRate).toFixed(
										2
									),
									igstamt: String(igstamt),
									cessrt: "0.00",
									cessamt: "0.00",
									cessnonadval: "0.00",
									// "discount": String(Math.abs(discount)),
									othchrg: otherchrg,
									statecessrt: "0.00",
									statecessamt: "0.00",
									totitemval: String(totitemval),
								};
								items.push(obj);
							}
						}
						// if (selecteddata.TransportDistanceinKM === "" && selecteddata.TransportDocDate === "" && selecteddata.VehicleNum === "" && selecteddata.VehicleType === "" && selecteddata.ModeOfTransport === "") {
						// 	MessageBox.error("Please complete the e-way bill details before proceeding.");
						// 	return;
						// }

						var selleradrs2 =
							(itemdata[0].StreetPrefixName1 || "") +
							(itemdata[0].StreetPrefixName2 || "");
						var buyeradrs2 =
							(itemdata[0].StreetPrefixName1_1 || "") +
							(itemdata[0].StreetPrefixName2_1 || "") +
							(itemdata[0].DistrictName || "");
						if (itemdata[0].BillToPartyCountry === "IN") {
							var buyergstin = itemdata[0].TaxNumber3_1;
							var buyerpos = itemdata[0].Region_1;
							var buyerpin = itemdata[0].PostalCode_1;
						} else {
							var buyergstin = "URP";
							var buyerpos = "96";
							var buyerpin = "999999";
						}
						if (itemdata[0].ShipToPartyCountry === "IN") {
							var portcode = selecteddata.PortCode;
							var shipgstin = itemdata[0].TaxNumber3;
							var shipligname = itemdata[0].CustomerName_1;
							var shipaddr1 = itemdata[0].StreetName_2;
							var shipadd2 =
								(itemdata[0].StreetPrefixName1_2 || "") +
								(itemdata[0].ShipToPartyStreet || "") +
								(itemdata[0].DistrictName_1 || "");
							var shiploc = itemdata[0].CityName_2;
							var shippin = itemdata[0].PostalCode_2;
							var shipstcd = itemdata[0].Region_2;
						} else {
							var portcode = selecteddata.PortCode;

							var portcode = selecteddata.PortCode;



							if (portcode == "") {
								MessageBox.error(
									"Please maintain the port code by selecting Edit Eway Bill Details."
								);
								return;
							} else {
								var shipgstin = "URP";
								var shipligname = selecteddata.PortName;
								var shipaddr1 = selecteddata.PortAddress1;
								var shipadd2 = selecteddata.PortAddress2;
								var shiploc = selecteddata.PortCity;
								var shippin = selecteddata.PortPostalCode;
								var shipstcd = selecteddata.PortRegionCode;
							}
						}
						if (itemdata[0].EinvoiceCateogry === "EXPWOP" || itemdata[0].EinvoiceCateogry === "EXPWP" || itemdata[0].EinvoiceCateogry === "SEZWP" || itemdata[0].EinvoiceCateogry === "SEZWOP" || itemdata[0].EinvoiceCateogry === "DEXP") {
							var subsupplytype = "3";
						} else {
							var subsupplytype = "1";
						}
						if (itemdata[0].BusinessPartner === itemdata[0].Customer) {
							var transmode = "REG";
						} else {
							var transmode = "SHP";
						}

						var TotInvVal = (
							(parseFloat(itemdata[0].TotalNetAmount) +
								parseFloat(itemdata[0].TotalTaxAmount)) *
							parseFloat(itemdata[0].AccountingExchangeRate)
						).toFixed(2);
						var TotInvValFc =
							parseFloat(itemdata[0].TotalNetAmount) +
							parseFloat(itemdata[0].TotalTaxAmount);

						if (itemdata[0].TotalTaxAmount === "0.00") {
							var wthpay = "N";
						} else {
							var wthpay = "Y";
						}
						if (itemdata[0].JOIGAmount !== "0.00") {
							var igstintra = "Y";
						} else {
							var igstintra = "N";
						}

						var oPayload = {
							einvoices: [
								{
									self_gstin: itemdata[0].PlantGSTIN,
									// "system_cd": "SYSTEM01",
									// "branch_cd": "BRANCH01",
									// "vertical_cd": "VERT001",
									irnreq: "Y",
									trandtl: {
										trancatg: itemdata[0].EinvoiceCateogry,
										reversecharge: "N",
										transactionmode: transmode,
										igstonintra: igstintra,
									},
									expdtl: {
										expcat: itemdata[0].EXPCAT,
										wthpay: wthpay,
										// "shipbno": "1234567",
										// "shipbdt": "13/03/2020",
										port: portcode,
										forcur: itemdata[0].TransactionCurrency_1,
										cntcode: itemdata[0].BillToPartyCountry,
										// "refclm": "N",
										// "expduty": "123.15"
									},
									docdtl: {
										document_type: itemdata[0].DocType,
										docno: itemdata[0].DocumentReferenceID,
										docdt: that.dateFormat1(itemdata[0].BillingDocumentDate),
									},
									supplierdtl: {
										supplier_gstin: itemdata[0].PlantGSTIN,
										supplier_lglnm: itemdata[0].PlantName,
										supplier_bnm: itemdata[0].PlantName,
										supplier_loc: itemdata[0].CityName,
										supplier_pin: itemdata[0].PostalCode,
										supplier_state: itemdata[0].Region,
									},
									buyerdtl: {
										buyer_gstin: BillToPartyGSTIN,
										buyer_lglnm: itemdata[0].CustomerName,
										buyer_bnm: itemdata[0].CustomerName,
										buyer_loc: itemdata[0].CityName_1,
										buyer_pin: buyerpin,
										buyer_state: buyerpos,
										pos: buyerpos,
									},

									shipdtl: {
										ship_gstin: shipgstin,
										ship_lglnm: shipligname,
										ship_bnm: shipligname,
										ship_loc: shiploc,
										ship_pin: shippin,
										ship_state: shipstcd,
									},
									itemdtls: items,
									valdtl: {
										ttlassval: String(Math.abs(AssVal)),
										cgstval: String(CgstVal),
										sgstval: String(SgstVal),
										igstval: String(IgstVal),
										cesval: "0.00",
										stcesval: "0.00",
										cesnonadval: "0.00",
										totinvval: String(TotInvVal),
										// "othchrg":OthChrg,
										// "discval": String(Math.abs(Discount)),
									},
									ewbdtl: {
										ewayreq: "Y",
										subsupplytype: subsupplytype,
										mode_of_transport: selecteddata.ModeOfTransport,
										distance_of_transport: selecteddata.TransportDistanceinKM,
										transporter_id: selecteddata.TransporterID,
										transporter_name: selecteddata.TransporterName,
										transport_doc_no: selecteddata.TransportDocNum || "",
										transporter_doc_date:
											that.dateFormat1(selecteddata.TransportDocDate) || "",
										veh_type: selecteddata.VehicleType || "",
										veh_number: selecteddata.VehicleNum || "",
									},
								},
							],
						};
					}
				}

				var jsonString = JSON.stringify(oPayload, null, 2);
				var blob = new Blob([jsonString], { type: "application/json" });
				var url = URL.createObjectURL(blob);
				var a = document.createElement("a");
				a.href = url;
				a.download = "data.txt";
				a.click();
				URL.revokeObjectURL(url);
			},
			// --------------------------------------------------------------------------------------------------- Generate IRN + E-way Bill ----------------------------------------------------------------------------------//
			onGenerateIRNEWayBill: async function () {
				var that = this;
				that.getView().setBusy(true);
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				var irncount = 0;

				if (aSelectedIndices.length !== 0) {
					for (var i = 0; i < aSelectedIndices.length; i++) {
						var selecteddata = oTable
							.getContextByIndex(aSelectedIndices[i])
							.getObject();
						if (
							selecteddata.BillingType === "L2" ||
							selecteddata.BillingType === "G2"
						) {
							MessageBox.error(
								`The Billing type is: ${selecteddata.BillingType} so you should generate only IRN `
							);
							return;
						}

						var items = [],
							AssVal = 0,
							CgstVal = 0,
							SgstVal = 0,
							IgstVal = 0,
							Discount = 0,
							OthChrg = 0;
						var itemdata = tData.filter(function (pItem) {
							return (
								pItem.AccountingDocument === selecteddata.Accountingdocument &&
								pItem.BillingDocument === selecteddata.BillingDocument &&
								pItem.DocumentReferenceID === selecteddata.DocumentReferenceID
							);
						});
						if (
							selecteddata.InvoiceRefNum !== "" ||
							selecteddata.EWayBill !== ""
						) {
							MessageBox.error(
								"The IRN/E-way bill has already been generated "
							);
							return;
						}
						for (var j = 0; j < itemdata.length; j++) {
							var salesdoccat = itemdata[j].SalesDocumentItemCategory;
							if (salesdoccat === "TAD") {
								var IsServc = "Y";
							} else {
								var IsServc = "N";
							}
							if (itemdata[j].ZTAXAmount === "0.00") {
								AssVal = (
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate) +
									parseFloat(AssVal)
								).toFixed(2);
								var assamt = (
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate)
								).toFixed(2);
							} else {
								var assamt = (
									(parseFloat(itemdata[j].NetAmount) +
										parseFloat(itemdata[j].TaxAmount)) *
									parseFloat(itemdata[j].AccountingExchangeRate)
								).toFixed(2);
								AssVal = (parseFloat(assamt) + parseFloat(AssVal)).toFixed(2);
							}
							// if(itemdata[j].ZTAXAmount==="0.00"){
							// 	AssVal = (
							// 		parseFloat(itemdata[j].NetAmount) *
							// 		parseFloat(itemdata[j].AccountingExchangeRate) +
							// 		parseFloat(AssVal)
							// 	).toFixed(2);
							// 	var assamt = (
							// 		parseFloat(itemdata[j].NetAmount) *
							// 		parseFloat(itemdata[j].AccountingExchangeRate)
							// 	).toFixed(2);
							// }else{
							// 	AssVal=	(parseFloat(itemdata[0].TotalNetAmount) + parseFloat(itemdata[0].TotalTaxAmount) ) *parseFloat(itemdata[0].AccountingExchangeRate)}
							//(parseFloat(itemdata[0].TotalNetAmount) + parseFloat(itemdata[0].TotalTaxAmount) ) *parseFloat(itemdata[0].AccountingExchangeRate)
							CgstVal = (
								parseFloat(itemdata[j].JOCGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate) +
								parseFloat(CgstVal)
							).toFixed(2);
							SgstVal = (
								parseFloat(itemdata[j].JOSGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate) +
								parseFloat(SgstVal)
							).toFixed(2);
							IgstVal = (
								parseFloat(itemdata[j].JOIGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate) +
								parseFloat(IgstVal)
							).toFixed(2);
							Discount = (
								(parseFloat(Math.abs(itemdata[j].ZTAXAmount)) *
									parseFloat(itemdata[j].AccountingExchangeRate)) +
								parseFloat(Discount)
							).toFixed(2);

							// var unitprice = (parseFloat(itemdata[j].ConditionAmount) / parseFloat(itemdata[j].BillingQuantity)) * (parseFloat(itemdata[j].AccountingExchangeRate))

							var unitprice = (
								(parseFloat(assamt) / parseFloat(itemdata[j].BillingQuantity)) *
								parseFloat(itemdata[j].AccountingExchangeRate)
							).toFixed(2);
							var totalamt;
							if (itemdata[j].ZTAXAmount != 0) {
								totalamt = (parseFloat(itemdata[j].NetAmount) + parseFloat(itemdata[j].TaxAmount)) * parseFloat(itemdata[j].AccountingExchangeRate);
							} else {
								totalamt =
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate);
							}


							var discount = (
								(parseFloat(itemdata[j].ZTAXAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate))
							).toFixed(2);

							var gstrate =
								parseFloat(itemdata[j].JOIGRate) +
								parseFloat(itemdata[j].JOCGRate) +
								parseFloat(itemdata[j].JOSGRate);
							var igstamt = (
								parseFloat(itemdata[j].JOIGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate)
							).toFixed(2);
							var cgstamt = (
								parseFloat(itemdata[j].JOCGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate)
							).toFixed(2);
							var sgstamt = (
								parseFloat(itemdata[j].JOSGAmount) *
								parseFloat(itemdata[j].AccountingExchangeRate)
							).toFixed(2);
							// var otherchrg = ((parseFloat(itemdata[j].ConditionAmount_5) + parseFloat(itemdata[j].JTC2Amount) + parseFloat(itemdata[j].ZFRCAmount) + parseFloat(itemdata[j].ZFREAmount) + parseFloat(itemdata[j].ZLB1Amount) + parseFloat(itemdata[j].FPA1Amount)) * parseFloat(itemdata[j].AccountingExchangeRate)).toFixed(2)
							var otherchrg =
								parseFloat(itemdata[j].JTC2Amount) *
								parseFloat(itemdata[j].AccountingExchangeRate);
							OthChrg = (parseFloat(otherchrg) + parseFloat(OthChrg)).toFixed(
								2
							);
							if (itemdata[j].ZTAXAmount === "0.00") {
								var totitemval = (
									(parseFloat(itemdata[j].NetAmount) +
										parseFloat(itemdata[j].TaxAmount)) *
									parseFloat(itemdata[j].AccountingExchangeRate)
								).toFixed(2);
							} else {
								var totitemval = (
									(parseFloat(itemdata[j].NetAmount) +
										parseFloat((itemdata[j].TaxAmount) * 2)) *
									parseFloat(itemdata[j].AccountingExchangeRate)
								).toFixed(2);
							}

							if (parseFloat(itemdata[j].BillingQuantity) > 0) {
								var obj = {
									SlNo: itemdata[j].BillingDocumentItem,//"000010",
									PrdDesc: itemdata[j].BillingDocumentItemText,//"Woven Textile Fabric",
									IsServc: IsServc,//"N", //y
									HsnCd: itemdata[j].ConsumptionTaxCtrlCode,//"520100", //998314
									// Barcde: "",
									Qty: itemdata[j].BillingQuantity,//1.0,
									FreeQty: 0,
									Unit: itemdata[j].UnitQuantityCode,// "NOS",
									UnitPrice: unitprice,//99600.0,
									TotAmt: totalamt,//99600.0,
									Discount: 0.0,//parseFloat(Math.abs(itemdata[j].ZTAXAmount))*parseFloat(itemdata[j].AccountingExchangeRate),//0.0,
									taxability: "TAX",
									// PreTaxVal: 0.0,
									cgstrt: parseFloat(itemdata[j].JOCGRate).toFixed(
										2
									),
									cgstamt: String(cgstamt),
									sgstrt: parseFloat(itemdata[j].JOSGRate).toFixed(
										2
									),
									sgstamt: String(sgstamt),
									igstrt: parseFloat(itemdata[j].JOIGRate).toFixed(
										2
									),
									AssAmt: assamt,// 99600.0,
									GstRt: gstrate,// 0.0,
									CgstAmt: cgstamt,// 0.0,
									SgstAmt: sgstamt,// 0.0,
									IgstAmt: String(igstamt),// 0.0,
									CesAmt: 0.0,
									CesRt: 0.0,
									CesNonAdvlAmt: 0.0,
									StateCesRt: 0.0,
									StateCesAmt: 0.0,
									StateCesNonAdvlAmt: 0.0,
									OthChrg: otherchrg,//0.0,
									TotItemVal: String(totitemval),//99600.0,
									// OrdLineRef: "",
									OrgCntry: itemdata[j].DepartureCountry,//"",
									// PrdSlNo: "",
									// AttribDtls: [
									// 	{
									// 		Nm: "",
									// 		Val: "",
									// 		SlNo: null,
									// 	},
									// ],
									// BchDtls: {
									// 	SlNo: null,
									// 	Nm: "",
									// 	ExpDt: "",
									// 	WrDt: "",
									// },

									// prdnm: itemdata[j].BillingDocumentItemText,
									// hsncd: itemdata[j].ConsumptionTaxCtrlCode,
									// qty: itemdata[j].BillingQuantity,
									// uqc: itemdata[j].EinvoiceUnitQuantityCode,
									// unitrate: unitprice,
									// grossamt: assamt,
									// assamt: assamt,
									// taxability: "TAX",
									// cgstrt: parseFloat(itemdata[j].JOCGRate).toFixed(
									// 	2
									// ),
									// cgstamt: String(cgstamt),
									// sgstrt: parseFloat(itemdata[j].JOSGRate).toFixed(
									// 	2
									// ),
									// sgstamt: String(sgstamt),
									// igstrt: parseFloat(itemdata[j].JOIGRate).toFixed(
									// 	2
									// ),
									// igstamt: String(igstamt),
									// cessrt: "0.00",
									// cessamt: "0.00",
									// cessnonadval: "0.00",
									// // "discount": discount,
									// othchrg: otherchrg,
									// statecessrt: "0.00",
									// statecessamt: "0.00",
									// totitemval: String(totitemval),
								};
								items.push(obj);
							}
						}
						// if (selecteddata.TransportDistanceinKM === "" && selecteddata.TransportDocDate === "" && selecteddata.VehicleNum === "" && selecteddata.VehicleType === "" && selecteddata.ModeOfTransport === "") {
						// 	MessageBox.error("Please complete the e-way bill details before proceeding.");
						// 	return;
						// }

						var selleradrs2 =
							(itemdata[0].PlantStreet || "") +
							(itemdata[0].PlantStreet2 || "");
						var buyeradrs2 =
							(itemdata[0].BillToPartyStreet || "") +
							(itemdata[0].BillToPartyStreet2 || "")

						if (itemdata[0].BillToPartyCountry === "IN") {
							var buyergstin = itemdata[0].BillToPartyGSTIN;
							var buyerpos = itemdata[0].BillToPartyRegion;
							var buyerpin = itemdata[0].BillToPartyPostalCode;
							var buyerstdcode = STATECODE.find((item) => {
								return itemdata[0].BillToPartyRegion === item.Region
							});
							var buyerstd = buyerstdcode.ITDStateCode

						} else {
							var buyergstin = "URP";
							var buyerstd = "96";
							var buyerpin = "999999";
						}
						if (itemdata[0].ShipToPartyCountry === "IN") {
							var portcode = selecteddata.PortCode;
							var shipgstin = itemdata[0].ShipToPartyGSTIN;
							var shipligname = itemdata[0].ShipToPartyCustomerName;
							// var shipaddr1 = itemdata[0].ShipToPartyStreet;
							var shipaddr1 =
								(itemdata[0].ShipToPartyStreet || "") +
								(itemdata[0].ShipToPartyStreet2 || "")

							var shiploc = itemdata[0].ShipToPartyCity;
							var shippin = itemdata[0].ShipToPartyPostalCode;
							var shipstcd = itemdata[0].ShipToPartyRegion;
							var shipstdcode = STATECODE.find((item) => {
								return itemdata[0].ShipToPartyRegion === item.Region
							});
							var shipstd = shipstdcode.ITDStateCode
						} else {
							var portcode = selecteddata.PortCode;

							console.log("portcode", selecteddata)
							console.log("portcode", portcode)



							if (portcode == "") {
								MessageBox.error(
									"Please maintain the port code by selecting Edit Eway Bill Details."
								);
								return;
							} else {
								var shipgstin = "URP";
								var shipligname = itemdata[0].PortName;
								// var shipaddr1 = itemdata[0].PortAddress1;
								var shipaddr1 = (itemdata[0].PortAddress1 || "") + (itemdata[0].PortAddress2 || "")
								var shiploc = itemdata[0].PortCity;
								var shippin = itemdata[0].PortPostalCode;
								var shipstd = itemdata[0].PortRegion;
								// var shipstdcode = STATECODE.find((item)=>{
								// 	return itemdata[0].PortRegion === item.Region
								// });
								// var shipstd = shipstdcode.ITDStateCode
							}
						}
						if (itemdata[0].SupType === "EXPWOP" || itemdata[0].SupType === "EXPWP" || itemdata[0].SupType === "SEZWP" || itemdata[0].SupType === "SEZWOP" || itemdata[0].SupType === "DEXP") {
							var subsupplytype = "3";
						} else {
							var subsupplytype = "1";
						}
						if (itemdata[0].BillToParty === itemdata[0].ShipToParty) {
							var transmode = "REG";
						} else {
							var transmode = "SHP";
						}

						var TotInvVal = (
							(parseFloat(itemdata[0].TotalNetAmount) +
								parseFloat(itemdata[0].TotalTaxAmount)) *
							parseFloat(itemdata[0].AccountingExchangeRate)
						).toFixed(2);
						var TotInvValFc =
							parseFloat(itemdata[0].TotalNetAmount) +
							parseFloat(itemdata[0].TotalTaxAmount);

						if (itemdata[0].TotalTaxAmount === "0.00") {
							var wthpay = "N";
						} else {
							var wthpay = "Y";
						}

						var oPayload2 =
						{
							"Version": "1.1",
							"TranDtls": {
								"TaxSch": "GST",
								"SupTyp": itemdata[0].SupType,//"B2B",
								"RegRev": "N",
								"EcmGstin": null,
								"IgstOnIntra": "N",
							},
							"DocDtls": {
								"Typ": itemdata[0].DocType,
								"No": itemdata[0].DocumentReferenceID,
								"Dt": that.dateFormat1(itemdata[0].BillingDocumentDate)
							},
							"SellerDtls": {
								"Gstin": itemdata[0].PlantGSTIN,
								"LglNm": itemdata[0].PlantName,//"DTA Cybercity Pune",
								"TrdNm": itemdata[0].PlantName,//"",
								"Addr1": itemdata[0].PlantStreet,//"LEVEL 5, WING A AND WING B, TOWER I",
								// "Addr2": selleradrs2,//itemdata[0].PlantStreet2,//"",
								"Loc": itemdata[0].PlantCity,//"MAGARPATTA CITY, HADAPSAR, PUNE",
								"Pin": itemdata[0].PlantPostalCode,//"411013",
								"Stcd": itemdata[0].PlantStateCode,//"27",
								//   Ph: "",
								//   Em: "",
							},
							"BuyerDtls": {
								"Gstin": buyergstin,//itemdata[0].BillToPartyGSTIN,//"27AAAPI3182M002",
								"LglNm": itemdata[0].BillToPartyCustomerName,//"EXL SERVICE. COM INDIA",
								"TrdNm": itemdata[0].BillToPartyCustomerName,//"",
								"Pos": buyerstd,//itemdata[0].BillToPartyRegion,//"09",
								"Addr1": buyeradrs2,//itemdata[0].BillToPartyStreet,//"8th Floor of Wing A of Building",
								// Addr2: buyeradrs2,//itemdata[0].BillToPartyStreet,//"",
								"Loc": itemdata[0].BillToPartyCity,//"Gautam Buddha Nagar",
								"Pin": buyerpin,//itemdata[0].BillToPartyPostalCode,//"444999",
								//   Ph: "",
								//   Em: "",
								"Stcd": buyerstd,//itemdata[0].BillToPartyRegion//"27",
							},
							// DispDtls: {
							// 	//   Nm: "",
							// 	//   Addr1: "",
							// 	//   Addr2: "",
							// 	//   Loc: "",
							// 	//   Pin: "",
							// 	//   Stcd: "",
							// },
							"ShipDtls": {
								"Gstin": shipgstin,//itemdata[0].ShipToPartyGSTIN,//"",
								"LglNm": shipligname,// itemdata[0].ShipToPartyCustomerName,//"EXL SERVICE. COM INDIA",
								"TrdNm": shipligname,// itemdata[0].ShipToPartyCustomerName,//"",
								"Addr1": shipaddr1,// itemdata[0].ShipToPartyStreet,//"8th Floor of Wing A of Building",
								// Addr2: itemdata[0].ShipToPartyStreet,//"",
								"Loc": shiploc,// itemdata[0].ShipToPartyCity,//"Gautam Buddha Nagar",
								"Pin": shippin,// itemdata[0].ShipToPartyPostalCode,//"201306",
								"Stcd": shipstd,//itemdata[0].ShipToPartyRegion   //"09",
							},
							"ValDtls": {
								"AssVal": AssVal,//(parseFloat(itemdata[0].TotalNetAmount) + parseFloat(itemdata[0].TotalTaxAmount) ) *parseFloat(itemdata[0].AccountingExchangeRate),//AssVal,//99600.0,
								"CgstVal": CgstVal,//0.0,
								"SgstVal": SgstVal,//0.0,
								"IgstVal": IgstVal,// 0.0,
								"CesVal": 0.0,
								"StCesVal": 0.0,
								"RndOffAmt": 0.0,
								"TotInvVal": TotInvVal,//99600.0,
								"TotInvValFc": TotInvValFc,// 0.0,
								"Discount": Discount,// 0.0,
								"OthChrg": 0.0,
							},
							"ItemList": items,
							// PayDtls: {
							// 	//   Nm: "",
							// 	//   AccDet: "",
							// 	//   Mode: "",
							// 	//   FinInsBr: "",
							// 	//   PayTerm: "",
							// 	//   PayInstr: "",
							// 	//   CrTrn: "",
							// 	//   DirDr: "",
							// 	//   CrDay: null,
							// 	//   PaidAmt: 0.0,
							// 	//   PaymtDue: 0.0,
							// },
							"RefDtls": {
								//   InvRm: "",
								//   DocPerdDtls: {
								// 	InvStDt: "",
								// 	InvEndDt: "",
								//   },
								//   PrecDocDtls: [
								// 	{
								// 	  InvNo: "",
								// 	  InvDt: "",
								// 	  OthRefNo: "",
								// 	},
								//   ],
								"ContrDtls": [
									{
										// RecAdvRefr: "",
										// RecAdvDt: "",
										// TendRefr: "",
										// ContrRefr: "",
										// ExtRefr: "",
										// ProjRefr: "",
										PORefr: itemdata[0].PurchaseOrderByCustomer,//"",
										PORefDt: that.dateFormat1(itemdata[0].CustomerPurchaseOrderDate),//"",
									},
								],
							},
							"ExpDtls": {
								//   ShipBNo: "",
								//   ShipBDt: "",
								"Port": itemdata[0].PortCode,//"",
								//   RefClm: "",
								"ForCur": itemdata[0].TransactionCurrency_1,//"",
								"CntCode": itemdata[0].BillToPartyCountry,//"",
								//   ExpDuty: null,
							},
							"AddlDocDtls": [
								{
									"Url": "",
									"Docs": "",
									"Info": "",
								},
							],
							"EwbDtls": {
								"ewayreq": "Y",
								"TransId": itemdata[0]?.TransporterID || "",
								"TransName": itemdata[0]?.TransporterName || "",
								"TransMode": itemdata[0]?.ModeofTransport || "",
								"Distance": itemdata[0]?.TransportDistanceinKM || "",
								"TransDocNo": itemdata[0]?.TransportDocNo || "",
								"TransDocDt": itemdata[0].TransportDocDate ? that.dateFormat1(itemdata[0].TransportDocDate) : "",
								"VehNo": itemdata[0]?.VehicleNo || "",
								"VehType": itemdata[0]?.VehicleType || ""
							},

						};

						var oHeaders = {
							Authorization: "Basic " + btoa("G0111" + ":" + "Admin@123"),
							"Content-Type": "application/json",
						};
						this.getView().setBusy(true);
						await $.ajax({
							// url: `api/auth?username=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}`, // Use the correct full URL
							url: `https://testdigisign.primustechsys.com:4001/api/auth`,
							// url: `https://primebridge.primustechsys.com/api/auth`,
							type: "GET",
							beforeSend: function (xhr) {
								// xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
								xhr.setRequestHeader(
									"Authorization",
									"Basic " + btoa("G0111" + ":" + "Admin@123")
								);
								xhr.setRequestHeader("Content-Type", "application/json");
							},
							// headers: oHeaders,
							// username: user,
							// password: passwrd,
							// async: false,
							// type: 'GET',
							// headers: oHeaders,
							// async: false,  // Use asynchronous request
							success: async function (data) {
								console.log("Token received:", data);
								let jsonData = JSON.parse(data);
								var tokens = jsonData.access_token;
								var username = jsonData.userName;

								// console.log(tokenVariable)

								var username = "G0111";
								var password = "Admin@123";
								var base64Credentials = btoa(username + ":" + password);
								var oHeaders = {
									// 'X-CSRF-Token': '',
									// "Authorization": "Basic " + base64Credentials,
									// "Content-Type": "application/json"

									Clientcode: selecteddata.Clientcode,
									CustomerCode: "G0111",
									Token: tokens,
									"Content-Type": "application/JSON",
								};
								that.getView().setBusy(true);
								await $.ajax({
									// url: '/api/Invoice/GenerateIRN?gstin=27AALCC5030G1ZT',
									url: `https://testdigisign.primustechsys.com:4001/api/Invoice/GenerateIRN?gstin=${itemdata[0].PlantGSTIN}`,
									// url: `https://primebridge.primustechsys.com/api/Invoice/GenerateIRN?gstin=${itemdata[0].PlantGSTIN}`,
									type: "POST",
									data: JSON.stringify(oPayload2),
									headers: oHeaders,
									async: false,
									success: function (data) {
										let result = data[0];
										// console.log("success" + data);
										if (result.flag === true) {
											if (result.irn !== null && result.ewbNo !== null) {
												if (result.flag === true) {
													sap.m.MessageToast.show(
														"E-invoice and E-way Bill generated successfully!"
													);
													let ackdate = result.ackDt;
													let EWDdate = result.ewbDt;
													if (result.ewbValidTill !== null) {
														var valdate = result.ewbValidTill;
														selecteddata.ValidTodate = valdate;
														// selecteddata.ValidTotime = valtime;
													}

													// Store the first 1000 characters
													let QrfirstPart = result.signedQRCode.slice(0, 500);

													// Store remaining characters if any
													let QrsecondPart =
														result.signedQRCode.length > 500
															? result.signedQRCode.slice(500)
															: "";

													selecteddata.InvoiceRefNum = result.irn;
													selecteddata.AcknowledgementNum = result.ackNo;
													selecteddata.AcknowledgementDate = ackdate;
													// selecteddata.AcknowledgementTime = acktime;
													selecteddata.QRCode1 = QrfirstPart;
													selecteddata.QRCode2 = QrsecondPart;
													selecteddata.EWayBill = result.ewbNo;
													selecteddata.eWayBillCreationDate = EWDdate;
													// selecteddata.eWayBillCreationTime = EWDtime;
													selecteddata.ValidFromdate = EWDdate;
													// selecteddata.ValidFromtime = EWDtime;
													selecteddata.PDFURL = result.detailedpdfUrl;
													selecteddata.SummaryPDFURL = result.pdfUrl;
													// that.getView().getModel("entryModel").refresh(true)
													// selecteddata.ValidFromtime = EWDtime;
													// MessageBox.success(`${result.message}`);
													MessageBox.success("E-invoice and E-way Bill generated successfully!");
													// 🔐 Store in LocalModel
													// let billingDocNum = String(selecteddata.BillingDocument || selecteddata.BillingDocumentNumber).trim();
													// if (!billingDocNum) {
													// 	sap.m.MessageToast.show("Billing document number not found.");
													// 	return;
													// }

													// let oLocalModel = that.getView().getModel("LocalModel");
													// let aPdfEntries = oLocalModel.getProperty("/pdfEntries") || [];

													// let index = aPdfEntries.findIndex(e => e.BillingDocumentNumber === billingDocNum);
													// let newEntry = {
													// 	BillingDocumentNumber: billingDocNum,
													// 	EWayBill: result.ewbNo,
													// 	pdfUrl: result.pdfUrl,
													// 	detailedpdfUrl: result.detailedpdfUrl
													// };

													// if (index !== -1) {
													// 	aPdfEntries[index] = newEntry;
													// } else {
													// 	aPdfEntries.push(newEntry);
													// }

													// oLocalModel.setProperty("/pdfEntries", aPdfEntries);


													//   that.onDownloadPDF()


												} else {
													sap.m.MessageToast.show(
														"Error while IRN & Eway Bill generation!"
													);
													if (result.flag === false) {
														// that.getView().getModel("entryModel").setProperty("/items/" + aSelectedIndices[i] + "/Messages", data.Data.irn.error[0].error_desc);
														selecteddata.Messages = result.message;
													} else {
														// that.getView().getModel("entryModel").setProperty("/items/" + aSelectedIndices[i] + "/Messages", data.Data.ewb.error[0].error_desc);
														selecteddata.Messages = result.message;
													}
												}
											}
										} else {
											sap.m.MessageToast.show("Error while IRN generation!");
											sap.m.MessageBox.error(data[0].message)
											// that.getView().getModel("entryModel").setProperty("/items/" + aSelectedIndices[i] + "/Messages", data.Errors[0].error_desc);
											selecteddata.Messages = data[0].message
										}
										// that.getView().setBusy(false);
										irncount++;
										if (irncount >= aSelectedIndices.length) {
											that.oncheckdoc();
										}
									},
									error: function (e) {
										console.log("error: " + e);
										that.getView().setBusy(false);
									},
								});
							},
							error: function (xhr, status, error) {
								console.log("Error:", status, error);
								MessageBox.error("Token generation failed");
								return error;
								that.getView().setBusy(false);
							},
						});
					}
				} else {
					sap.m.MessageToast.show("Please select at least one record!");
				}
			},

			// ---------------------------------------------------------------------------------------------------- Generate E-way Bill ---------------------------------------------------------------------------------------//
			onGenerateBill: function () {
				var that = this;
				// const today = new Date();
				// const formattedDate = this.formatDateToDDMMYYYY(today);
				// console.log("Formatted Date", formattedDate);

				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();

				if (aSelectedIndices.length !== 0) {
					for (var i = 0; i < aSelectedIndices.length; i++) {
						var selecteddata = oTable
							.getContextByIndex(aSelectedIndices[i])
							.getObject();
						console.log("selecteddata", selecteddata);
						var items = [],
							AssVal = 0,
							CgstVal = 0,
							SgstVal = 0,
							IgstVal = 0,
							Discount = 0,
							OthChrg = 0;
						var itemdata = tData.filter(function (pItem) {
							return (
								pItem.AccountingDocument === selecteddata.Accountingdocument &&
								pItem.BillingDocument === selecteddata.BillingDocument &&
								pItem.DocumentReferenceID === selecteddata.DocumentReferenceID
								// pItem.CompanyCode === selecteddata.CompanyCode &&
								// pItem.BillingDocument === selecteddata.BillingDocument &&
								// pItem.BillingDocumentDate === selecteddata.BillingDate
							);
						});
						debugger;
						// //new added
						// if(itemdata[0].ewayBillNo !== ""){
						// 	MessageBox.error("Eway Bill is already genreated!!");
						// 	return;
						// }
						// //newadded upper
						if (itemdata[0].IRN === "") {
							for (var j = 0; j < itemdata.length; j++) {
								var salesdoccat = itemdata[j].SalesDocumentItemCategory;
								if (salesdoccat === "TAD") {
									var IsServc = "Y";
								} else {
									var IsServc = "N";
								}
								AssVal = (
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate) +
									parseFloat(AssVal)
								).toFixed(2);
								CgstVal = (
									parseFloat(itemdata[j].JOCGAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate) +
									parseFloat(CgstVal)
								).toFixed(2);
								SgstVal = (
									parseFloat(itemdata[j].JOSGAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate) +
									parseFloat(SgstVal)
								).toFixed(2);
								IgstVal = (
									parseFloat(itemdata[j].JOIGAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate) +
									parseFloat(IgstVal)
								).toFixed(2);
								//   Discount =
								// 	(parseFloat(itemdata[j].ConditionAmount_4) +
								// 	  parseFloat(itemdata[j].ConditionAmount_7) +
								// 	  parseFloat(itemdata[j].ConditionAmount_8)) *
								// 	  parseFloat(itemdata[j].AccountingExchangeRate) +
								// 	parseFloat(Discount);
								OthChrg =
									// (parseFloat(itemdata[j].ConditionAmount_5) +
									parseFloat(itemdata[j].JTC2Amount) *
									parseFloat(itemdata[j].AccountingExchangeRate) +
									parseFloat(OthChrg);

								var unitprice =
									(parseFloat(itemdata[j].NetAmount) /
										parseFloat(itemdata[j].BillingQuantity)) *
									parseFloat(itemdata[j].AccountingExchangeRate);
								var totalamt =
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate);
								//   var discount =
								// 	(parseFloat(itemdata[j].ConditionAmount_4) +
								// 	  parseFloat(itemdata[j].ConditionAmount_7) +
								// 	  parseFloat(itemdata[j].ConditionAmount_8)) *
								// 	parseFloat(itemdata[j].AccountingExchangeRate);
								var assamt =
									parseFloat(itemdata[j].NetAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate);
								var gstrate =
									parseFloat(itemdata[j].JOIGRate) +
									parseFloat(itemdata[j].JOCGRate) +
									parseFloat(itemdata[j].JOSGRate);
								var igstamt =
									parseFloat(itemdata[j].JOIGAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate);
								var cgstamt =
									parseFloat(itemdata[j].JOCGAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate);
								var sgstamt =
									parseFloat(itemdata[j].JOSGAmount) *
									parseFloat(itemdata[j].AccountingExchangeRate);
								var otherchrg =

									(parseFloat(itemdata[j].JTC2Amount) *
										parseFloat(itemdata[j].AccountingExchangeRate));
								var totitemval =
									(parseFloat(itemdata[j].NetAmount) +
										parseFloat(itemdata[j].TaxAmount)) *
									parseFloat(itemdata[j].AccountingExchangeRate);
								if (parseFloat(itemdata[j].BillingQuantity) > 0) {
									var obj = {
										itemNo: 1,
										productName: itemdata[j].Product,
										productDesc: itemdata[j].BillingDocumentItemText,//"TOM1",
										hsnCode: itemdata[j].ConsumptionTaxCtrlCode,//"56074900",
										quantity: itemdata[j].BillingQuantity,// 1000.0,
										qtyUnit: itemdata[j].UnitQuantityCode,//"BUN",
										taxableAmount: parseFloat((itemdata[j].NetAmount) * (itemdata[j].AccountingExchangeRate)),// 60000.0,
										cgstRate: parseFloat(itemdata[j].JOCGRate),//0,
										sgstRate: parseFloat(itemdata[j].JOSGRate), //0,
										igstRate: parseFloat(itemdata[j].JOIGRate),//18.0,
										cessRate: 0,
										cessNonAdvol: 0,
									};

									items.push(obj);
								}
							}

							var selleradrs2 =
								(itemdata[0].PlantStreet || "") +
								(itemdata[0].PlantStreet2 || "");
							var buyeradrs2 =
								(itemdata[0].BillToPartyStreet || "") +
								(itemdata[0].BillToPartyStreet2 || "")
							if (itemdata[0].BillToPartyCountry === "IN") {
								var buyergstin = itemdata[0].BillToPartyGSTIN;
								var buyerpos = itemdata[0].BillToPartyRegion;
								var buyerpin = itemdata[0].BillToPartyPostalCode;
								var buyerstdcode = STATECODE.find((item) => {
									return itemdata[0].BillToPartyRegion === item.Region
								});
								var buyerstd = buyerstdcode.ITDStateCode
							} else {
								var buyergstin = "URP";
								var buyerpos = "96";
								var buyerpin = "999999";
							}
							if (itemdata[0].ShipToPartyCountry === "IN") {
								var portcode = itemdata[0].PortCode;
								var shipgstin = itemdata[0].ShipToPartyGSTIN;
								var shipligname = itemdata[0].ShipToPartyCustomerName;
								// var shipaddr1 = itemdata[0].ShipToPartyStreet2;
								var shipaddr1 =
									(itemdata[0].ShipToPartyStreet || "") +
									(itemdata[0].ShipToPartyStreet2 || "")
								var shiploc = itemdata[0].ShipToPartyCity;
								var shippin = itemdata[0].ShipToPartyPostalCode;
								var shipstcd = itemdata[0].ShipToPartyRegion;
								var shipstdcode = STATECODE.find((item) => {
									return itemdata[0].ShipToPartyRegion === item.Region
								});
								var shipstd = shipstdcode.ITDStateCode
							} else {
								var portcode = selecteddata.PortCode;
								console.log("portcode", selecteddata)
								console.log("portcode", portcode)



								if (portcode == "") {
									MessageBox.error(
										"Please maintain the port code by selecting Edit Eway Bill Details."
									);
									return;
								} else {
									var shipgstin = "URP";
									var shipligname = itemdata[0].PortName;
									var shipaddr1 = (itemdata[0].PortAddress1 || "") +
										(itemdata[0].PortAddress2 || "")
									var shipadd2 = itemdata[0].PortAddress2;
									var shiploc = itemdata[0].PortCity;
									var shippin = itemdata[0].PortPostalCode;
									var shipstcd = itemdata[0].PortRegionCode;
								}
							}
							var TotInvVal =
								(parseFloat(itemdata[0].TotalNetAmount) +
									parseFloat(itemdata[0].TotalTaxAmount)) *
								parseFloat(itemdata[0].AccountingExchangeRate);
							var TotInvValFc =
								parseFloat(itemdata[0].TotalNetAmount) +
								parseFloat(itemdata[0].TotalTaxAmount);

							if (
								itemdata[0].BillingDocumentType === "F8" ||
								(itemdata[0].BillingDocumentType === "JSN" &&
									itemdata[0].TotalTaxAmount === "0.00")
							) {
								var doctype = "CHL";
								var subsupplytyp = "8";
							} else if (
								itemdata[0].BillingDocumentType === "F2" &&
								itemdata[0].TotalTaxAmount === "0.00"
							) {
								var doctype = "BIL";
								var subsupplytyp = "1";
							} else {
								var doctype = "INV";
								var subsupplytyp = "1";
							}

							// else if (selecteddata.BillingType === "F2" && itemdata[0].TotalTaxAmount !== "0") {
							// 	var doctype = "INV"
							// 	var subsupplytyp = "1"
							// }

							if (itemdata[0].BillToParty === itemdata[0].ShipToParty) {
								var transtype = "1";
							} else {
								var transtype = "2";
							}

							// var oPayloadOLD = {
							// 	"supplyType": "O",
							// 	"docType": doctype,
							// 	"docNo": selecteddata.BillingDocument,
							// 	"docDate": that.dateFormat1(selecteddata.BillingDocumentDate),
							// 	"actFromStateCode": selecteddata.Region,
							// 	"actToStateCode": buyerpos,
							// 	"transporterId": selecteddata.TransporterID,
							// 	"transporterName": selecteddata.TransporterName,
							// 	"transactionType": transtype,
							// 	"cessNonAdvolValue": "0.00",
							// 	"otherValue": "0.00",
							// 	"subSupplyType": subsupplytyp,
							// 	"itemList": items,
							// 	"subSupplyDesc": "others",
							// 	"consignorGstin": itemdata[0].PlantGSTIN,FROM GSTIN
							// 	"consignorName": itemdata[0].PlantName,
							// 	"consignorAddLine1": itemdata[0].StreetName,
							// 	"consignorAddLine2": selleradrs2,
							// 	"consignorPlace": itemdata[0].CityName,
							// 	"consignorPincode": itemdata[0].PostalCode,
							// 	"consignorStateCode": itemdata[0].Region,
							// 	"consigneeGstin": shipgstin,
							// 	"consigneeName": shipligname,
							// 	"consigneeAddLine1": shipaddr1,
							// 	"consigneeAddLine2": shipadd2,
							// 	"consigneePlace": shiploc,
							// 	"consigneePincode": shippin,
							// 	"consigneeStateCode": shipstcd,
							// 	// "dispatchFromGSTIN": "",
							// 	// "dispatchFromTradeName": "",
							// 	"shipToGSTIN": shipgstin,
							// 	"shipToTradeName": shipligname,
							// 	"totalTaxableAmt": itemdata[0].TotalNetAmount,
							// 	"totalInvoiceValue": TotInvVal,
							// 	"transportDocNo": selecteddata.TransportDocNum,
							// 	"modeOfTransport": selecteddata.ModeOfTransport,
							// 	"distanceOfTransport": selecteddata.TransportDistanceinKM,
							// 	"transporterDocDate": that.dateFormat1(selecteddata.TransportDocDate),
							// 	"vehNumber": selecteddata.VehicleNum,
							// 	"vehType": selecteddata.VehicleType
							// }

							// var oPayloadNEW =
							// 	{
							// 		"userGstin":"27AAACE5491L1ZA",
							// 		"supplyType": "O",
							// 		"subSupplyType": subsupplytyp,//1 hardcode,
							// 		"subSupplyTypeDesc": "Supply",
							// 		"docType": doctype,
							// 		"docNo": selecteddata.BillingDocument,
							// 		"docDate": that.dateFormat1(selecteddata.BillingDocumentDate),
							// 		"TransType": transtype,
							// 		"fromGstin": "27AAACE5491L1ZA",  //*
							// 		"fromTrdName": itemdata[0].PlantName,//*
							// 		"fromAddr1": itemdata[0].StreetName,
							// 		"fromAddr2": selleradrs2,
							// 		"fromPlace": "Mumbai",//*itemdata[0].CityName
							// 		"fromPincode": "400027",//*itemdata[0].PostalCode
							// 		"fromStateCode": "27", //*itemdata[0].Region
							// 		"actualFromStateCode": "27",//*itemdata[0].Region
							// 		"toGstin": shipgstin,
							// 		"toTrdName": shipligname,
							// 		"toAddr1":  shipaddr1,
							// 		"toAddr2":shipadd2,
							// 		"toPlace": shiploc,
							// 		"toPincode": shippin,
							// 		"actualToStateCode":shipstcd,
							// 		"toStateCode": shipstcd,
							// 		"totalValue": 60000.0,
							// 		"cgstValue": 0.0,
							// 		"sgstValue": 0.0,
							// 		"igstValue": 10800.0,
							// 		"TotNonAdvolVal": 0,
							// 		"cessNonAdvolValue": 0,
							// 		"cessValue": 0,
							// 		"otherValue": 0,
							// 		"totInvValue": 70800.0,
							// 		"transporterId": selecteddata.TransporterID,
							// 		"transporterName": selecteddata.TransporterName,
							// 		"transDocNo":selecteddata.TransportDocNum,
							// 		"transMode":selecteddata.ModeOfTransport,
							// 		"transDistance": selecteddata.TransportDistanceinKM,
							// 		"vehicleNo": selecteddata.VehicleNum,
							// 		"vehicleType": selecteddata.VehicleType,
							// 		"shipToGSTIN":shipgstin,
							// 		"shipToTradeName": shipligname,
							// 		// "dispatchFromGSTIN": "",
							// 		// "dispatchFromTradeName": "",
							// 		"portPin": selecteddata.PortCode,
							// 		"portName": "",
							// 		"itemList":items,

							// 	}

							console.log("selected", selecteddata)

							let oPayload1 = {
								userGstin: itemdata[0].PlantGSTIN,//"27AAACE5491L1ZA",
								supplyType: "O",
								subSupplyType: subsupplytyp,// "1",
								subSupplyTypeDesc: selecteddata.SubSupplyTypeDesc || "",
								docType: doctype,//"INV",
								docNo: itemdata[0].DocumentReferenceID,
								docDate: that.dateFormat1(itemdata[0].BillingDocumentDate),// itemdata[0].BillingDocumentDate,//"08/04/2025",
								TransType: transtype,//"1",
								fromGstin: itemdata[0].PlantGSTIN,// "27AAACE5491L1ZA",
								fromTrdName: itemdata[0].PlantName,// "FPCL-Ankleshwar 328-329",
								fromAddr1: selleradrs2,//itemdata[0]."315-316/1,Gidc Ind. Estate,, Po Box",
								// fromAddr2:itemdata[0]
								// 	"Plot No- 328/329/E, G.I.D.C.Near Asian Paint Chokdi",
								fromPlace: itemdata[0].PlantCity, //"AHEM",
								fromPincode: itemdata[0].PlantPostalCode,
								fromStateCode: itemdata[0].PlantStateCode,// "24",
								actualFromStateCode: itemdata[0].PlantStateCode,//"24",
								toGstin: shipgstin,// "27AAAPI3182M002",
								toTrdName: itemdata[0].ShipToPartyCustomerName,//"URVASHI PULP & PAPER MILLS PVT LTD",
								toAddr1: shipaddr1,//"315-316/1,Gidc Ind. Estate,, Po Box No-7,",
								// toAddr2: "Bharuch",
								toPlace: itemdata[0].ShipToPartyCity,//"Bombay",
								toPincode: itemdata[0].ShipToPartyPostalCode,//"431132",
								actualToStateCode: shipstd,//"27",
								toStateCode: shipstd,//"27",
								totalValue: parseFloat((itemdata[0].TotalNetAmount) * (itemdata[0].AccountingExchangeRate)),//60000.0,
								cgstValue: CgstVal,//0.0,
								sgstValue: SgstVal,// 0.0,
								igstValue: IgstVal,// 10800.0,
								TotNonAdvolVal: 0,
								cessNonAdvolValue: 0,
								cessValue: 0,
								otherValue: 0,
								totInvValue: TotInvVal,// 70800.0,
								transporterId: selecteddata?.TransporterID, //"24AAACF3882",
								transporterName: selecteddata?.TransporterName, //"PALAK TRANSPORT",
								transDocNo: selecteddata?.TransportDocNum || "", //"234567789",
								transMode: selecteddata?.ModeOfTransport,//"1",
								transDistance: selecteddata?.TransportDistanceinKM,//"0",
								vehicleNo: selecteddata?.VehicleNum || "",
								vehicleType: selecteddata?.VehicleType,//"R",
								shipToGSTIN: shipgstin,//"24AAACU2632B1Z0",
								shipToTradeName: shipligname,// "URVASHI PULP & PAPER MILLS PVT LTD",
								// portPin:,// "",
								// portName: "",
								itemList: items,
							};

							console.log("oPayload1", oPayload1)
							var oHeaders = {
								Authorization: "Basic " + btoa("G0111" + ":" + "Admin@123"),
								"Content-Type": "application/json",
							};
							this.getView().setBusy(true);
							$.ajax({
								// url: `api/auth?username=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}`, // Use the correct full URL
								url: `https://testdigisign.primustechsys.com:4001/api/auth`,
								// url: `https://primebridge.primustechsys.com/api/auth`,
								type: "GET",
								beforeSend: function (xhr) {
									// xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
									xhr.setRequestHeader(
										"Authorization",
										"Basic " + btoa("G0111" + ":" + "Admin@123")
									);
									xhr.setRequestHeader("Content-Type", "application/json");
								},
								async: true,
								// type: 'GET',
								// headers: oHeaders,
								// async: false,  // Use asynchronous request
								success: function (data) {
									console.log("Token received:", data);
									let jsonData = JSON.parse(data);
									var tokens = jsonData.access_token;
									var username = jsonData.userName;

									// console.log(tokenVariable)

									var oHeaders = {
										username: "G0111",
										Password: "Admin@123",
										Token: tokens,
										// 'Clientcode': selecteddata.Clientcode,
										CustomerCode: "G0111",
										"Content-Type": "application/json",
										// 'Cookie': 'JSESSIONID=8uk3aJ4C3-edF--lMd9qsb8AXUZ750MhwAygdXvM.g186069w',
										GSTIN: itemdata[0].PlantGSTIN,
									};
									that.getView().setBusy(true);
									$.ajax({
										url: `https://testdigisign.primustechsys.com:4001/api/EWayBill/GenerateEWayBill?gstin=${itemdata[0].PlantGSTIN}`,
										// url: `https://primebridge.primustechsys.com/api/EWayBill/GenerateEWayBill?gstin=${itemdata[0].PlantGSTIN}`,
										type: "POST",
										data: JSON.stringify(oPayload1),
										headers: oHeaders,
										async: false,
										success: function (data) {
											let result = data[0];
											console.log("res", result);
											if (result.flag === true) {
												let valDate = that.convertToEdmDateTime(
													result.validUpto
												);

												let ewbDt = that.convertToEdmDateTime(
													result.ewayBillDate
												);

												if (valDate !== null) {
													selecteddata.ValidTodate = valDate;
													// selecteddata.ValidTotime = that.convertToEdmTime(result.ewayBillDate);
												}

												// Store the first 1000 characters
												// let QrfirstPart = data.SignedQRCode.slice(0, 500);

												// Store remaining characters if any
												// let QrsecondPart = data.SignedQRCode.length > 500 ? data.SignedQRCode.slice(500) : "";
												selecteddata.EWayBill = result.ewayBillNo;
												selecteddata.eWayBillCreationDate = ewbDt;
												// selecteddata.eWayBillCreationTime = EWDtime;
												selecteddata.ValidFromdate = ewbDt;
												// ✅ ADD THIS TO STORE THE PDF URL
												selecteddata.PDFURL = result.detailedpdfUrl;
												selecteddata.SummaryPDFURL = result.pdfUrl;
												// that.getView().getModel("entryModel").refresh(true)
												// selecteddata.ValidFromtime = EWDtime;
												MessageBox.success(`${result.message}`);
												selecteddata.eWayBillStatus = false;
												selecteddata.EWBCancelDate="";
												} else {
												sap.m.MessageToast.show(
													"Error while EWayBill generation!"
												);
												MessageBox.error(`${result.message}`);
												let valDate = that.convertToEdmDateTime(
													result.validUpto
												);

												let ewbDt = that.convertToEdmDateTime(
													result.ewayBillDate
												);

												if (valDate !== null) {
													selecteddata.ValidTodate = valDate;
													// selecteddata.ValidTotime = that.convertToEdmTime(result.ewayBillDate);
												}

												// that.getView().getModel("entryModel").setProperty("/items/" + aSelectedIndices[i] + "/Messages", data.Errors[0].error_desc);
												selecteddata.Messages = result.message;
												selecteddata.EWayBill = result.ewayBillNo;
												selecteddata.eWayBillCreationDate = ewbDt;
												selecteddata.ValidFromdate = ewbDt;

											}
											// that.getView().setBusy(false);
											that.oncheckdoc();
										},
										error: function (e) {
											console.log("error: " + e);
											that.getView().setBusy(false);
										},
									});
								},
								error: function (xhr, status, error) {
									console.log("Error:", status, error);
									MessageBox.error("Token generation failed");
									return error;
									that.getView().setBusy(false);
								},
							});
						}
						//with resp to irn eway bill generation
						else {
							if (itemdata[0].EinvoiceCateogry === "EXP") {
								var subsupplytype = "3";
							} else {
								var subsupplytype = "1";
							}

							var oPayload = {
								"irn": itemdata[0].IRN,
								"Distance": itemdata[0].TransportDistanceinKM,//0,
								"TransMode": itemdata[0].ModeofTransport,//"1",
								"TransId": itemdata[0].TransporterID,
								"TransName": itemdata[0].TransporterName,
								"TransDocDt": that.dateFormat1(itemdata[0].TransportDocDate) || "",
								"TransDocNo": itemdata[0].TransportDocNo || "",
								"VehNo": itemdata[0].VehicleNo || "",
								"VehType": itemdata[0].VehicleType || "",
							};

							this.getView().setBusy(true);
							$.ajax({
								// url: `api/auth?username=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}`, // Use the correct full URL
								url: `https://testdigisign.primustechsys.com:4001/api/auth`,
								// url: `https://primebridge.primustechsys.com/api/auth`,
								type: "GET",
								beforeSend: function (xhr) {
									// xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
									xhr.setRequestHeader(
										"Authorization",
										"Basic " + btoa("G0111" + ":" + "Admin@123")
									);
									xhr.setRequestHeader("Content-Type", "application/json");
								},
								// headers: oHeaders,
								// username: user,
								// password: passwrd,
								async: true,
								// type: 'GET',
								// headers: oHeaders,
								// async: false,  // Use asynchronous request
								success: function (data) {
									console.log("Token received:", data);
									let jsonData = JSON.parse(data);
									var tokens = jsonData.access_token;
									// let tokens = data.access_token;

									var username = "G0111";

									// console.log(tokenVariable)

									var username = "G0111";
									var password = "Admin@123";
									var base64Credentials = btoa(username + ":" + password);
									var oHeaders = {
										// 'X-CSRF-Token': '',
										// "Authorization": "Basic " + base64Credentials,
										// "Content-Type": "application/json"

										Clientcode: selecteddata.Clientcode,
										CustomerCode: "G0111",
										Token: tokens,
										"Content-Type": "application/JSON",
									};
									that.getView().setBusy(true);
									$.ajax({
										// url: '/api/Invoice/GenerateIRN?gstin=27AALCC5030G1ZT',
										url: `https://testdigisign.primustechsys.com:4001/api/Invoice/GenerateEwbByIRN?gstin=${itemdata[0].PlantGSTIN}`,
										// url: `https://primebridge.primustechsys.com/api/Invoice/GenerateEwbByIRN?gstin=${itemdata[0].PlantGSTIN}`,
										type: "POST",
										data: JSON.stringify(oPayload),
										headers: oHeaders,
										async: false,
										success: function (data) {
											// console.log("success" + data);
											let result = data[0];
											if (result.flag === true) {
												if (result.ewbNo !== null) {
													if (result.flag === true) {
														sap.m.MessageToast.show(
															"E-Way bill generated successfully!"
														);
														// let [ackdate, acktime] = data.Data.irn.data.ack_dt.split(" ");
														let EWDdate = result.ewbDt;
														if (result.ewbValidTill !== null) {
															var valdate = result.ewbValidTill.split(" ");
															selecteddata.ValidTodate = valdate;
															// selecteddata.ValidTotime = valtime;
														}
														selecteddata.EWayBill = result.ewbNo;
														selecteddata.eWayBillCreationDate = EWDdate;
														// selecteddata.eWayBillCreationTime = EWDtime;
														selecteddata.ValidFromdate = EWDdate;
														// ✅ ADD THIS TO STORE THE PDF URL
														selecteddata.PDFURL = result.detailedpdfUrl;
														selecteddata.SummaryPDFURL = result.pdfUrl;
														// that.getView().getModel("entryModel").refresh(true)
														// selecteddata.ValidFromtime = EWDtime;
														MessageBox.success(`${result.message}`);
														selecteddata.eWayBillStatus = false;
														selecteddata.EWBCancelDate="";
														// 🔐 Store in LocalModel
														// let billingDocNum = String(selecteddata.BillingDocument || selecteddata.BillingDocumentNumber).trim();
														// if (!billingDocNum) {
														// 	sap.m.MessageToast.show("Billing document number not found.");
														// 	return;
														// }

														// let oLocalModel = that.getView().getModel("LocalModel");
														// let aPdfEntries = oLocalModel.getProperty("/pdfEntries") || [];

														// let index = aPdfEntries.findIndex(e => e.BillingDocumentNumber === billingDocNum);
														// let newEntry = {
														// 	BillingDocumentNumber: billingDocNum,
														// 	EWayBill: result.ewbNo,
														// 	pdfUrl: result.pdfUrl,
														// 	detailedpdfUrl: result.detailedpdfUrl
														// };

														// if (index !== -1) {
														// 	aPdfEntries[index] = newEntry;
														// } else {
														// 	aPdfEntries.push(newEntry);
														// }

														// oLocalModel.setProperty("/pdfEntries", aPdfEntries);


														//   that.onDownloadPDF()


													} else {
														sap.m.MessageToast.show(
															"Error while EWayBill generation!"
														);
														MessageBox.error(`${result.message}`);
														// that.getView().getModel("entryModel").setProperty("/items/" + aSelectedIndices[i] + "/Messages", data.Data.ewb.error[0].error_desc);
														selecteddata.Messages = result.message;
														let EWDdate = result.ewbDt;
														if (result.ewbValidTill !== null) {
															var valdate = result.ewbValidTill.split(" ");
															selecteddata.ValidTodate = valdate;
															// selecteddata.ValidTotime = valtime;
														}
														selecteddata.EWayBill = result.ewbNo;
														selecteddata.eWayBillCreationDate = EWDdate;
														// selecteddata.eWayBillCreationTime = EWDtime;
														selecteddata.ValidFromdate = EWDdate;
													}
												}
											} else {
												sap.m.MessageToast.show(
													"Error while EWayBill generation!"
												);
												// that.getView().getModel("entryModel").setProperty("/items/" + aSelectedIndices[i] + "/Messages", data.Errors[0].error_desc);
												selecteddata.Messages = result.message;
											}
											// that.getView().setBusy(false);
											that.oncheckdoc();
										},
										error: function (e) {
											console.log("error: " + e);
											that.getView().setBusy(false);
										},
									});
								},
								error: function (xhr, status, error) {
									console.log("Error:", status, error);
									MessageBox.error("Token generation failed");
									return error;
									that.getView().setBusy(false);
								},
							});
						}
					}
				} else {
					sap.m.MessageToast.show("Please select at least one record!");
				}
			},

			convertToEdmDateTime: function (inputDate) {
				const [datePart, time, meridiem] = inputDate.split(" ");
				const [day, month, year] = datePart.split("/");
				let [hour, minute, second] = time.split(":").map(Number);

				// If seconds are missing, set it to 0
				if (second === undefined) {
					second = 0;
				}

				if (meridiem === "PM" && hour !== 12) {
					hour += 12;
				} else if (meridiem === "AM" && hour === 12) {
					hour = 0;
				}

				// Construct ISO 8601 format string
				const edmDateTime = `${year}-${month.padStart(2, "0")}-${day.padStart(
					2,
					"0"
				)}T${hour.toString().padStart(2, "0")}:${minute
					.toString()
					.padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
				return edmDateTime;
			},

			convertToEdmTime: function (dateStr) {
				const date = new Date(dateStr);
				const hours = date.getHours();
				const minutes = date.getMinutes();
				const seconds = date.getSeconds();

				return `PT${hours}H${minutes}M${seconds}S`;
			},
			// -----------------------------------------------------------------------------------------------------  cancel Eway bill -----------------------------------------------------------------------------------------//
			onCancelBill: function () {
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length === 0) {
					MessageBox.error("Please select a row!");
					return;
				} else if (aSelectedIndices.length > 1) {
					MessageBox.show("Please select only one row.");
					return;
				}
				var oContext = oTable.getContextByIndex(aSelectedIndices[0]);
				var oSelectedData = oContext.getObject();
				var oLocalModel = this.getView().getModel("EWBModel");
				that
					.getView()
					.getModel("EWBModel")
					.setProperty("/DocNumber", oSelectedData.BillingDocument);
				oLocalModel.setProperty(
					"/EWayCancelReasonCode",
					oSelectedData.CancellationCodeEWB || ""
				);
				oLocalModel.setProperty(
					"/EWayCancellationRemark",
					oSelectedData.EWBCancelRemark || ""
				);
				// oLocalModel.setProperty("/DocNumber", oSelectedData.DocumentNumber || "");
				if (!this._ewaybillFormDialog) {
					this._ewaybillFormDialog = sap.ui.xmlfragment(
						"einvoiceewaybill.view.cancelewaybillform",
						this
					);
					this.getView().addDependent(this._ewaybillFormDialog);
					this._ewaybillFormDialog.setContentWidth("600px");
				}
				this._ewaybillFormDialog.open();
			},

			oncancelewbSave: function () {
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length === 0) {
					MessageBox.error("No row selected to update.");
					return;
				}
				var oContext = oTable.getContextByIndex(aSelectedIndices[0]);
				var oSelectedData = oContext.getObject();
				var oEntryModel = this.getView().getModel("entryModel");
				var oLocalModel = this.getView().getModel("EWBModel");
				oSelectedData.EWayCancelReasonCode =
					oLocalModel.getProperty("/EWayCancelReasonCode") || "";
				oSelectedData.EWayCancellationRemark =
					oLocalModel.getProperty("/EWayCancellationRemark") || "";

				var oData = oEntryModel.getData();
				var sPath = oContext.getPath();
				var iIndex = parseInt(sPath.split("/")[2]);
				oData[iIndex] = oSelectedData;
				oEntryModel.setData(oData);
				this._ewaybillFormDialog.close();
				// MessageBox.success("Data updated successfully!");
				that.oncancelewaybill();
			},

			oncancelewbCancel: function () {
				this._ewaybillFormDialog.close();
			},

			oncancelewaybill: function () {
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length === 0) {
					MessageBox.error("No row selected to update.");
					return;
				}
				for (var i = 0; i < aSelectedIndices.length; i++) {
					var selecteddata = oTable
						.getContextByIndex(aSelectedIndices[i])
						.getObject();
					var itemdata = tData.filter(function (pItem) {
						return (
							pItem.AccountingDocument === selecteddata.Accountingdocument &&
							pItem.BillingDocument === selecteddata.BillingDocument &&
							pItem.DocumentReferenceID === selecteddata.DocumentReferenceID
						);
					});
					for (var j = 0; j < itemdata.length; j++) {
						var oPayload = {
							"ewbNo": selecteddata.EWayBill,
							"CancelledReason": selecteddata.EWayCancelReasonCode,//"Order Cancelled",
							"CancelledRemarks": selecteddata.EWayCancellationRemark// "Approved",

							// "ewayBillNo": selecteddata.EWayBill,
							// "cancelReasonCd": selecteddata.CancellationCodeEWB,
							// "cancelRemarks": selecteddata.EWBCancelRemark,
						};

						var oHeaders = {
							Authorization: "Basic " + btoa("G0111" + ":" + "Admin@123"),
							ContentType: "application/json",
						};
						this.getView().setBusy(true);
						setTimeout(() => {
							$.ajax({
								// url: `api/auth?username=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}`, // Use the correct full URL
								url: `https://testdigisign.primustechsys.com:4001/api/auth`,
								// url: `https://primebridge.primustechsys.com/api/auth`,
								type: "GET",
								headers: oHeaders,
								async: true, // Use asynchronous request
								success: function (data) {
									console.log("Token received:", data);
									let jsonData = JSON.parse(data);
									var tokens = jsonData.access_token;
									var username = jsonData.userName;

									// var username = "Admin";
									// var password = "Admin";
									// var base64Credentials = btoa(username + ":" + password);
									var oHeaders = {
										Token: tokens,
										CustomerCode: "G0111",
										"Content-Type": "application/json",
										Gstin: itemdata[0].PlantGSTIN,
									};

									$.ajax({
										url: `https://testdigisign.primustechsys.com:4001/api/EWayBill/CancelEWB?gstin=${itemdata[0].PlantGSTIN}`,
										// url: `https://primebridge.primustechsys.com/api/EWayBill/CancelEWB?gstin=${itemdata[0].PlantGSTIN}`,
										type: "POST",
										data: JSON.stringify(oPayload),
										headers: oHeaders,
										async: true,
										success: function (data) {
											let result = data[0];
											console.log("success" + data);
											if (result.flag === true) {
												MessageBox.success(`${result.message}`);
												sap.m.MessageToast.show(
													"E-way Bill Cancelled successfully!"
												);
												let ackdate = that.convertToEdmDateTime(
													result.cancelDate
												);
												selecteddata.EWBCancelDate = ackdate;
												// selecteddata.EWayCancelTime = acktime;
												selecteddata.eWayBillStatus = true;
											} else if (data) {
												sap.m.MessageToast.show(
													"Error while E-way bill cancelation!"
												);
												// that.getView().getModel("entryModel").setProperty("/items/" + aSelectedIndices[i] + "/Messages", data.Error.errorDescription);
												selecteddata.Messages = data[0].message;
											} else {
												sap.m.MessageToast.show(
													"Error while E-way bill cancelation!"
												);
												// that.getView().getModel("entryModel").setProperty("/items/" + aSelectedIndices[i] + "/Messages", data.Errors[0].error_desc);
												selecteddata.Messages = data[0].message;
											}
											// that.getView().setBusy(false);
											that.oncheckdoc();
										},
										error: function (e) {
											console.log("error: " + e);
											that.getView().setBusy(false);
										},
									});
								},
								error: function (xhr, status, error) {
									console.log("Error:", status, error);
									MessageBox.error("Token generation failed");
									return error;
									that.getView().setBusy(false);
								},
							});
						}, 500);
					}
				}
			},
			// ---------------------------------------------------------------------------------------------------------- Cancel E-invoice --------------------------------------------------------------------------------------//
			onCancelIRN: function () {
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length === 0) {
					MessageBox.error("Please select a row!");
					return;
				} else if (aSelectedIndices.length > 1) {
					MessageBox.show("Please select only one row.");
					return;
				}
				var oContext = oTable.getContextByIndex(aSelectedIndices[0]);
				var oSelectedData = oContext.getObject();
				var oLocalModel = this.getView().getModel("EinvoiceModel");
				that
					.getView()
					.getModel("EinvoiceModel")
					.setProperty("/DocNumber", oSelectedData.BillingDocument);
				oLocalModel.setProperty(
					"/invoiceNumber",
					oSelectedData.DocumentNumber || ""
				);
				oLocalModel.setProperty(
					"/Einvoicereasoncode",
					oSelectedData.EInvoiceReasonCode || ""
				);
				oLocalModel.setProperty(
					"/cancellationremark",
					oSelectedData.EinvoiceCancellationRemark || ""
				);
				// oLocalModel.setProperty("/DocNumber", oSelectedData.DocumentNumber || "");
				if (!this._EinvoiceFormDialog) {
					this._EinvoiceFormDialog = sap.ui.xmlfragment(
						"einvoiceewaybill.view.canceleinvoiceform",
						this
					);
					this.getView().addDependent(this._EinvoiceFormDialog);
					this._EinvoiceFormDialog.setContentWidth("600px");
				}
				this._EinvoiceFormDialog.open();
			},
			oncanceleinvoiceSave: function () {
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length === 0) {
					MessageBox.error("No row selected to update.");
					return;
				}
				var oContext = oTable.getContextByIndex(aSelectedIndices[0]);
				console.log(oContext);
				var oSelectedData = oContext.getObject();
				var oEntryModel = this.getView().getModel("entryModel");
				var oLocalModel = this.getView().getModel("EinvoiceModel");
				oSelectedData.EInvoiceReasonCode =
					oLocalModel.getProperty("/Einvoicereasoncode") || "";
				oSelectedData.EinvoiceCancellationRemark =
					oLocalModel.getProperty("/cancellationremark") || "";
				var oData = oEntryModel.getData();
				var sPath = oContext.getPath();
				var iIndex = parseInt(sPath.split("/")[2]);
				oData[iIndex] = oSelectedData;
				oEntryModel.setData(oData);
				this._EinvoiceFormDialog.close();
				// MessageBox.success("Data updated successfully!");
				that.oncanceleinvoice();
			},

			oncanceleinvoiceCancel: function () {
				this._EinvoiceFormDialog.close();
			},

			oncanceleinvoice: function () {
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();

				if (aSelectedIndices.length === 0) {
					MessageBox.error("No row selected to update.");
					return;
				}

				this.getView().setBusy(true); // Set busy indicator before making requests

				var ajaxCall = function (url, type, headers, data) {
					return new Promise(function (resolve, reject) {
						$.ajax({
							url: url,
							type: type,
							headers: headers,
							data: data ? JSON.stringify(data) : null,
							contentType: "application/json",
							success: function (response) {
								// var msg = response[0].message;
								// sap.m.MessageBox.success(msg);
								resolve(response);
								var msg = response[0].message;
								sap.m.MessageToast.show(msg);
								// return;
							},
							error: function (xhr, status, error) {
								reject(error);
							},
						});
					});
				};

				var requests = aSelectedIndices.map(function (index) {
					var selecteddata = oTable.getContextByIndex(index).getObject();
					var itemdata = tData.filter(function (pItem) {
						return (
							pItem.AccountingDocument === selecteddata.Accountingdocument &&
							pItem.BillingDocument === selecteddata.BillingDocument &&
							pItem.DocumentReferenceID === selecteddata.DocumentReferenceID
						);
					});

					if (itemdata.length === 0) {
						return Promise.resolve(); // Skip processing if no matching data
					}

					var gstin = itemdata[0].PlantGSTIN;
					var user = "G0111";
					var clientCode = "G0111";
					var password = "Admin@123";

					if (!user) {
						console.error("No credentials found for GSTIN: " + gstin);
						return Promise.resolve();
					}

					var authHeaders = {
						Authorization: "Basic " + btoa(user + ":" + password),
						"Content-Type": "application/json",
					};
					// "https://testdigisign.primustechsys.com:4001/api/auth"
					// https://primus-einvoice.chembondindia.com:8443/api/auth

					return ajaxCall(
						`https://testdigisign.primustechsys.com:4001/api/auth`,
						// `https://primebridge.primustechsys.com/api/auth`,
						"GET",
						authHeaders
					)
						.then(function (authResponse) {
							let jsonData = JSON.parse(authResponse);
							var token = jsonData.access_token;

							var cancelHeaders = {
								Token: token,
								CustomerCode: user,
								"Content-Type": "application/json",
							};

							var oPayload = {
								"Irn": selecteddata.InvoiceRefNum,
								"CnlRsn": selecteddata.EInvoiceReasonCode,
								"CnlRem": selecteddata.EinvoiceCancellationRemark,
							};
							// `https://testdigisign.primustechsys.com:4001/api/Invoice/CancelIRN?gstin=${itemdata[0].PlantGSTIN}`,
							// `https://primebridge.primustechsys.com/api/Invoice/CancelIRN?gstin=${itemdata[0].PlantGSTIN}`,
							return ajaxCall(
								`https://testdigisign.primustechsys.com:4001/api/Invoice/CancelIRN?gstin=${itemdata[0].PlantGSTIN}`,
								"POST",
								cancelHeaders,
								oPayload
							).then(function (response) {
								if (response) {
									let result = response[0];
									if (result.flag === true) {
										MessageBox.success(result.message);
										let ackDt = result.cancelDate.split(" ");
										var entryModel = that.getView().getModel("entryModel");
										selecteddata.CancelledDate = ackDt;
										selecteddata.CancelledTime = acktime;
										selecteddata.CancelEinvoice = true;
									} else {
										selecteddata.Messages = response.message;
									}
								}
							});
						})
						.catch(function (error) {
							// console.error("Error:", error);
							// MessageBox.error("E-Invoice cancellation failed.");
						});
				});

				// Set Busy false only after all requests are completed
				Promise.allSettled(requests).finally(function () {
					that.getView().setBusy(false);
					that.oncheckdoc(); // Call after all requests finish
				});
			},



			onDownloadPDF: function () {
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();

				if (aSelectedIndices.length === 0) {
					sap.m.MessageToast.show("Please select a record.");
					return;
				}

				var selecteddata = oTable.getContextByIndex(aSelectedIndices[0]).getObject();

				if (!selecteddata.PDFURL) {
					sap.m.MessageToast.show("PDF URL not available for selected entry.");
					return;
				}

				// Prefer detailedpdfUrl if present
				var pdfUrl = selecteddata.PDFURL;
				// var pdfUrl = "https://uat.logitax.in/web/webapi/AsyncPdfDetail?ewb_id_client_code=140~97U5F"

				// Create invisible anchor tag and trigger click
				var link = document.createElement("a");
				link.href = pdfUrl;
				link.target = "_blank"; // open in new tab or use "_self" for same window
				link.download = `EWayBill_${selecteddata.EWayBill || 'Document'}.pdf`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				this.oncheckdoc();

			},
			onDownloadSummaryPDF: function () {
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();

				if (aSelectedIndices.length === 0) {
					sap.m.MessageToast.show("Please select a record.");
					return;
				}

				var selecteddata = oTable.getContextByIndex(aSelectedIndices[0]).getObject();

				if (!selecteddata.SummaryPDFURL) {
					sap.m.MessageToast.show("PDF URL not available for selected entry.");
					return;
				}

				// Prefer detailedpdfUrl if present
				var pdfUrl = selecteddata.SummaryPDFURL
				// var pdfUrl = "https://uat.logitax.in/web/webapi/AsyncPdfDetail?ewb_id_client_code=140~97U5F"

				// Create invisible anchor tag and trigger click
				var link = document.createElement("a");
				link.href = pdfUrl;
				link.target = "_blank"; // open in new tab or use "_self" for same window
				link.download = `EWayBill_${selecteddata.EWayBill || 'Document'}.pdf`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				this.oncheckdoc();

			},
			// onDownloadPDF: function () {
			// 	var oTable = this.getView().byId("idEntryTable");
			// 	var aSelectedIndices = oTable.getSelectedIndices();

			// 	if (aSelectedIndices.length === 0) {
			// 	  sap.m.MessageToast.show("Please select a record.");
			// 	  return;
			// 	}

			// 	var selecteddata = oTable.getContextByIndex(aSelectedIndices[0]).getObject();
			// 	var billingDocNum = selecteddata.BillingDocument || selecteddata.BillingDocumentNumber;

			// 	// Get LocalModel entry
			// 	var oLocalModel = this.getView().getModel("LocalModel");
			// 	var aPdfEntries = oLocalModel.getProperty("/pdfEntries") || [];
			// 	var pdfEntry = aPdfEntries.find(e => e.BillingDocumentNumber === billingDocNum);

			// 	if (!pdfEntry || !pdfEntry.detailedpdfUrl) {
			// 	  sap.m.MessageToast.show("PDF not found for selected document.");
			// 	  return;
			// 	}

			// 	var filename = `EWayBill_${pdfEntry.EWayBill || 'Document'}.pdf`;

			// 	fetch(pdfEntry.detailedpdfUrl)
			// 	  .then(response => {
			// 		if (!response.ok) throw new Error("Download failed");
			// 		return response.blob();
			// 	  })
			// 	  .then(blob => {
			// 		var blobUrl = URL.createObjectURL(blob);
			// 		var link = document.createElement("a");
			// 		link.href = blobUrl;
			// 		link.download = filename;
			// 		document.body.appendChild(link);
			// 		link.click();
			// 		document.body.removeChild(link);
			// 		URL.revokeObjectURL(blobUrl);
			// 	  })
			// 	  .catch(error => {
			// 		console.error("Error downloading PDF", error);
			// 		sap.m.MessageToast.show("Failed to download PDF.");
			// 	  });
			//   },

			// onDownloadPDF: function () {
			// 	var oTable = this.getView().byId("idEntryTable");
			// 	var aSelectedIndices = oTable.getSelectedIndices();

			// 	if (aSelectedIndices.length === 0) {
			// 	  sap.m.MessageToast.show("Please select a record.");
			// 	  return;
			// 	}

			// 	var selecteddata = oTable.getContextByIndex(aSelectedIndices[0]).getObject();
			// 	var billingDocNum = String(selecteddata.BillingDocument || selecteddata.BillingDocumentNumber).trim();

			// 	var oLocalModel = this.getView().getModel("LocalModel");
			// 	var aPdfEntries = oLocalModel.getProperty("/pdfEntries") || [];
			// 	var pdfEntry = aPdfEntries.find(e => e.BillingDocumentNumber === billingDocNum);

			// 	if (!pdfEntry || !pdfEntry.detailedpdfUrl) {
			// 	  sap.m.MessageToast.show("PDF not found for selected document.");
			// 	  return;
			// 	}

			// 	// Create Dialog with PDF Viewer
			// 	var oDialog = new sap.m.Dialog({
			// 	  title: "E-Way Bill PDF Preview",
			// 	  contentWidth: "80%",
			// 	  contentHeight: "90%",
			// 	  resizable: true,
			// 	  draggable: true,
			// 	  content: [
			// 		new sap.ui.core.HTML({
			// 		  content: `<iframe src="${pdfEntry.detailedpdfUrl}" width="100%" height="100%" style="border:none;"></iframe>`
			// 		})
			// 	  ],
			// 	  beginButton: new sap.m.Button({
			// 		text: "Download",
			// 		icon: "sap-icon://download",
			// 		press: function () {
			// 		  var filename = `EWayBill_${pdfEntry.EWayBill || 'Document'}.pdf`;
			// 		  fetch(pdfEntry.detailedpdfUrl)
			// 			.then(response => {
			// 			  if (!response.ok) throw new Error("Download failed");
			// 			  return response.blob();
			// 			})
			// 			.then(blob => {
			// 			  var blobUrl = URL.createObjectURL(blob);
			// 			  var link = document.createElement("a");
			// 			  link.href = blobUrl;
			// 			  link.download = filename;
			// 			  document.body.appendChild(link);
			// 			  link.click();
			// 			  document.body.removeChild(link);
			// 			  URL.revokeObjectURL(blobUrl);
			// 			})
			// 			.catch(error => {
			// 			  console.error("Error downloading PDF", error);
			// 			  sap.m.MessageToast.show("Failed to download PDF.");
			// 			});
			// 		}
			// 	  }),
			// 	  endButton: new sap.m.Button({
			// 		text: "Close",
			// 		press: function () {
			// 		  oDialog.close();
			// 		  oDialog.destroy();
			// 		}
			// 	  })
			// 	});

			// 	oDialog.open();
			//   }
			// onDownloadPDF: function () {
			// 	var oTable = this.getView().byId("idEntryTable");
			// 	var aSelectedIndices = oTable.getSelectedIndices();

			// 	if (aSelectedIndices.length === 0) {
			// 		sap.m.MessageToast.show("Please select a record.");
			// 		return;
			// 	}

			// 	var selecteddata = oTable.getContextByIndex(aSelectedIndices[0]).getObject();
			// 	var billingDocNum = selecteddata.BillingDocument || selecteddata.BillingDocumentNumber;

			// 	var oLocalModel = this.getView().getModel("LocalModel");
			// 	var aPdfEntries = oLocalModel.getProperty("/pdfEntries") || [];
			// 	var pdfEntry = aPdfEntries.find(e => e.BillingDocumentNumber === billingDocNum);

			// 	if (!pdfEntry || !pdfEntry.detailedpdfUrl) {
			// 		sap.m.MessageToast.show("PDF not found for selected document.");
			// 		return;
			// 	}

			// 	// ✅ Open in a new tab
			// 	window.open(pdfEntry.detailedpdfUrl, "_blank");
			// }




			// 		downloadPdfFromUrl: function (url) {
			// 			const link = document.createElement("a");
			// 			link.href = url;
			// 			link.target = "_blank";
			// 			link.download = ""; // let browser infer file name
			// 			document.body.appendChild(link);
			// 			link.click();
			// 			document.body.removeChild(link);
			// 		}
			// ,				
			//----------------------------------------------------------------------------------------------------------- date formates -------------------------------------------------------------------------------------------//
			dateFormat: function (date) {
				if (!date) {
					return "";
				}
				var dateTime = new Date(date);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd",
				});
				var formattedDate = oDateFormat.format(dateTime);
				return formattedDate;
			},
			dateFormat4: function (date) {
				if (!date) {
					return "";
				}
				var dateTime = new Date(date);
				var year = dateTime.getUTCFullYear();
				var month = String(dateTime.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
				var day = String(dateTime.getUTCDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},


			dateFormat3: function (date) {
				// Split the input date
				const [day, month, year] = date.split("/");

				// Create a new Date object (month is 0-based)
				const dateObj = `${year}-${month}-${day}`;

				// Return the full string format
				return dateObj.toString();
			},
			dateFormat1: function (date) {
				if (!date) {
					return "";
				}
				var dateTime = new Date(date);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd/MM/yyyy",
				});
				var formattedDate = oDateFormat.format(dateTime);
				return formattedDate;
			},
			dateFormat2: function (date) {
				if (!date) {
					return "";
				}
				var dateTime = new Date(date);
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "dd-MM-yyyy",
				});
				var formattedDate = oDateFormat.format(dateTime);
				return formattedDate;
			},

			convertDate: function (sDate) {
				var dateTime = new Date(sDate);
				if (dateTime !== undefined && dateTime !== null && dateTime !== "") {
					var offSet = dateTime.getTimezoneOffset();
					var offSetVal = dateTime.getTimezoneOffset() / 60;
					var h = Math.floor(Math.abs(offSetVal));
					var m = Math.floor((Math.abs(offSetVal) * 60) % 60);
					dateTime = new Date(dateTime.setHours(h, m, 0, 0));
					return dateTime;
				}
			},

			convertEdmTime: function (time) {
				if (!time) {
					return "00:00:00";
				}

				// Check if input is in hh:mm:ss format
				if (typeof time === "string" && time.includes(":")) {
					var parts = time.split(":");
					if (parts.length === 3) {
						var hours = parseInt(parts[0], 10);
						var minutes = parseInt(parts[1], 10);
						var seconds = parseInt(parts[2], 10);

						if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
							return "Invalid Time Format";
						}

						// Convert to EDM time format (milliseconds)
						return {
							__edmType: "Edm.Time",
							ms: (hours * 3600 + minutes * 60 + seconds) * 1000,
						};
					}
					return "Invalid Time Format";
				}

				// Otherwise, assume input is in EDM format (milliseconds) and convert to hh:mm:ss
				if (isNaN(time)) {
					return "00:00:00";
				}

				var totalSeconds = parseInt(time, 10) / 1000;
				var hours = Math.floor(totalSeconds / 3600);
				var minutes = Math.floor((totalSeconds % 3600) / 60);
				var seconds = Math.floor(totalSeconds % 60);

				return (
					String(hours).padStart(2, "0") +
					":" +
					String(minutes).padStart(2, "0") +
					":" +
					String(seconds).padStart(2, "0")
				);
			},
			// ------------------------------------------------------------------------------------------------------------ Print function -------------------------------------------------------------------------------------------//
			onPrint() {
				if (!this._busyDialog) {
					this._busyDialog = new sap.m.BusyDialog({
						text: "PDF Generating...",
						title: "Please Wait",
					});
				}

				this._busyDialog.open();

				// Simulate PDF generation process (e.g. async call)
				setTimeout(
					function () {
						// Call your PDF generation logic here
						// After done:
						this._busyDialog.close();
					}.bind(this),
					3000
				);

				this._Arrpdfurl = [];
				var that = this;
				var oTable = this.getView().byId("idEntryTable");
				var aSelectedIndices = oTable.getSelectedIndices();
				if (aSelectedIndices.length === 0) {
					MessageBox.error("Please select a row!");
					return;
				} else if (aSelectedIndices.length > 1) {
					MessageBox.show("Please select only one row.");
					return;
				}
				var oSelectedData;
				for (let i = 0; i < aSelectedIndices.length; i++) {
					var oContext = oTable.getContextByIndex(aSelectedIndices[i]);
					oSelectedData = oContext.getObject();
				}
				var oHeaders = {
					"X-Requested-With": "X",
					Accept: "application/json",
				};
				var mModel = that.getView().getModel("API_BILLING_DOCUMENT_SRV");
				var sPath = `/A_BillingDocument('${oSelectedData.BillingDocument}')/to_Text`;
				// this.getView().setBusy(true);
				mModel.read(sPath, {
					method: "GET",
					headers: oHeaders,
					success: function (oData, oResponse) {
						var portOfloading = "",
							Mode = "",
							TransportName = "",
							LRNO = "",
							LRDate = "",
							MVNo = "",
							ASNNO = "",
							EWayBill = "";
						console.log("oData.results", oData.results);
						oData.results.forEach((item) => {
							if (item.LongTextID == "ZMOD") {
								Mode = item.LongText;
							} else if (item.LongTextID == "ZTNM") {
								TransportName = item.LongText;
							} else if (item.LongTextID == "ZLRN") {
								LRNO = item.LongText;
							} else if (item.LongTextID == "ZLRD") {
								LRDate = item.LongText;
							} else if (item.LongTextID == "ZVEH") {
								MVNo = item.LongText;
							} else if (item.LongTextID == "ZASN") {
								ASNNO = item.LongText;
							} else if (item.LongTextID == "ZPOR") {
								portOfloading = item.LongText;
							} else if (item.LongTextID == "ZEWB") {
								EWayBill = item.LongText;
							}
						});
						var matchingPData = kData.filter(function (pItem) {
							return pItem.BillingDocument === oSelectedData.BillingDocument;
						});
						console.log("oSelectedData", oSelectedData);
						var ConditionAmountitem_4 = 0;
						var ConditionAmountitem_7 = 0;
						var ConditionAmountitem_8 = 0;
						var ConditionAmountitem_6 = 0;
						var ConditionAmountitem_6 = 0;
						var ZFRCAmounttotal = 0;
						var ZFREAmounttotal = 0;
						var IGSTtotal = 0;
						var SCGSTTotal = 0;
						// Ensure AccountingExchangeRate remains a number
						var AccountingExchangeRate = parseFloat(
							matchingPData[0].AccountingExchangeRate
						);
						matchingPData.forEach((item) => {
							ConditionAmountitem_4 += parseFloat(item.ConditionAmount_4) || 0;
							ConditionAmountitem_7 += parseFloat(item.ConditionAmount_7) || 0;
							ConditionAmountitem_8 += parseFloat(item.ConditionAmount_8) || 0;
							ConditionAmountitem_6 += parseFloat(item.JTC2Amount) || 0;
							ZFRCAmounttotal += parseFloat(item.ZFRCAmount) || 0;
							ZFREAmounttotal += parseFloat(item.ZFREAmount) || 0;
							IGSTtotal += parseFloat(item.JOIGAmount) || 0;
							SCGSTTotal += parseFloat(item.JOSGAmount) || 0;

							var contype = parseFloat(item.ConditionRateValue) || 0;
							var ZHSSRate = parseFloat(item.ZHSSRate) || 0;
							var exprate = 0;

							if (contype !== 0 && ZHSSRate !== 0) {
								exprate = ZHSSRate * AccountingExchangeRate;
							} else if (ZHSSRate === 0 && contype !== 0) {
								exprate = contype * AccountingExchangeRate;
							} else if (contype === 0 && ZHSSRate !== 0) {
								exprate = ZHSSRate * AccountingExchangeRate;
							}

							item.exprate = exprate.toFixed(2); // Convert to 2 decimal places only when storing
						});

						// var matchingBdata = oDatak.filter(function (pItem) {
						// 	return pItem.BillingDocument === oSelectedData.BillingDocument;
						// });
						console.log("ConditionAmount_8kData ", matchingPData);
						var CustomerTaxClassification =
							matchingPData[0].CustomerTaxClassification;
						var QRCode = oSelectedData.QRCode1 + oSelectedData.QRCode2;
						var ShipToPartyCountry = matchingPData[0].ShipToPartyCountry;
						var ConditionAmountitem =
							ConditionAmountitem_4 +
							ConditionAmountitem_7 +
							ConditionAmountitem_8;
						var ZFRCAmountZFREAmount = ZFRCAmounttotal + ZFREAmounttotal;
						var ZFRCZFRETotal =
							ZFRCAmountZFREAmount * matchingPData[0].AccountingExchangeRate;
						var IGSTtotalValue = IGSTtotal.toFixed(2);
						var SCGSTtotalValue = SCGSTTotal.toFixed(2);
						var finalTotalValue =
							(parseFloat(matchingPData[0].TotalNetAmount) +
								parseFloat(matchingPData[0].TotalTaxAmount)) *
							AccountingExchangeRate;
						var CustomerName = matchingPData[0].CustomerName;
						var Customer = matchingPData[0].Customer;
						var StreetName = matchingPData[0].StreetName;
						var StreetName_1 = matchingPData[0].StreetName_1;
						var StreetName_2 = matchingPData[0].StreetName_2;
						var StreetName_3 = matchingPData[0].StreetName_3;
						var CityName_1 = matchingPData[0].CityName_1;
						var Region_1 = matchingPData[0].Region_1;
						var PostalCode_1 = matchingPData[0].PostalCode_1;
						var TelephoneNumber1_1 = matchingPData[0].TelephoneNumber1_1;
						var TelephoneNumber2_1 = matchingPData[0].TelephoneNumber2_1;
						var TaxNumber3 = matchingPData[0].TaxNumber3;
						var CustomerPurchaseOrderDate = that.formatDate(
							matchingPData[0].CustomerPurchaseOrderDate
						);
						var NetDueDate = that.formatDate(matchingPData[0].NetDueDate);
						var IncotermsClassification =
							matchingPData[0].IncotermsClassification;
						var IncotermsLocation1 = matchingPData[0].IncotermsLocation1;
						var DocumentNumber = matchingPData[0].DocumentNumber;
						var compcode = oSelectedData.CompanyCode;
						compcode = compcode.replace(/&/g, "&amp;");
						var Plant = oSelectedData.Plant;
						Plant = Plant.replace(/&/g, "&amp;");
						var irnref = oSelectedData.InvoiceRefNum;
						irnref = irnref.replace(/&/g, "&amp;");
						var IRNAckNo_BDH = oSelectedData.AcknowledgementNum;
						var IRNAckDate_BDH = that.dateFormat2(
							matchingPData[0].AcknowledgementDate
						);
						var SalesDocument = oSelectedData.SalesDocument;
						var PurchaseOrderByCustomer = oSelectedData.PurchaseOrderByCustomer;
						var PricingProcedure = matchingPData[0].PricingProcedure;
						var Cust_Purch_Date_BDI = oSelectedData.Cust_Purch_Date_BDI;
						var FullName = oSelectedData.FullName;
						var Partner = oSelectedData.Partner;
						var AccountByCustomer_BDI = oSelectedData.AccountByCustomer_BDI;
						var Incoterms = oSelectedData.Incoterms;
						var Region = oSelectedData.Region;
						var RegionName = oSelectedData.RegionName;
						var BillingDocumentType = matchingPData[0].BillingType;
						var YY1_ODIN_BDH = oSelectedData.YY1_ODIN_BDH;
						var DocumentReferenceID = oSelectedData.DocumentReferenceID;
						var YY1_CUST_MOBILE_NUMBER_BDH =
							oSelectedData.YY1_CUST_MOBILE_NUMBER_BDH;
						var YY1_CUST_TEL_NUMBER_BDH = oSelectedData.YY1_CUST_TEL_NUMBER_BDH;
						var BillingDate = that.formatDate(
							oSelectedData.BillingDocumentDate
						);
						var YY1_AccountByCustomer_BDI =
							oSelectedData.YY1_AccountByCustomer_BDI;
						var ReferenceSDDocument = matchingPData[0].ReferenceSDDocument;
						var ModeOfTransport = matchingPData[0].ModeOfTransport;
						var TransporterName = matchingPData[0].TransporterName;
						var TransportID = matchingPData[0].TransportID;
						var TransportDocDate = matchingPData[0].TransportDocDate;
						var VehicleNum = matchingPData[0].VehicleNum;
						var BillingDocumentDate = that.formatDate(
							matchingPData[0].BillingDocumentDate
						);
						var Region_2 = matchingPData[0].Region_2;
						var TaxNumber3_1 = matchingPData[0].TaxNumber3_1;
						var TransactionCurrency = matchingPData[0].TransactionCurrency;
						var CustomerName_1 = matchingPData[0].CustomerName_1;
						var StreetPrefixName1_2 = matchingPData[0].StreetPrefixName1_2;
						var ShipToPartyStreet = matchingPData[0].ShipToPartyStreet;
						var TelephoneNumber1 = matchingPData[0].TelephoneNumber1;
						var BillingDocument = matchingPData[0].BillingDocument;
						var TelephoneNumber2 = matchingPData[0].TelephoneNumber2;
						var BillToParty = matchingPData[0].BillToParty;
						var BTPHouseNumber = matchingPData[0].BTPHouseNumber;
						var STPHouseNumber = matchingPData[0].STPHouseNumber;
						var TotalDiscount = ConditionAmountitem.toFixed(2);
						var TcsTotal = ConditionAmountitem_6.toFixed(2);
						var TotalTaxAmount = matchingPData[0].TotalTaxAmount;
						var StreetPrefixName2_1 = matchingPData[0].StreetPrefixName2_1;
						var StreetPrefixName1_1 = matchingPData[0].StreetPrefixName1_1;
						var AcknowledgementTime = oSelectedData.AcknowledgementTime;
						var PostalCode_2 = matchingPData[0].PostalCode_2;
						var CityName_2 = matchingPData[0].CityName_2;
						var VendorCode = matchingPData[0].otcAccountByCustomer;
						var otcAccountByCustomer_1 =
							matchingPData[0].otcAccountByCustomer_1;
						var otcAccountByCustomer = matchingPData[0].otcAccountByCustomer;
						var otcShipToPartyAccountGroup =
							matchingPData[0].otcShipToPartyAccountGroup;
						var otcOrganizationName1 = matchingPData[0].otcOrganizationName1;
						var otcStreetName = matchingPData[0].otcStreetName;
						var otcStreetPrefixName1 = matchingPData[0].otcStreetPrefixName1;
						var otcStreetPrefixName2 = matchingPData[0].otcStreetPrefixName2;
						var otcStreetSuffixName1 = matchingPData[0].otcStreetSuffixName1;
						var otcStreetSuffixName2 = matchingPData[0].otcStreetSuffixName2;
						var otcDistrictName = matchingPData[0].otcDistrictName;
						var otcPostalCode = matchingPData[0].otcPostalCode;
						var otcCityName = matchingPData[0].otcCityName;
						// var otcDistrictName = matchingPData[0].otcDistrictName
						var otcRegion = matchingPData[0].otcRegion;
						var otcOrganizationName1_1 =
							matchingPData[0].otcOrganizationName1_1;
						var otcStreetName_1 = matchingPData[0].otcStreetName_1;
						var otcStreetPrefixName1_1 =
							matchingPData[0].otcStreetPrefixName1_1;
						var otcStreetPrefixName2_1 =
							matchingPData[0].otcStreetPrefixName2_1;
						var otcStreetSuffixName1_1 =
							matchingPData[0].otcStreetSuffixName1_1;
						var otcStreetSuffixName2_1 =
							matchingPData[0].otcStreetSuffixName2_1;
						var otcDistrictName_1 = matchingPData[0].otcDistrictName_1;
						var otcPostalCode_1 = matchingPData[0].otcPostalCode_1;
						var otcCityName_1 = matchingPData[0].otcCityName_1;
						var otcRegion_1 = matchingPData[0].otcRegion_1;
						var LRDatee = LRDate.replace(/\./g, "-");
						var YY1_UnloadingPoint_SDH = oSelectedData.YY1_UnloadingPoint_SDH;
						var BTPOrganizationBPName3 = oSelectedData.BTPOrganizationBPName3;
						var SHPOrganizationBPName3 = oSelectedData.SHPOrganizationBPName3;
						var DistrictName_1 = matchingPData[0].DistrictName_1;
						var DistrictName = matchingPData[0].DistrictName;
						var eWayBillNO = oSelectedData.EWayBill;
						var EWayBill = "";
						console.log(
							"kData ",
							portOfloading,
							Mode,
							TransportName,
							LRNO,
							LRDate,
							MVNo,
							ASNNO,
							EWayBill
						);
						if (EWayBill && eWayBillNO) {
							EWayBill = EWayBill;
						} else if (EWayBill) {
							EWayBill = EWayBill;
						} else if (eWayBillNO) {
							EWayBill = eWayBillNO;
						}
						var Item = [];
						matchingPData.forEach((itemdata) => {
							if (parseFloat(itemdata.BillingQuantity) > 0) {
								// console.log(itemdata.SalesDocumentItemCategory,itemdata.BillingQuantity )
								var item =
									"<Item>" +
									"<BillingDocumentItem>" +
									itemdata.BillingDocumentItem +
									"</BillingDocumentItem>" +
									"<Material>" +
									itemdata.Product.replace(/&/g, "&amp;") +
									"</Material>" +
									"<BillingDocumentItemText>" +
									itemdata.BillingDocumentItemText.replace(/&/g, "&amp;") +
									"</BillingDocumentItemText>" +
									"<HSNOrSACCode>" +
									itemdata.ConsumptionTaxCtrlCode.replace(/&/g, "&amp;") +
									"</HSNOrSACCode>" +
									// '<B30>' + itemdata.PurchaseOrderByCustomer_1.replace(/&/g, '&amp;') + '</B30>' +
									"<QuantityUnit>" +
									itemdata.BillingQuantityUnit +
									"</QuantityUnit>" +
									"<Quantity>" +
									itemdata.BillingQuantity +
									"</Quantity>" +
									"<PricingProcedure>" +
									itemdata.PricingProcedure.replace(/&/g, "&amp;") +
									"</PricingProcedure>" +
									"<AccountingExchangeRate>" +
									itemdata.AccountingExchangeRate +
									"</AccountingExchangeRate>" +
									"<TransactionCurrency>" +
									itemdata.TransactionCurrency +
									"</TransactionCurrency>" +
									"<ConditionRateValue>" +
									itemdata.ConditionRateValue +
									"</ConditionRateValue>" +
									"<ConditionAmount>" +
									itemdata.ConditionAmount +
									"</ConditionAmount>" +
									"<ZHSSRate>" +
									itemdata.ZHSSRate +
									"</ZHSSRate>" +
									"<ZHSSAmount>" +
									itemdata.ZHSSAmount +
									"</ZHSSAmount>" +
									"<ZFREAmount>" +
									itemdata.ZFREAmount +
									"</ZFREAmount>" +
									"<ZFRCAmount>" +
									itemdata.ZFRCAmount +
									"</ZFRCAmount>" +
									"<JOIGRate>" +
									itemdata.JOIGRate +
									"</JOIGRate>" +
									"<JOCGRate>" +
									itemdata.JOCGRate +
									"</JOCGRate>" +
									"<JOSGRate>" +
									itemdata.JOSGRate +
									"</JOSGRate>" +
									"<JOIGAmount>" +
									parseFloat(itemdata.JOIGAmount).toFixed(2) +
									"</JOIGAmount>" +
									"<JOCGAmount>" +
									parseFloat(itemdata.JOCGAmount).toFixed(2) +
									"</JOCGAmount>" +
									"<JOSGAmount>" +
									parseFloat(itemdata.JOSGAmount).toFixed(2) +
									"</JOSGAmount>" +
									"<ConditionAmount_4>" +
									itemdata.ConditionAmount_4 +
									"</ConditionAmount_4>" +
									"<ConditionAmount_7>" +
									itemdata.ConditionAmount_7 +
									"</ConditionAmount_7>" +
									"<ConditionAmount_8>" +
									itemdata.ConditionAmount_8 +
									"</ConditionAmount_8>" +
									"<longtextZPAC>" +
									itemdata.longtextZPAC.replace(/&/g, "&amp;") +
									"</longtextZPAC>" +
									"<LongText>" +
									itemdata.longtext0001.replace(/&/g, "&amp;") +
									"</LongText>" +
									"<exprate>" +
									itemdata.exprate +
									"</exprate>" +
									"<MaterialByCustomer>" +
									itemdata.MaterialByCustomer.replace(/&/g, "&amp;") +
									"</MaterialByCustomer>" +
									"</Item>";
								Item.push(item);
							}
						});

						var xml =
							'<?xml version="1.0" encoding="UTF-8"?><Form><E_Invoice_E_Way_Bill>' +
							"<QRCode>" +
							QRCode.replace(/&/g, "&amp;") +
							"</QRCode>" +
							"<CompanyCode>" +
							compcode +
							"</CompanyCode>" +
							"<Plant>" +
							Plant +
							"</Plant>" +
							"<IRN_BDH>" +
							irnref.replace(/&/g, "&amp;") +
							"</IRN_BDH>" +
							"<IRNAckNo_BDH>" +
							IRNAckNo_BDH +
							"</IRNAckNo_BDH>" +
							"<IRNAckDate_BDH>" +
							IRNAckDate_BDH +
							"</IRNAckDate_BDH>" +
							"<AcknowledgementTime>" +
							AcknowledgementTime +
							"</AcknowledgementTime>" +
							"<SalesDocument>" +
							SalesDocument +
							"</SalesDocument>" +
							"<PurchaseOrderByCustomer>" +
							PurchaseOrderByCustomer.replace(/&/g, "&amp;") +
							"</PurchaseOrderByCustomer>" +
							"<PricingProcedure>" +
							PricingProcedure.replace(/&/g, "&amp;") +
							"</PricingProcedure>" +
							"<Cust_Purch_Date_BDI>" +
							Cust_Purch_Date_BDI +
							"</Cust_Purch_Date_BDI>" +
							"<FullName>" +
							FullName +
							"</FullName>" +
							"<Partner>" +
							Partner +
							"</Partner>" +
							"<AccountByCustomer_BDI>" +
							AccountByCustomer_BDI +
							"</AccountByCustomer_BDI>" +
							"<Incoterms>" +
							Incoterms +
							"</Incoterms>" +
							"<Region>" +
							Region.replace(/&/g, "&amp;") +
							"</Region>" +
							"<RegionName>" +
							RegionName +
							"</RegionName>" +
							"<BillingDocumentType>" +
							BillingDocumentType +
							"</BillingDocumentType>" +
							"<YY1_ODIN_BDH>" +
							YY1_ODIN_BDH +
							"</YY1_ODIN_BDH>" +
							"<DocumentReferenceID>" +
							DocumentReferenceID +
							"</DocumentReferenceID>" +
							"<BillingDate>" +
							BillingDate +
							"</BillingDate>" +
							"<YY1_AccountByCustomer_BDI>" +
							YY1_AccountByCustomer_BDI +
							"</YY1_AccountByCustomer_BDI>" +
							"<YY1_CUST_MOBILE_NUMBER_BDH>" +
							YY1_CUST_MOBILE_NUMBER_BDH +
							"</YY1_CUST_MOBILE_NUMBER_BDH>" +
							"<YY1_CUST_TEL_NUMBER_BDH>" +
							YY1_CUST_TEL_NUMBER_BDH +
							"</YY1_CUST_TEL_NUMBER_BDH>" +
							"<CustomerName>" +
							CustomerName.replace(/&/g, "&amp;") +
							"</CustomerName>" +
							"<CustomerName_1>" +
							CustomerName_1.replace(/&/g, "&amp;") +
							"</CustomerName_1>" +
							"<Customer>" +
							Customer.replace(/&/g, "&amp;") +
							"</Customer>" +
							"<StreetName>" +
							StreetName.replace(/&/g, "&amp;") +
							"</StreetName>" +
							"<StreetName_1>" +
							StreetName_3.replace(/&/g, "&amp;") +
							"</StreetName_1>" +
							"<StreetName_2>" +
							StreetName_2.replace(/&/g, "&amp;") +
							"</StreetName_2>" +
							"<StreetPrefixName1_2>" +
							StreetPrefixName1_2.replace(/&/g, "&amp;") +
							"</StreetPrefixName1_2>" +
							"<StreetPrefixName1_1>" +
							StreetPrefixName1_1.replace(/&/g, "&amp;") +
							"</StreetPrefixName1_1>" +
							"<StreetPrefixName2_1>" +
							StreetPrefixName2_1.replace(/&/g, "&amp;") +
							"</StreetPrefixName2_1>" +
							"<ShipToPartyStreet>" +
							ShipToPartyStreet.replace(/&/g, "&amp;") +
							"</ShipToPartyStreet>" +
							"<CityName_1>" +
							CityName_1.replace(/&/g, "&amp;") +
							"</CityName_1>" +
							"<PostalCode_1>" +
							PostalCode_1 +
							"</PostalCode_1>" +
							"<Region_1>" +
							Region_1.replace(/&/g, "&amp;") +
							"</Region_1>" +
							"<TaxNumber3>" +
							TaxNumber3.replace(/&/g, "&amp;") +
							"</TaxNumber3>" +
							"<CustomerPurchaseOrderDate>" +
							CustomerPurchaseOrderDate.replace(/&/g, "&amp;") +
							"</CustomerPurchaseOrderDate>" +
							"<NetDueDate>" +
							NetDueDate.replace(/&/g, "&amp;") +
							"</NetDueDate>" +
							"<IncotermsClassification>" +
							IncotermsClassification.replace(/&/g, "&amp;") +
							"</IncotermsClassification>" +
							"<IncotermsLocation1>" +
							IncotermsLocation1.replace(/&/g, "&amp;") +
							"</IncotermsLocation1>" +
							"<DocumentNumber>" +
							DocumentNumber.replace(/&/g, "&amp;") +
							"</DocumentNumber>" +
							"<EWayBill>" +
							EWayBill +
							"</EWayBill>" +
							"<ReferenceSDDocument>" +
							ReferenceSDDocument +
							"</ReferenceSDDocument>" +
							"<ModeOfTransport>" +
							ModeOfTransport.replace(/&/g, "&amp;") +
							"</ModeOfTransport>" +
							"<TransporterName>" +
							TransporterName.replace(/&/g, "&amp;") +
							"</TransporterName>" +
							"<TransportID>" +
							TransportID +
							"</TransportID>" +
							"<TransportDocDate>" +
							TransportDocDate +
							"</TransportDocDate>" +
							"<VehicleNum>" +
							VehicleNum +
							"</VehicleNum>" +
							"<BillingDocumentDate>" +
							BillingDocumentDate +
							"</BillingDocumentDate>" +
							"<Region_2>" +
							Region_2.replace(/&/g, "&amp;") +
							"</Region_2>" +
							"<TaxNumber3_1>" +
							TaxNumber3_1 +
							"</TaxNumber3_1>" +
							"<AccountingExchangeRate>" +
							AccountingExchangeRate +
							"</AccountingExchangeRate>" +
							"<TransactionCurrency>" +
							TransactionCurrency +
							"</TransactionCurrency>" +
							"<BillToParty>" +
							BillToParty.replace(/&/g, "&amp;") +
							"</BillToParty>" +
							"<TelephoneNumber1>" +
							TelephoneNumber1 +
							"</TelephoneNumber1>" +
							"<TelephoneNumber2>" +
							TelephoneNumber2 +
							"</TelephoneNumber2>" +
							"<TotalDiscount>" +
							TotalDiscount +
							"</TotalDiscount>" +
							"<TcsTotal>" +
							TcsTotal +
							"</TcsTotal>" +
							"<TotalTaxAmount>" +
							TotalTaxAmount +
							"</TotalTaxAmount>" +
							"<ZFRCZFRETotal>" +
							ZFRCZFRETotal.toFixed(2) +
							"</ZFRCZFRETotal>" +
							"<IGSTtotalValue>" +
							IGSTtotalValue.replace(/&/g, "&amp;") +
							"</IGSTtotalValue>" +
							"<SCGSTtotalValue>" +
							SCGSTtotalValue +
							"</SCGSTtotalValue>" +
							"<finalTotalValue>" +
							finalTotalValue.toFixed(2) +
							"</finalTotalValue>" +
							"<BillingDocument>" +
							BillingDocument +
							"</BillingDocument>" +
							"<TelephoneNumber1_1>" +
							TelephoneNumber1_1 +
							"</TelephoneNumber1_1>" +
							"<PostalCode_2>" +
							PostalCode_2 +
							"</PostalCode_2>" +
							"<CityName_2>" +
							CityName_2.replace(/&/g, "&amp;") +
							"</CityName_2>" +
							"<Mode>" +
							Mode.replace(/&/g, "&amp;") +
							"</Mode>" +
							"<TransportName>" +
							TransportName.replace(/&/g, "&amp;") +
							"</TransportName>" +
							"<LRNO>" +
							LRNO.replace(/&/g, "&amp;") +
							"</LRNO>" +
							"<LRDate>" +
							LRDatee +
							"</LRDate>" +
							"<MVNo>" +
							MVNo.replace(/&/g, "&amp;") +
							"</MVNo>" +
							"<ASNNO>" +
							ASNNO.replace(/&/g, "&amp;") +
							"</ASNNO>" +
							"<portOfloading>" +
							portOfloading.replace(/&/g, "&amp;") +
							"</portOfloading>" +
							"<VendorCode>" +
							VendorCode.replace(/&/g, "&amp;") +
							"</VendorCode>" +
							"<ShipToPartyCountry>" +
							ShipToPartyCountry.replace(/&/g, "&amp;") +
							"</ShipToPartyCountry>" +
							"<otcAccountByCustomer_1>" +
							otcAccountByCustomer_1.replace(/&/g, "&amp;") +
							"</otcAccountByCustomer_1>" +
							"<otcAccountByCustomer>" +
							otcAccountByCustomer.replace(/&/g, "&amp;") +
							"</otcAccountByCustomer>" +
							"<otcShipToPartyAccountGroup>" +
							otcShipToPartyAccountGroup.replace(/&/g, "&amp;") +
							"</otcShipToPartyAccountGroup>" +
							"<otcOrganizationName1>" +
							otcOrganizationName1.replace(/&/g, "&amp;") +
							"</otcOrganizationName1>" +
							"<otcStreetName>" +
							otcStreetName.replace(/&/g, "&amp;") +
							"</otcStreetName>" +
							"<otcStreetPrefixName1>" +
							otcStreetPrefixName1.replace(/&/g, "&amp;") +
							"</otcStreetPrefixName1>" +
							"<otcStreetPrefixName2>" +
							otcStreetPrefixName2.replace(/&/g, "&amp;") +
							"</otcStreetPrefixName2>" +
							"<otcStreetSuffixName1>" +
							otcStreetSuffixName1.replace(/&/g, "&amp;") +
							"</otcStreetSuffixName1>" +
							"<otcStreetSuffixName2>" +
							otcStreetSuffixName2.replace(/&/g, "&amp;") +
							"</otcStreetSuffixName2>" +
							"<otcDistrictName>" +
							otcDistrictName.replace(/&/g, "&amp;") +
							"</otcDistrictName>" +
							"<otcPostalCode>" +
							otcPostalCode.replace(/&/g, "&amp;") +
							"</otcPostalCode>" +
							"<otcCityName>" +
							otcCityName.replace(/&/g, "&amp;") +
							"</otcCityName>" +
							"<otcRegion>" +
							otcRegion.replace(/&/g, "&amp;") +
							"</otcRegion>" +
							"<otcOrganizationName1_1>" +
							otcOrganizationName1_1.replace(/&/g, "&amp;") +
							"</otcOrganizationName1_1>" +
							"<otcStreetName_1>" +
							otcStreetName_1.replace(/&/g, "&amp;") +
							"</otcStreetName_1>" +
							"<otcStreetPrefixName1_1>" +
							otcStreetPrefixName1_1.replace(/&/g, "&amp;") +
							"</otcStreetPrefixName1_1>" +
							"<otcStreetPrefixName2_1>" +
							otcStreetPrefixName2_1.replace(/&/g, "&amp;") +
							"</otcStreetPrefixName2_1>" +
							"<otcStreetSuffixName1_1>" +
							otcStreetSuffixName1_1.replace(/&/g, "&amp;") +
							"</otcStreetSuffixName1_1>" +
							"<otcStreetSuffixName2_1>" +
							otcStreetSuffixName2_1.replace(/&/g, "&amp;") +
							"</otcStreetSuffixName2_1>" +
							"<otcDistrictName_1>" +
							otcDistrictName_1.replace(/&/g, "&amp;") +
							"</otcDistrictName_1>" +
							"<otcPostalCode_1>" +
							otcPostalCode_1.replace(/&/g, "&amp;") +
							"</otcPostalCode_1>" +
							"<otcCityName_1>" +
							otcCityName_1.replace(/&/g, "&amp;") +
							"</otcCityName_1>" +
							"<otcRegion_1>" +
							otcRegion_1.replace(/&/g, "&amp;") +
							"</otcRegion_1>" +
							"<BTPHouseNumber>" +
							BTPHouseNumber.replace(/&/g, "&amp;") +
							"</BTPHouseNumber>" +
							"<STPHouseNumber>" +
							STPHouseNumber.replace(/&/g, "&amp;") +
							"</STPHouseNumber>" +
							"<YY1_UnloadingPoint_SDH>" +
							YY1_UnloadingPoint_SDH.replace(/&/g, "&amp;") +
							"</YY1_UnloadingPoint_SDH>" +
							"<BTPOrganizationBPName3>" +
							BTPOrganizationBPName3.replace(/&/g, "&amp;") +
							"</BTPOrganizationBPName3>" +
							"<SHPOrganizationBPName3>" +
							SHPOrganizationBPName3.replace(/&/g, "&amp;") +
							"</SHPOrganizationBPName3>" +
							"<DistrictName>" +
							DistrictName.replace(/&/g, "&amp;") +
							"</DistrictName>" +
							"<DistrictName_1>" +
							DistrictName_1.replace(/&/g, "&amp;") +
							"</DistrictName_1>" +
							"<CustomerTaxClassification>" +
							CustomerTaxClassification +
							"</CustomerTaxClassification>" +
							Item +
							"</E_Invoice_E_Way_Bill></Form>";

						var str1 = that.Base64Encode(xml);
						var pUrl = "v1/adsRender/pdf";
						var oRequest =
							'{"xdpTemplate":"' +
							that._printTemplate +
							'","xmlData": "' +
							str1 +
							'"}';

						that.postpdf(pUrl, oRequest).then(function (data) {
							that._Arrpdfurl.push(data);
							that.oPenDialog(that._Arrpdfurl);
							var base64PDF = data;
							that.getView().setBusy(false);
						});
					},
				});
			},
			Base64Encode: function (input) {
				var _keyStr =
					"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
				var output = "";
				var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
				var i = 0;
				input = this.utf8_encode(input);
				while (i < input.length) {
					chr1 = input.charCodeAt(i++);
					chr2 = input.charCodeAt(i++);
					chr3 = input.charCodeAt(i++);
					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					output =
						output +
						_keyStr.charAt(enc1) +
						_keyStr.charAt(enc2) +
						_keyStr.charAt(enc3) +
						_keyStr.charAt(enc4);
				}
				return output;
			},

			utf8_encode: function (string) {
				string = string.replace(/\r\n/g, "\n");
				var utftext = "";
				for (var n = 0; n < string.length; n++) {
					var c = string.charCodeAt(n);
					if (c < 128) {
						utftext += String.fromCharCode(c);
					} else if (c > 127 && c < 2048) {
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					} else {
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}
				}
				return utftext;
			},

			_calltempleate: function (that, name) {
				var promise = new Promise(function (resolve, reject) {
					var t = $.ajax({
						// url: "https://adsrestapi-formsprocessing.cfapps.us10.hana.ondemand.com/v1/forms/" + name + "/templates",
						url: "v1/forms/" + name + "/templates",

						type: "GET",
						/* beforeSend: function (xhr) {
									xhr.setRequestHeader('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsImprdSI6Imh0dHBzOi8vZGV2ZWxvcG1lbnQta3drcTBtMWUuYXV0aGVudGljYXRpb24udXMxMC5oYW5hLm9uZGVtYW5kLmNvbS90b2tlbl9rZXlzIiwia2lkIjoiZGVmYXVsdC1qd3Qta2V5LTMwNDQzODM0NSIsInR5cCI6IkpXVCIsImppZCI6ICJrU2xXVUVVQXVlSnZ0QVp4cGxjMkdOYVBpaUNEMWdSVzlQYWFUVDcwMHBvPSJ9.eyJqdGkiOiI5NGQ3MWRhYmY3YWM0NzVlODY5MDY1MDhkODZhMmFhYiIsImV4dF9hdHRyIjp7ImVuaGFuY2VyIjoiWFNVQUEiLCJzdWJhY2NvdW50aWQiOiI2YTY3OTcxYy0wMDAxLTRiZTctYTMwMi1jOTA3MzVmYThjN2UiLCJ6ZG4iOiJkZXZlbG9wbWVudC1rd2txMG0xZSIsInNlcnZpY2VpbnN0YW5jZWlkIjoiNWQ3ZTFhNTItNDZhMC00OGQ5LTg5NWQtMTU0NWVjOGY3MzI5In0sInN1YiI6InNiLTVkN2UxYTUyLTQ2YTAtNDhkOS04OTVkLTE1NDVlYzhmNzMyOSFiMjAzMjk1fGFkcy14c2FwcG5hbWUhYjY1NDg4IiwiYXV0aG9yaXRpZXMiOlsidWFhLnJlc291cmNlIiwiYWRzLXhzYXBwbmFtZSFiNjU0ODguQURTQ2FsbGVyIiwiYWRzLXhzYXBwbmFtZSFiNjU0ODguVGVtcGxhdGVTdG9yZUNhbGxlciJdLCJzY29wZSI6WyJ1YWEucmVzb3VyY2UiLCJhZHMteHNhcHBuYW1lIWI2NTQ4OC5UZW1wbGF0ZVN0b3JlQ2FsbGVyIiwiYWRzLXhzYXBwbmFtZSFiNjU0ODguQURTQ2FsbGVyIl0sImNsaWVudF9pZCI6InNiLTVkN2UxYTUyLTQ2YTAtNDhkOS04OTVkLTE1NDVlYzhmNzMyOSFiMjAzMjk1fGFkcy14c2FwcG5hbWUhYjY1NDg4IiwiY2lkIjoic2ItNWQ3ZTFhNTItNDZhMC00OGQ5LTg5NWQtMTU0NWVjOGY3MzI5IWIyMDMyOTV8YWRzLXhzYXBwbmFtZSFiNjU0ODgiLCJhenAiOiJzYi01ZDdlMWE1Mi00NmEwLTQ4ZDktODk1ZC0xNTQ1ZWM4ZjczMjkhYjIwMzI5NXxhZHMteHNhcHBuYW1lIWI2NTQ4OCIsImdyYW50X3R5cGUiOiJjbGllbnRfY3JlZGVudGlhbHMiLCJyZXZfc2lnIjoiYjY2ODk2YWMiLCJpYXQiOjE3MTA4Mzc1OTUsImV4cCI6MTcxMDg0MTE5NSwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wbWVudC1rd2txMG0xZS5hdXRoZW50aWNhdGlvbi51czEwLmhhbmEub25kZW1hbmQuY29tL29hdXRoL3Rva2VuIiwiemlkIjoiNmE2Nzk3MWMtMDAwMS00YmU3LWEzMDItYzkwNzM1ZmE4YzdlIiwiYXVkIjpbInVhYSIsImFkcy14c2FwcG5hbWUhYjY1NDg4Iiwic2ItNWQ3ZTFhNTItNDZhMC00OGQ5LTg5NWQtMTU0NWVjOGY3MzI5IWIyMDMyOTV8YWRzLXhzYXBwbmFtZSFiNjU0ODgiXX0.fZ4axEc4W6TbJsMA2y_o4TOlTtLVc7TQbiZP7WNWMOnLc4oZdNiU8xgZ2jF1wcsMgb3rc5EFMik7UUzQUy013bS0Fs5iN-Tip06ytcf4A_dYss1SndP7WKwzl7MlVT82AhLh6a7MFXC8mfjZI4Dq3B-9RxnNEOevvzu8nEo7uLFNtRYsmuSjgYHn29DBCYpRnZT55Xphj_--gS5IaRIK5ZoAbHcVSf0xfqKaW1vlwygE0kw1-FuxzOcRq-RQEeUDa3zRDEUsR6p1415yVEpCMMim1dHZ0yTfqtcN8N8Gha5hFCGVDkMWCQ9oTecikk6hQK4g65KWckz6MHD9etZMaA');
									xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
									xhr.setRequestHeader('Access-Control-Allow-Methods','GET');
									xhr.setRequestHeader('Access-Control-Allow-Methods','Content-Type','Authorization');
								}, */
						async: true,
						crossDomain: true,

						data: "",
						dataType: "json",
						contentType: 'application/json;charset="utf-8"',
						Accept: "application/json",
						success: function (t, r, i) {
							var a = t[0].xdpTemplate;
							resolve(a);
						},
						error: function () {
							// sap.m.MessageBox.error("Error");
						},
					});
				});
				return promise;
			},

			postpdf: function (oUrl, oRequest) {
				var response = "";
				var that = this;
				var promise = new Promise(function (resolve, reject) {
					var aData = $.ajax({
						url: oUrl,
						type: "POST",

						data: oRequest,
						dataType: "json",
						contentType: 'application/json;charset="utf-8"',
						Accept: "application/json",

						success: function (data, textStatus, jqXHR) {
							response = data.fileContent;
							resolve(response);
						},
						error: function (xhr, status) {
							reject(xhr);
						},
					});
				});
				return promise;
			},

			oPenDialog: function (Arrpdfurl) {
				//this.globalBusyOff();
				jQuery.sap.addUrlWhitelist("blob");
				var pages = [];
				for (var i = 0; i < Arrpdfurl.length; i++) {
					var decodedPdfContent = atob(Arrpdfurl[i]);

					var byteArray = new Uint8Array(decodedPdfContent.length);
					for (var j = 0; j < decodedPdfContent.length; j++) {
						byteArray[j] = decodedPdfContent.charCodeAt(j);
					}
					var blob = new Blob([byteArray.buffer], {
						type: "application/pdf",
					});
					var _pdfurl = URL.createObjectURL(blob);

					var PDFViewer = new sap.m.PDFViewer({
						source: _pdfurl,
						loaded: function () {
							// alert(1);
							// that.showOnePDF(evt);
						},
					});
				}
				PDFViewer.setTitle("E-invoice and EWayBill");
				PDFViewer.open();
				// if (btntext === "Download") {
				// 	//download pdfs
				// 	var link = document.createElement('a');
				// 	link.href = _pdfurl;
				// 	link.download = billDocNo + '.pdf';
				// 	document.body.appendChild(link);
				// 	link.click();
				// 	document.body.removeChild(link);
				// } else {
				// 	PDFViewer.open();
				// }
			},
			formatDate(dateString) {
				if (!dateString) return ""; // Handle empty/null values

				var date = new Date(dateString);

				// Check if the date is valid
				if (isNaN(date.getTime())) {
					return "Invalid Date"; // Handle incorrect date formats
				}

				var day = String(date.getDate()).padStart(2, "0"); // Ensures 2-digit day
				var month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
				var year = date.getFullYear();

				// Use traditional string concatenation (instead of template literals)
				return day + "-" + month + "-" + year;
			},
		});
	}
);
