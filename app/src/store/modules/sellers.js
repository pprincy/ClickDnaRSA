import { axios } from "@/plugins/http-request.js";

const state = {};

const getters = {};

const actions = {
  getSellersUploadList(_, payload) {
    return axios
      .get("/api/sellers/upload-list", {
        params: payload,
      })
      .then((res) => res.data);
  },
  getUploadedSeller(_, id) {
    return axios.get(`/api/sellers/upload-list/${id}`).then((res) => res.data);
  },
  updateSellersUploadList(_, payload) {
    return axios
      .patch(`/api/sellers/upload-list/${payload.id}`, payload.data)
      .then((res) => res.data);
  },
  getManageSellers(_, payload) {
    return axios
      .get("/api/sellers/manage-seller", {
        params: payload,
      })
      .then((res) => res.data);
  },
  changeSellerStatus(_, payload) {
    return axios
      .patch(`/api/sellers/${payload.id}`, { active: payload.state })
      .then((res) => res.data);
  },
  downloadSellerDataTemplate() {
    return axios
      .get(
        `/assets/app_seller/template/seller_data_upload_excel_template.xlsx`,
        {
          responseType: "blob",
        }
      )
      .then((res) => res);
  },
  uploadSellerExcel(_, payload) {
    return axios.post("/api/sellers/upload", payload).then((res) => res.data);
  },
  getSellerDataTemplate(_, payload) {
    return axios
      .get("/api/sellers/upload-template", {
        params: payload,
      })
      .then((res) => res.data);
  },
  sendSellerInvite(_, payload) {
    return axios
      .patch("/api/sellers/action/action_send_invite", payload)
      .then((res) => res.data);
  },
  updateManageSeller(_, payload) {
    return axios
      .patch(`/api/sellers/${payload.id}`, payload.data)
      .then((res) => res.data);
  },
  downloadProductHSCodeTemplate(_, client_id) {
    return axios
      .get(`/api/sellers/product-pending-status/download/${client_id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  downloadProductHSCodeVerifyTemplate() {
    return axios
      .get(
        `/assets/app_seller/template/sample_verify_product_hs_code_upload_excel_template.xlsx`,
        {
          responseType: "blob",
        }
      )
      .then((res) => res);
  },
  uploadProductHSCodeVerify(_, payload) {
    return axios
      .post("/api/products/verify-upload", payload)
      .then((res) => res.data);
  },
  uploadProductHSCode(_, payload) {
    return axios.post("/api/products/upload", payload).then((res) => res.data);
  },
  getInvoices(_, payload) {
    return axios
      .get(`/api/seller/invoice-listing/${payload.client_id}`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  getSellers(_, payload) {
    return axios
      .get(`/api/seller/seller-list/${payload.client_id}`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  getMappedSellers(_, payload) {
    return axios
      .get(`/api/sellers/mapped-seller/${payload.id}`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  unMapSeller(_, id) {
    return axios
      .patch(`/api/sellers/inactive-mapped-seller/${id}`)
      .then((res) => res.data);
  },
  downloadPackingListSample() {
    return axios
      .get(
        `/assets/app_seller/template/package_seller_data_upload_excel_template.xlsx`,
        {
          responseType: "blob",
        }
      )
      .then((res) => res);
  },
  verifyPackingList(_, payload) {
    return axios
      .post("/api/seller/packages/verify-upload-seller", payload)
      .then((res) => res.data);
  },
  createInvoice(_, payload) {
    return axios
      .post("/api/seller/package-invoice-seller", payload)
      .then((res) => res.data);
  },
  getTempProducts(_, payload) {
    return axios
      .get(`/api/products/temp-products-list`, {
        params: payload,
      })
      .then((res) => res.data);
  },
  updateTempProduct(_, payload) {
    return axios
      .patch(`/api/products/update-temp-products/${payload.id}`, payload.data)
      .then((res) => res.data);
  },
  uploadInvPDF(_, payload) {
    return axios
      .patch(`/api/seller/invoice-data-submit/${payload.id}`, payload.data)
      .then((res) => res.data);
  },
  uploadTempProductExcel(_, payload) {
    return axios
      .post(`/api/products/temp-upload`, payload)
      .then((res) => res.data);
  },
  downloadTempProdTemplate() {
    return axios
      .get(
        `/assets/app_seller/template/sample_Temp_product_data_upload_template.csv`,
        {
          responseType: "blob",
        }
      )
      .then((res) => res);
  },
  getInvoicePackages(_, id) {
    return axios
      .get(`/api/sellers/invoice/packages/${id}`)
      .then((res) => res.data);
  },
  getInvoiceDetails(_, id) {
    return axios.get(`/api/sellers/invoice/edit/${id}`).then((res) => res.data);
  },
  updateInvoiceDetails(_, payload) {
    return axios
      .patch(`/api/sellers/invoice/update/${payload.id}`, payload.data)
      .then((res) => res.data);
  },
  downloadClientProducts(_, id) {
    return axios
      .get(`/api/sellers/package-excel-download/${id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  downloadInvReport1(_, id) {
    return axios
      .get(`/api/sellers/custom-report-1/download/${id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  downloadInvReport2(_, id) {
    return axios
      .get(`/api/sellers/custom-report-2/download/${id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  addTempProductAndVerify(_, payload) {
    return axios
      .post(`/api/temp-products-upload`, payload)
      .then((res) => res.data);
  },
  refreshProduct(_, id) {
    return axios
      .patch(`/api/products/refresh-temp-products/${id}`)
      .then((res) => res.data);
  },
  downloadSellerList(_, payload) {
    return axios
      .post(`/api/sellers/seller-upload/download`, payload, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  getCRMDetails(_, id) {
    return axios.get(`/api/sellers/crm-link/${id}`).then((res) => res.data);
  },
  getInvoiceCounts() {
    return axios
      .get(`/api/client/seller/invoice-count`)
      .then((res) => res.data);
  },
  downloadSampleInvPDF(_, id) {
    return axios
      .get(`/api/sellers/invoice-file-excel-download/${id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  getInvInboundEntries(_, payload) {
    return axios
      .get(`/api/seller/custom-inbound-listing/${payload.id}`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  downloadSellerOnboardStatus(_, payload) {
    return axios
      .post(`/api/sellers/seller-onboard-status/download`, payload, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  uploadSellerOnboardStatus(_, payload) {
    return axios
      .post(`/api/sellers/seller-onboard-status/upload`, payload)
      .then((res) => res);
  },
  downloadManageSellers(context, payload) {
    return axios
      .post(`/api/sellers/manage-seller/download`, payload, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  extendAgreementExpiry(_, payload) {
    return axios
      .patch(`/api/sellers/extend-agreement-expiry`, payload)
      .then((res) => res.data);
  },
  downloadMappedSellers(context, client_id) {
    return axios
      .get(`/api/sellers/mapped-seller/download/${client_id}`, {
        responseType: "blob",
      })
      .then((res) => res);
  },
  getInvoiceDetail(_, payload) {
    return axios
      .get(`/api/sellers/add-new-invoice`, {
        params: payload.params,
      })
      .then((res) => res.data);
  },
  submitInvoiceDetails(_, payload) {
    return axios
      .post(`/api/sellers/add-new-invoice`, payload)
      .then((res) => res.data);
  },
};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations,
};
