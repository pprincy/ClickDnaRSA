<template>
  <v-col class="ma-4">
    <v-row class="justify-center">
      <v-col md="12" sm="12" xs="12">
        <div class="orange--text" id="holidayTemp">
          <div v-if="userCategory.user_category == 2">
            <v-alert outlined type="warning" prominent border="left">
              <h3>Dear {{ fullName }},</h3>
              <p>
                Our offices will be closed from December 1 to December 3, 2022
                to commemorate National Day in the United Arab Emirates. Regular
                operations will resume on Monday 05th&nbsp;December 2022.<br />
                Kindly get in touch with our team for any arrangements in
                advance of these dates. We regret any inconvenience caused.<br /><br />
                For emergencies please contact:<br />
                ior.support@rsa.global&nbsp;-&nbsp;+971 50 750 3510
                <br /><br />Please expect some delay in response time. Thank you
                for understanding.<br />
              </p>
            </v-alert>
          </div>
          <div v-else>
            <v-alert outlined type="warning" prominent border="left">
              <h3>Dear {{ fullName }},</h3>
              <p>
                Our offices will be closed from December 1 to December 3, 2022
                to commemorate National Day in the United Arab Emirates. Regular
                operations will resume on Monday 05th December 2022.<br />
                Kindly get in touch with our team for any arrangements in
                advance of these dates. We regret any inconvenience caused.
                Please expect some delay in response time. Thank you for
                understanding.
              </p>
            </v-alert>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <template v-for="(item, i) of _cards">
        <v-col
          lg="3"
          md="4"
          sm="6"
          xs="12"
          :key="i"
          v-if="canScreen(item.screen)"
        >
          <v-card color="white" class="fill-height" elevation="4">
            <div class="d-flex fill-height">
              <div class="text-center" :style="{ background: item.color }">
                <v-avatar class="ma-3" size="80" tile>
                  <v-img
                    v-if="item.icon && item.icon.includes('/images')"
                    max-height="40"
                    max-width="40"
                    :src="item.icon"
                    class="mx-auto"
                  ></v-img>
                  <v-icon
                    v-else-if="item.icon"
                    class="mx-auto"
                    color="white"
                    size="40"
                  >
                    {{ item.icon }}
                  </v-icon>
                </v-avatar>
                <v-card-actions>
                  <v-btn
                    :to="{ name: item.name }"
                    color="white"
                    class="mx-auto"
                    outlined
                    rounded
                    small
                  >
                    Open
                  </v-btn>
                </v-card-actions>
              </div>
              <div>
                <v-card-title class="body-1 font-weight-bold">
                  {{ item.text }}
                </v-card-title>
                <v-card-subtitle> {{ item.description }} </v-card-subtitle>
              </div>
            </div>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-col>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["userRole", "userCategory"]),
    _cards() {
      return this.cards.map((i) => {
        if (i.name === "TrackingRange" && this.userRole.code === "AD")
          i.text = "Manage Tracking Range";
        return i;
      });
    },
    fullName() {
      return this.$store.getters.user?.name;
    },
  },
  data() {
    return {
      cards: [
        {
          name: "DashBoardsReports",
          text: "Dashboard",
          description:
            "A graphical interface which provides at-a-glance views of key performance indicators.",
          screen: "#62",
          icon: "mdi-domain",
          color: "#808080",
        },
        {
          name: "Clients",
          text: "Manage Clients",
          description:
            "You can add, edit, delete, send invitation email, make active/inactive the client.",
          screen: "#47",
          icon: "mdi-domain",
          color: "#808080",
        },
        {
          name: "Carriers",
          text: "Manage Carriers",
          description:
            "You can create or change carrier details. You can also add city/country coverage details.",
          screen: "#3",
          icon: "mdi-truck",
          color: "#808080",
        },
        {
          name: "Linehaul",
          text: "Manage Linehaul",
          description:
            "You can create, change to view linehaul for the origin and destination country.",
          screen: "#1",
          icon: "/images/Linehaul.svg",
          color: "#808080",
        },
        {
          name: "SpHandlingCodes",
          text: "Special Handling Codes",
          description: "You can view or change labels features.",
          screen: "#7",
          icon: "/images/Special Handling.svg",
          color: "#808080",
        },
        {
          name: "TrackingRange",
          text: "Request Range",
          description:
            "In this screen you can indicate the bag or tracking number you need and download a range to use offline in your system.",
          screen: "#10",
          icon: "/images/Request Range White.svg",
          color: "#808080",
        },
        {
          name: "ManifestsList",
          text: "Manifests",
          description:
            "You can upload and download and check summary of uploaded manifests.",
          screen: "#11",
          icon: "/images/Manifest.svg",
          color: "#808080",
        },
        {
          name: "SplitCodes",
          text: "Split Codes",
          description:
            "You can create or update split codes. You can also change the status of the codes",
          screen: "#8",
          icon: "/images/Split Codes.svg",
          color: "#808080",
        },
        {
          name: "TrackingEvents",
          text: "Manage Tracking Events",
          description:
            "You can create or update tracking events. You can also change the status of the events.",
          screen: "#13",
          icon: "/images/Tracking Events.svg",
          color: "#808080",
        },
        {
          name: "BagsList",
          text: "Manage Bags",
          description:
            "You can see the list of uploaded bags data. You can also upload your bags data in bulk via excel sheet using provided template.",
          screen: "#16",
          icon: "/images/Bag White.svg",
          color: "#808080",
        },
        {
          name: "PackagesList",
          text: "Manage Packages",
          description:
            "You can see the list of uploaded packages data. You can also upload your packages data in bulk via excel sheet using provided template.",
          screen: "#18",
          icon: "/images/Package White.svg",
          color: "#808080",
        },
        {
          name: "BagLabels",
          text: "Download Bag Labels",
          description:
            "You can see the list of uploaded bags data and then you can download labels.",
          screen: "#5",
          icon: "/images/Download Bag Label.svg",
          color: "#808080",
        },
        {
          name: "PackageLabels",
          text: "Download Package Labels",
          description:
            "You can see the list of uploaded packages data and then you can download labels.",
          screen: "#6",
          icon: "/images/Download Package Label.svg",
          color: "#808080",
        },
        {
          name: "Consolidations",
          text: "Consolidation",
          description:
            "You can see the list of existing consolidations list and also create new one by selecting bags and packages.",
          screen: "#20",
          icon: "/images/Consolidation White.svg",
          color: "#808080",
        },
        {
          name: "ClientTracking",
          text: "Tracking",
          description:
            "Track your packages in a singular and bulk manner. You can also find obtain the proof of delivery.",
          screen: "#22",
          icon: "/images/Tracking Package White.svg",
          color: "#808080",
        },
        {
          name: "ClientAddresses",
          text: "Client Addresses",
          description: "You can add, edit and delete your pickup addresses.",
          screen: "#23",
          icon: "/images/Client Address White.svg",
          color: "#808080",
        },
        {
          name: "UsersList",
          text: "Users",
          description:
            "You can add, edit, remove users as well as delegate access to other users in your organization.",
          screen: "#27",
          icon: "/images/User Access White.svg",
          color: "#808080",
        },
        {
          name: "TrackLblSub",
          text: "Subscription(s)",
          description:
            "You can manage subscription for tracking, label and proof of delivery URL.",
          screen: "#25",
          icon: "/images/Subscriptions White.svg",
          color: "#808080",
        },
        {
          name: "ChangePassword",
          text: "Password Change",
          description: "You can change your password for the next login.",
          screen: "#15",
          icon: "/images/Change Password White.svg",
          color: "#808080",
        },
        {
          name: "MnfConfiguration",
          text: "Configure Manifest",
          description:
            "You can configure manifest fields, headers and other format details to download.",
          screen: "#14",
          icon: "/images/Configure Manifest White.svg",
          color: "#808080",
        },
        {
          name: "ManifestDownload",
          text: "Manifest Download",
          description:
            "You can download manifest file for the selected consolidation.",
          screen: "#26",
          icon: "/images/Download File.svg",
          color: "#808080",
        },
        {
          name: "EntityScans",
          text: "Entity Scans",
          description:
            "You can add, edit, delete and map enitity scans with tracking status to display it publicly.",
          screen: "#51",
          icon: "mdi-barcode",
          color: "#808080",
        },
        {
          name: "Inbox",
          text: "Inbox",
          description:
            "You can see all the emails received at RSA with attachments for trace if any issue arise in email parsing.",
          screen: "#49",
          icon: "mdi-inbox",
          color: "#808080",
        },
        {
          name: "SellersList",
          text: "Upload Seller List",
          description:
            "You can see list of uploaded sellers here. You can also upload new sellers by uploading excel. You can also download sellers list.",
          screen: "#52",
          icon: "mdi-upload",
          color: "#808080",
        },
        {
          name: "Invoices",
          text: "IOR Package",
          description:
            "You can see list of all the invoices with status wise count. counts are clickable and you can see more details for the invoices. You can also create new invoice and update invoices.",
          screen: "#57",
          icon: "mdi-receipt",
          color: "#808080",
        },
        {
          name: "Products",
          text: "Check Product Eligibility",
          description:
            "You can see list of product codes here. You can also upload new product codes from here by downloading excel template.",
          screen: "#60",
          icon: "mdi-database",
          color: "#808080",
        },
        {
          name: "Help",
          text: "Help",
          description:
            "You can get List of Steps to Ship the Packages under IOR services.",
          screen: "#81",
          icon: "mdi-help",
          color: "#2d9c31f0",
        },
      ],
    };
  },
  mounted() {
    this.holidayTemplate();
  },
  methods: {
    holidayTemplate() {
      var current = new Date();
      var expiry = new Date("December 4, 2022 12:00:00");

      if (current.getTime() >= expiry.getTime()) {
        document.getElementById("holidayTemp").style.display = "none";
      } else {
        document.getElementById("holidayTemp").style.display = "block";
      }
    },
  },
};
</script>
