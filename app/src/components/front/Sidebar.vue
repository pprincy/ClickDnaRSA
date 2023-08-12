<template>
  <v-navigation-drawer
    class="primary accent-4 fill-height"
    dark
    v-model="drawer"
    mobile-breakpoint="960"
    :mini-variant.sync="mini"
    v-click-outside="onClickOutside"
    app
  >
    <v-list-item class="py-1 px-2">
      <v-list-item-avatar>
        <v-avatar color="rgb(218 27 49)" size="38">{{ initials }}</v-avatar>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title>{{ fullName }}</v-list-item-title>
      </v-list-item-content>

      <v-btn icon @click.stop="mini = !mini">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>
    <v-divider></v-divider>
    <v-list class="side-bar-menu" nav dense>
      <template v-for="(item, i) of routes">
        <v-list-item
          v-if="
            (!item.children || item.children.length === 0) &&
            canScreen(item.screen)
          "
          :key="i"
          :to="{ name: item.name, params: item.params }"
          exact
        >
          <v-list-item-icon>
            <v-img
              v-if="item.icon.includes('/images')"
              max-height="24"
              max-width="24"
              :src="item.icon"
            ></v-img>
            <v-icon v-else>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
        <v-list-group
          :class="{ 'dropdown-level-1': !mini }"
          :key="i"
          color="normal"
          v-if="
            item.children &&
            item.children.length &&
            canScreen(item.children.map((i) => i.screen))
          "
          :value="
            item.children
              .flat(1)
              .map((i) => i.name)
              .includes($route.name)
          "
        >
          <template v-slot:prependIcon>
            <v-img
              v-if="item.icon.includes('/images')"
              max-height="24"
              max-width="24"
              :src="item.icon"
            ></v-img>
            <v-icon v-else>{{ item.icon }}</v-icon>
          </template>
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <template v-for="(sub, j) of item.children">
            <v-list-item
              v-if="
                (!sub.children || sub.children.length === 0) &&
                canScreen(sub.screen)
              "
              :key="j"
              :to="{ name: sub.name, params: sub.params }"
              exact
            >
              <v-list-item-icon>
                <v-img
                  v-if="sub.icon.includes('/images')"
                  max-height="24"
                  max-width="24"
                  :src="sub.icon"
                ></v-img>
                <v-icon v-else>{{ sub.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ sub.text }}</v-list-item-title>
            </v-list-item>
            <v-list-group
              :class="{ 'dropdown-level-2': !mini }"
              :key="j"
              color="normal"
              sub-group
              v-if="
                sub.children &&
                sub.children.length &&
                canScreen(sub.children.map((i) => i.screen))
              "
            >
              <template v-slot:prependIcon>
                <v-img
                  v-if="sub.icon.includes('/images')"
                  max-height="24"
                  max-width="24"
                  :src="sub.icon"
                ></v-img>
                <v-icon v-else>{{ sub.icon }}</v-icon>
              </template>
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>{{ sub.text }}</v-list-item-title>
                </v-list-item-content>
              </template>
              <template v-for="(sSub, k) of sub.children">
                <v-list-item
                  v-if="canScreen(sSub.screen)"
                  :key="k"
                  :to="{ name: sSub.name, params: sSub.params }"
                  exact
                >
                  <v-list-item-icon>
                    <v-img
                      v-if="sSub.icon.includes('/images')"
                      max-height="24"
                      max-width="24"
                      :src="sSub.icon"
                    ></v-img>
                    <v-icon v-else>{{ sSub.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ sSub.text }}</v-list-item-title>
                </v-list-item>
              </template>
            </v-list-group>
          </template>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
