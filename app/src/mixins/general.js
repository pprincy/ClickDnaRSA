import XLSX from "xlsx";
import { mapGetters } from "vuex";
import moment from "moment";
import { countries } from "@/config/data";

export default {
  computed: {
    ...mapGetters(["permissions", "screens"]),
  },
  methods: {
    scrollIntoView(ref) {
      if (ref) {
        this.$nextTick(() => {
          this.$refs[ref].$el.scrollIntoView({
            block: "center",
            scrollBehavior: "smooth",
          });
        });
      }
    },
    downloadXLSX(data, name) {
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const new_workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(new_workbook, worksheet, name);
      XLSX.writeFile(new_workbook, name + ".xlsx");
    },
    can(key) {
      if (Array.isArray(key)) {
        return this.permissions.some((p) => key.includes(p));
      } else {
        return this.permissions.includes(key);
      }
    },
    canScreen(key) {
      if (Array.isArray(key)) {
        return this.screens.some((p) => key.includes(p));
      } else {
        return this.screens.includes(key);
      }
    },
    fileDownload(res) {
      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      if (res.headers["content-disposition"]) {
        link.download = res.headers["content-disposition"]
          .split("filename=")
          .pop();
        link.download = link.download.replace(/['"]+/g, "");
      }
      link.click();
      URL.revokeObjectURL(link.href);
    },
    fileCSVDownload(res) {
      const blob = new Blob([res.data], {
        type: res.headers["content-type"],
      });
      const link = document.createElement("a");
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", "export.csv");
      link.click();
      URL.revokeObjectURL(link.href);
    },
    timeInput(time, type) {
      if (time[type]?.length === 2) {
        time[type] += ":";
      }
    },
    getFormattedDate(date) {
      return date && moment(date).isValid()
        ? moment(date).format("ddd DD MMM, YYYY")
        : "";
    },
    isURL(data) {
      if (typeof data === "string") {
        return true;
      }
    },
    displayCountry(code) {
      if (code) return countries[code];
    },
  },
};
