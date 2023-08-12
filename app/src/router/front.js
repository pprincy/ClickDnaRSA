export const FrontRoutes = [
  {
    path: "/",
    component: () =>
      import(/* webpackChunkName: "layout" */ `@/views/front/FrontLayout`),
    meta: {
      auth: true,
    },
    children: [
      {
        path: "/",
        name: "Home",
        component: () =>
          import(/* webpackChunkName: "home" */ `@/views/front/home/Dashboard`),
        meta: {
          auth: true,
        },
      },
      {
        path: "/boe-outbound",
        name: "BoeOutbound",
        component: () =>
          import(
            /* webpackChunkName: "boe outbound" */ "@/views/front/boe-outbound/Index"
          ),
        meta: {
          auth: true,
          breadcrums: [
            {
              text: "BOE Outbound",
            },
          ],
          ref: "#86",
        },
      },
      {
        path: "/help",
        name: "Help",
        component: () =>
          import(/* webpackChunkName: "help" */ "@/views/front/help/Index"),
        meta: {
          auth: true,
          breadcrums: [
            {
              text: "Help Section",
            },
          ],
          ref: "#81",
        },
      },
      {
        path: "/dashboards-reports",
        name: "DashBoardsReports",
        component: () =>
          import(
            /* webpackChunkName: "dashboards-reports" */ `@/views/front/dashboards/Index`
          ),
        meta: {
          breadcrums: [
            {
              text: "Dashboard / Reports",
            },
          ],
          ref: "#62",
        },
      },
      {
        path: "/dashboards-reports/:id",
        name: "DashBoardsReportsDetails",
        component: () =>
          import(
            /* webpackChunkName: "dashboards-reports-details" */ `@/views/front/dashboards/Details`
          ),
        meta: {
          breadcrums: [
            {
              text: "Dashboard / Reports",
              to: "DashBoardsReports",
            },
            {
              text: "Details",
            },
          ],
          ref: "#63",
        },
      },
      {
        path: "/dashboards-reports/preview/:id",
        name: "DashBoardsReportsPreview",
        component: () =>
          import(
            /* webpackChunkName: "dashboards-reports-details" */ `@/views/front/dashboards/Preview`
          ),
        meta: {
          breadcrums: [
            {
              text: "Dashboard / Reports",
              to: "DashBoardsReports",
            },
            {
              text: "Preview",
            },
          ],
          ref: "#67",
        },
      },
      {
        path: "/linehaul",
        name: "Linehaul",
        component: () =>
          import(
            /* webpackChunkName: "linehaul" */ "@/views/front/linehaul/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Linehaul",
            },
          ],
          ref: "#1",
        },
      },
      {
        path: "/linehaul/edit/:id",
        name: "LinehaulEdit",
        component: () =>
          import(
            /* webpackChunkName: "linehaul-edit" */ "@/views/front/linehaul/Edit"
          ),
        meta: {
          breadcrums: [
            {
              text: "Linehaul",
              to: "Linehaul",
            },
            {
              text: "Edit",
            },
          ],
          ref: "#2",
        },
      },
      {
        path: "/carriers",
        name: "Carriers",
        component: () =>
          import(
            /* webpackChunkName: "carriers" */ "@/views/front/carriers/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Carriers",
            },
          ],
          ref: "#3",
        },
      },
      {
        path: "/carriers/edit/:id",
        name: "CarrierEdit",
        component: () =>
          import(
            /* webpackChunkName: "carriers-edit" */ "@/views/front/carriers/Edit"
          ),
        meta: {
          breadcrums: [
            {
              text: "Carriers",
              to: "Carriers",
            },
            {
              text: "Edit",
            },
          ],
          ref: "#4",
        },
      },
      {
        path: "/carriers/events-upload",
        name: "CarrierEventsUpload",
        component: () =>
          import(
            /* webpackChunkName: "carriers-edit" */ "@/views/front/carriers/EventsUpload"
          ),
        meta: {
          breadcrums: [
            {
              text: "Carriers",
              to: "Carriers",
            },
            {
              text: "Events Upload",
            },
          ],
          ref: "#87",
        },
      },
      {
        path: "bag-labels",
        component: () =>
          import(
            /* webpackChunkName: "bag-label" */ "@/views/front/labels/Bags"
          ),
        name: "BagLabels",
        meta: {
          breadcrums: [
            {
              text: "Label",
              to: "BagLabels",
            },
            {
              text: "Download",
            },
          ],
          ref: "#5",
        },
      },
      {
        path: "package-labels",
        component: () =>
          import(
            /* webpackChunkName: "package-label" */ "@/views/front/labels/Packages"
          ),
        name: "PackageLabels",
        meta: {
          breadcrums: [
            {
              text: "Label",
              to: "PackageLabels",
            },
            {
              text: "Download",
            },
          ],
          ref: "#6",
        },
      },
      {
        path: "/handling-codes",
        name: "SpHandlingCodes",
        component: () =>
          import(
            /* webpackChunkName: "handling-codes" */ "@/views/front/handling-codes/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Special Handling Codes",
            },
          ],
          ref: "#7",
        },
      },
      {
        path: "/split-codes",
        name: "SplitCodes",
        component: () =>
          import(
            /* webpackChunkName: "split-codes" */ "@/views/front/split-codes/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Split Codes",
            },
          ],
          ref: "#8",
        },
      },
      {
        path: "/split-codes/:id",
        name: "SplitCodeDetails",
        component: () =>
          import(
            /* webpackChunkName: "split-codes-details" */ "@/views/front/split-codes/Details"
          ),
        meta: {
          breadcrums: [
            {
              text: "Split Creation",
            },
          ],
          ref: "#9",
        },
      },
      {
        path: "manifests",
        component: () =>
          import(
            /* webpackChunkName: "manifests" */ "@/views/front/manifests/Index"
          ),
        children: [
          {
            path: "",
            component: () =>
              import(
                /* webpackChunkName: "manifests-list" */ "@/components/front/manifests/List"
              ),
            name: "ManifestsList",
            meta: {
              breadcrums: [
                {
                  text: "Manifests",
                },
              ],
              ref: "#11",
            },
          },
          {
            path: "manifests-template",
            component: () =>
              import(
                /* webpackChunkName: "manifests-template" */ "@/components/front/manifests/Template"
              ),
            name: "ManifestsTemplate",
            meta: {
              breadcrums: [
                {
                  text: "Manifests",
                  to: "ManifestsList",
                },
                {
                  text: "Explain Template",
                },
              ],
              ref: "#12",
            },
          },
        ],
      },
      {
        path: "/tracking-events",
        name: "TrackingEvents",
        component: () =>
          import(
            /* webpackChunkName: "tracking-events" */ "@/views/front/tracking-events/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Manage Events",
            },
          ],
          ref: "#13",
        },
      },
      {
        path: "/entity-scans",
        name: "EntityScans",
        component: () =>
          import(
            /* webpackChunkName: "entity-scans" */ "@/views/front/entity-scans/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Entity Scans",
            },
          ],
          ref: "#51",
        },
      },
      {
        path: "/clients",
        name: "Clients",
        component: () =>
          import(
            /* webpackChunkName: "clients" */ "@/views/front/clients/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Manage Clients",
            },
          ],
          ref: "#47",
        },
      },
      {
        path: "/clients/product-hscode/:id",
        name: "ProductHSCodeMap",
        component: () =>
          import(
            /* webpackChunkName: "clients-product-hscodes" */ "@/views/front/clients/ProductHSCodeMap"
          ),
        meta: {
          breadcrums: [
            {
              text: "Manage Clients",
              to: "Clients",
            },
            {
              text: "Product Code and HS Code mapping",
            },
          ],
          ref: "#55",
        },
      },
      {
        path: "/clients/product-hscode",
        name: "ProductHSCode",
        component: () =>
          import(
            /* webpackChunkName: "clients-product-hscodes" */ "@/views/front/clients/ProductHSCodeMap"
          ),
        meta: {
          breadcrums: [
            {
              text: "ProductCode-HSCode",
            },
          ],
          ref: "#61",
        },
      },
      {
        path: "/clients/map-sellers/:id",
        name: "MapSellers",
        component: () =>
          import(
            /* webpackChunkName: "clients-map-sellers" */ "@/views/front/clients/MapSellers"
          ),
        meta: {
          breadcrums: [
            {
              text: "Manage Clients",
              to: "Clients",
            },
            {
              text: "Map Sellers",
            },
          ],
          ref: "#56",
        },
      },
      {
        path: "/seller-onboarding-status",
        component: () =>
          import(
            /* webpackChunkName: "seller-onboarding-status" */ "@/components/front/sellers/SellerOnboardingStatus"
          ),
        name: "SellerOnboardingStatus",
        meta: {
          breadcrums: [
            {
              text: "Seller Onboarding Status",
            },
          ],
          ref: "#75",
        },
      },
      {
        path: "/invoices",
        name: "Invoices",
        component: () =>
          import(
            /* webpackChunkName: "invoices-counts" */ "@/views/front/invoices/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "IOR Package",
            },
          ],
          ref: "#57",
        },
      },
      {
        path: "/client-invoices",
        name: "ClientInvoices",
        component: () =>
          import(
            /* webpackChunkName: "invoices" */ "@/views/front/invoices/ClientInvoices"
          ),
        meta: {
          breadcrums: [
            {
              text: "IOR Package",
              to: "Invoices",
            },
            {
              text: "Client",
            },
          ],
          ref: "#64",
        },
      },
      {
        path: "/invoices/add",
        name: "InvoiceAdd",
        component: () =>
          import(
            /* webpackChunkName: "invoices-add" */ "@/views/front/invoices/Add"
          ),
        meta: {
          breadcrums: [
            {
              text: "IOR Package",
              to: "Invoices",
            },
            {
              text: "Add",
            },
          ],
          ref: "#58",
        },
      },
      {
        path: "/invoices/:id",
        name: "InvoiceEdit",
        component: () =>
          import(
            /* webpackChunkName: "invoices-edit" */ "@/views/front/invoices/Edit"
          ),
        meta: {
          breadcrums: [
            {
              text: "IOR Package",
              to: "Invoices",
            },
            {
              text: "Edit",
            },
          ],
          ref: "#59",
        },
      },
      {
        path: "/invoice/inbound-entries/:id",
        name: "InboundEntries",
        component: () =>
          import(
            /* webpackChunkName: "invoices-inbound" */ "@/views/front/invoices/InboundEntries"
          ),
        meta: {
          breadcrums: [
            {
              text: "IOR Package",
              to: "Invoices",
            },
            {
              text: "Inbound Entries",
            },
          ],
          ref: "#65",
        },
      },
      {
        path: "/carrier-coverage",
        name: "CarrierCoverage",
        component: () =>
          import(
            /* webpackChunkName: "carrier-coverage" */ "@/views/front/carriers/Coverage"
          ),
        meta: {
          breadcrums: [
            {
              text: "Carrier Coverage",
            },
          ],
          ref: "#66",
        },
      },
      {
        path: "/country-wise-coverage",
        name: "CountryWiseCoverage",
        component: () =>
          import(
            /* webpackChunkName: "country-wise-coverage" */ "@/views/front/carriers/CountryWiseCoverage"
          ),
        meta: {
          breadcrums: [
            {
              text: "Carrier Coverage",
              to: "CarrierCoverage",
            },
            {
              text: "Country Wise Coverage",
            },
          ],
          ref: "#84",
        },
      },
      {
        path: "/quotes-list",
        name: "QuotesList",
        component: () =>
          import(
            /* webpackChunkName: "invoices-quotes" */ "@/views/front/invoices/QuotesList"
          ),
        meta: {
          breadcrums: [
            {
              text: "Quotes List",
            },
          ],
          ref: "#66",
        },
      },
      {
        path: "/pending-payments",
        name: "PendingPayments",
        component: () =>
          import(
            /* webpackChunkName: "pending-payments" */ "@/views/front/invoices/PendingPayments"
          ),
        meta: {
          breadcrums: [
            {
              text: "Payment Pending from Seller",
            },
          ],
          ref: "#68",
        },
      },
      {
        path: "/pending-payments",
        name: "PendingPayments",
        component: () =>
          import(
            /* webpackChunkName: "pending-payments" */ "@/views/front/invoices/PendingPayments"
          ),
        meta: {
          breadcrums: [
            {
              text: "Payment Pending from Seller",
            },
          ],
          ref: "#68",
        },
      },
      {
        path: "/bank-transfer",
        name: "BankTransfer",
        component: () =>
          import(
            /* webpackChunkName: "bank-transfer" */ "@/views/front/invoices/BankTransfer"
          ),
        meta: {
          breadcrums: [
            {
              text: "Bank Transfer",
            },
          ],
          ref: "#69",
        },
      },
      {
        path: "/payment-list",
        name: "PaymentList",
        component: () =>
          import(
            /* webpackChunkName: "payment-list" */ "@/views/front/invoices/PaymentList"
          ),
        meta: {
          breadcrums: [
            {
              text: "List of Payments",
            },
          ],
          ref: "#83",
        },
      },
      {
        path: "/payment-gateway-status",
        name: "PaymentGatewayStatus",
        component: () =>
          import(
            /* webpackChunkName: "payment-gateway-status" */ "@/views/front/invoices/PaymentGatewayStatus"
          ),
        meta: {
          breadcrums: [
            {
              text: "Payment Gateway Status",
            },
          ],
          ref: "#70",
        },
      },
      {
        path: "/upload-outbound",
        name: "UploadOutbound",
        component: () =>
          import(
            /* webpackChunkName: "outbound" */ "@/views/front/upload-outbound/Index"
          ),
        meta: {
          auth: true,
          breadcrums: [
            {
              text: "Upload Outbound Files",
            },
          ],
          ref: "#71",
        },
      },
      {
        path: "/outbound-xml-data-parsing",
        name: "OutboundXMLDataParsing",
        component: () =>
          import(
            /* webpackChunkName: "outbound-xml-data-parsing" */ "@/views/front/outboundxml/Index"
          ),
        meta: {
          auth: true,
          breadcrums: [
            {
              text: "Outbound XML DataParsing",
            },
          ],
          ref: "#76",
        },
      },
      {
        path: "/rsa-xml-invoice",
        name: "ManifestXML",
        component: () =>
          import(
            /* webpackChunkName: "manifest-xml" */ "@/views/front/outboundxml/ManifestXMLListing"
          ),
        meta: {
          auth: true,
          breadcrums: [
            {
              text: "Manifest XML",
            },
          ],
          ref: "#77",
        },
      },
      {
        path: "/rsa-xml-invoice-details/:id",
        name: "ManifestXMLDetails",
        component: () =>
          import(
            /* webpackChunkName: "manifest-xml-details" */ "@/views/front/outboundxml/ManifestXMLDetailsView"
          ),
        meta: {
          auth: true,
          breadcrums: [
            {
              text: "Manifest XML",
              to: "ManifestXML",
            },
            {
              text: "Manifest XML Details",
            },
          ],
          ref: "#78",
        },
      },
      {
        path: "/obamz-commercial-invoice",
        name: "CommercialInvoiceXML",
        component: () =>
          import(
            /* webpackChunkName: "commercial-invoice-xml" */ "@/views/front/outboundxml/CommercialInvoiceXMLListing"
          ),
        meta: {
          auth: true,
          breadcrums: [
            {
              text: "Commercial Invoice XML",
            },
          ],
          ref: "#79",
        },
      },
      {
        path: "/obamz-commercial-invoice-details/:id",
        name: "CommercialInvoiceXMLDetails",
        component: () =>
          import(
            /* webpackChunkName: "commercial-invoice-xml-details" */ "@/views/front/outboundxml/CommercialInvoiceXMLDetailsView"
          ),
        meta: {
          auth: true,
          breadcrums: [
            {
              text: "Commercial Invoice XML",
              to: "CommercialInvoiceXML",
            },
            {
              text: "Commercial Invoice XML Details",
            },
          ],
          ref: "#80",
        },
      },
      {
        path: "/hs-code",
        name: "HSCode",
        component: () =>
          import(
            /* webpackChunkName: "hs-code" */ "@/views/front/hs-code/Index"
          ),
        meta: {
          auth: true,
          breadcrums: [
            {
              text: "HS Code",
              to: "HSCode",
            },
          ],
          ref: "#73",
        },
      },
      {
        path: "/hs-code-list",
        name: "HSCodeList",
        component: () =>
          import(
            /* webpackChunkName: "hs-code-list" */ "@/views/front/hs-code/View"
          ),
        meta: {
          breadcrums: [
            {
              text: "HS Code",
              to: "HSCode",
            },
            {
              text: "HS Code Listing",
            },
          ],
          ref: "#74",
        },
      },
      {
        path: "/add-products",
        name: "Products",
        component: () =>
          import(
            /* webpackChunkName: "sellers-products" */ "@/views/front/sellers/Products"
          ),
        meta: {
          breadcrums: [
            {
              text: "Check Product Eligibility",
              to: "Products",
            },
            // {
            //   text: "Add",
            // },
          ],
          ref: "#60",
        },
      },
      {
        path: "/tracking-range",
        name: "TrackingRange",
        component: () =>
          import(
            /* webpackChunkName: "tracking-ranges" */ "@/views/front/tracking-ranges/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Manage Tracking Range",
            },
          ],
          ref: "#10",
        },
      },
      {
        path: "/inbox",
        name: "Inbox",
        component: () =>
          import(/* webpackChunkName: "inbox" */ "@/views/front/inbox/Inbox"),
        meta: {
          breadcrums: [
            {
              text: "Inbox",
            },
          ],
          ref: "#49",
        },
      },
      {
        path: "/inbox/:id",
        name: "InboxView",
        component: () =>
          import(
            /* webpackChunkName: "inbox-view" */ "@/views/front/inbox/View"
          ),
        meta: {
          breadcrums: [
            {
              to: "Inbox",
              text: "Inbox",
            },
            {
              text: "View",
            },
          ],
          ref: "#50",
        },
      },
      {
        path: "/manifests/configuration",
        name: "MnfConfiguration",
        component: () =>
          import(
            /* webpackChunkName: "manifests-config" */ "@/views/front/manifests/Configuration"
          ),
        meta: {
          breadcrums: [
            {
              text: "Manifest",
            },
            {
              text: "Configuration",
            },
          ],
          ref: "#14",
        },
      },
      {
        path: "/change-password",
        name: "ChangePassword",
        component: () =>
          import(
            /* webpackChunkName: "change-password" */ "@/views/front/home/ChangePassword"
          ),
        meta: {
          breadcrums: [
            {
              text: "Change Password",
            },
          ],
          ref: "#15",
        },
      },
      {
        path: "bags",
        component: () =>
          import(/* webpackChunkName: "bags" */ "@/views/front/bags/Index"),
        children: [
          {
            path: "",
            component: () =>
              import(
                /* webpackChunkName: "bag-list" */ "@/components/front/bags/List"
              ),
            name: "BagsList",
            meta: {
              breadcrums: [
                {
                  text: "Bags",
                },
              ],
              ref: "#16",
            },
          },
          {
            path: "bags-template",
            component: () =>
              import(
                /* webpackChunkName: "bag-template" */ "@/components/front/bags/Template"
              ),
            name: "BagsTemplate",
            meta: {
              breadcrums: [
                {
                  text: "Bags",
                  to: "BagsList",
                },
                {
                  text: "Explain Template",
                },
              ],
              ref: "#17",
            },
          },
        ],
      },
      {
        path: "bags/:id",
        component: () =>
          import(
            /* webpackChunkName: "bag-details" */ "@/views/front/bags/Details"
          ),
        name: "BagDetails",
        meta: {
          breadcrums: [
            {
              text: "Bags",
              to: "BagsList",
            },
            {
              text: "Edit",
            },
          ],
          ref: "#34",
        },
      },
      {
        path: "packages",
        component: () =>
          import(
            /* webpackChunkName: "packages" */ "@/views/front/packages/Index"
          ),
        children: [
          {
            path: "",
            component: () =>
              import(
                /* webpackChunkName: "packages-list" */ "@/components/front/packages/List"
              ),
            name: "PackagesList",
            meta: {
              breadcrums: [
                {
                  text: "Packages",
                },
              ],
              ref: "#18",
            },
          },
          {
            path: "packages-template",
            component: () =>
              import(
                /* webpackChunkName: "packages-template" */ "@/components/front/packages/Template"
              ),
            name: "PackagesTemplate",
            meta: {
              breadcrums: [
                {
                  text: "Packages",
                  to: "PackagesList",
                },
                {
                  text: "Explain Template",
                },
              ],
              ref: "#19",
            },
          },
        ],
      },
      {
        path: "packages/:id",
        component: () =>
          import(
            /* webpackChunkName: "packages-details" */ "@/views/front/packages/Details"
          ),
        name: "PackageDetails",
        meta: {
          breadcrums: [
            {
              text: "Packages",
              to: "PackagesList",
            },
            {
              text: "Edit",
            },
          ],
          ref: "#33",
        },
      },
      {
        path: "consolidations",
        component: () =>
          import(
            /* webpackChunkName: "consolidations" */ "@/views/front/consolidations/Index"
          ),
        name: "Consolidations",
        meta: {
          breadcrums: [
            {
              text: "Consolidations",
              to: "Consolidations",
            },
            {
              text: "View",
            },
          ],
          ref: "#20",
        },
      },
      {
        path: "consolidations/:id",
        component: () =>
          import(
            /* webpackChunkName: "consolidations-details" */ "@/views/front/consolidations/Details"
          ),
        name: "ConsolidationsDetails",
        meta: {
          breadcrums: [
            {
              text: "Consolidations",
              to: "Consolidations",
            },
            {
              text: "Create",
            },
          ],
          ref: "#21",
        },
      },
      {
        path: "new-consolidations",
        component: () =>
          import(
            /* webpackChunkName: "consolidations-new" */ "@/views/front/consolidations/New"
          ),
        name: "NewConsolidations",
        meta: {
          breadcrums: [
            {
              text: "Inbound",
            },
            {
              text: "New Consolidations",
            },
          ],
          ref: "#35",
        },
      },
      {
        path: "new-consolidations/deconsolidated",
        component: () =>
          import(
            /* webpackChunkName: "consolidations-deconsolidated" */ "@/views/front/consolidations/Deconsolidated"
          ),
        name: "Deconsolidated",
        meta: {
          auth: false,
          breadcrums: [
            {
              text: "Inbound",
            },
            {
              text: "Deconsolidated",
            },
          ],
          ref: "#36",
        },
      },
      {
        path: "new-consolidations/merged",
        component: () =>
          import(
            /* webpackChunkName: "consolidations-merged" */ "@/views/front/consolidations/Merged"
          ),
        name: "Merged",
        meta: {
          breadcrums: [
            {
              text: "Inbound",
            },
            {
              text: "Merged",
            },
          ],
          ref: "#37",
        },
      },
      {
        path: "new-consolidations/staged",
        component: () =>
          import(
            /* webpackChunkName: "consolidations-staged" */ "@/views/front/consolidations/Staged"
          ),
        name: "Staged",
        meta: {
          breadcrums: [
            {
              text: "Outbound",
            },
            {
              text: "Staged",
            },
          ],
          ref: "#38",
        },
      },
      {
        path: "new-consolidations/dispatched",
        component: () =>
          import(
            /* webpackChunkName: "consolidations-dispatched" */ "@/views/front/consolidations/Dispatched"
          ),
        name: "Dispatched",
        meta: {
          breadcrums: [
            {
              text: "Outbound",
            },
            {
              text: "Dispatched",
            },
          ],
          ref: "#39",
        },
      },
      {
        path: "new-consolidations/departed",
        component: () =>
          import(
            /* webpackChunkName: "consolidations-departed" */ "@/views/front/consolidations/Departed"
          ),
        name: "Departed",
        meta: {
          breadcrums: [
            {
              text: "Outbound",
            },
            {
              text: "Departed",
            },
          ],
          ref: "#48",
        },
      },
      {
        path: "lm-new-inbound",
        component: () =>
          import(
            /* webpackChunkName: "consolidations-lm-new" */ "@/views/front/consolidations/LMNew"
          ),
        name: "LMNewConsolidations",
        meta: {
          breadcrums: [
            {
              text: "Inbound",
            },
            {
              text: "New",
            },
          ],
          ref: "#41",
        },
      },
      {
        path: "lm-apply-scan",
        component: () =>
          import(
            /* webpackChunkName: "scanning-lm-apply-scan" */ "@/views/front/scanning/LMApplyScan"
          ),
        name: "LMApplyScan",
        meta: {
          breadcrums: [
            {
              text: "Scanning",
            },
            {
              text: "Apply Scan",
            },
          ],
          ref: "#42",
        },
      },
      {
        path: "lm-scan-upload",
        component: () =>
          import(
            /* webpackChunkName: "scanning-lm-scan-upload" */ "@/views/front/scanning/LMScanUpload"
          ),
        children: [
          {
            path: "",
            component: () =>
              import(
                /* webpackChunkName: "scanning-lm-scan-upload-list" */ "@/components/front/scanning/LMScanUploadList"
              ),
            name: "LMScanUploadList",
            meta: {
              breadcrums: [
                {
                  text: "Scanning",
                },
                {
                  text: "Bulk Scan Upload",
                },
              ],
              ref: "#43",
            },
          },
          {
            path: "lm-scan-upload-template",
            component: () =>
              import(
                /* webpackChunkName: "scanning-lm-scan-upload-template" */ "@/components/front/scanning/LMScanUploadTemplate"
              ),
            name: "LMScanUploadTemplate",
            meta: {
              breadcrums: [
                {
                  text: "Bulk Scan Upload",
                  to: "LMScanUploadList",
                },
                {
                  text: "Explain Template",
                },
              ],
              ref: "#44",
            },
          },
        ],
      },
      {
        path: "lm-in-clearance",
        component: () =>
          import(
            /* webpackChunkName: "consolidations-lm-in-clearence" */ "@/views/front/consolidations/LMInClearance"
          ),
        name: "LMInClearance",
        meta: {
          breadcrums: [
            {
              text: "Inbound",
            },
            {
              text: "In Clearance",
            },
          ],
          ref: "#45",
        },
      },
      {
        path: "lm-missing-scan",
        component: () =>
          import(
            /* webpackChunkName: "scanning-lm-missing-scan" */ "@/views/front/scanning/LMMissingScan"
          ),
        name: "LMMissingScan",
        meta: {
          breadcrums: [
            {
              text: "Scanning",
            },
            {
              text: "Missing Scan",
            },
          ],
          ref: "#46",
        },
      },
      {
        path: "/client/tracking",
        name: "ClientTracking",
        component: () =>
          import(
            /* webpackChunkName: "client-tracking" */ "@/views/front/tracking/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Tracking",
            },
          ],
          ref: "#22",
        },
      },
      {
        path: "/client/tracking/summary",
        name: "ClientTrackingSummary",
        component: () =>
          import(
            /* webpackChunkName: "client-tracking-summary" */ "@/views/front/tracking/Summary"
          ),
        meta: {
          breadcrums: [
            {
              text: "Tracking",
              to: "ClientTracking",
            },
            {
              text: "Summary",
            },
          ],
          ref: "#31",
        },
      },
      {
        path: "/client/tracking/details",
        name: "ClientTrackingDetails",
        component: () =>
          import(
            /* webpackChunkName: "client-tracking-details" */ "@/views/front/tracking/Details"
          ),
        meta: {
          breadcrums: [
            {
              text: "Tracking",
              to: "ClientTracking",
            },
            {
              text: "Summary",
              to: "ClientTrackingSummary",
            },
            {
              text: "Details",
            },
          ],
          ref: "#32",
        },
      },
      {
        path: "/client-addresses",
        name: "ClientAddresses",
        component: () =>
          import(
            /* webpackChunkName: "client-addresses" */ "@/views/front/client-addresses/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Addresses",
            },
          ],
          ref: "#23",
        },
      },
      {
        path: "/client-addresses/:id",
        name: "ClientAddressDetails",
        component: () =>
          import(
            /* webpackChunkName: "client-addresses-details" */ "@/views/front/client-addresses/Details"
          ),
        meta: {
          breadcrums: [
            {
              text: "Addresses",
              to: "ClientAddresses",
            },
            {
              text: "Details",
            },
          ],
          ref: "#24",
        },
      },
      {
        path: "/client/subscription/tracking",
        name: "TrackLblSub",
        component: () =>
          import(
            /* webpackChunkName: "tracking-subscription" */ "@/views/front/tracking-subscription/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Subscription",
            },
          ],
          ref: "#25",
        },
      },
      {
        path: "/client/consolidations/manifest/download",
        name: "ManifestDownload",
        component: () =>
          import(
            /* webpackChunkName: "consolidations-manifest-download" */ "@/views/front/consolidations/ManifestDownload"
          ),
        meta: {
          breadcrums: [
            {
              text: "Manifest",
              to: "ManifestDownload",
            },
            {
              text: "Download",
            },
          ],
          ref: "#26",
        },
      },
      {
        path: "/access-control",
        component: () =>
          import(
            /* webpackChunkName: "user-groups" */ "@/views/front/user-groups/Index"
          ),
        children: [
          {
            path: "users/list",
            component: () =>
              import(
                /* webpackChunkName: "user-groups-users" */ "@/components/front/user-groups/Users"
              ),
            name: "UsersList",
            meta: {
              breadcrums: [
                {
                  text: "Create users",
                },
              ],
              ref: "#27",
            },
          },
          {
            path: "users/details/:id",
            component: () =>
              import(
                /* webpackChunkName: "user-groups-user-create" */ "@/components/front/user-groups/UserCreate"
              ),
            name: "UserCreate",
            meta: {
              breadcrums: [
                {
                  text: "Create users",
                },
              ],
              ref: "#29",
            },
          },
          {
            path: "groups/list",
            component: () =>
              import(
                /* webpackChunkName: "user-groups-groups" */ "@/components/front/user-groups/Groups"
              ),
            name: "GroupsList",
            meta: {
              breadcrums: [
                {
                  text: "Create users",
                },
              ],
              ref: "#28",
            },
          },
          {
            path: "groups/details/:id",
            component: () =>
              import(
                /* webpackChunkName: "user-groups-group-create" */ "@/components/front/user-groups/GroupCreate"
              ),
            name: "GroupCreate",
            meta: {
              breadcrums: [
                {
                  text: "Create users",
                },
              ],
              ref: "#30",
            },
          },
          {
            path: "screens/list",
            component: () =>
              import(
                /* webpackChunkName: "user-groups-users" */ "@/components/front/user-groups/UserCategoryScreen"
              ),
            name: "UserCategoryScreen",
            meta: {
              breadcrums: [
                {
                  text: "User Category Screen",
                },
              ],
              ref: "#30",
              // ref: "#88",
            },
          },
        ],
      },
      {
        path: "/set-alerts",
        name: "SetAlerts",
        component: () =>
          import(
            /* webpackChunkName: "alerts" */ "@/views/front/alerts/SetAlerts"
          ),
        meta: {
          breadcrums: [
            {
              text: "Account Settings",
            },
            {
              text: "Set Alerts",
            },
          ],
          ref: "#40",
        },
      },
      {
        path: "sellers",
        component: () =>
          import(
            /* webpackChunkName: "sellers" */ "@/views/front/sellers/Index"
          ),
        children: [
          {
            path: "",
            component: () =>
              import(
                /* webpackChunkName: "sellers-list" */ "@/components/front/sellers/List"
              ),
            name: "SellersList",
            meta: {
              breadcrums: [
                {
                  text: "Upload Seller List",
                },
              ],
              ref: "#52",
            },
          },
          {
            path: "sellers-template",
            component: () =>
              import(
                /* webpackChunkName: "sellers-template" */ "@/components/front/sellers/Template"
              ),
            name: "SellersTemplate",
            meta: {
              breadcrums: [
                {
                  text: "Sellers",
                  to: "SellersList",
                },
                {
                  text: "Explain Template",
                },
              ],
              ref: "#53",
            },
          },
        ],
      },
      {
        path: "/manage-sellers",
        name: "ManageSellers",
        component: () =>
          import(
            /* webpackChunkName: "manage-sellers" */ "@/views/front/sellers/ManageSellers"
          ),
        meta: {
          breadcrums: [
            {
              text: "Manage Sellers",
            },
          ],
          ref: "#54",
        },
      },

      {
        path: "/order-list",
        name: "OrderList",
        component: () =>
          import(
            /* webpackChunkName: "order-list" */ "@/views/front/order/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Order List",
            },
          ],
          ref: "#72",
        },
      },
      {
        path: "/documents",
        name: "Documents",
        component: () =>
          import(
            /* webpackChunkName: "order-list" */ "@/views/front/documents/Index"
          ),
        meta: {
          breadcrums: [
            {
              text: "Documents",
            },
          ],
          ref: "#85",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/front/Login"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/sign-up",
    name: "SignUp",
    component: () =>
      import(/* webpackChunkName: "signup" */ "@/views/front/SignUp"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () =>
      import(
        /* webpackChunkName: "forgot-password" */ "@/views/front/ForgotPassword"
      ),
    meta: {
      auth: false,
    },
  },
  {
    path: "/password-reset",
    name: "ResetPassword",
    component: () =>
      import(
        /* webpackChunkName: "reset-password" */ "@/views/front/ResetPassword"
      ),
    meta: {
      auth: false,
    },
  },
  {
    path: "/tracking",
    name: "Tracking",
    component: () =>
      import(/* webpackChunkName: "tracking" */ "@/views/front/Tracking"),
    meta: {
      auth: false,
    },
  },
  {
    path: "/tracking/details",
    name: "TrackingDetails",
    component: () =>
      import(
        /* webpackChunkName: "tracking-details" */ "@/views/front/TrackingDetails"
      ),
    meta: {
      auth: false,
    },
  },
  {
    path: "/tracking/summary",
    name: "TrackingSummary",
    component: () =>
      import(
        /* webpackChunkName: "tracking-summary" */ "@/views/front/TrackingSummary"
      ),
    meta: {
      auth: false,
    },
  },
  {
    path: "/payment-route/:invoicePg/:invoiceNo",
    name: "PaymentRequest",
    component: () =>
      import(
        /* webpackChunkName: "payment-request" */ "@/views/front/payment-request/Index.vue"
      ),
    meta: {
      auth: false,
    },
  },
  {
    path: "/payment-route-response/:invoicePgResponse/:hashValue",
    name: "PaymentResponse",
    component: () =>
      import(
        /* webpackChunkName: "payment-response" */ "@/views/front/payment-response/Index.vue"
      ),
    meta: {
      auth: false,
    },
  },
];