export default {
  computed: {
    fullName() {
      return this.$store.getters.user?.name;
    },
    initials() {
      if (!this.fullName) return;
      return this.fullName
        .split(" ")
        .map((n) => n[0])
        .join("");
    },
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isOpen() {
      this.drawer = this.isOpen;
      this.mini = false;
    },
    drawer() {
      this.$emit("update:isOpen", this.drawer);
    },
  },
  data() {
    return {
      mini: true,
      drawer: !this.$vuetify.breakpoint.smAndDown,
      routes: [
        {
          name: "DashBoardsReports",
          icon: "mdi-view-dashboard-edit-outline",
          text: "Dashboard / Reports",
          screen: "#62",
        },
        {
          name: "Slingshot",
          icon: "mdi-account-wrench",
          text: "Slingshot Services",
          children: [
            {
              name: "TrackingRange",
              icon: "/images/Request Range White.svg",
              text: "Manage Tracking Range",
              screen: "#10",
            },
            {
              name: "CarrierCoverage",
              icon: "mdi-radar",
              text: "Carrier Coverage",
              screen: "#66",
            },
            {
              name: "Linehaul",
              icon: "/images/Linehaul.svg",
              text: "Linehaul",
              screen: "#1",
            },
            {
              name: "SpHandlingCodes",
              icon: "/images/Special Handling.svg",
              text: "Special Handling Codes",
              screen: "#7",
            },
            {
              name: "SplitCodes",
              icon: "/images/Split Codes.svg",
              text: "Split Codes",
              screen: "#8",
            },
            {
              name: "TrackingEvents",
              icon: "/images/Tracking Events.svg",
              text: "Tracking Events",
              screen: "#13",
            },
            {
              name: "EntityScans",
              icon: "mdi-barcode",
              text: "Entity Scans",
              screen: "#51",
            },
            {
              name: "ManifestsList",
              icon: "/images/Manifest.svg",
              text: "Manifests",
              screen: "#11",
            },
            {
              name: "ClientTracking",
              icon: "/images/Tracking Package White.svg",
              text: "Tracking",
              screen: "#22",
            },
            {
              name: "Consolidation",
              icon: "/images/Consolidation White.svg",
              text: "Consolidation",
              children: [
                {
                  name: "ConsolidationsDetails",
                  icon: "/images/Create White.svg",
                  text: "Create",
                  screen: "#20",
                  params: {
                    id: 0,
                  },
                },
                {
                  name: "Consolidations",
                  icon: "/images/View White.svg",
                  text: "View",
                  screen: "#20",
                },
              ],
            },
            {
              name: "DownloadLabels",
              icon: "/images/Download Docs White.svg",
              text: "Download",
              children: [
                {
                  name: "BagLabels",
                  icon: "/images/Download Bag Label.svg",
                  text: "Bag Label",
                  screen: "#5",
                },
                {
                  name: "PackageLabels",
                  icon: "/images/Download Package Label.svg",
                  text: "Package Label",
                  screen: "#6",
                },
                {
                  name: "ManifestDownload",
                  icon: "/images/Download File.svg",
                  text: "Manifest",
                  screen: "#26",
                },
              ],
            },
            {
              name: "BagsPackages",
              icon: "/images/Upload Data White.svg",
              text: "Upload Data",
              children: [
                {
                  name: "BagsList",
                  icon: "/images/Bag White.svg",
                  text: "Bag",
                  screen: "#16",
                },
                {
                  name: "PackagesList",
                  icon: "/images/Package White.svg",
                  text: "Package",
                  screen: "#18",
                },
              ],
            },
          ],
        },
        // {
        //   name: "Inbox",
        //   icon: "mdi-inbox",
        //   text: "Inbox",
        //   screen: "#49",
        // },
        {
          name: "Carriers",
          icon: "mdi-truck",
          text: "Carriers",
          screen: "#3",
        },
        {
          icon: "mdi-arrow-down-left-bold",
          text: "Inbound",
          children: [
            {
              name: "NewConsolidations",
              icon: "mdi-new-box",
              text: "New Consolidations",
              screen: "#35",
            },
            {
              name: "LMNewConsolidations",
              icon: "mdi-new-box",
              text: "New Consolidations",
              screen: "#41",
            },
            {
              name: "Deconsolidated",
              icon: "mdi-file-tree-outline",
              text: "Deconsolidated",
              screen: "#36",
            },
            {
              name: "Merged",
              icon: "mdi-merge",
              text: "Merged",
              screen: "#37",
            },
            {
              name: "LMInClearance",
              icon: "mdi-middleware",
              text: "In Clearance",
              screen: "#45",
            },
          ],
        },
        {
          icon: "mdi-arrow-right-top-bold",
          text: "Outbound",
          children: [
            {
              name: "Staged",
              icon: "mdi-postage-stamp",
              text: "Staged",
              screen: "#38",
            },
            {
              name: "Dispatched",
              icon: "mdi-truck-delivery",
              text: "Dispatched",
              screen: "#39",
            },
            {
              name: "Departed",
              icon: "mdi-airplane-takeoff",
              text: "Departed",
              screen: "#48",
            },
          ],
        },
        {
          icon: "mdi-barcode-scan",
          text: "Scanning",
          children: [
            {
              name: "LMApplyScan",
              icon: "mdi-barcode-scan",
              text: "Apply Scan",
              screen: "#42",
            },
            {
              name: "LMScanUploadList",
              icon: "mdi-upload",
              text: "Bulk Scan Upload",
              screen: "#43",
            },
            {
              name: "LMMissingScan",
              icon: "mdi-barcode-off",
              text: "Missing Scan",
              screen: "#46",
            },
          ],
        },
        {
          name: "Clients",
          icon: "mdi-domain",
          text: "Manage Clients",
          screen: "#47",
        },
        {
          name: "ManageSellers",
          icon: "mdi-human-dolly",
          text: "Manage Sellers",
          screen: "#54",
        },
        {
          name: "SellersList",
          icon: "mdi-database-cog",
          text: "IOR Services",
          children: [
            {
              name: "SellersList",
              icon: "mdi-upload",
              text: "Upload Seller List",
              screen: "#52",
            },
            {
              name: "SellerOnboardingStatus",
              icon: "mdi-upload",
              text: "Seller Onboarding Status",
              screen: "#75",
            },
            {
              name: "Invoices",
              icon: "mdi-receipt",
              text: "IOR Package",
              screen: "#57",
            },
            {
              name: "Products",
              icon: "mdi-database",
              text: "Check Product Eligibility",
              screen: "#60",
            },
            {
              name: "ProductHSCode",
              icon: "mdi-arrow-left-right",
              text: "ProductCode-HSCode",
              screen: "#61",
            },
            {
              name: "QuotesList",
              icon: "mdi-comment-quote",
              text: "Quotes",
              screen: "#66",
            },
            {
              name: "PendingPayments",
              icon: "mdi-cash-clock",
              text: "Pending Payments",
              screen: "#68",
            },
            {
              name: "PaymentList",
              icon: "mdi-cash-clock",
              text: "List of Payments",
              screen: "#83",
            },
            {
              name: "BankTransfer",
              icon: "mdi-cash",
              text: "Bank Transfer",
              screen: "#69",
            },
            {
              name: "PaymentGatewayStatus",
              icon: "mdi-credit-card-outline",
              text: "Payment Gateway Status",
              screen: "#70",
            },
            {
              name: "UploadOutbound",
              icon: "mdi-file-upload-outline",
              text: "Upload Outbound Files",
              screen: "#71",
            },
            {
              name: "OutboundXMLDataParsing",
              icon: "mdi-xml",
              text: "Outbound XML Data Parsing",
              screen: "#76",
            },
          ],
        },
        {
          name: "HSCode",
          icon: "mdi-code-tags",
          text: "Lookup HS Code",
          screen: "#73",
        },
        {
          name: "FulfillmentSection",
          icon: "mdi-package-variant",
          text: "Fulfillment",
          children: [
            {
              name: "OrderList",
              icon: "mdi-package-variant-closed",
              text: "Order List",
              screen: "#72",
            },
            {
              name: "BoeOutbound",
              icon: "mdi-file-upload-outline",
              text: "BOE Outbound",
              screen: "#86",
            },
          ],
        },
        {
          name: "Documents",
          icon: "mdi-file",
          text: "Documents",
          screen: "#85",
        },
        {
          name: "AccountSettings",
          icon: "/images/Account Settings.svg",
          text: "Settings",
          children: [
            {
              name: "UsersList",
              icon: "/images/User Access White.svg",
              text: "Users",
              screen: "#27",
            },
            {
              name: "ClientAddresses",
              icon: "/images/Client Address White.svg",
              text: "Address(es)",
              screen: "#23",
            },
            {
              name: "TrackLblSub",
              icon: "/images/Subscriptions White.svg",
              text: "Subscription(s)",
              screen: "#25",
            },
            {
              name: "ChangePassword",
              icon: "/images/Change Password White.svg",
              text: "Password Change",
              screen: "#15",
            },
            {
              name: "MnfConfiguration",
              icon: "/images/Configure Manifest White.svg",
              text: "Configure Manifest",
              screen: "#14",
            },
            {
              name: "SetAlerts",
              icon: "mdi-alert",
              text: "Set Alerts",
              screen: "#40",
            },
          ],
        },
        {
          name: "Help",
          icon: "mdi-help",
          text: "Help",
          screen: "#81",
        },
      ],
    };
  },
  methods: {
    onClickOutside() {
      if (!this.$vuetify.breakpoint.smAndDown) {
        this.mini = true;
      }
    },
  },
};
</script>
<style lang="scss">
.side-bar-menu {
  .v-list-group__items {
    display: none;
  }
  .dropdown-level-1 .v-list-group__items {
    padding-left: 20px;
    display: block;
  }
  .v-list-item__icon {
    margin-right: 12px !important;
  }
  .dropdown-level-2 {
    .v-list-group__header {
      padding-left: 8px !important;
    }
    .v-list-group__items {
      padding-left: 20px;
      display: block;
      .v-list-item {
        padding-left: 8px !important;
      }
    }
  }
  .v-list-group--active {
    background: rgb(88 98 140);
  }
}
</style>
