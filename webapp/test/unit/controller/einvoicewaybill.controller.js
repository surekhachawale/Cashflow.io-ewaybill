/*global QUnit*/

sap.ui.define([
	"einvoiceewaybill/controller/einvoicewaybill.controller"
], function (Controller) {
	"use strict";

	QUnit.module("einvoicewaybill Controller");

	QUnit.test("I should test the einvoicewaybill controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
