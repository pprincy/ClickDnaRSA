<!-- #81 -->
<template>
  <v-col class="mx-4">
    <template>
      <v-row>
        <v-col class="col-md-10">
          <v-toolbar flat>
            <v-toolbar-title class="text-h6"
              >List of Steps to Ship the Packages under IOR services
              <v-spacer></v-spacer>
            </v-toolbar-title>
          </v-toolbar>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td class="stepNo" valign="top">
                    <label><strong>STEP 1</strong></label
                    ><br />
                    <label><strong>Create Package</strong></label>
                  </td>
                  <td class="content" valign="top">
                    Upload Invoice data in the format available on the platform
                  </td>

                  <td class="creation-title" valign="top">
                    <label>
                      <b>IOR Services-> Add IOR Package</b>
                    </label>
                    <v-img src="/images/help-section/step-1.jpg"></v-img> <br />

                    <label>
                      <b>Download the Invoice Template</b>
                    </label>
                    <v-img src="/images/help-section/step-1-1.jpg"></v-img>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td class="content" valign="top">Invoice Template Format</td>

                  <td class="creation-title" valign="top">
                    <label
                      >Values in each column are required. <br />Label
                      Definition: This will explain the label and values
                      expected COO, Unit of Weight, Currency should contain
                      value from the sub-sheet shared</label
                    ><br /><br />
                    <v-img src="/images/help-section/step-1-2.jpg"></v-img>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td class="content" valign="top">
                    Package Details required to complete the create process
                  </td>

                  <td class="creation-title" valign="top">
                    <label
                      >Invoice Number -> this is the number which belongs to
                      Seller (used by them internally to raise invoice)</label
                    >
                    <br /><br />
                    <v-img src="/images/help-section/step-1-3.jpg"></v-img>
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td class="content" valign="top">
                    How to upload the Invoice PDF
                    <ul>
                      <li>1.Download the Sample from the Panel</li>
                      <li>2.Add the Company Logo</li>
                      <li>3.Add the Authorised Name and Signature</li>
                      <li>4.Convert the excel to PDF</li>
                      <li>5.Upload the PDF to portal</li>
                    </ul>
                  </td>

                  <td class="creation-title" valign="top">
                    <label
                      >Download the pre-filled Invoice by clicking on the
                      “Download” button</label
                    >
                    <br /><br />
                    <v-img src="/images/help-section/step-1-4.jpg"></v-img>
                    <br />
                    <label
                      >Fill in the company logo, authorised Name and signature.
                      Convert this excel into PDF and upload in Invoice PDF
                      section</label
                    >
                    <br /><br />
                    <v-img src="/images/help-section/step-1-5.jpg"></v-img>
                  </td>
                </tr>
                <tr>
                  <td class="stepNo" valign="top">
                    <label><strong>STEP 2</strong></label
                    ><br />
                    <label><strong>Approval of Product List</strong></label>
                  </td>
                  <td class="content" valign="top">
                    RSA Team will update the status of HS Code verification on
                    the Portal
                  </td>

                  <td class="creation-title" valign="top">
                    <label>
                      Once RSA Team approves the product list, the status of the
                      package will be moved to
                      <span class="green--text"
                        ><strong>“RSA to Send payment link”</strong></span
                      >
                    </label>
                  </td>
                </tr>
                <tr>
                  <td class="stepNo" valign="top">
                    <label><strong>STEP 3</strong></label
                    ><br />
                    <label><strong>Quote Request for Freight</strong></label>
                  </td>
                  <td class="content" valign="top">
                    Seller can request for a freight quote within the portal.
                  </td>

                  <td class="creation-title" valign="top">
                    <label> Request for quote by clicking on the button </label>
                    <br /><br />
                    <v-img src="/images/help-section/step-3.jpg"></v-img> <br />
                    <label>
                      Fill the quote form with the requested details
                    </label>
                    <br /><br />
                    <v-img src="/images/help-section/step-3-1.jpg"></v-img>
                    <br />
                    <label>
                      Accept or Reject the Offer given by RSA for freight
                      service
                    </label>
                    <br /><br />
                    <v-img src="/images/help-section/step-3-2.jpg"></v-img>
                  </td>
                </tr>
                <tr>
                  <td class="stepNo" valign="top">
                    <label><strong>STEP 4</strong></label
                    ><br />
                    <label><strong>RSA to Send payment link</strong></label>
                  </td>
                  <td class="content" valign="top">
                    RSA will send the payment link
                  </td>

                  <td class="creation-title" valign="top">
                    <v-img src="/images/help-section/step-4.jpg"></v-img> <br />
                  </td>
                </tr>
                <tr>
                  <td class="stepNo" valign="top">
                    <label><strong>STEP 5</strong></label
                    ><br />
                    <label><strong>Payment received</strong></label>
                  </td>
                  <td class="content" valign="top">
                    Once the payment is received in the system, package can be
                    shipped. <br />Note: Do not ship the package before payment.
                    RSA won’t confirm the shipment.
                  </td>

                  <td class="creation-title" valign="top">
                    <v-img src="/images/help-section/step-5.jpg"></v-img> <br />
                  </td>
                </tr>
                <tr>
                  <td class="stepNo" valign="top">
                    <label><strong>STEP 6</strong></label
                    ><br />
                    <label
                      ><strong
                        >Update Pre-alert details on portal</strong
                      ></label
                    >
                  </td>
                  <td class="content" valign="top">
                    In case seller is using 3rd party for shipping then Seller
                    needs to upload the Pre-alert details on portal.
                  </td>

                  <td class="creation-title" valign="top">
                    <label>
                      Update the status to Shipped and update the AWB file and
                      number
                    </label>
                    <v-img src="/images/help-section/step-6.jpg"></v-img> <br />
                  </td>
                </tr>
                <tr>
                  <td class="stepNo" valign="top">
                    <label><strong>STEP 7</strong></label
                    ><br />
                    <label
                      ><strong
                        >Cargo Arrived and Customs is initiated</strong
                      ></label
                    >
                  </td>
                  <td class="content" valign="top">
                    Customs process is initiated by the RSA Team. <br />Track
                    the status of Customs via portal.
                  </td>

                  <td class="creation-title" valign="top">
                    <v-img src="/images/help-section/step-7.jpg"></v-img> <br />
                  </td>
                </tr>
                <tr>
                  <td class="stepNo" valign="top">
                    <label><strong>STEP 8</strong></label
                    ><br />
                    <label><strong>Delivery of Package</strong></label>
                  </td>
                  <td class="content" valign="top">
                    Appointment is taken for delivery to AMZ FC and shipment is
                    delivered
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <div class="my-4">
            <strong
              ><span class="red--text">*</span>Please note, failure to follow
              steps 4 and 6 can result in shipment being rejected for delivery
              at the Amazon fulfilment center</strong
            >
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-md-10">
          <v-toolbar-title class="text-h6"
            >Feature: Lookup HS Code
          </v-toolbar-title>
          <p>
            To find if a HS code is applicable in IOR Service given by RSA
            Global
          </p>
          <v-img src="/images/help-section/hs-code.jpg"></v-img><br /><br />
          <v-img src="/images/help-section/hs-code-listing.jpg"></v-img>
        </v-col>
      </v-row>
    </template>
  </v-col>
</template>

<style lang="scss">
.v-responsive__content {
  width: 100% !important;
}
.stepNo,
.content {
  width: 20%;
}
.stepNo,
.content,
.creation-title {
  padding: 1rem !important;
}
.creation-title {
  width: 60%;
}
ul {
  list-style: none;
}
</style>
